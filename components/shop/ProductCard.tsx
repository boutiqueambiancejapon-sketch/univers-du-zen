'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCartStore } from '@/lib/store/cart';
import type { Product } from '@/lib/types';

const PLACEHOLDER_BG: Record<string, string> = {
  aromatherapie:      'bg-[#7A9E7E]',
  bougies:            'bg-[#C4A882]',
  encens:             'bg-[#9B8B7A]',
  'pierres-cristaux': 'bg-[#B8C4C8]',
  'maison-deco':      'bg-[#D4C5B2]',
  'thes-artisanaux':  'bg-[#A8956E]',
};

const PLACEHOLDER_IMG: Record<string, string> = {
  aromatherapie:      '/images/udz-cat-aromatherapie.jpeg',
  bougies:            '/images/udz-cat-bougies.jpeg',
  encens:             '/images/udz-cat-encens.jpeg',
  'pierres-cristaux': '/images/udz-cat-cristaux.jpeg',
  'maison-deco':      '/images/udz-cat-maison.jpeg',
  'thes-artisanaux':  '/images/udz-cat-thes.jpeg',
};

export default function ProductCard({ product }: { product: Partial<Product> }) {
  const locale  = useLocale();
  const addItem = useCartStore(s => s.addItem);

  const discount = product.compareAtPriceEur
    ? Math.round((1 - product.retailPriceEur! / product.compareAtPriceEur) * 100)
    : null;

  const placeholderBg   = PLACEHOLDER_BG[product.category ?? ''] ?? 'bg-zen-sand';
  const hasProductImage = !!product.images?.[0];
  const imgSrc          = hasProductImage
    ? product.images![0]
    : PLACEHOLDER_IMG[product.category ?? ''];

  const isOutOfStock = product.stockStatus === 'OutOfStock';
  const isVeryLow    = product.stockStatus === 'VeryLow';
  const isLow        = product.stockStatus === 'Low';

  return (
    <div className="group lift rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: '#FCFAF4', border: '1px solid rgba(44,36,32,.07)' }}>

      {/* Image */}
      <div className={`relative aspect-[3/4] overflow-hidden ${hasProductImage ? 'bg-white' : placeholderBg}`}>
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={product.nameFr ?? ''}
            fill
            className={`transition-transform duration-500 group-hover:scale-105 ${
              hasProductImage ? 'object-contain p-8' : 'object-cover'
            }`}
            unoptimized={imgSrc.startsWith('https://raw.githubusercontent.com')}
          />
        )}

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded"
              style={{ background: '#3B2A1F', color: '#F2ECE0' }}>Best-seller</span>
          )}
          {discount && !isOutOfStock && (
            <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded"
              style={{ background: '#C4714A', color: '#fff' }}>-{discount}%</span>
          )}
          {isVeryLow && (
            <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded"
              style={{ background: '#FEF3F0', color: '#9B3D1A', border: '1px solid #FECDB9' }}>⚡ Presque épuisé</span>
          )}
          {isLow && !isVeryLow && (
            <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded"
              style={{ background: '#FFFBEB', color: '#92400E' }}>Stock limité</span>
          )}
          {isOutOfStock && (
            <span className="text-[12px] font-sans font-medium px-2 py-0.5 rounded bg-gray-200 text-gray-500">Rupture</span>
          )}
        </div>

        {/* Eco badges */}
        <div className="absolute top-3 right-3 flex gap-1 z-10">
          {product.isVegan && (
            <span className="w-5 h-5 rounded-full bg-green-50 text-green-700 text-[9px] flex items-center justify-center font-bold" title="Vegan">V</span>
          )}
          {product.isCrueltyFree && (
            <span className="w-5 h-5 rounded-full bg-pink-50 text-pink-600 text-[9px] flex items-center justify-center" title="Sans test animal">♥</span>
          )}
        </div>

        {/* Add to cart overlay */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <button
              onClick={() => addItem(product as Product)}
              aria-label={`Ajouter ${product.nameFr ?? 'ce produit'} au panier`}
              className="w-full text-sm font-sans font-semibold py-4 flex items-center justify-center gap-2 transition-colors"
              style={{ background: '#3B2A1F', color: '#F2ECE0' }}>
              <ShoppingBag size={15} />
              Ajouter au panier
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 lg:p-6">
        <p className="text-[12px] font-sans font-semibold uppercase tracking-widest mb-2"
          style={{ color: '#675A4E', letterSpacing: '0.08em' }}>
          {product.category?.replace('-', ' & ')}
        </p>

        <Link href={`/${locale}/produits/${product.slug}`}>
          <h3 className="font-sans font-medium leading-snug hover:opacity-70 transition-opacity line-clamp-2 mb-3"
            style={{ fontSize: '15px', color: '#3B2A1F' }}>
            {product.nameFr}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="font-sans font-bold text-lg" style={{ color: isOutOfStock ? '#675A4E' : '#3B2A1F' }}>
            {product.retailPriceEur} €
          </span>
          {product.compareAtPriceEur && (
            <span className="text-sm font-sans line-through" style={{ color: '#675A4E' }}>
              {product.compareAtPriceEur} €
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
