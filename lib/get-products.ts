/**
 * Source de vérité produits publiés — lecture Supabase (server-only).
 *
 * STRATÉGIE PRIX :
 *  - retail_eur = prix normal, toujours affiché (pas de prix barré par défaut).
 *  - Promo réelle et temporaire (conforme Omnibus) : si promo_price_eur est défini
 *    et que la date courante est dans [promo_starts_at, promo_ends_at], on affiche
 *    promo_price_eur et on barre retail_eur (prix réellement pratiqué auparavant).
 *
 * STOCK : temps quasi-réel depuis supplier_catalog (mis à jour par le cron),
 * joint sur le SKU. Le statut est recalculé à partir du stock fournisseur réel.
 *
 * NB : ce module est server-only (clé service-role). Ne jamais l'importer dans un
 * composant client — passer par '@/lib/all-products' côté client.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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
  family?: string;
  stock_status?: 'Normal' | 'Low' | 'VeryLow' | 'OutOfStock';
  stock_qty?: number;
  is_best_seller?: boolean;
  is_vegan?: boolean;
  is_cruelty_free?: boolean;
  pushed_at?: string;
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

type StockStatus = 'Normal' | 'Low' | 'VeryLow' | 'OutOfStock';
type StockRow = { sku: string; stock_qty: number | null; in_stock: boolean | null };

let _client: SupabaseClient | null = null;
function getClient(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

function statusFromQty(qty: number): StockStatus {
  if (qty > 10) return 'Normal';
  if (qty > 2) return 'Low';
  if (qty > 0) return 'VeryLow';
  return 'OutOfStock';
}

function toNum(v: unknown): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isNaN(n) ? undefined : n;
}

function asArray<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (typeof v === 'string') {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? (p as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function mapRow(row: Record<string, any>, stock?: StockRow): PublishedProduct {
  // Stock temps réel depuis supplier_catalog (fallback : valeurs stockées sur le produit)
  const liveQty = stock
    ? stock.in_stock === false
      ? 0
      : stock.stock_qty ?? 0
    : toNum(row.stock_qty) ?? 0;
  const stockStatus = statusFromQty(liveQty);

  // Prix + promo réelle/temporaire
  const retailNormal = toNum(row.retail_eur) ?? 0;
  const promoPrice = toNum(row.promo_price_eur);
  const now = Date.now();
  const starts = row.promo_starts_at ? new Date(row.promo_starts_at).getTime() : null;
  const ends = row.promo_ends_at ? new Date(row.promo_ends_at).getTime() : null;
  const promoActive =
    promoPrice != null && starts != null && ends != null && starts <= now && now <= ends;

  const retailPriceEur = promoActive ? promoPrice : retailNormal;
  const compareAtPriceEur = promoActive ? retailNormal : undefined;

  const images = asArray<string>(row.images);
  const nameFr = String(row.name_fr ?? row.slug ?? '');

  return {
    id: String(row.id ?? row.sku ?? row.slug),
    slug: String(row.slug),
    name: nameFr,
    images,
    tags: asArray<string>(row.tags),

    nameFr,
    shortDescriptionFr: row.short_description_fr ?? undefined,
    descriptionFr: row.description_fr ?? undefined,
    longDescriptionFr: row.long_description_fr ?? undefined,
    usageFr: row.usage_fr ?? undefined,
    meta_description: row.meta_desc_fr ?? undefined,
    short_description: row.short_description_fr ?? undefined,
    description: row.description_fr ?? undefined,

    benefitsFr: asArray<string>(row.benefits_fr),
    faqFr: asArray<{ question: string; answer: string }>(row.faq_fr),
    characteristics: asArray<{ label: string; value: string }>(row.characteristics),

    retailPriceEur,
    compareAtPriceEur,
    retail_price_eur: retailPriceEur,
    compare_at_price_eur: compareAtPriceEur,

    stockStatus,
    stock_status: stockStatus,
    stockQty: liveQty,
    stock_qty: liveQty,

    isBestSeller: Boolean(row.is_best_seller),
    isVegan: Boolean(row.is_vegan),
    isCrueltyFree: Boolean(row.is_cruelty_free),
    isOrganic: Boolean(row.is_organic),

    category: row.category ? String(row.category) : undefined,
    family: row.family ? String(row.family) : undefined,
  };
}

async function attachStock(
  client: SupabaseClient,
  rows: Record<string, any>[],
): Promise<PublishedProduct[]> {
  const skus = rows.map((r) => r.sku).filter(Boolean);
  const stockMap = new Map<string, StockRow>();
  if (skus.length) {
    const { data: stock } = await client
      .from('supplier_catalog')
      .select('sku, stock_qty, in_stock')
      .in('sku', skus);
    for (const s of (stock ?? []) as StockRow[]) stockMap.set(s.sku, s);
  }
  return rows.map((r) => mapRow(r, stockMap.get(r.sku)));
}

export async function getPublishedProducts(): Promise<PublishedProduct[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('is_published', true)
    .order('updated_at', { ascending: false });
  if (error || !data) return [];
  return attachStock(client, data as Record<string, any>[]);
}

export async function getProductBySlug(slug: string): Promise<PublishedProduct | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (error || !data) return null;
  const [mapped] = await attachStock(client, [data as Record<string, any>]);
  return mapped ?? null;
}
