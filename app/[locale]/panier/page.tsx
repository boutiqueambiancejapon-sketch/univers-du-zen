'use client';

import { useCartStore } from '@/lib/store/cart';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { computeShipping } from '@/lib/shipping';
import { computeVat } from '@/lib/vat';
import { BUNDLES } from '@/lib/bundles';
import { ALL_PRODUCTS } from '@/lib/all-products';

const FREE_THRESHOLD = 59;

function localeToCountry(l: string) {
  if (l.includes('BE')) return 'BE';
  if (l.includes('FR')) return 'FR';
  if (l.includes('NL')) return 'NL';
  return 'BE';
}

export default function PanierPage() {
  const { items, removeItem, updateQuantity, addItem, total } = useCartStore();
  const locale  = useLocale();
  const router  = useRouter();

  const country     = localeToCountry(locale);
  const subtotal    = total();
  const shipping    = computeShipping(country, subtotal);
  const orderTotal  = subtotal + shipping;
  const vat         = computeVat(orderTotal, country);
  const remaining   = Math.max(0, FREE_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_THRESHOLD) * 100);

  const resolveBundle = (slugs: string[]) =>
    slugs.map(s => ALL_PRODUCTS.find(p => p.slug === s)).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={48} className="text-gray-200 mb-4" />
        <h1 className="font-serif text-2xl text-zen-bark mb-2">Votre rituel est vide</h1>
        <p className="text-zen-muted font-sans text-sm mb-8">
          Découvrez notre sélection de produits bien-être.
        </p>
        <Link
          href={`/${locale}/boutique`}
          className="bg-zen-terracotta text-white font-sans px-6 py-3 rounded-xl text-sm hover:bg-zen-terracotta/90 transition-colors"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-4xl text-zen-bark mb-8">Votre panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ---- LEFT: items ---- */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 p-5">
                  {/* Image */}
                  <div className="w-[88px] h-[88px] rounded-xl flex-shrink-0 bg-gray-50 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.nameFr}
                        fill
                        className="object-contain p-1.5"
                        unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')}
                      />
                    ) : (
                      <div className="w-full h-full bg-zen-sand/20" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-sans font-medium text-zen-bark text-[15px] leading-snug">
                          {product.nameFr}
                        </p>
                        {product.category && (
                          <p className="text-xs text-zen-muted font-sans mt-0.5 capitalize">
                            {product.category.replace(/-/g, ' ')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-0.5"
                        aria-label="Retirer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-zen-bark hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-sans text-zen-bark">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-zen-bark hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="font-sans font-semibold text-zen-bark text-xl">
                        {(product.retailPriceEur * quantity).toFixed(0)} €
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/boutique`}
              className="inline-flex items-center gap-1.5 text-sm font-sans text-zen-muted hover:text-zen-bark transition-colors"
            >
              ← Continuer mes achats
            </Link>

            {/* ---- BUNDLES ---- */}
            <div className="mt-10 pt-2">
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="font-serif text-2xl text-zen-bark">Ajoutez un rituel complet</h2>
                <span className="text-sm font-sans text-zen-terracotta font-medium">
                  -15% sur chaque coffret
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {BUNDLES.map(bundle => {
                  const prods = resolveBundle(bundle.productSlugs);
                  return (
                    <div
                      key={bundle.id}
                      className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4"
                    >
                      {/* Color swatches */}
                      <div className="flex gap-2">
                        {bundle.swatchColors.map((c, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>

                      <div>
                        <h3 className="font-serif text-zen-bark text-base">{bundle.name}</h3>
                        <p className="text-xs font-sans text-zen-muted mt-1 leading-relaxed">
                          {bundle.tagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-auto flex-wrap">
                        <p className="font-sans font-bold text-zen-bark text-lg">
                          {bundle.bundlePrice.toFixed(0)} €
                        </p>
                        <p className="font-sans text-zen-muted line-through text-sm">
                          {bundle.regularPrice.toFixed(0)} €
                        </p>
                        <span className="ml-auto text-xs font-sans bg-zen-terracotta/10 text-zen-terracotta px-2 py-0.5 rounded-full font-medium">
                          -{bundle.discountPct}%
                        </span>
                      </div>

                      <button
                        onClick={() => prods.forEach(p => p && addItem(p as any, 1))}
                        className="w-full bg-zen-bark text-white font-sans text-sm py-2.5 rounded-xl hover:bg-zen-bark/90 transition-colors"
                      >
                        Ajouter le coffret
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ---- RIGHT: summary ---- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 space-y-5">
              <h2 className="font-serif text-lg text-zen-bark">Récapitulatif</h2>

              {/* Shipping progress */}
              <div>
                {remaining > 0 ? (
                  <p className="text-xs font-sans text-zen-muted mb-1.5">
                    Plus que{' '}
                    <strong className="text-zen-bark">
                      {remaining.toFixed(2).replace('.', ',')} €
                    </strong>{' '}
                    pour la livraison offerte
                  </p>
                ) : (
                  <p className="text-xs font-sans text-green-600 font-medium mb-1.5">
                    ✓ Livraison offerte débloquée !
                  </p>
                )}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      remaining === 0 ? 'bg-green-500' : 'bg-zen-terracotta'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-2.5 text-sm font-sans">
                <div className="flex justify-between text-zen-muted">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className="flex justify-between text-zen-muted">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0
                      ? 'Offerte'
                      : `${shipping.toFixed(2).replace('.', ',')} €`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                <span className="font-sans font-medium text-zen-bark">Total</span>
                <span className="font-sans font-bold text-zen-bark text-2xl">
                  {orderTotal.toFixed(0)} €
                </span>
              </div>

              <button
                onClick={() => router.push(`/${locale}/checkout`)}
                className="w-full bg-zen-terracotta text-white font-sans font-medium py-4 rounded-xl hover:bg-zen-terracotta/90 transition-colors text-sm"
              >
                Passer à la caisse →
              </button>

              <p className="text-center text-[11px] text-zen-muted font-sans">
                🔒 Paiement sécurisé · Retours 30 jours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
