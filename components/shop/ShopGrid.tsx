'use client';

/**
 * ShopGrid
 *
 * Reçoit des produits déjà pré-filtrés côté serveur.
 * La navigation par collection/sous-collection passe par de vrais <Link> (SEO).
 * Seuls le tri et les filtres "En stock / Cruelty-free" restent côté client
 * (ils n'affectent pas l'indexation — Google voit déjà les produits dans le HTML).
 */

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
  /** Slug actif — null sur /boutique, slug de la collection sur /boutique/[category], etc. */
  activeCategory: string | null;
}

const SORT_LABELS: Record<SortOption, string> = {
  pertinence:  'Pertinence',
  'prix-asc':  'Prix croissant',
  'prix-desc': 'Prix décroissant',
  nouveautes:  'Nouveautés',
};

export default function ShopGrid({ products, categories, activeCategory }: Props) {
  const locale = useLocale();
  const [sort, setSort]               = useState<SortOption>('pertinence');
  const [showInStock, setShowInStock] = useState(false);
  const [showEco, setShowEco]         = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  /* ── Tri + filtres auxiliaires (client-only, ne cassent pas le SEO) ── */
  const visible = [...products]
    .filter(p => !showInStock || p.stockStatus !== 'OutOfStock')
    .filter(p => !showEco || p.isCrueltyFree)
    .sort((a, b) => {
      if (sort === 'prix-asc')  return (a.retailPriceEur ?? 0) - (b.retailPriceEur ?? 0);
      if (sort === 'prix-desc') return (b.retailPriceEur ?? 0) - (a.retailPriceEur ?? 0);
      return 0;
    });

  /* ── Sidebar : navigation par catégorie via <Link> ────────────────── */
  const SidebarContent = (
    <div className="space-y-8">
      {/* Navigation collections */}
      <div>
        <p className="font-sans font-semibold uppercase mb-4"
          style={{ fontSize: 10, letterSpacing: '0.1em', color: '#C1714A' }}>
          Univers
        </p>
        <ul className="space-y-0.5">
          <li>
            <Link href={`/${locale}/boutique`}
              className="w-full text-left text-sm px-3 py-2.5 rounded-xl transition-all font-sans block"
              style={!activeCategory
                ? { background: '#2C2420', color: '#F2ECE0', fontWeight: 600 }
                : { color: '#2C2420' }}>
              Tous les produits
            </Link>
          </li>
          {categories.map(c => (
            <li key={c.slug}>
              <Link href={`/${locale}/boutique/${c.slug}`}
                className="w-full text-left text-sm px-3 py-2.5 rounded-xl transition-all font-sans block"
                style={activeCategory === c.slug
                  ? { background: '#2C2420', color: '#F2ECE0', fontWeight: 600 }
                  : { color: '#2C2420' }}>
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Filtres auxiliaires */}
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

      {/* Encart coffret */}
      <div className="rounded-2xl p-5" style={{ background: '#2C2420', color: '#F2ECE0' }}>
        <p className="font-sans font-semibold text-xs uppercase tracking-wider mb-2"
          style={{ color: '#E8C5A0', letterSpacing: '0.08em' }}>
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

      {/* ── Chips de navigation — vrais liens <Link> ───────────────────── */}
      <div className="flex gap-2 flex-wrap mb-8 pb-8 border-b border-zen-sand">
        <Link href={`/${locale}/boutique`}
          className="text-xs font-sans font-semibold px-4 py-2 rounded-full transition-all"
          style={!activeCategory
            ? { background: '#2C2420', color: '#F2ECE0', border: '1px solid #2C2420' }
            : { background: '#fff', color: '#2C2420', border: '1px solid rgba(44,36,32,.18)' }}>
          Tout
        </Link>
        {categories.map(c => (
          <Link key={c.slug} href={`/${locale}/boutique/${c.slug}`}
            className="text-xs font-sans font-semibold px-4 py-2 rounded-full transition-all"
            style={activeCategory === c.slug
              ? { background: '#C1714A', color: '#fff', border: '1px solid #C1714A' }
              : { background: '#fff', color: '#2C2420', border: '1px solid rgba(44,36,32,.18)' }}>
            {c.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-14">
        {/* Sidebar desktop */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          {SidebarContent}
        </aside>

        {/* Grille produits */}
        <div className="flex-1 min-w-0">
          {/* Barre de tri */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm font-sans" style={{ color: '#9a8878' }}>
              <strong style={{ color: '#2C2420' }}>{visible.length}</strong> produit{visible.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-3">
              <button
                className="md:hidden flex items-center gap-1.5 text-sm font-sans rounded-xl px-4 py-2.5 transition-colors"
                style={{ border: '1px solid rgba(44,36,32,.18)', color: '#2C2420' }}
                onClick={() => setMobileFiltersOpen(true)}>
                <SlidersHorizontal size={14} /> Filtres
              </button>
              <select value={sort} onChange={e => setSort(e.target.value as SortOption)}
                className="text-sm font-sans rounded-xl px-4 py-2.5 bg-white focus:outline-none transition-colors"
                style={{ border: '1px solid rgba(44,36,32,.18)', color: '#2C2420' }}>
                {(Object.keys(SORT_LABELS) as SortOption[]).map(k => (
                  <option key={k} value={k}>{SORT_LABELS[k]}</option>
                ))}
              </select>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="text-center py-24" style={{ color: '#9a8878' }}>
              <p className="font-serif text-xl mb-2" style={{ color: '#2C2420' }}>Aucun produit dans cette collection</p>
              <p className="text-sm mb-6">Les produits arrivent bientôt — revenez nous voir !</p>
              <Link href={`/${locale}/boutique`}
                className="inline-flex items-center gap-2 text-sm font-sans font-medium px-5 py-2.5 rounded-xl transition-colors"
                style={{ background: '#2C2420', color: '#F2ECE0' }}>
                ← Voir toute la boutique
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {visible.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay filtres mobile */}
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
