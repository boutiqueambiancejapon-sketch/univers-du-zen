#!/usr/bin/env npx tsx
/**
 * enrich-products.ts
 * ———————————————————————————————————
 * Ce script lit tous les products/<slug>/data.json,
 * génère le contenu enrichi via Gemini,
 * et écrit lib/supplier-products.ts automatiquement.
 *
 *   npx tsx scripts/enrich-products.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_KEY = process.env.GEMINI_API_KEY ?? '';
const PRODUCTS_DIR = path.resolve(process.cwd(), 'products');
const RAW_BASE = 'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main/products';

if (!GEMINI_KEY) { console.error('GEMINI_API_KEY manquant'); process.exit(1); }

const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const CATEGORY_MAP: Record<string, string> = {
  'essential oil': 'aromatherapie',
  'diffuser': 'aromatherapie',
  'room spray': 'maison-deco',
  'candle': 'bougies',
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

async function enrichWithGemini(product: any) {
  const prompt = `Tu es rédacteur e-commerce bien-être pour "Univers du Zen", boutique française haut de gamme. 
Ne mentionne JAMAIS le nom du fournisseur.
Produit : ${product.name}
Description originale : ${product.description?.slice(0, 500)}

Génère en JSON valide :
{
  "nameFr": "Nom marketing français élégant (max 60 car)",
  "shortDescriptionFr": "Accroche 1 phrase percutante (max 140 car)",
  "longDescriptionFr": "3 paragraphes séparés par \\n\\n, ton zen premium, 250-350 mots",
  "benefitsFr": ["4 bénéfices courts (max 60 car chacun)"],
  "usageFr": "Instructions d'utilisation 2-3 phrases",
  "faqFr": [
    {"question": "Question client fréquente 1", "answer": "Réponse 2-3 phrases"},
    {"question": "Question client fréquente 2", "answer": "Réponse 2-3 phrases"},
    {"question": "Question client fréquente 3", "answer": "Réponse 2-3 phrases"}
  ],
  "metaDescriptionFr": "Description SEO 155 car max"
}
Réponds UNIQUEMENT avec le JSON, aucun texte autour.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim().replace(/^```json\n?|```$/g, '');
  return JSON.parse(text);
}

async function main() {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.error('Dossier products/ introuvable. Lance push-products.ts d’abord.');
    process.exit(1);
  }

  const catalog = fs.existsSync(path.join(PRODUCTS_DIR, 'catalog.json'))
    ? JSON.parse(fs.readFileSync(path.join(PRODUCTS_DIR, 'catalog.json'), 'utf8'))
    : [];

  const enriched: any[] = [];

  for (const { slug } of catalog) {
    const dataPath = path.join(PRODUCTS_DIR, slug, 'data.json');
    if (!fs.existsSync(dataPath)) continue;

    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`Enrichissement : ${slug}...`);

    let gemini: any = {};
    try {
      gemini = await enrichWithGemini(raw);
    } catch (e) {
      console.warn(`  Gemini échec, contenu minimal: ${e}`);
      gemini = { nameFr: raw.name, shortDescriptionFr: raw.short_description?.slice(0, 140) ?? '' };
    }

    const imagesInDir = fs.readdirSync(path.join(PRODUCTS_DIR, slug))
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .map(f => `${RAW_BASE}/${slug}/${f}`);

    enriched.push({
      id: String(raw.id),
      slug,
      ...gemini,
      descriptionFr: gemini.longDescriptionFr ?? raw.description ?? '',
      longDescriptionFr: gemini.longDescriptionFr ?? raw.description ?? '',
      characteristics: [],
      category: guessCategory(raw.name ?? '', raw.description ?? ''),
      retailPriceEur: calcPrice(raw.price),
      compareAtPriceEur: undefined,
      stockStatus: 'Normal',
      stockQty: 50,
      isBestSeller: false,
      isVegan: true,
      isCrueltyFree: true,
      tags: (raw.tags ?? '').split(',').map((t: string) => t.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean),
      images: imagesInDir,
    });
  }

  // Générer lib/supplier-products.ts
  const RAW_HEADER = `/**
 * AUTO-GÉNÉRÉ par scripts/enrich-products.ts — ne pas éditer manuellement.
 */
import type { DemoProduct } from '@/lib/demo-products';

export const SUPPLIER_PRODUCTS: DemoProduct[] = `;

  const fileContent = RAW_HEADER + JSON.stringify(enriched, null, 2) + ';
';
  fs.writeFileSync(path.resolve(process.cwd(), 'lib/supplier-products.ts'), fileContent);
  console.log(`\n✅ lib/supplier-products.ts généré avec ${enriched.length} produit(s).`);
}

main().catch(err => { console.error(err); process.exit(1); });
