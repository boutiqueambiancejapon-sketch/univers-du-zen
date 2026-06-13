'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

type SortOption = 'pertinence' | 'prix-asc' | 'prix-desc' | 'nouveautes';

interface Props {
  products: Partial<Product>[];
  categories: { slug: string; label: string }[];
  activeCategory: string | null;
}

const SORT_LABELS: Record<SortOption, string> = {
  pertinence: 'Pertinence',
  'prix-asc': 'Prix croissant',
  'prix-desc': 'Prix décroissant',
  nouveautes: 'Nouveautés',
};

export default function ShopGrid({ products, categories, activeCategory }: Props) {
  const locale = useLocale();
  const [sort, setSort] = useState<SortOption>('pertinence');
  const [showInStock, setShowInStock] = useState(false);
  const [showEco, setShowEco] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const sorted = [...products]
    .filter(p => !showInStock || p.stockStatus !== 'OutOfStock')
    .filter(p => !showEco || p.isCrueltyFree)
    .sort((a, b) => {
      if (sort === 'prix-asc') return (a.retailPriceEur ?? 0) - (b.retailPriceEur ?? 0);
      if (sort === 'prix-desc') return (b.retailPriceEur ?? 0) - (a.retailPriceEur ?? 0);
      return 0;
    });

  const Filters = (
    <div className="space-y-6">
      {/* Catégories */}
      <div>
        <p className="text-xs font-sans font-semibold tracking-widest uppercase text-zen-muted mb-3">Univers</p>
        <ul className="space-y-1">
          <li>
            <Link
              href={`/${locale}/boutique`}
              className={`block text-sm py-1 px-2 rounded transition-colors ${
                !activeCategory ? 'bg-zen-bark text-white' : 'text-zen-bark hover:bg-zen-beige'
              }`}
            >
              Tous les produits
            </Link>
          </li>
          {categories.map(c => (
            <li key={c.slug}>
              <Link
                href={`/${locale}/boutique/${c.slug}`}
                className={`block text-sm py-1 px-2 rounded transition-colors ${
                  activeCategory === c.slug ? 'bg-zen-bark text-white' : 'text-zen-bark hover:bg-zen-beige'
                }`}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Filtres */}
      <div>
        <p className="text-xs font-sans font-semibold tracking-widest uppercase text-zen-muted mb-3">Filtres</p>
        <label className="flex items-center gap-2 cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={showInStock}
            onChange={e => setShowInStock(e.target.checked)}
            className="accent-zen-bark"
          />
          <span className="text-sm text-zen-bark">En stock uniquement</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showEco}
            onChange={e => setShowEco(e.target.checked)}
            className="accent-zen-bark"
          />
          <span className="text-sm text-zen-bark">Sans test sur animaux</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs font-sans text-zen-muted mb-6 flex gap-2">
        <Link href={`/${locale}`} className="hover:text-zen-bark">Accueil</Link>
        <span>/</span>
        <Link href={`/${locale}/boutique`} className="hover:text-zen-bark">Boutique</Link>
        {activeCategory && (
          <>
            <span>/</span>
            <span className="text-zen-bark">{categories.find(c => c.slug === activeCategory)?.label}</span>
          </>
        )}
      </nav>

      <div className="flex gap-10">
        {/* Sidebar desktop */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          {Filters}
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-zen-muted">
              <span className="font-semibold text-zen-bark">{sorted.length}</span> produits
            </p>

            <div className="flex items-center gap-3">
              {/* Mobile filters */}
              <button
                className="md:hidden flex items-center gap-1 text-sm text-zen-bark border border-zen-sand rounded px-3 py-1.5"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal size={14} /> Filtres
              </button>

              {/* Sort */}
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="text-sm text-zen-bark border border-zen-sand rounded px-3 py-1.5 bg-white focus:outline-none focus:border-zen-bark"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map(k => (
                  <option key={k} value={k}>{SORT_LABELS[k]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {sorted.length === 0 ? (
            <div className="text-center py-20 text-zen-muted">
              <p className="text-lg font-serif mb-2">Aucun produit trouvé</p>
              <p className="text-sm">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sorted.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-72 bg-white h-full p-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="font-serif text-lg text-zen-bark">Filtres</p>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={20} className="text-zen-bark" />
              </button>
            </div>
            {Filters}
          </div>
        </div>
      )}
    </div>
  );
}
