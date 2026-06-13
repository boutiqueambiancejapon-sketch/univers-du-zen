import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetailClient from '@/components/shop/ProductDetailClient';
import { DEMO_PRODUCTS } from '@/lib/demo-products';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = DEMO_PRODUCTS.find(p => p.slug === params.slug);
  if (!p) return {};
  return {
    title: p.nameFr,
    description: p.descriptionFr?.slice(0, 155),
  };
}

export function generateStaticParams() {
  return DEMO_PRODUCTS.filter(p => p.slug).map(p => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = DEMO_PRODUCTS.find(p => p.slug === params.slug);
  if (!product) notFound();

  const related = DEMO_PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
