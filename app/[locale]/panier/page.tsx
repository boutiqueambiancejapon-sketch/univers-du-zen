'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Minus, Plus, X, ShoppingBag, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { computeShipping } from '@/lib/shipping';
import { computeVat } from '@/lib/vat';

const FREE_THRESHOLD = 59;

function countryFromLocale(l: string): string {
  if (l.includes('FR')) return 'FR';
  if (l.includes('NL')) return 'NL';
  return 'BE';
}

const eur = (n: number) => `${n.toFixed(2).replace('.', ',')} €`;

export default function PanierPage() {
  const locale         = useLocale();
  const router         = useRouter();
  const items          = useCartStore((s) => s.items);
  const removeItem     = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  // Le panier vit dans le localStorage : on attend le montage client pour rendre
  // un contenu identique à celui du serveur (= aucune erreur d'hydratation).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F3EF' }}>
        <p className="font-sans text-sm text-zen-muted">Chargement de votre panier…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: '#F5F3EF' }}>
        <div className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center bg-white border border-[rgba(44,36,32,.08)]">
          <ShoppingBag size={34} className="text-zen-sand" />
        </div>
        <h1 className="font-serif text-3xl text-zen-bark mb-3">Votre panier est vide</h1>
        <p className="font-sans text-sm text-zen-muted mb-8 max-w-sm">
          Parcourez notre sélection bien-être et composez votre rituel.
        </p>
        <Link
          href={`/${locale}/boutique`}
          className="font-sans text-sm font-semibold text-white px-8 py-4 rounded-xl"
          style={{ background: '#C1714A' }}
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  const country     = countryFromLocale(locale);
  const subtotal    = items.reduce((s, i) => s + (i.product.retailPriceEur ?? 0) * i.quantity, 0);
  const shipping    = computeShipping(country, subtotal);
  const orderTotal  = subtotal + shipping;
  const vat         = computeVat(orderTotal, country);
  const remaining   = Math.max(0, FREE_THRESHOLD - subtotal);
  const freeShip    = remaining === 0;
  const progressPct = Math.min(100, (subtotal / FREE_THRESHOLD) * 100);

  return (
    <div className="min-h-screen" style={{ background: '#F5F3EF' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <h1 className="font-serif text-zen-bark mb-10" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          Votre panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* Lignes panier */}
          <div className="lg:col-span-2 space-y-3">
            <div className="rounded-2xl bg-white border border-[rgba(44,36,32,.07)] overflow-hidden">
              {items.map(({ product, quantity }, idx) => (
                <div
                  key={product.id ?? idx}
                  className="flex gap-5 p-6"
                  style={{ borderTop: idx ? '1px solid rgba(44,36,32,.06)' : 'none' }}
                >
                  <div className="w-24 h-24 rounded-xl flex-shrink-0 relative overflow-hidden bg-[#F5F3EF]">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.nameFr ?? ''}
                        fill
                        className="object-contain p-2"
                        unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E8DDD4]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-sans font-semibold text-zen-bark text-[15px] leading-snug">
                        {product.nameFr}
                      </p>
                      <button
                        onClick={() => removeItem(product.id!)}
                        aria-label="Retirer"
                        className="flex-shrink-0 text-zen-sand hover:text-zen-bark transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center rounded-xl border border-[rgba(44,36,32,.14)]">
                        <button
                          onClick={() => updateQuantity(product.id!, quantity - 1)}
                          aria-label="Diminuer"
                          className="w-10 h-10 flex items-center justify-center text-zen-bark hover:bg-[#F5F3EF] transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-9 text-center font-sans font-semibold text-sm text-zen-bark">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id!, quantity + 1)}
                          aria-label="Augmenter"
                          className="w-10 h-10 flex items-center justify-center text-zen-bark hover:bg-[#F5F3EF] transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="font-serif font-bold text-zen-bark text-xl">
                        {eur((product.retailPriceEur ?? 0) * quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/boutique`}
              className="inline-flex items-center gap-1.5 font-sans text-sm text-zen-muted pt-1 hover:text-zen-bark transition-colors"
            >
              ← Continuer mes achats
            </Link>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white border border-[rgba(44,36,32,.07)] p-7 sticky top-24 space-y-6">
              <h2 className="font-serif text-xl text-zen-bark">Récapitulatif</h2>

              <div>
                <p className="font-sans text-sm mb-2.5" style={{ color: freeShip ? '#3D7A58' : '#9a8878' }}>
                  {freeShip ? (
                    '✓ Livraison offerte débloquée !'
                  ) : (
                    <>Plus que <strong className="text-zen-bark">{eur(remaining)}</strong> pour la livraison offerte</>
                  )}
                </p>
                <div className="h-2 rounded-full overflow-hidden bg-[#EDE8E2]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%`, background: freeShip ? '#3D7A58' : '#C1714A' }}
                  />
                </div>
              </div>

              <div className="space-y-3 font-sans text-sm">
                <div className="flex justify-between text-zen-muted">
                  <span>Sous-total</span><span>{eur(subtotal)}</span>
                </div>
                <div className="flex justify-between" style={{ color: freeShip ? '#3D7A58' : '#9a8878' }}>
                  <span>Livraison</span><span>{freeShip ? 'Offerte' : eur(shipping)}</span>
                </div>
                <div className="flex justify-between text-xs text-[rgba(44,36,32,.4)]">
                  <span>dont TVA ({(vat.vatRate * 100).toFixed(0)}%)</span><span>{eur(vat.vatAmount)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-[rgba(44,36,32,.07)]">
                <span className="font-sans font-medium text-sm text-zen-bark">Total TTC</span>
                <span className="font-serif font-bold text-zen-bark" style={{ fontSize: 26 }}>{eur(orderTotal)}</span>
              </div>

              <button
                onClick={() => router.push(`/${locale}/checkout`)}
                className="w-full py-4 rounded-xl font-sans font-semibold text-white text-sm transition-colors"
                style={{ background: '#C1714A' }}
              >
                Passer à la caisse →
              </button>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[rgba(44,36,32,.06)]">
                {[
                  { icon: <Truck size={14} />, label: 'Livraison 3–5j' },
                  { icon: <RotateCcw size={14} />, label: 'Retours 30j' },
                  { icon: <Shield size={14} />, label: 'Paiement sécurisé' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 text-center">
                    <span className="text-zen-muted">{icon}</span>
                    <span className="font-sans text-[10px] leading-tight text-zen-muted">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
