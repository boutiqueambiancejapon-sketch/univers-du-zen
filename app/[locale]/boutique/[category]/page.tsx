import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
import { getLocale } from 'next-intl/server';
import ShopGrid from '@/components/shop/ShopGrid';
import { ALL_PRODUCTS, CATEGORIES } from '@/lib/all-products';
import { CATEGORY_SEO } from '@/lib/category-seo';

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const seo = CATEGORY_SEO[params.category];
  const cat = CATEGORIES.find(c => c.slug === params.category);
  if (!cat) return {};
  const title = `${seo?.title ?? cat.label} | Univers du Zen`;
  const description = seo?.shortDesc ?? `Découvrez notre sélection ${cat.label.toLowerCase()} — produits éthiques livrés en Belgique.`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
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

  const locale = await getLocale();
  const products = ALL_PRODUCTS.filter(p => p.category === params.category);
  const seo = CATEGORY_SEO[params.category];

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

      <div className="bg-zen-beige border-b border-zen-sand">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="text-xs font-sans text-zen-muted mb-4 flex gap-1.5">
            <a href={`/${locale}`} className="hover:text-zen-bark">Accueil</a>
            <span>/</span>
            <a href={`/${locale}/boutique`} className="hover:text-zen-bark">Boutique</a>
            <span>/</span>
            <span className="text-zen-bark">{cat.label}</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-3">
            {seo?.title ?? cat.label}
          </h1>
          {seo?.shortDesc && (
            <p className="text-zen-muted max-w-2xl text-sm leading-relaxed">{seo.shortDesc}</p>
          )}
        </div>
      </div>

      <ShopGrid
        products={products as any}
        categories={CATEGORIES}
        activeCategory={params.category}
      />

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
