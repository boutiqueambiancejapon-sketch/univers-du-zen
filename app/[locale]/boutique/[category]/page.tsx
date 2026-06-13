import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ShopGrid from '@/components/shop/ShopGrid';
import { CATEGORIES, DEMO_PRODUCTS } from '@/lib/demo-products';

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const cat = CATEGORIES.find(c => c.slug === params.category);
  if (!cat) return {};
  return {
    title: cat.label,
    description: `Découvrez notre sélection ${cat.label.toLowerCase()} — produits éthiques livrés depuis l'Europe.`,
  };
}

export function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.slug }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const cat = CATEGORIES.find(c => c.slug === params.category);
  if (!cat) notFound();

  const products = DEMO_PRODUCTS.filter(p => p.category === params.category);

  return (
    <ShopGrid
      products={products}
      categories={CATEGORIES}
      activeCategory={params.category}
    />
  );
}
