import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import ShopGrid from '@/components/shop/ShopGrid';
import { getPublishedProducts } from '@/lib/get-products';
import { CATEGORIES } from '@/lib/demo-products';
import { COLLECTIONS, getCollection, getSubCollection } from '@/lib/collections';

export async function generateMetadata({
  params,
}: {
  params: { category: string; sub: string };
}): Promise<Metadata> {
  const collection = getCollection(params.category);
  const sub        = getSubCollection(params.category, params.sub);
  if (!collection || !sub) return {};
  const title       = `${sub.label} — ${collection.label} | Univers du Zen`;
  const description = `Découvrez notre sélection ${sub.label.toLowerCase()} dans la collection ${collection.label}. Produits éthiques et naturels, livrés en Belgique, France et Luxembourg.`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
  };
}

export function generateStaticParams() {
  return COLLECTIONS.flatMap(c =>
    c.subs.map(sub => ({ category: c.slug, sub: sub.slug }))
  );
}

export default async function SubCategoryPage({
  params,
}: {
  params: { locale: string; category: string; sub: string };
}) {
  const collection = getCollection(params.category);
  const subCol     = getSubCollection(params.category, params.sub);
  const cat        = CATEGORIES.find(c => c.slug === params.category);

  if (!collection || !subCol) notFound();

  const locale   = await getLocale();
  // Filter by top-level category. When subcategory field is added to data.json,
  // narrow further: p.subcategory === params.sub
  const products = getPublishedProducts().filter(p => p.category === params.category);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil',          item: `https://universduzen.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Boutique',         item: `https://universduzen.com/${locale}/boutique` },
      { '@type': 'ListItem', position: 3, name: collection.label,   item: `https://universduzen.com/${locale}/boutique/${params.category}` },
      { '@type': 'ListItem', position: 4, name: subCol.label,       item: `https://universduzen.com/${locale}/boutique/${params.category}/${params.sub}` },
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
            <span className="text-zen-bark">{subCol.label}</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-3">
            {subCol.label}
          </h1>
          <p className="text-zen-muted max-w-2xl text-sm leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Sub-collection sibling nav (with active state) */}
      <div className="border-b border-zen-sand bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          <Link
            href={`/${locale}/boutique/${params.category}`}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-sans text-zen-bark border border-zen-sand hover:border-zen-bark hover:bg-zen-beige transition-colors whitespace-nowrap"
          >
            ← Tout {cat?.label ?? collection.label}
          </Link>
          {collection.subs.map(sub => (
            <Link
              key={sub.slug}
              href={`/${locale}/boutique/${params.category}/${sub.slug}`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-sans border transition-colors whitespace-nowrap ${
                sub.slug === params.sub
                  ? 'bg-zen-bark text-white border-zen-bark'
                  : 'text-zen-bark border-zen-sand hover:border-zen-bark hover:bg-zen-beige'
              }`}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Sub-sub-collection pills (tags only, no routing yet) */}
      {subCol.subs && subCol.subs.length > 0 && (
        <div className="border-b border-zen-sand bg-zen-beige/50">
          <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
            {subCol.subs.map(s => (
              <span
                key={s.slug}
                className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-sans text-zen-muted border border-zen-sand/60 bg-white whitespace-nowrap"
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <ShopGrid
        products={products as any}
        categories={CATEGORIES}
        activeCategory={params.category}
      />

      {/* SEO editorial block */}
      <div className="bg-zen-beige border-t border-zen-sand mt-8">
        <div className="max-w-4xl mx-auto px-4 py-14">
          <h2 className="font-serif text-2xl text-zen-bark mb-4">
            {subCol.label}
          </h2>
          <p className="text-zen-muted leading-relaxed text-sm mb-6">
            {collection.description}
          </p>

          {subCol.subs && subCol.subs.length > 0 && (
            <>
              <h3 className="font-serif text-lg text-zen-bark mb-3">
                Familles de produits
              </h3>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subCol.subs.map(s => (
                  <li key={s.slug} className="text-sm text-zen-muted font-sans flex items-start gap-1.5">
                    <span className="text-zen-terracotta mt-0.5">→</span>
                    <span className="text-zen-bark">{s.label}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}
