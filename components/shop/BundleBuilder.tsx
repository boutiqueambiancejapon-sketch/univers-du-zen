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

const CATEGORY_LABELS: Record<string, string> = {
  aromatherapie:    'Aromââââââââââââââââââthérapie',
  bougies:          'Bougies',
  encens:           'Encens',
  'pierres-cristaux': 'Cristaux',
  'thes-artisanaux':  'Thés',
  'maison-deco':    'Maison',
};

function bundleName(items: Array<{ product: ValidProduct }>): string {
  const freq: Record<string, number> = {};
  items.forEach(i => {
    const c = i.product.category ?? '';
    freq[c] = (freq[c] ?? 0) + 1;
  });
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0];
  const label = top ? (CATEGORY_LABELS[top] ?? 'Zen') : 'Zen';
  return `Coffret ${label} sur mesure`;
}

function generate(): Array<Array<{ product: ValidProduct; selected: boolean }>> {
  const pool = ALL_PRODUCTS.filter(isValid);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const bundles: Array<Array<{ product: ValidProduct; selected: boolean }>> = [];
  for (let i = 0; i < NUM_BUNDLES; i++) {
    const slice = shuffled.slice(i * BUNDLE_SIZE, (i + 1) * BUNDLE_SIZE);
    if (slice.length === BUNDLE_SIZE) {
      bundles.push(slice.map(p => ({ product: p, selected: true })));
    }
  }
  return bundles;
}

export default function BundleBuilder() {
  const { addItem, openCart } = useCartStore();
  // Start null to avoid SSR/hydration mismatch (Math.random)
  const [bundles, setBundles] = useState<
    Array<Array<{ product: ValidProduct; selected: boolean }>>
  >([]);

  useEffect(() => { setBundles(generate()); }, []);

  const reshuffle = useCallback((bundleIdx: number) => {
    setBundles(prev => {
      const usedIds = prev.flatMap((b, i) => i !== bundleIdx ? b.map(x => x.product.id) : []);
      const pool = ALL_PRODUCTS.filter(isValid).filter(p => !usedIds.includes(p.id));
      const picks = [...pool].sort(() => Math.random() - 0.5).slice(0, BUNDLE_SIZE);
      if (picks.length < BUNDLE_SIZE) return prev;
      const next = [...prev];
      next[bundleIdx] = picks.map(p => ({ product: p, selected: true }));
      return next;
    });
  }, []);

  const toggle = useCallback((bundleIdx: number, productIdx: number) => {
    setBundles(prev => {
      const next = prev.map(b => [...b]);
      next[bundleIdx][productIdx] = {
        ...next[bundleIdx][productIdx],
        selected: !next[bundleIdx][productIdx].selected,
      };
      return next;
    });
  }, []);

  const addBundle = useCallback((bundle: Array<{ product: ValidProduct; selected: boolean }>) => {
    const selected = bundle.filter(i => i.selected);
    if (selected.length === 0) return;
    selected.forEach(({ product }) => {
      const discounted = {
        ...product,
        retailPriceEur: Math.round(product.retailPriceEur * (1 - DISCOUNT) * 100) / 100,
        nameFr: `${product.nameFr} (coffret −15%)`,
      };
      addItem(discounted as any, 1);
    });
    openCart();
  }, [addItem, openCart]);

  if (bundles.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {bundles.map((bundle, bi) => {
        const selected   = bundle.filter(i => i.selected);
        const fullPrice  = bundle.reduce((s, i) => s + (i.selected ? i.product.retailPriceEur : 0), 0);
        const discPrice  = Math.round(fullPrice * (1 - DISCOUNT) * 100) / 100;
        const noneSelected = selected.length === 0;
        const name = bundleName(bundle);

        return (
          <div key={bi} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">

            {/* Title */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-zen-bark text-base leading-snug">{name}</h3>
              <button
                onClick={() => reshuffle(bi)}
                className="flex-shrink-0 p-1.5 rounded-full text-zen-muted hover:text-zen-bark hover:bg-gray-100 transition-colors"
                title="Regénérer"
                aria-label="Régénérer ce coffret"
              >
                <RefreshCw size={13} />
              </button>
            </div>

            {/* Products */}
            <div className="space-y-2">
              {bundle.map(({ product, selected: sel }, pi) => (
                <button
                  key={product.id}
                  onClick={() => toggle(bi, pi)}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all text-left ${
                    sel
                      ? 'bg-gray-50 hover:bg-gray-100'
                      : 'bg-white opacity-45 hover:opacity-60'
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    sel
                      ? 'bg-zen-bark border-zen-bark'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {sel && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>

                  {/* Image */}
                  <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.nameFr}
                        fill
                        className="object-cover"
                        unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')}
                      />
                    ) : (
                      <div className="w-full h-full bg-zen-sand/20" />
                    )}
                  </div>

                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-sans text-zen-bark leading-snug line-clamp-2">
                      {product.nameFr}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      sel ? 'text-zen-muted' : 'text-gray-300 line-through'
                    }`}>
                      {product.retailPriceEur.toFixed(2).replace('.', ',')} €
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Price + CTA */}
            <div className="border-t border-gray-100 pt-3 mt-auto">
              {noneSelected ? (
                <p className="text-xs font-sans text-zen-muted text-center py-1">
                  Sélectionnez au moins un produit
                </p>
              ) : (
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <p className="font-sans font-bold text-zen-bark text-lg">
                    {discPrice.toFixed(2).replace('.', ',')} €
                  </p>
                  <p className="font-sans text-zen-muted line-through text-sm">
                    {fullPrice.toFixed(2).replace('.', ',')} €
                  </p>
                  <span className="ml-auto text-xs font-sans bg-zen-terracotta/10 text-zen-terracotta px-2 py-0.5 rounded-full font-medium">
                    -{Math.round(DISCOUNT * 100)}%
                  </span>
                </div>
              )}
              <button
                onClick={() => addBundle(bundle)}
                disabled={noneSelected}
                className="w-full flex items-center justify-center gap-2 bg-zen-bark text-white font-sans text-sm py-2.5 rounded-xl hover:bg-zen-bark/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={13} />
                Ajouter le coffret
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
