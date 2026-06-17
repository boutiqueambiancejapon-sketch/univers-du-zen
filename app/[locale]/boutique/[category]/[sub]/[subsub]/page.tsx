import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import ShopGrid from '@/components/shop/ShopGrid';
import { getPublishedProducts } from '@/lib/get-products';
import { CATEGORIES } from '@/lib/demo-products';
import { COLLECTIONS, getCollection, getSubCollection } from '@/lib/collections';
import { getSubSubCollection, familiesForSubSub } from '@/lib/collections-helpers';
import CollectionSeoBlock from '@/components/shop/CollectionSeoBlock';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; category: string; sub: string; subsub: string };
}): Promise<Metadata> {
  const collection = getCollection(params.category);
  const sub        = getSubCollection(params.category, params.sub);
  const subsub     = getSubSubCollection(params.category, params.sub, params.subsub);
  if (!collection || !sub || !subsub) return {};
  const title       = `${subsub.label} — ${sub.label}`;
  const description = `Notre sélection ${subsub.label.toLowerCase()} (${sub.label}, ${collection.label}). Produits éthiques et naturels, livrés en Belgique, France et Luxembourg.`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: { canonical: `https://universduzen.com/${params.locale}/boutique/${params.category}/${params.sub}/${params.subsub}` },
  };
}

export function generateStaticParams() {
  return COLLECTIONS.flatMap(c =>
    c.subs.flatMap(s => (s.subs ?? []).map(ss => ({ category: c.slug, sub: s.slug, subsub: ss.slug }))),
  );
}

export default async function SubSubCategoryPage({
  params,
}: {
  params: { locale: string; category: string; sub: string; subsub: string };
}) {
  const collection = getCollection(params.category);
  const sub        = getSubCollection(params.category, params.sub);
  const subsub     = getSubSubCollection(params.category, params.sub, params.subsub);
  if (!collection || !sub || !subsub) notFound();

  const locale   = await getLocale();
  const families = familiesForSubSub(params.category, params.sub, params.subsub);
  const products = (await getPublishedProducts()).filter(
    p => p.category === params.category && p.family && families.includes(p.family),
  );

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil',        item: `https://universduzen.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Boutique',       item: `https://universduzen.com/${locale}/boutique` },
      { '@type': 'ListItem', position: 3, name: collection.label, item: `https://universduzen.com/${locale}/boutique/${params.category}` },
      { '@type': 'ListItem', position: 4, name: sub.label,        item: `https://universduzen.com/${locale}/boutique/${params.category}/${params.sub}` },
      { '@type': 'ListItem', position: 5, name: subsub.label,     item: `https://universduzen.com/${locale}/boutique/${params.category}/${params.sub}/${params.subsub}` },
    ],
  };

  return (
    <>
      <Script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero header */}
      <div className="bg-zen-beige border-b border-zen-sand">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="text-xs font-sans text-zen-muted mb-4 flex gap-1.5 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-zen-bark">Accueil</Link>
            <span>/</span>
            <Link href={`/${locale}/boutique`} className="hover:text-zen-bark">Boutique</Link>
            <span>/</span>
            <Link href={`/${locale}/boutique/${params.category}`} className="hover:text-zen-bark">{collection.label}</Link>
            <span>/</span>
            <Link href={`/${locale}/boutique/${params.category}/${params.sub}`} className="hover:text-zen-bark">{sub.label}</Link>
            <span>/</span>
            <span className="text-zen-bark">{subsub.label}</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-3">
            {subsub.label}
          </h1>
          <p className="text-zen-muted max-w-2xl text-sm leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Sibling sous-sous-collections */}
      {sub.subs && sub.subs.length > 0 && (
        <div className="border-b border-zen-sand bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
            <Link
              href={`/${locale}/boutique/${params.category}/${params.sub}`}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-sans text-zen-bark border border-zen-sand hover:border-zen-bark hover:bg-zen-beige transition-colors whitespace-nowrap"
            >
              ← Tout {sub.label}
            </Link>
            {sub.subs.map(s => (
              <Link
                key={s.slug}
                href={`/${locale}/boutique/${params.category}/${params.sub}/${s.slug}`}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-sans border transition-colors whitespace-nowrap ${
                  s.slug === params.subsub
                    ? 'bg-zen-bark text-white border-zen-bark'
                    : 'text-zen-bark border-zen-sand hover:border-zen-bark hover:bg-zen-beige'
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <ShopGrid
        products={products as any}
        categories={CATEGORIES}
        activeCategory={params.category}
      />

      <CollectionSeoBlock path={`${params.category}/${params.sub}/${params.subsub}`} />
    </>
  );
}

export const revalidate = 300;
