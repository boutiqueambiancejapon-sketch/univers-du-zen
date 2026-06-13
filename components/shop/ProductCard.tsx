'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
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
            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded"
              style={{ background: '#2C2420', color: '#F2ECE0' }}>Best-seller</span>
          )}
          {discount && !isOutOfStock && (
            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded"
              style={{ background: '#C1714A', color: '#fff' }}>-{discount}%</span>
          )}
          {isVeryLow && (
            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded"
              style={{ background: '#FEF3F0', color: '#9B3D1A', border: '1px solid #FECDB9' }}>⚡ Presque épuisé</span>
          )}
          {isLow && !isVeryLow && (
            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded"
              style={{ background: '#FFFBEB', color: '#92400E' }}>Stock limité</span>
          )}
          {isOutOfStock && (
            <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-gray-200 text-gray-500">Rupture</span>
          )}
        </div>

        {/* Eco badges */}
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
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,.85)' }}
          aria-label="Ajouter aux favoris">
          <Heart size={14} style={{ color: '#2C2420' }} />
        </button>

        {/* Add to cart overlay */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <button
              onClick={() => addItem(product as Product)}
              aria-label={`Ajouter ${product.nameFr ?? 'ce produit'} au panier`}
              className="w-full text-sm font-sans font-semibold py-4 flex items-center justify-center gap-2 transition-colors"
              style={{ background: '#2C2420', color: '#F2ECE0' }}>
              <ShoppingBag size={15} />
              Ajouter au panier
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 lg:p-6">
        <p className="text-[10px] font-sans font-semibold uppercase tracking-widest mb-2"
          style={{ color: '#6B5C55', letterSpacing: '0.08em' }}>
          {product.category?.replace('-', ' & ')}
        </p>

        {/* DM Sans pour la lisibilité en carte — serif réservé aux grands titres */}
        <Link href={`/${locale}/produits/${product.slug}`}>
          <h3 className="font-sans font-medium leading-snug hover:opacity-70 transition-opacity line-clamp-2 mb-3"
            style={{ fontSize: '14px', color: '#2C2420' }}>
            {product.nameFr}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-4" aria-label={`Note : 4.8 sur 5`}>
          {[1,2,3,4,5].map(i => (
            <svg key={i} className="w-3 h-3" fill={i <= 4 ? '#F59E0B' : '#E5D8C0'} viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-[10px] font-sans ml-1" style={{ color: '#6B5C55' }}>4.8 (124)</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-sans font-bold text-lg" style={{ color: isOutOfStock ? '#6B5C55' : '#2C2420' }}>
            {product.retailPriceEur} €
          </span>
          {product.compareAtPriceEur && (
            <span className="text-sm font-sans line-through" style={{ color: '#6B5C55' }}>
              {product.compareAtPriceEur} €
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
