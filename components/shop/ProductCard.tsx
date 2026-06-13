'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCartStore } from '@/lib/store/cart';
import type { Product } from '@/lib/types';

const PLACEHOLDER_BG: Record<string, string> = {
  aromatherapie: 'bg-[#7A9E7E]',
  bougies: 'bg-[#C4A882]',
  encens: 'bg-[#9B8B7A]',
  'pierres-cristaux': 'bg-[#B8C4C8]',
  'maison-deco': 'bg-[#D4C5B2]',
  'thes-artisanaux': 'bg-[#A8956E]',
};

const PLACEHOLDER_IMG: Record<string, string> = {
  aromatherapie: '/images/udz-cat-aromatherapie.jpeg',
  bougies: '/images/udz-cat-bougies.jpeg',
  encens: '/images/udz-cat-encens.jpeg',
  'pierres-cristaux': '/images/udz-cat-cristaux.jpeg',
  'maison-deco': '/images/udz-cat-maison.jpeg',
  'thes-artisanaux': '/images/udz-cat-thes.jpeg',
};

const STOCK_BADGE: Record<string, { label: string; color: string }> = {
  Low: { label: 'Dernières pièces', color: 'bg-amber-100 text-amber-700' },
  VeryLow: { label: 'Presque épuisé', color: 'bg-red-100 text-red-600' },
  OutOfStock: { label: 'Rupture', color: 'bg-gray-200 text-gray-500' },
};

export default function ProductCard({ product }: { product: Partial<Product> }) {
  const locale = useLocale();
  const addItem = useCartStore(s => s.addItem);

  const discount = product.compareAtPriceEur
    ? Math.round((1 - product.retailPriceEur! / product.compareAtPriceEur) * 100)
    : null;

  const placeholderBg = PLACEHOLDER_BG[product.category ?? ''] ?? 'bg-zen-sand';
  const hasProductImage = !!product.images?.[0];
  const imgSrc = hasProductImage
    ? product.images![0]
    : PLACEHOLDER_IMG[product.category ?? ''];

  const stockBadge = STOCK_BADGE[product.stockStatus ?? ''];
  const isOutOfStock = product.stockStatus === 'OutOfStock';

  return (
    <div className="group card-product">
      {/* Image */}
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-t-xl ${
          hasProductImage ? 'bg-[#F5F0EA]' : placeholderBg
        }`}
      >
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={product.nameFr ?? ''}
            fill
            className={`transition-transform duration-500 group-hover:scale-105 ${
              hasProductImage ? 'object-contain p-6' : 'object-cover'
            }`}
            unoptimized={imgSrc.startsWith('https://raw.githubusercontent.com')}
          />
        )}

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="badge-bestseller">Best-seller</span>
          )}
          {discount && !isOutOfStock && (
            <span className="badge-discount">-{discount}%</span>
          )}
          {stockBadge && (
            <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full ${stockBadge.color}`}>
              {stockBadge.label}
            </span>
          )}
        </div>

        {/* Eco badges top-right */}
        <div className="absolute top-3 right-10 flex gap-1 z-10">
          {product.isVegan && (
            <span className="w-5 h-5 rounded-full bg-green-50 text-green-700 text-[9px] flex items-center justify-center font-bold" title="Vegan">V</span>
          )}
          {product.isCrueltyFree && (
            <span className="w-5 h-5 rounded-full bg-pink-50 text-pink-600 text-[9px] flex items-center justify-center" title="Sans test animal">♥</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Ajouter aux favoris"
        >
          <Heart size={14} className="text-zen-bark" />
        </button>

        {/* Add to cart overlay */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <button
              onClick={() => addItem(product as Product)}
              className="w-full bg-zen-bark text-white text-sm font-sans font-medium py-3 flex items-center justify-center gap-2 hover:bg-zen-bark/90 transition-colors"
            >
              <ShoppingBag size={14} />
              Ajouter au panier
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] font-sans tracking-widest uppercase text-zen-muted mb-1">
          {product.category?.replace('-', ' & ')}
        </p>
        <Link href={`/${locale}/produits/${product.slug}`}>
          <h3 className="font-serif text-zen-bark text-sm leading-snug hover:text-zen-terracotta transition-colors line-clamp-2">
            {product.nameFr}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1">
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={10} className={i <= 4 ? 'fill-zen-gold text-zen-gold' : 'text-zen-sand fill-zen-sand'} />
          ))}
          <span className="text-[10px] text-zen-muted ml-1">4.8 (124)</span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className={`font-sans font-semibold ${isOutOfStock ? 'text-zen-muted' : 'text-zen-bark'}`}>
            {product.retailPriceEur} €
          </span>
          {product.compareAtPriceEur && (
            <span className="text-xs text-zen-muted line-through">{product.compareAtPriceEur} €</span>
          )}
        </div>
      </div>
    </div>
  );
}
