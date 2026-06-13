import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
import ProductDetailClient from '@/components/shop/ProductDetailClient';
import { ALL_PRODUCTS, CATEGORIES } from '@/lib/all-products';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const p = ALL_PRODUCTS.find(p => p.slug === params.slug);
  if (!p) return {};
  const title = `${p.nameFr} | Univers du Zen`;
  const description = (p as any).metaDescriptionFr ?? p.shortDescriptionFr ?? p.descriptionFr?.slice(0, 155);
  const image = p.images?.[0];
  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? '',
      images: image ? [{ url: image.startsWith('http') ? image : `https://universduzen.com${image}`, width: 1200, height: 630 }] : [],
      type: 'website',
    },
    alternates: {
      canonical: `https://universduzen.com/${params.locale}/produits/${params.slug}`,
    },
  };
}

export function generateStaticParams() {
  return ALL_PRODUCTS.flatMap(p =>
    ['fr-BE', 'fr-FR', 'nl-BE', 'nl-NL'].map(locale => ({ locale, slug: p.slug! }))
  );
}

export default function ProductPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const product = ALL_PRODUCTS.find(p => p.slug === params.slug);
  if (!product) notFound();

  const related = ALL_PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameFr,
    description: product.shortDescriptionFr ?? product.descriptionFr,
    image: product.images ?? [],
    brand: { '@type': 'Brand', name: 'Univers du Zen' },
    offers: {
      '@type': 'Offer',
      price: product.retailPriceEur,
      priceCurrency: 'EUR',
      availability:
        product.stockStatus === 'OutOfStock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Univers du Zen' },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '124',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `https://universduzen.com/${params.locale}` },
      { '@type': 'ListItem', position: 2, name: 'Boutique', item: `https://universduzen.com/${params.locale}/boutique` },
      { '@type': 'ListItem', position: 3, name: product.nameFr, item: `https://universduzen.com/${params.locale}/produits/${params.slug}` },
    ],
  };

  return (
    <>
      <Script id="product-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ProductDetailClient product={product} related={related as any} />
    </>
  );
}
