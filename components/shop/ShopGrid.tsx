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
  pertinence:   'Pertinence',
  'prix-asc':   'Prix croissant',
  'prix-desc':  'Prix décroissant',
  nouveautes:   'Nouveautés',
};

export default function ShopGrid({ products, categories, activeCategory }: Props) {
  const locale = useLocale();
  const [sort, setSort]               = useState<SortOption>('pertinence');
  const [showInStock, setShowInStock] = useState(false);
  const [showEco, setShowEco]         = useState(false);
  const [activeCat, setActiveCat]     = useState<string | null>(activeCategory);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const sorted = [...products]
    .filter(p => !activeCat || p.category === activeCat)
    .filter(p => !showInStock || p.stockStatus !== 'OutOfStock')
    .filter(p => !showEco || p.isCrueltyFree)
    .sort((a, b) => {
      if (sort === 'prix-asc')  return (a.retailPriceEur ?? 0) - (b.retailPriceEur ?? 0);
      if (sort === 'prix-desc') return (b.retailPriceEur ?? 0) - (a.retailPriceEur ?? 0);
      return 0;
    });

  const SidebarContent = (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <p className="font-sans font-semibold uppercase mb-4"
          style={{ fontSize: 10, letterSpacing: '0.1em', color: '#C1714A' }}>
          Univers
        </p>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => setActiveCat(null)}
              className="w-full text-left text-sm px-3 py-2.5 rounded-xl transition-all font-sans"
              style={!activeCat
                ? { background: '#2C2420', color: '#F2ECE0', fontWeight: 600 }
                : { color: '#2C2420' }}>
              Tous les produits
            </button>
          </li>
          {categories.map(c => (
            <li key={c.slug}>
              <button
                onClick={() => setActiveCat(activeCat === c.slug ? null : c.slug)}
                className="w-full text-left text-sm px-3 py-2.5 rounded-xl transition-all font-sans"
                style={activeCat === c.slug
                  ? { background: '#2C2420', color: '#F2ECE0', fontWeight: 600 }
                  : { color: '#2C2420' }}>
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Filters */}
      <div>
        <p className="font-sans font-semibold uppercase mb-4"
          style={{ fontSize: 10, letterSpacing: '0.1em', color: '#C1714A' }}>
          Filtres
        </p>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={showInStock} onChange={e => setShowInStock(e.target.checked)}
              className="rounded" style={{ accentColor: '#C1714A' }} />
            <span className="text-sm font-sans" style={{ color: '#2C2420' }}>En stock uniquement</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={showEco} onChange={e => setShowEco(e.target.checked)}
              className="rounded" style={{ accentColor: '#C1714A' }} />
            <span className="text-sm font-sans" style={{ color: '#2C2420' }}>Sans test sur animaux</span>
          </label>
        </div>
      </div>

      {/* Bundle upsell */}
      <div className="rounded-2xl p-5" style={{ background: '#2C2420', color: '#F2ECE0' }}>
        <p className="font-sans font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: '#E8C5A0', letterSpacing: '0.08em' }}>
          Coffret sur mesure
        </p>
        <p className="text-xs font-sans leading-relaxed mb-4" style={{ color: 'rgba(242,236,224,.7)' }}>
          Composez votre sélection et économisez <strong style={{ color: '#E8C5A0' }}>−15%</strong> sur le total.
        </p>
        <Link href={`/${locale}/boutique`}
          className="block text-center text-xs font-sans font-semibold py-2.5 rounded-xl transition-colors"
          style={{ background: '#C1714A', color: '#fff' }}>
          Créer mon coffret
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">

      {/* Filter chips — mobile & desktop quick filters */}
      <div className="flex gap-2 flex-wrap mb-8 pb-8 border-b border-zen-sand">
        <button
          onClick={() => setActiveCat(null)}
          className="text-xs font-sans font-semibold px-4 py-2 rounded-full transition-all"
          style={!activeCat
            ? { background: '#2C2420', color: '#F2ECE0', border: '1px solid #2C2420' }
            : { background: '#fff', color: '#2C2420', border: '1px solid rgba(44,36,32,.18)' }}>
          Tout
        </button>
        {categories.map(c => (
          <button key={c.slug}
            onClick={() => setActiveCat(activeCat === c.slug ? null : c.slug)}
            className="text-xs font-sans font-semibold px-4 py-2 rounded-full transition-all"
            style={activeCat === c.slug
              ? { background: '#C1714A', color: '#fff', border: '1px solid #C1714A' }
              : { background: '#fff', color: '#2C2420', border: '1px solid rgba(44,36,32,.18)' }}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex gap-14">
        {/* Sidebar desktop */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          {SidebarContent}
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm font-sans" style={{ color: '#9a8878' }}>
              <strong style={{ color: '#2C2420' }}>{sorted.length}</strong> produit{sorted.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-3">
              <button
                className="md:hidden flex items-center gap-1.5 text-sm font-sans rounded-xl px-4 py-2.5 transition-colors"
                style={{ border: '1px solid rgba(44,36,32,.18)', color: '#2C2420' }}
                onClick={() => setMobileFiltersOpen(true)}>
                <SlidersHorizontal size={14} /> Filtres
              </button>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="text-sm font-sans rounded-xl px-4 py-2.5 bg-white focus:outline-none transition-colors"
                style={{ border: '1px solid rgba(44,36,32,.18)', color: '#2C2420' }}>
                {(Object.keys(SORT_LABELS) as SortOption[]).map(k => (
                  <option key={k} value={k}>{SORT_LABELS[k]}</option>
                ))}
              </select>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-24" style={{ color: '#9a8878' }}>
              <p className="font-serif text-xl mb-2" style={{ color: '#2C2420' }}>Aucun produit trouvé</p>
              <p className="text-sm">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {sorted.map(p => (
                <div key={p.id} className="sr">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-72 bg-white h-full p-8 shadow-xl overflow-y-auto"
            style={{ animation: 'slideIn .3s cubic-bezier(.2,.85,.25,1)' }}>
            <div className="flex items-center justify-between mb-8">
              <p className="font-serif text-xl" style={{ color: '#2C2420' }}>Filtres</p>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={20} style={{ color: '#2C2420' }} />
              </button>
            </div>
            {SidebarContent}
          </div>
        </div>
      )}
    </div>
  );
}
