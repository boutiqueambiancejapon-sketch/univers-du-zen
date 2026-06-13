'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

const CATEGORIES = [
  { key: 'aromatherapy', slug: 'aromatherapie' },
  { key: 'candles',      slug: 'bougies' },
  { key: 'incense',      slug: 'encens' },
  { key: 'gemstones',    slug: 'pierres-cristaux' },
  { key: 'home',         slug: 'maison-deco' },
  { key: 'music',        slug: 'musique-sons' },
  { key: 'tea',          slug: 'thes-artisanaux' },
] as const;

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore(s => s.items.reduce((n, i) => n + i.quantity, 0));

  const href = (path: string) => `/${locale}${path}`;

  return (
    <nav className="bg-zen-cream border-b border-zen-sand sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href={href('/')} className="flex-shrink-0">
          <span className="font-serif text-xl text-zen-bark tracking-tight">
            Univers du Zen
          </span>
        </Link>

        {/* Nav desktop */}
        <ul className="hidden lg:flex items-center gap-6">
          <li>
            <Link
              href={href('/boutique')}
              className="text-sm font-medium text-zen-bark hover:text-zen-terracotta transition-colors"
            >
              {t('shop')}
            </Link>
          </li>
          {CATEGORIES.map(({ key, slug }) => (
            <li key={key}>
              <Link
                href={href(`/boutique/${slug}`)}
                className="text-sm text-zen-muted hover:text-zen-bark transition-colors"
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Icônes */}
        <div className="flex items-center gap-3">
          <button
            aria-label={t('search')}
            className="p-2 text-zen-bark hover:text-zen-terracotta transition-colors"
          >
            <Search size={20} />
          </button>

          <Link
            href={href('/compte')}
            aria-label={t('account')}
            className="p-2 text-zen-bark hover:text-zen-terracotta transition-colors"
          >
            <User size={20} />
          </Link>

          <Link
            href={href('/panier')}
            aria-label={t('cart')}
            className="relative p-2 text-zen-bark hover:text-zen-terracotta transition-colors"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-zen-terracotta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Burger mobile */}
          <button
            className="lg:hidden p-2 text-zen-bark"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zen-sand bg-zen-cream">
          <ul className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            <li>
              <Link
                href={href('/boutique')}
                className="text-sm font-medium text-zen-bark"
                onClick={() => setMobileOpen(false)}
              >
                {t('shop')}
              </Link>
            </li>
            {CATEGORIES.map(({ key, slug }) => (
              <li key={key}>
                <Link
                  href={href(`/boutique/${slug}`)}
                  className="text-sm text-zen-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
