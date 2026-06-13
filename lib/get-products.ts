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
  /** Parsed as string[] — stored as a comma-separated string in JSON but normalized on read. */
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
  // Legacy compat (ProductCard attend ces champs)
  nameFr?: string;
  descriptionFr?: string;
  retailPriceEur?: number;
  compareAtPriceEur?: number;
  stockStatus?: 'Normal' | 'Low' | 'VeryLow' | 'OutOfStock';
  stockQty?: number;
  isBestSeller?: boolean;
  isVegan?: boolean;
  isCrueltyFree?: boolean;
}

const PRODUCTS_DIR = path.join(process.cwd(), 'products');

/** Normalise tags: accepte une chaîne CSV ou un tableau déjà parsé. */
function parseTags(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw === 'string') return raw.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

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

          const REPO_RAW = 'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main';
          const images = (raw.images ?? []).map((img: string) =>
            img.startsWith('http') ? img : `${REPO_RAW}/products/${slug}/${img}`
          );

          return {
            ...raw,
            images,
            tags:              parseTags(raw.tags),
            nameFr:            raw.name,
            descriptionFr:     raw.description,
            retailPriceEur:    raw.retail_price_eur,
            compareAtPriceEur: raw.compare_at_price_eur,
            stockStatus:       raw.stock_status ?? 'Normal',
            stockQty:          raw.stock_qty ?? 0,
            isBestSeller:      raw.is_best_seller ?? false,
            isVegan:           raw.is_vegan ?? true,
            isCrueltyFree:     raw.is_cruelty_free ?? true,
            category:          raw.category ?? 'huiles-fragrance',
          } as PublishedProduct;
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
    const REPO_RAW = 'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main';
    const images = (raw.images ?? []).map((img: string) =>
      img.startsWith('http') ? img : `${REPO_RAW}/products/${slug}/${img}`
    );
    return {
      ...raw,
      images,
      tags:              parseTags(raw.tags),
      nameFr:            raw.name,
      descriptionFr:     raw.description,
      retailPriceEur:    raw.retail_price_eur,
      compareAtPriceEur: raw.compare_at_price_eur,
      stockStatus:       raw.stock_status ?? 'Normal',
      stockQty:          raw.stock_qty ?? 0,
      isBestSeller:      raw.is_best_seller ?? false,
      isVegan:           raw.is_vegan ?? true,
      isCrueltyFree:     raw.is_cruelty_free ?? true,
      category:          raw.category ?? 'huiles-fragrance',
    };
  } catch {
    return null;
  }
}
