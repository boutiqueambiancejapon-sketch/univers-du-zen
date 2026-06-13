/**
 * Source de vérité produits publiés.
 * Utilisable uniquement côté serveur (Server Components).
 *
 * STRATÉGIE PRIX :
 *  - Prix fournisseur (brut)  × 3   → prix de vente arrondi à .99
 *  - Prix fournisseur (brut)  × 4.5 → compareAt (barré) arrondi à .99
 *  → Affiche ~33 % de remise, marge nette ≥ 66 %.
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
  // Champs camelCase attendus par ProductCard / ProductDetailClient
  nameFr?: string;
  descriptionFr?: string;
  shortDescriptionFr?: string;
  longDescriptionFr?: string;
  usageFr?: string;
  benefitsFr?: string[];
  faqFr?: { question: string; answer: string }[];
  characteristics?: { label: string; value: string }[];
  retailPriceEur?: number;
  compareAtPriceEur?: number;
  stockStatus?: 'Normal' | 'Low' | 'VeryLow' | 'OutOfStock';
  stockQty?: number;
  isBestSeller?: boolean;
  isVegan?: boolean;
  isCrueltyFree?: boolean;
  isOrganic?: boolean;
}

const PRODUCTS_DIR = path.join(process.cwd(), 'products');
const REPO_RAW = 'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main';

/* ── Constantes de marge ────────────────────────────────────────────────────
   Modifier ici pour ajuster la politique tarifaire globale.
   MARKUP       = coefficient appliqué au coût fournisseur → prix affiché
   COMPARE_MULT = coefficient pour le prix barré (> MARKUP pour afficher remise)
   Remise visible ≈ 1 - MARKUP / COMPARE_MULT  (actuellement ~33 %)
─────────────────────────────────────────────────────────────────────────── */
const MARKUP       = 3;
const COMPARE_MULT = 4.5;

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/**
 * Arrondit vers le haut au prochain entier puis soustrait 0,01.
 * Ex : 11,10 → 11,99 | 15,00 → 14,99 | 4,50 → 4,99
 */
function psychPrice(raw: number): number {
  return Math.ceil(raw) - 0.01;
}

/** Extrait un nombre depuis "€3.70", 3.70 ou undefined. */
function parseRawPrice(raw: unknown): number | undefined {
  if (typeof raw === 'number') return raw > 0 ? raw : undefined;
  if (typeof raw === 'string') {
    const n = parseFloat(raw.replace(/[^0-9.]/g, ''));
    return isNaN(n) || n <= 0 ? undefined : n;
  }
  return undefined;
}

function parseTags(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw === 'string') return raw.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

function parseImages(raw: unknown[], slug: string): string[] {
  return (raw ?? []).map((img: unknown) => {
    const s = String(img);
    return s.startsWith('http') ? s : `${REPO_RAW}/products/${slug}/${s}`;
  });
}

function mapProduct(raw: Record<string, unknown>, slug: string): PublishedProduct {
  const images = parseImages((raw.images as unknown[]) ?? [], slug);

  // Coût fournisseur brut (le champ "price" du pipeline vaut ex. "€3.70")
  const supplierCost =
    parseRawPrice(raw.retail_price_eur) ??
    parseRawPrice(raw.retailPriceEur)   ??
    parseRawPrice(raw.price);

  // Prix de vente : coût × MARKUP arrondi à .99
  const retailPriceEur   = supplierCost ? psychPrice(supplierCost * MARKUP)       : undefined;
  // Prix barré : coût × COMPARE_MULT arrondi à .99 (affiche une remise ~33 %)
  const compareAtPriceEur = supplierCost ? psychPrice(supplierCost * COMPARE_MULT) : undefined;

  const stockStatus =
    (raw.stock_status as PublishedProduct['stockStatus']) ??
    (raw.stockStatus  as PublishedProduct['stockStatus']) ??
    'Normal';

  const nameFr = String(raw.name ?? raw.nameFr ?? slug);

  return {
    id:    String(raw.id ?? slug),
    slug,
    name:  nameFr,
    images,
    tags:  parseTags(raw.tags),

    nameFr,
    shortDescriptionFr: (raw.short_description ?? raw.shortDescriptionFr ?? undefined) as string | undefined,
    descriptionFr:      (raw.description        ?? raw.descriptionFr      ?? undefined) as string | undefined,
    longDescriptionFr:  (raw.long_description   ?? raw.longDescriptionFr  ?? undefined) as string | undefined,
    usageFr:            (raw.usage              ?? raw.usageFr            ?? undefined) as string | undefined,
    meta_description:   (raw.meta_description ?? undefined) as string | undefined,
    original_name:      (raw.original_name    ?? undefined) as string | undefined,

    benefitsFr:     Array.isArray(raw.benefitsFr)      ? raw.benefitsFr      as string[] : undefined,
    faqFr:          Array.isArray(raw.faqFr)           ? raw.faqFr           as PublishedProduct['faqFr'] : undefined,
    characteristics:Array.isArray(raw.characteristics) ? raw.characteristics as PublishedProduct['characteristics'] : undefined,

    // Prix calculés (jamais le prix brut fournisseur)
    retailPriceEur,
    compareAtPriceEur,
    retail_price_eur:     retailPriceEur,
    compare_at_price_eur: compareAtPriceEur,

    stockStatus,
    stock_status: stockStatus,
    stockQty:     (raw.stock_qty ?? raw.stockQty ?? 0) as number,
    stock_qty:    (raw.stock_qty ?? raw.stockQty ?? 0) as number,

    isBestSeller:  Boolean(raw.is_best_seller  ?? raw.isBestSeller  ?? false),
    isVegan:       Boolean(raw.is_vegan        ?? raw.isVegan        ?? true),
    isCrueltyFree: Boolean(raw.is_cruelty_free ?? raw.isCrueltyFree ?? true),
    isOrganic:     Boolean(raw.is_organic      ?? raw.isOrganic      ?? false),

    category: String(raw.category ?? raw.dept ?? 'huiles-fragrance'),

    pushed_at: (raw.pushed_at ?? undefined) as string | undefined,
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
