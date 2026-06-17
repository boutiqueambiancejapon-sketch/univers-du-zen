'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import CartDrawer from '@/components/shop/CartDrawer';

/** Slugs alignés sur lib/demo-products.ts */
const NAV_CATEGORIES = [
  { slug: 'huiles-fragrance',         label: 'Huiles & Fragrance' },
  { slug: 'aromatherapie',            label: 'Aromathérapie' },
  { slug: 'encens-rituels',           label: 'Encens & Rituels' },
  { slug: 'cristaux-lithotherapie',   label: 'Cristaux' },
  { slug: 'bougies-photophores',      label: 'Bougies' },
  { slug: 'bien-etre-corps',          label: 'Bien-être' },
  { slug: 'deco-maison-zen',          label: 'Maison Zen' },
  { slug: 'the-tisanes',              label: 'Thé & Tisanes' },
  { slug: 'instruments-sonotherapie', label: 'Sonothérapie' },
  { slug: 'bijoux-cristaux',          label: 'Bijoux' },
] as const;

const NAV_MAIN = NAV_CATEGORIES.slice(0, 6);
const NAV_MORE = NAV_CATEGORIES.slice(6);

export default function Nav() {
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen]     = useState(false);

  const itemCount  = useCartStore(s => s.items.reduce((n, i) => n + i.quantity, 0));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const toggleCart = useCartStore(s => s.toggleCart);

  const href = (path: string) => `/${locale}${path}`;

  return (
    <>
      {/* Nav — pas sticky ici, c'est <header> qui est sticky dans Header.tsx */}
      <nav className="bg-zen-cream border-b border-zen-sand">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href={href('/')} className="flex-shrink-0">
            <span className="font-serif text-xl text-zen-bark tracking-tight">
              Univers du Zen
            </span>
          </Link>

          {/* Nav desktop */}
          <ul className="hidden lg:flex items-center gap-1">
            <li>
              <Link href={href('/boutique')}
                className="text-sm font-semibold text-zen-bark hover:text-zen-terracotta transition-colors px-3 py-2 rounded-lg hover:bg-zen-beige">
                Boutique
              </Link>
            </li>

            {NAV_MAIN.map(({ slug, label }) => (
              <li key={slug}>
                <Link href={href(`/boutique/${slug}`)}
                  className="text-sm text-zen-muted hover:text-zen-bark hover:bg-zen-beige transition-colors px-3 py-2 rounded-lg block whitespace-nowrap">
                  {label}
                </Link>
              </li>
            ))}

            {/* Dropdown "Plus" */}
            <li className="relative">
              <button
                onClick={() => setMoreOpen(o => !o)}
                className="flex items-center gap-1 text-sm text-zen-muted hover:text-zen-bark hover:bg-zen-beige transition-colors px-3 py-2 rounded-lg"
              >
                Plus <ChevronDown size={13} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                  <ul className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-zen-sand z-50 py-2 min-w-[180px]">
                    {NAV_MORE.map(({ slug, label }) => (
                      <li key={slug}>
                        <Link href={href(`/boutique/${slug}`)}
                          className="block px-4 py-2.5 text-sm text-zen-bark hover:bg-zen-beige transition-colors"
                          onClick={() => setMoreOpen(false)}>
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-1">
            <Link href={href('/compte')} aria-label="Mon compte"
              className="p-2 text-zen-bark hover:text-zen-terracotta hover:bg-zen-beige rounded-lg transition-colors">
              <User size={20} />
            </Link>

            <button onClick={toggleCart} aria-label="Panier"
              className="relative p-2 text-zen-bark hover:text-zen-terracotta hover:bg-zen-beige rounded-lg transition-colors">
              <ShoppingBag size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-zen-terracotta text-white text-[12px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button className="lg:hidden p-2 text-zen-bark hover:bg-zen-beige rounded-lg transition-colors"
              onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-zen-sand bg-zen-cream">
            <ul className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <li>
                <Link href={href('/boutique')}
                  className="block px-3 py-2.5 text-sm font-semibold text-zen-bark rounded-xl hover:bg-zen-beige transition-colors"
                  onClick={() => setMobileOpen(false)}>
                  Toute la boutique
                </Link>
              </li>
              {NAV_CATEGORIES.map(({ slug, label }) => (
                <li key={slug}>
                  <Link href={href(`/boutique/${slug}`)}
                    className="block px-3 py-2.5 text-sm text-zen-muted rounded-xl hover:bg-zen-beige hover:text-zen-bark transition-colors"
                    onClick={() => setMobileOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <CartDrawer />
    </>
  );
}
