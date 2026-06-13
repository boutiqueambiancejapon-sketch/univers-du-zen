'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { ALL_PRODUCTS } from '@/lib/all-products';

const FREE_THRESHOLD = 59;

function getUpsells(cartIds: string[], count = 3) {
  return ALL_PRODUCTS
    .filter(p => p.id != null && !cartIds.includes(p.id!))
    .slice(0, count);
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, addItem, total } =
    useCartStore();
  const locale  = useLocale();
  const router  = useRouter();

  const subtotal    = total();
  const remaining   = Math.max(0, FREE_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_THRESHOLD) * 100);
  const itemCount   = items.reduce((n, i) => n + i.quantity, 0);
  const cartIds     = items.map(i => i.product.id).filter((id): id is string => id != null);
  const upsells     = getUpsells(cartIds);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
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
          {items.length > 0 && (
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

          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 gap-4 px-5 text-center">
              <ShoppingBag size={40} className="text-gray-200" />
              <p className="text-zen-muted font-sans text-sm">Votre rituel est vide pour l&apos;instant.</p>
              <button onClick={() => { closeCart(); router.push(`/${locale}/boutique`); }} className="text-sm font-sans text-zen-terracotta underline underline-offset-2">
                Découvrir nos produits
              </button>
            </div>
          )}

          {items.length > 0 && (
            <div className="divide-y divide-gray-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 px-5 py-4">
                  <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 relative">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.nameFr} fill className="object-contain p-1.5" unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')} />
                    ) : (
                      <div className="w-full h-full bg-zen-sand/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-sans text-sm text-zen-bark leading-snug line-clamp-2">{product.nameFr}</p>
                      <button onClick={() => removeItem(product.id!)} className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-0.5" aria-label="Supprimer">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                        <button onClick={() => updateQuantity(product.id!, quantity - 1)} className="w-8 h-8 flex items-center justify-center text-zen-bark hover:text-zen-terracotta transition-colors">
                          <Minus size={11} />
                        </button>
                        <span className="text-sm font-sans text-zen-bark w-4 text-center">{quantity}</span>
                        <button onClick={() => updateQuantity(product.id!, quantity + 1)} className="w-8 h-8 flex items-center justify-center text-zen-bark hover:text-zen-terracotta transition-colors">
                          <Plus size={11} />
                        </button>
                      </div>
                      <p className="font-sans font-semibold text-zen-bark text-sm">
                        {(product.retailPriceEur * quantity).toFixed(2).replace('.', ',')} €
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && upsells.length > 0 && (
            <div className="border-t border-gray-100">
              <p className="text-[10px] font-sans tracking-[0.12em] uppercase text-zen-muted px-5 pt-4 pb-2">— Complétez votre rituel</p>
              <div className="divide-y divide-gray-50">
                {upsells.map(product => (
                  <div key={product.id} className="flex items-center gap-3 px-5 py-3 bg-gray-50/60">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100 relative">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.nameFr} fill className="object-contain p-1" unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')} />
                      ) : (
                        <div className="w-full h-full bg-zen-sand/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-xs text-zen-bark leading-snug line-clamp-1">{product.nameFr}</p>
                      <p className="text-xs text-zen-muted mt-0.5">{product.retailPriceEur.toFixed(2).replace('.', ',')} €</p>
                    </div>
                    <button
                      onClick={() => addItem(product as any, 1)}
                      className="flex-shrink-0 text-xs font-sans text-zen-bark border border-zen-bark/40 rounded-lg px-3 py-1.5 hover:bg-zen-bark hover:text-white hover:border-zen-bark transition-all"
                    >
                      + Ajouter
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-3 bg-white">
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-zen-muted text-sm">Sous-total</span>
              <span className="font-sans font-bold text-zen-bark text-xl">{subtotal.toFixed(2).replace('.', ',')} €</span>
            </div>
            <button onClick={() => { closeCart(); router.push(`/${locale}/checkout`); }} className="w-full bg-zen-terracotta text-white font-sans font-medium py-3.5 rounded-xl hover:bg-zen-terracotta/90 transition-colors text-sm">
              Passer à la caisse →
            </button>
            <button onClick={() => { closeCart(); router.push(`/${locale}/panier`); }} className="w-full border border-gray-200 text-zen-bark font-sans text-sm py-2.5 rounded-xl hover:border-gray-400 transition-colors">
              Voir le panier
            </button>
            <p className="text-center text-[11px] text-zen-muted font-sans">🔒 Paiement sécurisé · Retours sous 30 jours</p>
          </div>
        )}
      </aside>
    </>
  );
}
