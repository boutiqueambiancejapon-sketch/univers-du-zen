import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import ShopGrid from '@/components/shop/ShopGrid';
import { getPublishedProducts } from '@/lib/get-products';
import { CATEGORIES } from '@/lib/demo-products';
import { getCollection } from '@/lib/collections';
import { CATEGORY_SEO } from '@/lib/category-seo';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; category: string };
}): Promise<Metadata> {
  const seo        = CATEGORY_SEO[params.category];
  const collection = getCollection(params.category);
  const cat        = CATEGORIES.find(c => c.slug === params.category);
  if (!cat && !collection) return {};
  const label       = collection?.label ?? cat?.label ?? params.category;
  const title       = seo?.title ?? label;
  const description = seo?.shortDesc ?? collection?.description ?? `Découvrez notre sélection ${label.toLowerCase()} — produits éthiques livrés en Belgique.`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: { canonical: `https://universduzen.com/${params.locale}/boutique/${params.category}` },
  };
}

export function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: { locale: string; category: string };
}) {
  const cat = CATEGORIES.find(c => c.slug === params.category);
  if (!cat) notFound();

  const locale     = await getLocale();
  const collection = getCollection(params.category);
  const products   = (await getPublishedProducts()).filter(p => p.category === params.category);
  const seo        = CATEGORY_SEO[params.category];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `https://universduzen.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Boutique', item: `https://universduzen.com/${locale}/boutique` },
      { '@type': 'ListItem', position: 3, name: cat.label, item: `https://universduzen.com/${locale}/boutique/${params.category}` },
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
            <span className="text-zen-bark">{cat.label}</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-3">
            {seo?.title ?? cat.label}
          </h1>
          <p className="text-zen-muted max-w-2xl text-sm leading-relaxed">
            {seo?.shortDesc ?? collection?.description ?? ''}
          </p>
        </div>
      </div>

      {/* Sub-collection nav — flex-wrap bento (pas de scroll horizontal) */}
      {collection && collection.subs.length > 0 && (
        <div className="border-b border-zen-sand bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2">
            <Link
              href={`/${locale}/boutique/${params.category}`}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-sans font-medium bg-zen-bark text-white"
            >
              Tout voir
            </Link>
            {collection.subs.map(sub => (
              <Link
                key={sub.slug}
                href={`/${locale}/boutique/${params.category}/${sub.slug}`}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-sans text-zen-bark border border-zen-sand hover:border-zen-bark hover:bg-zen-beige transition-colors whitespace-nowrap"
              >
                {sub.label}
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

      {/* Editorial SEO block */}
      {seo && (
        <div className="bg-zen-beige border-t border-zen-sand mt-8">
          <div className="max-w-4xl mx-auto px-4 py-14">
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-zen-bark mb-4">
                Tout savoir sur {cat.label.toLowerCase()}
              </h2>
              {seo.longDesc.split('\n\n').map((para, i) => (
                <p key={i} className="text-zen-muted leading-relaxed mb-4 text-sm">{para}</p>
              ))}
            </div>

            {seo.faq.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl text-zen-bark mb-6">Questions fréquentes</h2>
                <div className="space-y-3">
                  {seo.faq.map((item, i) => (
                    <details key={i} className="group border border-zen-sand rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-sans font-medium text-zen-bark hover:bg-white/60 transition-colors list-none">
                        {item.question}
                        <span className="ml-3 flex-shrink-0 text-zen-muted group-open:rotate-180 transition-transform">▾</span>
                      </summary>
                      <div className="px-4 pb-4 text-sm text-zen-muted leading-relaxed border-t border-zen-sand pt-3">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export const revalidate = 300;
