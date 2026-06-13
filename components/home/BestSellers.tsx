'use client';

import { Heart, Star } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cart';
import type { Product } from '@/lib/types';

// Données de démo — remplacées par Supabase dès le pipeline actif
const DEMO_PRODUCTS: Partial<Product>[] = [
  {
    id: '1',
    slug: 'huile-essentielle-lavande-bleue',
    nameFr: 'Huile essentielle Lavande bleue',
    category: 'aromatherapie',
    retailPriceEur: 18,
    compareAtPriceEur: 24,
    stockStatus: 'Normal',
    isBestSeller: true,
    images: [],
  },
  {
    id: '2',
    slug: 'bougie-soja-vanille',
    nameFr: 'Bougie de soja Vanille & Bois de Santal',
    category: 'bougies',
    retailPriceEur: 22,
    stockStatus: 'Normal',
    isBestSeller: true,
    images: [],
  },
  {
    id: '3',
    slug: 'palo-santo-lot-6',
    nameFr: 'Palo Santo sacré (lot de 6)',
    category: 'encens',
    retailPriceEur: 14,
    stockStatus: 'Low',
    isBestSeller: true,
    images: [],
  },
  {
    id: '4',
    slug: 'quartz-rose-brut',
    nameFr: 'Quartz rose brut',
    category: 'pierres-cristaux',
    retailPriceEur: 12,
    stockStatus: 'Normal',
    isBestSeller: false,
    images: [],
  },
];

function ProductCard({ product }: { product: Partial<Product> }) {
  const t = useTranslations('product');
  const locale = useLocale();
  const addItem = useCartStore(s => s.addItem);
  const discount = product.compareAtPriceEur
    ? Math.round((1 - product.retailPriceEur! / product.compareAtPriceEur) * 100)
    : null;

  // Couleur placeholder selon catégorie
  const bg: Record<string, string> = {
    aromatherapie: 'bg-[#7A9E7E]',
    bougies: 'bg-[#C4A882]',
    encens: 'bg-[#9B8B7A]',
    'pierres-cristaux': 'bg-[#B8C4C8]',
  };
  const placeholderBg = bg[product.category ?? ''] ?? 'bg-zen-sand';

  return (
    <div className="card-product">
      {/* Image */}
      <div className={`relative aspect-[3/4] ${placeholderBg} overflow-hidden`}>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="badge-bestseller">{t('bestSeller')}</span>
          )}
          {discount && (
            <span className="badge-discount">-{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
          <Heart size={14} className="text-zen-bark" />
        </button>

        {/* Ajouter au panier — overlay hover */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => addItem(product as Product)}
            className="w-full bg-zen-bark text-white text-sm font-sans font-medium py-3 hover:bg-zen-bark/90 transition-colors"
          >
            {t('addToCart')}
          </button>
        </div>
      </div>

      {/* Infos */}
      <div className="p-3">
        <p className="text-[10px] font-sans tracking-widest uppercase text-zen-muted mb-1">
          {product.category?.replace('-', ' & ')}
        </p>
        <Link href={`/${locale}/produits/${product.slug}`}>
          <h3 className="font-serif text-zen-bark text-sm leading-snug hover:text-zen-terracotta transition-colors">
            {product.nameFr}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <Star size={11} className="fill-zen-gold text-zen-gold" />
          <span className="text-[11px] text-zen-muted">4.8 · 124 avis</span>
        </div>

        {/* Prix */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-sans font-semibold text-zen-bark">
            {product.retailPriceEur} €
          </span>
          {product.compareAtPriceEur && (
            <span className="text-xs text-zen-muted line-through">
              {product.compareAtPriceEur} €
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BestSellers() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-zen-bark">Nos best-sellers</h2>
          <p className="text-zen-muted mt-2">Les favoris de notre communauté</p>
        </div>
        <Link
          href="/boutique"
          className="text-sm text-zen-muted hover:text-zen-bark transition-colors hidden md:block"
        >
          Voir tout →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DEMO_PRODUCTS.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
