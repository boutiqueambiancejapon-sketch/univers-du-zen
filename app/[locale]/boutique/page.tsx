import type { Metadata } from 'next';
import ShopGrid from '@/components/shop/ShopGrid';
import { CATEGORIES, DEMO_PRODUCTS } from '@/lib/demo-products';

export const metadata: Metadata = {
  title: 'Boutique',
  description: 'Découvrez notre sélection de produits bien-être : aromathérapie, bougies, encens, cristaux et déco zen.',
};

export default function BoutiquePage() {
  return (
    <ShopGrid
      products={DEMO_PRODUCTS}
      categories={CATEGORIES}
      activeCategory={null}
    />
  );
}
