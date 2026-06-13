// Client-safe barrel export.
// Do NOT re-export anything from '@/lib/get-products' here — it uses Node.js 'fs'
// and will break client component bundles (e.g. CartDrawer, Nav).
// In Server Components, import directly: import { getPublishedProducts } from '@/lib/get-products'
export { CATEGORIES } from '@/lib/demo-products';
