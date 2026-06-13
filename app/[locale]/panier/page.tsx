'use client';

import { useCartStore } from '@/lib/store/cart';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield } from 'lucide-react';
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
  const freeShip    = remaining === 0;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: '#F5F3EF' }}>
        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
          <ShoppingBag size={36} style={{ color: '#D4C8BE' }} />
        </div>
        <h1 className="font-serif mb-3" style={{ fontSize: 30, color: '#2C2420' }}>Votre rituel est vide</h1>
        <p className="text-sm font-sans mb-10 max-w-sm" style={{ color: '#9a8878' }}>
          Découvrez notre sélection de produits bien-être.
        </p>
        <Link href={`/${locale}/boutique`}
          className="text-sm font-sans font-semibold px-8 py-4 rounded-xl text-white transition-colors"
          style={{ background: '#C1714A' }}>
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F5F3EF' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">

        <h1 className="font-serif mb-10" style={{ fontSize: 'clamp(30px, 4vw, 48px)', color: '#2C2420' }}>
          Votre panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">

          {/* ── Items ── */}
          <div className="lg:col-span-2 space-y-3">
            <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
              {items.map(({ product, quantity }, idx) => (
                <div key={product.id} className="flex gap-5 p-6"
                  style={{ borderTop: idx > 0 ? '1px solid rgba(44,36,32,.06)' : 'none' }}>
                  {/* Image */}
                  <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-xl flex-shrink-0 relative overflow-hidden"
                    style={{ background: '#F5F3EF' }}>
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.nameFr ?? ''} fill
                        className="object-contain p-2"
                        unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')} />
                    ) : <div className="w-full h-full" style={{ background: '#E8DDD4' }} />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-sans font-semibold leading-snug" style={{ color: '#2C2420', fontSize: 15 }}>
                          {product.nameFr}
                        </p>
                        {product.category && (
                          <p className="text-xs font-sans mt-1 capitalize" style={{ color: '#9a8878' }}>
                            {product.category.replace(/-/g, ' ')}
                          </p>
                        )}
                      </div>
                      <button onClick={() => removeItem(product.id!)}
                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ color: '#C4B8AE' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#2C2420'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#C4B8AE'}
                        aria-label="Retirer">
                        <X size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Stepper */}
                      <div className="flex items-center rounded-xl overflow-hidden"
                        style={{ border: '1px solid rgba(44,36,32,.14)' }}>
                        <button onClick={() => updateQuantity(product.id!, quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center transition-colors"
                          style={{ color: '#2C2420' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F5F3EF'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                          <Minus size={13} />
                        </button>
                        <span className="w-9 text-center text-sm font-sans font-semibold" style={{ color: '#2C2420' }}>
                          {quantity}
                        </span>
                        <button onClick={() => updateQuantity(product.id!, quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center transition-colors"
                          style={{ color: '#2C2420' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F5F3EF'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                          <Plus size={13} />
                        </button>
                      </div>

                      <p className="font-serif font-bold" style={{ color: '#2C2420', fontSize: 20 }}>
                        {((product.retailPriceEur ?? 0) * quantity).toFixed(2).replace('.', ',')} €
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href={`/${locale}/boutique`}
              className="inline-flex items-center gap-1.5 text-sm font-sans transition-colors pt-1"
              style={{ color: '#9a8878' }}>
              ← Continuer mes achats
            </Link>
          </div>

          {/* ── Summary ── */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl p-7 sticky top-24 space-y-6"
              style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
              <h2 className="font-serif text-xl" style={{ color: '#2C2420' }}>Récapitulatif</h2>

              {/* Free shipping progress */}
              <div>
                <p className="text-sm font-sans mb-2.5" style={{ color: freeShip ? '#3D7A58' : '#9a8878' }}>
                  {freeShip ? (
                    <><strong style={{ color: '#3D7A58' }}>✓ Livraison offerte débloquée !</strong></>
                  ) : (
                    <>Plus que <strong style={{ color: '#2C2420' }}>{remaining.toFixed(2).replace('.', ',')} €</strong> pour la livraison offerte</>
                  )}
                </p>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#EDE8E2' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%`, background: freeShip ? '#3D7A58' : '#C1714A' }} />
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between" style={{ color: '#9a8878' }}>
                  <span>Sous-total</span><span>{subtotal.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className="flex justify-between" style={{ color: freeShip ? '#3D7A58' : '#9a8878', fontWeight: freeShip ? 600 : 400 }}>
                  <span>Livraison</span>
                  <span>{freeShip ? 'Offerte' : `${shipping.toFixed(2).replace('.', ',')} €`}</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: 'rgba(44,36,32,.35)' }}>
                  <span>TVA ({(vat.vatRate * 100).toFixed(0)}%)</span>
                  <span>{vat.vatAmount.toFixed(2).replace('.', ',')} €</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline pt-4"
                style={{ borderTop: '1px solid rgba(44,36,32,.07)' }}>
                <span className="font-sans font-medium text-sm" style={{ color: '#2C2420' }}>Total TTC</span>
                <span className="font-serif font-bold" style={{ fontSize: 28, color: '#2C2420' }}>
                  {orderTotal.toFixed(2).replace('.', ',')} €
                </span>
              </div>

              {/* CTA */}
              <button onClick={() => router.push(`/${locale}/checkout`)}
                className="w-full py-4 rounded-xl text-sm font-sans font-semibold transition-all text-white"
                style={{ background: '#C1714A', boxShadow: '0 10px 24px rgba(193,113,74,.25)' }}>
                Passer à la caisse →
              </button>

              {/* Trust strip */}
              <div className="grid grid-cols-3 gap-2 pt-2"
                style={{ borderTop: '1px solid rgba(44,36,32,.06)' }}>
                {[
                  { icon: <Truck size={14} />, label: 'Livraison 3–5j' },
                  { icon: <RotateCcw size={14} />, label: 'Retours 30j' },
                  { icon: <Shield size={14} />, label: 'Paiement sécurisé' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 text-center">
                    <span style={{ color: '#9a8878' }}>{icon}</span>
                    <span className="text-[10px] font-sans leading-tight" style={{ color: '#9a8878' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bundle builder */}
        <div className="mt-20">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-serif" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#2C2420' }}>
              Composez votre coffret
            </h2>
            <span className="text-sm font-sans font-semibold" style={{ color: '#C1714A' }}>-15% par coffret</span>
          </div>
          <p className="text-sm font-sans mb-10 max-w-xl" style={{ color: '#9a8878' }}>
            Sélectionnez les produits que vous voulez, décochez ceux que vous ne souhaitez pas.
            Cliquez sur ↻ pour générer de nouvelles suggestions.
          </p>
          <BundleBuilder />
        </div>
      </div>
    </div>
  );
}
