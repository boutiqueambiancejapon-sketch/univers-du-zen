/**
 * Helpers de filtrage produits par taxonomie.
 * Séparé de collections.ts pour garder ce dernier purement déclaratif.
 */
import { getSubCollection, type SubSubCollection } from '@/lib/collections';

/** Familles (csvFamilies) couvertes par une sous-collection = union de ses sous-sous-collections. */
export function familiesForSub(collectionSlug: string, subSlug: string): string[] {
  const sub = getSubCollection(collectionSlug, subSlug);
  if (!sub) return [];
  return Array.from(new Set((sub.subs ?? []).flatMap(ss => ss.csvFamilies ?? [])));
}

/** Récupère une sous-sous-collection par ses 3 slugs. */
export function getSubSubCollection(
  collectionSlug: string,
  subSlug: string,
  subSubSlug: string,
): SubSubCollection | undefined {
  return getSubCollection(collectionSlug, subSlug)?.subs?.find(s => s.slug === subSubSlug);
}

/** Familles d'une sous-sous-collection. */
export function familiesForSubSub(collectionSlug: string, subSlug: string, subSubSlug: string): string[] {
  return getSubSubCollection(collectionSlug, subSlug, subSubSlug)?.csvFamilies ?? [];
}
