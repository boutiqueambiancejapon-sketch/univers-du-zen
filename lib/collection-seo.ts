import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

export interface CollectionSeo {
  long_description: string | null;
  faq: { question: string; answer: string }[];
}

/** Contenu éditorial (description longue + FAQ) d'un nœud de collection, par chemin. */
export async function getCollectionSeo(path: string): Promise<CollectionSeo | null> {
  if (!client) return null;
  const { data, error } = await client
    .from('collection_seo')
    .select('long_description, faq')
    .eq('path', path)
    .maybeSingle();
  if (error || !data) return null;
  return {
    long_description: (data.long_description as string) ?? null,
    faq: Array.isArray(data.faq) ? (data.faq as { question: string; answer: string }[]) : [],
  };
}
