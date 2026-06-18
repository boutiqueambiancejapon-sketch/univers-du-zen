/**
 * Avis produits — helpers server-only (clé service-role).
 * Ne jamais importer dans un composant client.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface ProductReview {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  verified_purchase: boolean;
  created_at: string;
}

export interface ReviewSummary {
  count: number;
  average: number;                       // arrondi à 1 décimale
  distribution: Record<number, number>;  // { 1: n, ... 5: n }
}

const EMPTY: ReviewSummary = { count: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };

let _client: SupabaseClient | null = null;
function getClient(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

/** Avis approuvés d'un produit + statistiques agrégées. */
export async function getApprovedReviews(
  slug: string,
): Promise<{ reviews: ProductReview[]; summary: ReviewSummary }> {
  const client = getClient();
  if (!client) return { reviews: [], summary: { ...EMPTY } };

  const { data, error } = await client
    .from('product_reviews')
    .select('id, author_name, rating, title, body, verified_purchase, created_at')
    .eq('product_slug', slug)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) return { reviews: [], summary: { ...EMPTY } };

  const reviews = data as ProductReview[];
  const count = reviews.length;
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of reviews) {
    sum += r.rating;
    distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
  }
  const average = Math.round((sum / count) * 10) / 10;
  return { reviews, summary: { count, average, distribution } };
}

/**
 * Vérifie qu'un email a bien acheté un produit (commande validée contenant le produit).
 * Tolère les différentes formes d'items stockés (id / sku / productId / slug).
 */
export async function hasPurchased(
  email: string,
  slug: string,
  sku?: string,
): Promise<{ purchased: boolean; orderId: string | null }> {
  const client = getClient();
  if (!client) return { purchased: false, orderId: null };

  const { data } = await client
    .from('orders')
    .select('id, items, status, email')
    .eq('email', email)
    .in('status', ['paid', 'processing', 'shipped', 'delivered']);

  for (const o of (data ?? []) as Array<{ id: string; items: unknown }>) {
    const items: any[] = Array.isArray(o.items) ? o.items : [];
    const match = items.some((it) => {
      const ids = [it?.id, it?.sku, it?.productId, it?.product_id, it?.slug]
        .filter((x) => x !== null && x !== undefined)
        .map((x) => String(x));
      return (sku ? ids.includes(String(sku)) : false) || ids.includes(slug);
    });
    if (match) return { purchased: true, orderId: o.id };
  }
  return { purchased: false, orderId: null };
}
