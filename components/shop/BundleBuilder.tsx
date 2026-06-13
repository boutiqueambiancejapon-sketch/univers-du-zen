'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { RefreshCw, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { ALL_PRODUCTS } from '@/lib/all-products';
import type { DemoProduct } from '@/lib/all-products';

const DISCOUNT    = 0.15;
const BUNDLE_SIZE = 3;
const NUM_BUNDLES = 3;

type ValidProduct = DemoProduct & { id: string; retailPriceEur: number; nameFr: string };

function isValid(p: DemoProduct): p is ValidProduct {
  return p.id != null && p.retailPriceEur != null && p.nameFr != null;
}

const CATEGORY_NAMES: Record<string, string> = {
  'aromatherapie':    'Aromathérapie',
  'bougies':          'Bougies',
  'encens':           'Encens',
  'pierres-cristaux': 'Cristaux',
  'thes-artisanaux':  'Thés & Bien-être',
  'maison-deco':      'Maison',
};

function bundleTitle(items: Array<{ product: ValidProduct }>): string {
  const freq: Record<string, number> = {};
  items.forEach(i => {
    const c = i.product.category ?? 'zen';
    freq[c] = (freq[c] ?? 0) + 1;
  });
  const topCat = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'zen';
  const label  = CATEGORY_NAMES[topCat] ?? 'Zen';
  return `Coffret ${label}`;
}

function generate(): Array<Array<{ product: ValidProduct; selected: boolean }>> {
  const pool     = ALL_PRODUCTS.filter(isValid);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return Array.from({ length: NUM_BUNDLES }, (_, i) => {
    const slice = shuffled.slice(i * BUNDLE_SIZE, (i + 1) * BUNDLE_SIZE);
    return slice.length === BUNDLE_SIZE
      ? slice.map(p => ({ product: p, selected: true }))
      : [];
  }).filter(b => b.length === BUNDLE_SIZE);
}

export default function BundleBuilder() {
  const { addItem, openCart } = useCartStore();
  const [bundles, setBundles] = useState<
    Array<Array<{ product: ValidProduct; selected: boolean }>>
  >([]);

  // Client-only — avoid hydration mismatch with Math.random()
  useEffect(() => { setBundles(generate()); }, []);

  const reshuffle = useCallback((bi: number) => {
    setBundles(prev => {
      const takenIds = prev.flatMap((b, i) => i !== bi ? b.map(x => x.product.id) : []);
      const pool     = ALL_PRODUCTS.filter(isValid).filter(p => !takenIds.includes(p.id));
      const picks    = [...pool].sort(() => Math.random() - 0.5).slice(0, BUNDLE_SIZE);
      if (picks.length < BUNDLE_SIZE) return prev;
      const next  = [...prev];
      next[bi]    = picks.map(p => ({ product: p, selected: true }));
      return next;
    });
  }, []);

  const toggle = useCallback((bi: number, pi: number) => {
    setBundles(prev =>
      prev.map((b, i) =>
        i !== bi ? b : b.map((item, j) =>
          j !== pi ? item : { ...item, selected: !item.selected }
        )
      )
    );
  }, []);

  const addBundle = useCallback((bundle: Array<{ product: ValidProduct; selected: boolean }>) => {
    const picks = bundle.filter(i => i.selected);
    if (!picks.length) return;
    picks.forEach(({ product }) =>
      addItem({
        ...product,
        retailPriceEur: Math.round(product.retailPriceEur * (1 - DISCOUNT) * 100) / 100,
        nameFr: `${product.nameFr} — Coffret -15%`,
      } as any, 1)
    );
    openCart();
  }, [addItem, openCart]);

  if (!bundles.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {bundles.map((bundle, bi) => {
        const selected     = bundle.filter(i => i.selected);
        const fullPrice    = bundle.reduce((s, i) => s + (i.selected ? i.product.retailPriceEur : 0), 0);
        const discPrice    = Math.round(fullPrice * (1 - DISCOUNT) * 100) / 100;
        const noneSelected = selected.length === 0;
        const title        = bundleTitle(bundle);

        return (
          <div key={bi} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-zen-bark text-xl leading-snug">{title}</h3>
              <button
                onClick={() => reshuffle(bi)}
                className="flex-shrink-0 mt-0.5 p-2 rounded-full text-zen-muted hover:text-zen-bark hover:bg-gray-100 transition-colors"
                aria-label="Régénérer ce coffret"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {/* Products */}
            <div className="flex flex-col gap-3">
              {bundle.map(({ product, selected: sel }, pi) => (
                <button
                  key={product.id}
                  onClick={() => toggle(bi, pi)}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all text-left ${
                    sel ? 'bg-gray-50 hover:bg-gray-100' : 'opacity-40 hover:opacity-60 bg-white'
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    sel ? 'bg-zen-bark border-zen-bark' : 'border-gray-300'
                  }`}>
                    {sel && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.nameFr}
                        fill
                        className="object-cover"
                        unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')}
                      />
                    ) : (
                      <div className="w-full h-full bg-zen-sand/30" />
                    )}
                  </div>

                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-sans text-sm leading-snug ${
                      sel ? 'text-zen-bark' : 'text-gray-400 line-through'
                    }`}>
                      {product.nameFr}
                    </p>
                    <p className={`text-sm mt-1 font-medium ${
                      sel ? 'text-zen-terracotta' : 'text-gray-300'
                    }`}>
                      {product.retailPriceEur.toFixed(2).replace('.', ',')} €
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Price + CTA */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
              {noneSelected ? (
                <p className="text-xs font-sans text-zen-muted text-center py-1">
                  Sélectionnez au moins un produit
                </p>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="font-serif font-bold text-zen-bark text-2xl">
                    {discPrice.toFixed(2).replace('.', ',')} €
                  </span>
                  <span className="font-sans text-gray-400 line-through text-sm">
                    {fullPrice.toFixed(2).replace('.', ',')} €
                  </span>
                  <span className="ml-auto text-xs font-sans bg-zen-terracotta/10 text-zen-terracotta px-2.5 py-1 rounded-full font-semibold">
                    -15%
                  </span>
                </div>
              )}

              <button
                onClick={() => addBundle(bundle)}
                disabled={noneSelected}
                className="w-full flex items-center justify-center gap-2 bg-zen-bark text-white font-sans font-medium py-3.5 rounded-xl hover:bg-zen-bark/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                <ShoppingBag size={14} />
                Ajouter le coffret
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
