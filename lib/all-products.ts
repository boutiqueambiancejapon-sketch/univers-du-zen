/**
 * Source unique de vérité produits.
 * Merge les démos + les produits importés via Nano Banana.
 * Importer depuis ici dans toutes les pages.
 */
import { DEMO_PRODUCTS, CATEGORIES } from '@/lib/demo-products';
import { SUPPLIER_PRODUCTS } from '@/lib/supplier-products';
import type { DemoProduct } from '@/lib/demo-products';

export const ALL_PRODUCTS: DemoProduct[] = [
  ...DEMO_PRODUCTS,
  ...SUPPLIER_PRODUCTS,
];

export { CATEGORIES };
export type { DemoProduct };
