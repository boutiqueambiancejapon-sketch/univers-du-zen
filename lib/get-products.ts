/**
 * Source de vérité produits publiés.
 * Lit products/catalog.json + products/{slug}/data.json depuis le filesystem.
 * Utilisable uniquement côté serveur (Server Components, getStaticProps équivalent).
 */

import fs from 'fs';
import path from 'path';

export interface PublishedProduct {
  id: string;
  slug: string;
  name: string;
  original_name?: string;
  short_description?: string;
  description?: string;
  meta_description?: string;
  /** Toujours normalisé en string[] à la lecture. */
  tags?: string[];
  images: string[];
  retail_price_eur?: number;
  compare_at_price_eur?: number;
  category?: string;
  stock_status?: 'Normal' | 'Low' | 'VeryLow' | 'OutOfStock';
  stock_qty?: number;
  is_best_seller?: boolean;
  is_vegan?: boolean;
  is_cruelty_free?: boolean;
  pushed_at?: string;
  // Champs legacy attendus par ProductCard / ProductDetailClient
  nameFr?: string;
  descriptionFr?: string;
  shortDescriptionFr?: string;
  retailPriceEur?: number;
  compareAtPriceEur?: number;
  stockStatus?: 'Normal' | 'Low' | 'VeryLow' | 'OutOfStock';
  stockQty?: number;
  isBestSeller?: boolean;
  isVegan?: boolean;
  isCrueltyFree?: boolean;
}

const PRODUCTS_DIR = path.join(process.cwd(), 'products');
const REPO_RAW = 'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main';

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/** Accepte "€3.70", "3.70", 3.70, undefined → number | undefined */
function parsePrice(raw: unknown): number | undefined {
  if (typeof raw === 'number') return raw > 0 ? raw : undefined;
  if (typeof raw === 'string') {
    const n = parseFloat(raw.replace(/[^0-9.]/g, ''));
    return isNaN(n) || n <= 0 ? undefined : n;
  }
  return undefined;
}

/** Accepte "tag1,tag2", ["tag1","tag2"], undefined → string[] */
function parseTags(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw === 'string') return raw.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

/** Normalise les URLs des images (GitHub raw si chemin relatif). */
function parseImages(raw: unknown[], slug: string): string[] {
  return (raw ?? []).map((img: unknown) => {
    const s = String(img);
    return s.startsWith('http') ? s : `${REPO_RAW}/products/${slug}/${s}`;
  });
}

/** Mappe un objet JSON brut vers PublishedProduct. */
function mapProduct(raw: Record<string, unknown>, slug: string): PublishedProduct {
  const images = parseImages((raw.images as unknown[]) ?? [], slug);

  // Prix : essaie retail_price_eur (nombre), puis price (string "€x.xx")
  const retailPriceEur =
    parsePrice(raw.retail_price_eur) ??
    parsePrice(raw.retailPriceEur)  ??
    parsePrice(raw.price);

  const compareAtPriceEur =
    parsePrice(raw.compare_at_price_eur) ??
    parsePrice(raw.compareAtPriceEur)    ??
    parsePrice(raw.compare_price);

  const stockStatus =
    (raw.stock_status as PublishedProduct['stockStatus']) ??
    (raw.stockStatus  as PublishedProduct['stockStatus']) ??
    'Normal';

  return {
    ...raw as Partial<PublishedProduct>,
    slug,
    images,
    tags:              parseTags(raw.tags),
    nameFr:            (raw.name ?? raw.nameFr) as string,
    descriptionFr:     (raw.description ?? raw.descriptionFr) as string | undefined,
    shortDescriptionFr:(raw.short_description ?? raw.shortDescriptionFr) as string | undefined,
    retailPriceEur,
    compareAtPriceEur,
    retail_price_eur:  retailPriceEur,
    compare_at_price_eur: compareAtPriceEur,
    stockStatus,
    stock_status:      stockStatus,
    stockQty:          (raw.stock_qty ?? raw.stockQty ?? 0) as number,
    isBestSeller:      Boolean(raw.is_best_seller ?? raw.isBestSeller ?? false),
    isVegan:           Boolean(raw.is_vegan      ?? raw.isVegan      ?? true),
    isCrueltyFree:     Boolean(raw.is_cruelty_free ?? raw.isCrueltyFree ?? true),
    category:          (raw.category ?? 'huiles-fragrance') as string,
  };
}

/* ── API publique ─────────────────────────────────────────────────────────── */

export function getPublishedProducts(): PublishedProduct[] {
  try {
    const catalogPath = path.join(PRODUCTS_DIR, 'catalog.json');
    if (!fs.existsSync(catalogPath)) return [];
    const catalog: { slug: string }[] = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

    return catalog
      .map(({ slug }) => {
        try {
          const dataPath = path.join(PRODUCTS_DIR, slug, 'data.json');
          if (!fs.existsSync(dataPath)) return null;
          const raw = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
          return mapProduct(raw, slug);
        } catch {
          return null;
        }
      })
      .filter(Boolean) as PublishedProduct[];
  } catch {
    return [];
  }
}

export function getProductBySlug(slug: string): PublishedProduct | null {
  try {
    const dataPath = path.join(PRODUCTS_DIR, slug, 'data.json');
    if (!fs.existsSync(dataPath)) return null;
    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    return mapProduct(raw, slug);
  } catch {
    return null;
  }
}
