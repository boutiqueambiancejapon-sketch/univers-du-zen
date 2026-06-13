'use client';

import { useCartStore } from '@/lib/store/cart';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { computeShipping } from '@/lib/shipping';
import { computeVat } from '@/lib/vat';
import BundleBuilder from '@/components/shop/BundleBuilder';

const FREE_THRESHOLD = 59;

function localeToCountry(l: string) {
  if (l.includes('BE')) return 'BE';
  if (l.includes('FR')) return 'FR';
  if (l.includes('NL')) return 'NL';
  return 'BE';
}

export default function PanierPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const locale  = useLocale();
  const router  = useRouter();

  const country     = localeToCountry(locale);
  const subtotal    = total();
  const shipping    = computeShipping(country, subtotal);
  const orderTotal  = subtotal + shipping;
  const vat         = computeVat(orderTotal, country);
  const remaining   = Math.max(0, FREE_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_THRESHOLD) * 100);

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
                  <div className="w-[88px] h-[88px] rounded-xl flex-shrink-0 bg-gray-50 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.nameFr ?? ''}
                        fill
                        className="object-contain p-1.5"
                        unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')}
                      />
                    ) : (
                      <div className="w-full h-full bg-zen-sand/20" />
                    )}
                  </div>

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
                        onClick={() => removeItem(product.id!)}
                        className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-0.5"
                        aria-label="Retirer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id!, quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-zen-bark hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-sans text-zen-bark">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id!, quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-zen-bark hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="font-sans font-semibold text-zen-bark text-xl">
                        {((product.retailPriceEur ?? 0) * quantity).toFixed(0)} €
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

            {/* ---- BUNDLE BUILDER ---- */}
            <div className="mt-10 pt-2">
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="font-serif text-2xl text-zen-bark">Composez votre coffret</h2>
                <span className="text-sm font-sans text-zen-terracotta font-medium">-15% par coffret</span>
              </div>
              <p className="text-sm font-sans text-zen-muted mb-5 -mt-2">
                Sélectionnez les produits que vous voulez, décochez les autres. Cliquez sur ↻ pour régénérer.
              </p>
              <BundleBuilder />
            </div>
          </div>

          {/* ---- RIGHT: summary ---- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 space-y-5">
              <h2 className="font-serif text-lg text-zen-bark">Récapitulatif</h2>

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
                <div className="flex justify-between text-zen-muted text-xs">
                  <span>TVA ({(vat.vatRate * 100).toFixed(0)}%)</span>
                  <span>{vat.vatAmount.toFixed(2).replace('.', ',')} €</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                <span className="font-sans font-medium text-zen-bark">Total TTC</span>
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
