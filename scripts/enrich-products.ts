#!/usr/bin/env npx tsx
/**
 * enrich-products.ts
 * Lit products/<slug>/data.json, enrichit via Claude (Anthropic),
 * et écrit lib/supplier-products.ts.
 *
 *   npx tsx scripts/enrich-products.ts
 *
 * Variable requise dans .env :
 *   ANTHROPIC_API_KEY=sk-ant-...
 */

import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? '';
const PRODUCTS_DIR = path.resolve(process.cwd(), 'products');
const RAW_BASE =
  'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main/products';

if (!ANTHROPIC_KEY) {
  console.error('ANTHROPIC_API_KEY manquant dans .env');
  process.exit(1);
}

const client = new Anthropic({ apiKey: ANTHROPIC_KEY });

const CATEGORY_MAP: Record<string, string> = {
  'essential oil': 'aromatherapie',
  'diffuser': 'aromatherapie',
  'room spray': 'maison-deco',
  'spray': 'maison-deco',
  'candle': 'bougies',
  'bougie': 'bougies',
  'incense': 'encens',
  'crystal': 'pierres-cristaux',
  'stone': 'pierres-cristaux',
  'tea': 'thes-artisanaux',
  'matcha': 'thes-artisanaux',
  default: 'maison-deco',
};

function guessCategory(name: string, desc: string): string {
  const text = (name + ' ' + desc).toLowerCase();
  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    if (key !== 'default' && text.includes(key)) return cat;
  }
  return CATEGORY_MAP.default;
}

function calcPrice(wholesale: string | number): number {
  const raw = parseFloat(String(wholesale).replace(/[^0-9.]/g, ''));
  if (!raw) return 19.99;
  const retail = raw * 3.0 * 1.17;
  return Math.ceil(retail) - 0.01;
}

async function enrichWithClaude(product: any) {
  const prompt = `Tu es rédacteur e-commerce bien-être pour "Univers du Zen", boutique francophone haut de gamme (Belgique/France).
Ne mentionne JAMAIS le nom du fournisseur ou de la marque d’origine.
Ton : zen, chaleureux, authentique. Pas de superlatifs vides.

Produit : ${product.name}
Description originale : ${product.description?.slice(0, 600) ?? ''}

Génère UNIQUEMENT ce JSON valide, sans texte autour :
{
  "nameFr": "Nom marketing français élégant (max 65 car)",
  "shortDescriptionFr": "Accroche 1 phrase percutante (max 140 car)",
  "longDescriptionFr": "3 paragraphes séparés par \\n\\n, ton zen premium, 250-350 mots total",
  "benefitsFr": ["bénéfice 1", "bénéfice 2", "bénéfice 3", "bénéfice 4"],
  "usageFr": "Instructions d'utilisation, 2-3 phrases simples",
  "faqFr": [
    {"question": "Question fréquente 1 ?", "answer": "Réponse 2-3 phrases."},
    {"question": "Question fréquente 2 ?", "answer": "Réponse 2-3 phrases."},
    {"question": "Question fréquente 3 ?", "answer": "Réponse 2-3 phrases."}
  ],
  "metaDescriptionFr": "Description SEO 150 car max"
}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = (message.content[0] as any).text.trim().replace(/^```json\n?|```$/g, '');
  return JSON.parse(text);
}

async function main() {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.error('Dossier products/ introuvable. Lance push-products.ts d’abord.');
    process.exit(1);
  }

  const catalogPath = path.join(PRODUCTS_DIR, 'catalog.json');
  const catalog: { slug: string }[] = fs.existsSync(catalogPath)
    ? JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
    : [];

  const enriched: any[] = [];

  for (const { slug } of catalog) {
    const dataPath = path.join(PRODUCTS_DIR, slug, 'data.json');
    if (!fs.existsSync(dataPath)) { console.warn(`  skip (no data.json): ${slug}`); continue; }

    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`✨  ${slug}...`);

    let gemini: any = {};
    try {
      gemini = await enrichWithClaude(raw);
    } catch (e) {
      console.warn(`  Claude échec, contenu minimal: ${e}`);
      gemini = {
        nameFr: raw.name,
        shortDescriptionFr: (raw.short_description ?? '').slice(0, 140),
        longDescriptionFr: raw.description ?? '',
        benefitsFr: [],
        usageFr: '',
        faqFr: [],
        metaDescriptionFr: '',
      };
    }

    const imagesInDir = fs.readdirSync(path.join(PRODUCTS_DIR, slug))
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .map(f => `${RAW_BASE}/${slug}/${f}`);

    enriched.push({
      id: String(raw.id),
      slug,
      nameFr: gemini.nameFr ?? raw.name,
      shortDescriptionFr: gemini.shortDescriptionFr ?? '',
      descriptionFr: gemini.longDescriptionFr ?? raw.description ?? '',
      longDescriptionFr: gemini.longDescriptionFr ?? raw.description ?? '',
      benefitsFr: gemini.benefitsFr ?? [],
      usageFr: gemini.usageFr ?? '',
      faqFr: gemini.faqFr ?? [],
      metaDescriptionFr: gemini.metaDescriptionFr ?? '',
      characteristics: [],
      category: guessCategory(raw.name ?? '', raw.description ?? ''),
      retailPriceEur: calcPrice(raw.price),
      compareAtPriceEur: undefined,
      stockStatus: 'Normal',
      stockQty: 50,
      isBestSeller: false,
      isVegan: true,
      isCrueltyFree: true,
      tags: (raw.tags ?? '')
        .split(',')
        .map((t: string) => t.trim().toLowerCase().replace(/\s+/g, '-'))
        .filter(Boolean),
      images: imagesInDir,
    });
  }

  // Écrire lib/supplier-products.ts
  const output =
    `/**
 * AUTO-GÉNÉRÉ par scripts/enrich-products.ts — ne pas éditer manuellement.
 */
import type { DemoProduct } from '@/lib/demo-products';

export const SUPPLIER_PRODUCTS: DemoProduct[] = ` +
    JSON.stringify(enriched, null, 2) +
    `;
`;

  fs.writeFileSync(path.resolve(process.cwd(), 'lib/supplier-products.ts'), output);
  console.log(`\n✅ ${enriched.length} produit(s) enrichi(s) → lib/supplier-products.ts`);
}

main().catch(err => { console.error(err); process.exit(1); });
