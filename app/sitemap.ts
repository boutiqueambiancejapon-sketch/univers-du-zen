import type { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/lib/collections';
import { getPublishedProducts } from '@/lib/get-products';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://universduzen.com').replace(/\/$/, '');
const LOCALES = ['fr-BE', 'fr-FR'];

const STATIC_PATHS = [
  '', '/boutique',
  '/livraison', '/retours', '/faq', '/contact',
  '/a-propos', '/cgv', '/mentions-legales', '/confidentialite', '/cookies',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Familles publiées → ne lister que les pages de collection NON vides
  let products: { slug: string; family?: string }[] = [];
  try {
    products = await getPublishedProducts();
  } catch {
    products = [];
  }
  const publishedFamilies = new Set(products.map(p => p.family).filter(Boolean) as string[]);

  // Chemins de collection : hubs toujours ; sous/sous-sous uniquement si famille publiée
  const collectionPaths = new Set<string>();
  for (const c of COLLECTIONS) {
    collectionPaths.add(`/boutique/${c.slug}`);
    for (const s of c.subs) {
      const subFamilies = (s.subs ?? []).flatMap(ss => ss.csvFamilies ?? []);
      if (subFamilies.some(f => publishedFamilies.has(f))) {
        collectionPaths.add(`/boutique/${c.slug}/${s.slug}`);
      }
      for (const ss of s.subs ?? []) {
        if ((ss.csvFamilies ?? []).some(f => publishedFamilies.has(f))) {
          collectionPaths.add(`/boutique/${c.slug}/${s.slug}/${ss.slug}`);
        }
      }
    }
  }

  const productPaths = products.map(p => `/produits/${p.slug}`);
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE}/${locale}${path}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: path === '' ? 1 : path === '/boutique' ? 0.9 : 0.3,
      });
    }
    for (const path of Array.from(collectionPaths)) {
      entries.push({ url: `${SITE}/${locale}${path}`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 });
    }
    for (const path of productPaths) {
      entries.push({ url: `${SITE}/${locale}${path}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 });
    }
  }
  return entries;
}
