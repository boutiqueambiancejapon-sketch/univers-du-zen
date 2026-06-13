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
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-6 text-center">
        <ShoppingBag size={52} className="text-gray-200 mb-5" />
        <h1 className="font-serif text-3xl text-zen-bark mb-3">Votre rituel est vide</h1>
        <p className="text-zen-muted font-sans mb-10 max-w-sm">
          Découvrez notre sélection de produits bien-être.
        </p>
        <Link
          href={`/${locale}/boutique`}
          className="bg-zen-terracotta text-white font-sans px-8 py-4 rounded-xl hover:bg-zen-terracotta/90 transition-colors"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <h1 className="font-serif text-4xl lg:text-5xl text-zen-bark mb-10">Votre panier</h1>

        {/* ===== Items + Summary ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">

          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-6 p-6 lg:p-8">
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-xl flex-shrink-0 bg-gray-50 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.nameFr ?? ''}
                        fill
                        className="object-contain p-2"
                        unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')}
                      />
                    ) : (
                      <div className="w-full h-full bg-zen-sand/20" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-sans font-medium text-zen-bark text-lg leading-snug">
                          {product.nameFr}
                        </p>
                        {product.category && (
                          <p className="text-sm text-zen-muted font-sans mt-1 capitalize">
                            {product.category.replace(/-/g, ' ')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(product.id!)}
                        className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors p-1"
                        aria-label="Retirer"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-5">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id!, quantity - 1)}
                          className="w-11 h-11 flex items-center justify-center text-zen-bark hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-base font-sans text-zen-bark">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id!, quantity + 1)}
                          className="w-11 h-11 flex items-center justify-center text-zen-bark hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-serif font-bold text-zen-bark text-2xl">
                        {((product.retailPriceEur ?? 0) * quantity).toFixed(2).replace('.', ',')} €
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/boutique`}
              className="inline-flex items-center gap-2 text-sm font-sans text-zen-muted hover:text-zen-bark transition-colors pt-2"
            >
              ← Continuer mes achats
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 sticky top-24 space-y-6">
              <h2 className="font-serif text-2xl text-zen-bark">Récapitulatif</h2>

              <div>
                {remaining > 0 ? (
                  <p className="text-sm font-sans text-zen-muted mb-2">
                    Plus que{' '}
                    <strong className="text-zen-bark">
                      {remaining.toFixed(2).replace('.', ',')} €
                    </strong>{' '}
                    pour la livraison offerte
                  </p>
                ) : (
                  <p className="text-sm font-sans text-green-600 font-medium mb-2">
                    ✓ Livraison offerte débloquée !
                  </p>
                )}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      remaining === 0 ? 'bg-green-500' : 'bg-zen-terracotta'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between text-zen-muted">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className="flex justify-between text-zen-muted">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Offerte' : `${shipping.toFixed(2).replace('.', ',')} €`}
                  </span>
                </div>
                <div className="flex justify-between text-zen-muted text-xs">
                  <span>TVA ({(vat.vatRate * 100).toFixed(0)}%)</span>
                  <span>{vat.vatAmount.toFixed(2).replace('.', ',')} €</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 flex justify-between items-baseline">
                <span className="font-sans font-medium text-zen-bark text-base">Total TTC</span>
                <span className="font-serif font-bold text-zen-bark text-3xl">
                  {orderTotal.toFixed(2).replace('.', ',')} €
                </span>
              </div>

              <button
                onClick={() => router.push(`/${locale}/checkout`)}
                className="w-full bg-zen-terracotta text-white font-sans font-medium py-4 rounded-xl hover:bg-zen-terracotta/90 transition-colors text-base"
              >
                Passer à la caisse →
              </button>

              <p className="text-center text-xs text-zen-muted font-sans">
                🔒 Paiement sécurisé · Retours 30 jours
              </p>
            </div>
          </div>
        </div>

        {/* ===== Bundle builder pleine largeur ===== */}
        <div className="mt-20">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-3xl lg:text-4xl text-zen-bark">Composez votre coffret</h2>
            <span className="text-sm font-sans text-zen-terracotta font-medium">-15% par coffret</span>
          </div>
          <p className="text-sm font-sans text-zen-muted mb-10 max-w-xl">
            Sélectionnez les produits que vous voulez, décochez ceux que vous ne souhaitez pas.
            Cliquez sur ↻ pour générer de nouvelles suggestions.
          </p>
          <BundleBuilder />
        </div>
      </div>
    </div>
  );
}
