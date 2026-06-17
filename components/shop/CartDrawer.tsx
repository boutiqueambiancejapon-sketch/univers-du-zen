'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

// Upsells are intentionally disabled: product data is server-only (filesystem).
const upsells: any[] = [];

const FREE_THRESHOLD = 59;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, addItem } = useCartStore();
  const locale   = useLocale();
  const router   = useRouter();
  const pathname = usePathname();

  // Garde anti-mismatch d'hydratation (panier persisté en localStorage)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Ferme le tiroir à chaque changement de page (sinon le voile bloque les clics)
  useEffect(() => { closeCart(); }, [pathname, closeCart]);

  const open = mounted && isOpen;
  const list = mounted ? items : [];

  const subtotal    = list.reduce((s, i) => s + (i.product.retailPriceEur ?? 0) * i.quantity, 0);
  const remaining   = Math.max(0, FREE_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_THRESHOLD) * 100);
  const itemCount   = list.reduce((n, i) => n + i.quantity, 0);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={closeCart}
          aria-hidden
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-serif text-lg text-zen-bark">
            Votre rituel
            {itemCount > 0 && (
              <span className="ml-2 font-sans text-sm text-zen-muted font-normal">({itemCount})</span>
            )}
          </h2>
          <button onClick={closeCart} className="p-1.5 rounded-full text-zen-muted hover:bg-gray-100 hover:text-zen-bark transition-colors" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Free shipping progress */}
          {list.length > 0 && (
            <div className="px-5 py-3 border-b border-gray-100">
              {remaining > 0 ? (
                <p className="text-xs font-sans text-zen-muted mb-1.5">
                  Plus que <strong className="text-zen-bark">{remaining.toFixed(2).replace('.', ',')} €</strong> pour la livraison offerte
                </p>
              ) : (
                <p className="text-xs font-sans text-green-600 font-medium mb-1.5">✓ Livraison offerte débloquée !</p>
              )}
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${remaining === 0 ? 'bg-green-500' : 'bg-zen-terracotta'}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Empty state */}
          {list.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 gap-4 px-5 text-center">
              <ShoppingBag size={40} className="text-gray-200" />
              <p className="text-zen-muted font-sans text-sm">Votre rituel est vide pour l&apos;instant.</p>
              <button
                onClick={() => { closeCart(); router.push(`/${locale}/boutique`); }}
                className="text-sm font-sans text-zen-terracotta underline underline-offset-2"
              >
                Découvrir nos produits
              </button>
            </div>
          )}

          {/* Cart items */}
          {list.length > 0 && (
            <div className="divide-y divide-gray-100">
              {list.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 px-5 py-4">
                  <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 relative">
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
                      <p className="font-sans text-sm text-zen-bark leading-snug line-clamp-2">{product.nameFr}</p>
                      <button
                        onClick={() => removeItem(product.id!)}
                        className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-0.5"
                        aria-label="Supprimer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(product.id!, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-zen-bark hover:text-zen-terracotta transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-sm font-sans text-zen-bark w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id!, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-zen-bark hover:text-zen-terracotta transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <p className="font-sans font-semibold text-zen-bark text-sm">
                        {((product.retailPriceEur ?? 0) * quantity).toFixed(2).replace('.', ',')} €
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upsell — disabled until /api/featured-products is implemented */}
          {list.length > 0 && upsells.length > 0 && (
            <div className="border-t border-gray-100">
              <div className="divide-y divide-gray-50">
                {upsells.map((product: any) => (
                  <button key={product.id} onClick={() => addItem(product, 1)} className="hidden" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {list.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-3 bg-white">
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-zen-muted text-sm">Sous-total</span>
              <span className="font-sans font-bold text-zen-bark text-xl">
                {subtotal.toFixed(2).replace('.', ',')} €
              </span>
            </div>
            <button
              onClick={() => { closeCart(); router.push(`/${locale}/checkout`); }}
              className="w-full bg-zen-terracotta text-white font-sans font-medium py-3.5 rounded-xl hover:bg-zen-terracotta/90 transition-colors text-sm"
            >
              Passer à la caisse →
            </button>
            <button
              onClick={() => { closeCart(); router.push(`/${locale}/panier`); }}
              className="w-full border border-gray-200 text-zen-bark font-sans text-sm py-2.5 rounded-xl hover:border-gray-400 transition-colors"
            >
              Voir le panier
            </button>
            <p className="text-center text-[11px] text-zen-muted font-sans">
              🔒 Paiement sécurisé · Retours sous 30 jours
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
