'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus, Star, Check } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCartStore } from '@/lib/store/cart';
import type { Product } from '@/lib/types';

const CATEGORY_LABEL: Record<string, string> = {
  aromatherapie: 'Aromathérapie',
  bougies: 'Bougies de soja',
  encens: 'Encens',
  'pierres-cristaux': 'Pierres & Cristaux',
  'maison-deco': 'Maison & Déco',
  'thes-artisanaux': 'Thés Artisanaux',
};

const PLACEHOLDER_IMG: Record<string, string> = {
  aromatherapie: '/images/udz-cat-aromatherapie.jpeg',
  bougies: '/images/udz-cat-bougies.jpeg',
  encens: '/images/udz-cat-encens.jpeg',
  'pierres-cristaux': '/images/udz-cat-cristaux.jpeg',
  'maison-deco': '/images/udz-cat-maison.jpeg',
  'thes-artisanaux': '/images/udz-cat-thes.jpeg',
};

function MiniProductCard({ product }: { product: Partial<Product> }) {
  const locale = useLocale();
  const addItem = useCartStore(s => s.addItem);
  const [added, setAdded] = useState(false);

  const img = product.images?.[0] || PLACEHOLDER_IMG[product.category ?? ''];
  const discount = product.compareAtPriceEur
    ? Math.round((1 - product.retailPriceEur! / product.compareAtPriceEur) * 100)
    : null;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product as Product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group flex-shrink-0 w-52 bg-white rounded-xl overflow-hidden border border-zen-sand/60">
      {/* Image */}
      <Link href={`/${locale}/produits/${product.slug}`}>
        <div className="relative h-48 overflow-hidden">
          {img && (
            <Image
              src={img}
              alt={product.nameFr ?? ''}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {/* Badge */}
          {product.isBestSeller && !product.compareAtPriceEur && (
            <span className="absolute top-2.5 left-2.5 text-[9px] bg-white/90 text-zen-bark font-sans font-semibold px-2 py-0.5 rounded-full tracking-wide">
              Best-seller
            </span>
          )}
          {product.compareAtPriceEur && (
            <span className="absolute top-2.5 left-2.5 text-[9px] bg-white/90 text-zen-bark font-sans font-semibold px-2 py-0.5 rounded-full tracking-wide">
              Édition limitée
            </span>
          )}
          {/* Quick add */}
          <button
            onClick={handleAdd}
            aria-label="Ajouter au panier"
            className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-all ${
              added
                ? 'bg-green-600 scale-95'
                : 'bg-zen-bark hover:bg-zen-terracotta'
            }`}
          >
            {added
              ? <Check size={13} className="text-white" />
              : <Plus size={13} className="text-white" />}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <p className="text-[9px] font-sans tracking-widest uppercase text-zen-muted mb-1">
          {CATEGORY_LABEL[product.category ?? ''] ?? product.category}
        </p>
        <Link href={`/${locale}/produits/${product.slug}`}>
          <p className="font-serif text-zen-bark text-sm leading-snug line-clamp-2 hover:text-zen-terracotta transition-colors">
            {product.nameFr}
          </p>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <Star size={9} className="fill-zen-gold text-zen-gold" />
          <span className="text-[9px] text-zen-muted">4.8 &middot; 124 avis</span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span className="font-sans font-semibold text-zen-bark text-sm">{product.retailPriceEur} €</span>
          {product.compareAtPriceEur && (
            <span className="text-xs text-zen-muted line-through">{product.compareAtPriceEur} €</span>
          )}
          {discount && (
            <span className="text-[9px] text-zen-terracotta font-sans font-semibold">-{discount}%</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface Props {
  sectionLabel: string;
  title: string;
  description: string;
  products: Partial<Product>[];
  ctaHref: string;
  cardBg?: string;
  pieceCount?: number;
  discount?: number;
}

export default function FeaturedSection({
  sectionLabel,
  title,
  description,
  products,
  ctaHref,
  cardBg = '#2B4036',
  pieceCount,
  discount,
}: Props) {
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 220 : -220, behavior: 'smooth' });
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="max-w-md">
          <p className="text-[11px] font-sans tracking-widest uppercase text-zen-terracotta mb-2">
            &mdash; {sectionLabel}
          </p>
          <h2 className="font-serif text-3xl text-zen-bark leading-tight">{title}</h2>
          <p className="text-zen-muted mt-1.5 text-sm leading-relaxed">{description}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 flex-shrink-0 pt-1">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-zen-sand flex items-center justify-center text-zen-muted hover:border-zen-bark hover:text-zen-bark transition-colors"
            aria-label="Précédent"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-zen-sand flex items-center justify-center text-zen-muted hover:border-zen-bark hover:text-zen-bark transition-colors"
            aria-label="Suivant"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Collection hero card */}
        <div
          className="flex-shrink-0 w-52 rounded-xl p-5 flex flex-col justify-between"
          style={{ backgroundColor: cardBg, minHeight: '336px' }}
        >
          <div>
            {(pieceCount || discount) && (
              <p className="text-white/50 text-[10px] font-sans tracking-widest uppercase mb-4">
                {pieceCount ? `${String(pieceCount).padStart(2, '0')} pièces` : ''}
                {pieceCount && discount ? ' · ' : ''}
                {discount ? `-${discount}%` : ''}
              </p>
            )}
            <h3 className="font-serif text-white text-2xl leading-snug mb-3">{title}</h3>
            <p className="text-white/55 text-xs leading-relaxed">{description}</p>
          </div>
          <Link
            href={`/${locale}${ctaHref}`}
            className="mt-5 block bg-zen-terracotta text-white text-sm font-sans font-medium text-center py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Voir la collection →
          </Link>
        </div>

        {/* Products */}
        {products.map(p => (
          <MiniProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
