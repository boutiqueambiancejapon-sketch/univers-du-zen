'use client';

import { useCartStore } from '@/lib/store/cart';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { computeShipping } from '@/lib/shipping';
import { computeVat } from '@/lib/vat';

const FREE_THRESHOLD = 59;

function localeToCountry(locale: string): string {
  if (locale.includes('BE')) return 'BE';
  if (locale.includes('FR')) return 'FR';
  if (locale.includes('NL')) return 'NL';
  return 'BE';
}

export default function PanierPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const locale = useLocale();
  const router = useRouter();

  const country = localeToCountry(locale);
  const subtotal = total();
  const shipping = computeShipping(country, subtotal);
  const vat = computeVat(subtotal + shipping, country);
  const remaining = Math.max(0, FREE_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zen-cream flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={48} className="text-zen-sand mb-4" />
        <h1 className="font-serif text-2xl text-zen-bark mb-2">Votre panier est vide</h1>
        <p className="text-zen-muted font-sans mb-8">Découvrez notre collection de produits bien-être.</p>
        <Link href={`/${locale}/boutique`} className="btn-primary">Découvrir la boutique</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-cream">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-zen-bark mb-8">Mon panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">

            {/* Livraison offerte progress */}
            {remaining > 0 ? (
              <div className="bg-white rounded-xl p-4 border border-zen-sand">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={16} className="text-zen-bark" />
                  <p className="text-sm font-sans text-zen-bark">
                    Plus que <strong>{remaining.toFixed(2).replace('.', ',')} €</strong> pour la livraison offerte
                  </p>
                </div>
                <div className="h-1.5 bg-zen-sand rounded-full overflow-hidden">
                  <div className="h-full bg-zen-terracotta rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-center gap-2">
                <Truck size={16} className="text-green-600" />
                <p className="text-sm font-sans text-green-700 font-medium">Livraison offerte !</p>
              </div>
            )}

            {/* Cart items */}
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="bg-white rounded-xl p-4 border border-zen-sand flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-zen-sand flex-shrink-0 relative">
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.nameFr}
                      fill
                      className="object-contain p-1"
                      unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-sans tracking-widest uppercase text-zen-muted">{product.category}</p>
                  <h3 className="font-serif text-zen-bark text-sm leading-snug">{product.nameFr}</h3>
                  <p className="font-sans font-semibold text-zen-bark mt-1">
                    {(product.retailPriceEur * quantity).toFixed(2).replace('.', ',')} €
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-zen-muted hover:text-red-500 transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-2 border border-zen-sand rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="text-zen-bark hover:text-zen-terracotta">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-sans w-4 text-center">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="text-zen-bark hover:text-zen-terracotta">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-zen-sand sticky top-24 space-y-4">
              <h2 className="font-serif text-lg text-zen-bark">Récapitulatif</h2>

              <div className="space-y-2 text-sm font-sans">
                <div className="flex justify-between text-zen-muted">
                  <span>Sous-total ({items.reduce((n, i) => n + i.quantity, 0)} article{items.reduce((n, i) => n + i.quantity, 0) > 1 ? 's' : ''})</span>
                  <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className="flex justify-between text-zen-muted">
                  <span>Livraison</span>
                  <span>
                    {shipping === 0
                      ? <span className="text-green-600 font-medium">Offerte</span>
                      : `${shipping.toFixed(2).replace('.', ',')} €`
                    }
                  </span>
                </div>
                <div className="flex justify-between text-zen-muted text-xs">
                  <span>TVA incluse ({(vat.vatRate * 100).toFixed(0)}%)</span>
                  <span>{vat.vatAmount.toFixed(2).replace('.', ',')} €</span>
                </div>
              </div>

              <div className="border-t border-zen-sand pt-3 flex justify-between font-sans font-semibold text-zen-bark text-base">
                <span>Total TTC</span>
                <span>{(subtotal + shipping).toFixed(2).replace('.', ',')} €</span>
              </div>

              <button
                onClick={() => router.push(`/${locale}/checkout`)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Commander <ArrowRight size={16} />
              </button>

              <Link
                href={`/${locale}/boutique`}
                className="block text-center text-xs text-zen-muted hover:text-zen-bark font-sans transition-colors"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
