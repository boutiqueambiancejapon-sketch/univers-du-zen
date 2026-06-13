#!/usr/bin/env npx tsx
/**
 * push-products.ts
 * ———————————————————————————————————
 * Lance depuis ta machine :
 *   npx tsx scripts/push-products.ts
 *
 * Ce script :
 *  1. Fetch le catalogue Retina API (toutes les pages)
 *  2. Télécharge l’image principale de chaque produit
 *  3. Crée products/<slug>/data.json + image-1.jpg dans le repo
 *  4. Met à jour products/catalog.json
 *
 * Après le push, Claude lit le catalog et auto-enrichit supplier-products.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const RETINA_BASE = process.env.RETINA_API_BASE ?? 'https://app.aiku.io/app/re-api';
const RETINA_TOKEN = process.env.RETINA_API_TOKEN ?? '';
const PRODUCTS_DIR = path.resolve(process.cwd(), 'products');

if (!RETINA_TOKEN) {
  console.error('RETINA_API_TOKEN manquant dans .env');
  process.exit(1);
}

// ---- helpers ----------------------------------------------------------------

async function apiFetch(endpoint: string) {
  const res = await fetch(`${RETINA_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${RETINA_TOKEN}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Retina API ${res.status}: ${await res.text()}`);
  return res.json();
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadImage(res.headers.location!, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => { fs.unlinkSync(dest); reject(err); });
  });
}

// ---- main -------------------------------------------------------------------

async function main() {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  // Charger le catalog existant
  const catalogPath = path.join(PRODUCTS_DIR, 'catalog.json');
  const existing: { slug: string; pushed_at: string }[] = fs.existsSync(catalogPath)
    ? JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
    : [];
  const existingSlugs = new Set(existing.map(e => e.slug));

  // Fetch toutes les pages
  let page = 1;
  let totalNew = 0;

  while (true) {
    const data = await apiFetch(`/products?per_page=50&page=${page}`);
    const items: any[] = data.data ?? data.products ?? data ?? [];
    if (!items.length) break;

    for (const item of items) {
      const rawSlug = slugify(item.name ?? item.sku ?? String(item.id));
      const slug = rawSlug || `product-${item.id}`;

      if (existingSlugs.has(slug)) {
        console.log(`  skip (already exists): ${slug}`);
        continue;
      }

      console.log(`  + ${slug}`);
      const dir = path.join(PRODUCTS_DIR, slug);
      fs.mkdirSync(dir, { recursive: true });

      // Trouver l’image principale
      const imageUrl: string | undefined =
        item.images?.[0]?.url ??
        item.images?.[0] ??
        item.image ??
        undefined;

      if (imageUrl) {
        try {
          await downloadImage(imageUrl, path.join(dir, 'image-1.jpg'));
        } catch (e) {
          console.warn(`    image échec: ${e}`);
        }
      }

      // data.json
      const entry = {
        id: item.id,
        slug,
        name: item.name,
        original_name: item.name,
        short_description: item.short_description ?? item.description?.slice(0, 200) ?? '',
        description: item.description ?? '',
        meta_description: '',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags ?? ''),
        price: item.wholesale_price ?? item.price ?? item.cost ?? '',
        images: imageUrl ? ['image-1.jpg'] : [],
        pushed_at: new Date().toISOString(),
      };
      fs.writeFileSync(path.join(dir, 'data.json'), JSON.stringify(entry, null, 2));

      existing.push({ slug, pushed_at: entry.pushed_at });
      existingSlugs.add(slug);
      totalNew++;
    }

    if (!data.next_page_url && !data.links?.next) break;
    page++;
  }

  // Sauver catalog.json
  fs.writeFileSync(catalogPath, JSON.stringify(existing, null, 2));
  console.log(`\n✅ ${totalNew} nouveaux produits pushés. Lance un git add/commit/push, puis dis à Claude de les intégrer.`);
}

main().catch(err => { console.error(err); process.exit(1); });
