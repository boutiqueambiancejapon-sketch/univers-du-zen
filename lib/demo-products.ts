import type { Product } from '@/lib/types';

export interface DemoProduct extends Partial<Product> {
  shortDescriptionFr?: string;
  longDescriptionFr?: string;
  benefitsFr?: string[];
  usageFr?: string;
  faqFr?: { question: string; answer: string }[];
  characteristics?: { label: string; value: string }[];
}

// Tous les produits démo ont été supprimés.
// La boutique utilise désormais uniquement les produits publiés via products/catalog.json
export const DEMO_PRODUCTS: DemoProduct[] = [];

export const CATEGORIES = [
  { slug: 'huiles-fragrance',         label: 'Huiles de Fragrance' },
  { slug: 'aromatherapie',            label: 'Aromathérapie' },
  { slug: 'encens-rituels',           label: 'Encens & Rituels' },
  { slug: 'cristaux-lithotherapie',   label: 'Cristaux & Lithothérapie' },
  { slug: 'bougies-photophores',      label: 'Bougies & Lumières' },
  { slug: 'bien-etre-corps',          label: 'Bien-être Corps' },
  { slug: 'deco-maison-zen',          label: 'Déco & Maison Zen' },
  { slug: 'the-tisanes',              label: 'Thé & Tisanes' },
  { slug: 'instruments-sonotherapie', label: 'Instruments & Sonothérapie' },
  { slug: 'bijoux-cristaux',          label: 'Bijoux & Cristaux Portés' },
];
