#!/usr/bin/env tsx
/**
 * Retina → Supabase product ingest
 * Usage: npx tsx scripts/pipeline/ingest.ts
 *
 * Required env vars (copy from .env):
 *   RETINA_API_BASE, RETINA_API_TOKEN
 *   GEMINI_API_KEY
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { getProducts } from '../../lib/retina';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// ── Category mapping (Retina category names → our slugs) ──────────────────
const CATEGORY_MAP: Record<string, string> = {
  'essential oils': 'aromatherapie',
  'aromatherapy': 'aromatherapie',
  'candles': 'bougies',
  'incense': 'encens',
  'crystals': 'pierres-cristaux',
  'gemstones': 'pierres-cristaux',
  'home': 'maison-deco',
  'home fragrance': 'maison-deco',
  'tea': 'thes-artisanaux',
  'herbs': 'thes-artisanaux',
};

function mapCategory(name: string): string {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_MAP)) {
    if (key.includes(k)) return v;
  }
  return 'maison-deco'; // fallback
}

// ── Price formula ──────────────────────────────────────────────────────────
const GBP_EUR = 1.17;

function calcRetailPrice(wholesale: number): number {
  const raw = wholesale * 3.0 * GBP_EUR;
  return Math.ceil(raw) - 0.01; // round to ,99
}

// ── Gemini rewrite ────────────────────────────────────────────────────────
async function rewriteWithGemini(product: {
  name: string;
  description: string;
  category: string;
}): Promise<{
  nameFr: string;
  shortDescriptionFr: string;
  descriptionFr: string;
  benefitsFr: string[];
  metaTitleFr: string;
  metaDescriptionFr: string;
  slug: string;
}> {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) throw new Error('Missing GEMINI_API_KEY');

  const prompt = `
Tu es copywriter SEO pour une boutique bien-être belge francophone « Univers du Zen ».
Pour ce produit wellness, génère en JSON :

- nameFr : nom français SEO (max 60 chars, sans marque fournisseur)
- shortDescriptionFr : accroche 1-2 phrases (max 120 chars)
- descriptionFr : description riche 250 mots, bénéfices, usage, paragraphes
- benefitsFr : tableau de 4 bullet points courts et percutants
- metaTitleFr : titre SEO 60 chars incluant catégorie et localisation BE
- metaDescriptionFr : méta description 150 chars avec CTA
- slug : URL slug sans accents, tirets, max 60 chars

Produit source :
- Nom EN : ${product.name}
- Description EN : ${product.description?.slice(0, 500) ?? 'N/A'}
- Catégorie : ${product.category}

Réponds UNIQUEMENT avec du JSON valide, aucun texte avant ou après.
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    },
  );

  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  const cleaned = text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.warn('Gemini JSON parse error for', product.name);
    return {
      nameFr: product.name,
      shortDescriptionFr: '',
      descriptionFr: product.description ?? '',
      benefitsFr: [],
      metaTitleFr: product.name,
      metaDescriptionFr: '',
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60),
    };
  }
}

// ── Sleep helper ──────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── Main ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌿 Univers du Zen — Retina product ingest');
  console.log('─'.repeat(50));

  let page = 1;
  let totalPages = 1;
  let imported = 0;
  let errors = 0;

  do {
    console.log(`\n📦 Fetching page ${page}/${totalPages}...`);
    const res = await getProducts(page, 50);
    totalPages = res.meta.last_page;

    for (const product of res.data) {
      try {
        process.stdout.write(`  → ${product.name.slice(0, 40).padEnd(40)} `);

        // Rewrite with Gemini
        const fr = await rewriteWithGemini({
          name: product.name,
          description: product.description,
          category: product.category?.name ?? '',
        });

        const retailPrice = calcRetailPrice(product.wholesale ?? product.price);
        const category = mapCategory(product.category?.name ?? '');

        // Upsert into Supabase
        const { error } = await supabase.from('products').upsert({
          retina_id: String(product.id),
          sku: product.sku,
          slug: fr.slug,
          name_fr: fr.nameFr,
          short_description_fr: fr.shortDescriptionFr,
          description_fr: fr.descriptionFr,
          benefits_fr: fr.benefitsFr,
          meta_title_fr: fr.metaTitleFr,
          meta_description_fr: fr.metaDescriptionFr,
          category,
          images: product.images ?? [],
          wholesale_price: product.wholesale ?? product.price,
          retail_price_eur: retailPrice,
          stock_qty: product.stock,
          stock_status: product.stock > 10 ? 'Normal' : product.stock > 2 ? 'Low' : product.stock > 0 ? 'VeryLow' : 'OutOfStock',
          is_vegan: true,
          is_cruelty_free: true,
          tags: product.tags ?? [],
          updated_at: new Date().toISOString(),
        }, { onConflict: 'retina_id' });

        if (error) {
          console.log('❌ DB error:', error.message);
          errors++;
        } else {
          console.log('✓');
          imported++;
        }

        // Rate limit: 1 Gemini call / second
        await sleep(1100);
      } catch (err) {
        console.log('❌', err instanceof Error ? err.message : err);
        errors++;
      }
    }

    page++;
  } while (page <= totalPages);

  console.log('\n' + '─'.repeat(50));
  console.log(`✅ Done — ${imported} imported, ${errors} errors`);
}

main().catch(console.error);
