'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, CheckCircle2, Clock, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import Link from 'next/link';

interface Product {
  sku: string; name: string; department: string; family_code: string; family: string;
  wholesale_price: number; rrp: number; stock_qty: number; in_stock: boolean; image_url: string;
}

const REPO_RAW = 'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main';

const DEPTS = [
  'Aromathérapie', 'Huiles de fragrance', 'Encens & Rituel',
  'Cristaux & Pierres', 'Bougies & Photophores', 'Bien-être Corps',
  'Déco & Maison', 'Thé & Tisanes', 'Instruments',
];

const DEPT_EMOJI: Record<string, string> = {
  'Aromathérapie': '🌿', 'Huiles de fragrance': '🧴', 'Encens & Rituel': '🌸',
  'Cristaux & Pierres': '💎', 'Bougies & Photophores': '🕯️', 'Bien-être Corps': '🛁',
  'Déco & Maison': '🏠', 'Thé & Tisanes': '🍵', 'Instruments': '🎵',
};

function ProductImg({ src, emoji }: { src: string; emoji: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <div className="w-full h-full flex items-center justify-center text-3xl">{emoji}</div>;
  return (
    <img
      src={`/api/admin/retina-image?url=${encodeURIComponent(src)}`}
      alt=""
      className="w-full h-full object-contain p-2"
      onError={() => setErr(true)}
    />
  );
}

export default function CataloguePage() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [total, setTotal]         = useState(0);
  const [published, setPublished] = useState<Set<string>>(new Set());
  const [search, setSearch]       = useState('');
  const [dept, setDept]           = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [requesting, setRequesting] = useState<Set<string>>(new Set());
  const [requested, setRequested]   = useState<Set<string>>(new Set());
  const PER = 48;

  // Load published SKUs from catalog.json
  useEffect(() => {
    fetch(`${REPO_RAW}/products/catalog.json`)
      .then(r => r.ok ? r.json() : [])
      .then(async (index: { slug: string }[]) => {
        const results = await Promise.allSettled(
          index.map(({ slug }) =>
            fetch(`${REPO_RAW}/products/${slug}/data.json`).then(r => r.ok ? r.json() : null)
          )
        );
        const skus = new Set<string>();
        results.forEach(r => { if (r.status === 'fulfilled' && r.value?.id) skus.add(r.value.id); });
        setPublished(skus);
      })
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams({
      page: String(page), per: String(PER),
      ...(dept   ? { dept }   : {}),
      ...(search ? { search } : {}),
      ...(inStockOnly ? { in_stock: 'true' } : {}),
    });
    fetch(`/api/admin/supplier-catalog?${params}`)
      .then(async r => {
        const text = await r.text();
        try { return JSON.parse(text); }
        catch { return { error: `Réponse invalide (${r.status}): ${text.slice(0, 150)}` }; }
      })
      .then(d => {
        if (d.error) { setError(d.error); return; }
        setProducts(d.data ?? []);
        setTotal(d.total ?? 0);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [page, dept, search, inStockOnly]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [dept, search, inStockOnly]);

  async function requestPublication(p: Product) {
    setRequesting(s => new Set(s).add(p.sku));
    await fetch('/api/admin/request-publication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.sku, name: p.name, category: p.department, price: p.wholesale_price }),
    }).catch(() => {});
    setRequested(s => new Set(s).add(p.sku));
    setRequesting(s => { const n = new Set(s); n.delete(p.sku); return n; });
  }

  const totalPages = Math.ceil(total / PER);
  const isEmpty = !loading && products.length === 0 && !error;
  const needsImport = error.includes('manquante') || error.includes('does not exist');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Catalogue fournisseur</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total > 0 ? `${total.toLocaleString()} produits · ${published.size} publiés` : 'Chargement…'}
          </p>
        </div>
        <Link href="/admin/import"
          className="flex items-center gap-2 text-sm font-medium border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors text-gray-600">
          <Upload size={13} /> Mettre à jour le CSV
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5 p-4 bg-white rounded-xl border border-gray-200">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
            className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400" />
        </div>

        <select value={dept} onChange={e => setDept(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none">
          <option value="">Tous les départements</option>
          {DEPTS.map(d => <option key={d} value={d}>{DEPT_EMOJI[d]} {d}</option>)}
        </select>

        <button onClick={() => setInStockOnly(v => !v)}
          className={`text-sm px-4 py-2 rounded-lg border font-medium transition-colors ${
            inStockOnly ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>
          En stock uniquement
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {needsImport ? (
            <>
              Table Supabase manquante —{' '}
              <Link href="/admin/import" className="underline font-medium">importer le CSV d'abord →</Link>
              <p className="mt-2 text-xs text-red-500">
                Crée d'abord la table dans Supabase (SQL ci-dessous), puis importe le CSV.
              </p>
            </>
          ) : error}
        </div>
      )}

      {/* Empty */}
      {isEmpty && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-4">📂</p>
          <p className="font-semibold text-gray-700 mb-2">Catalogue vide</p>
          <p className="text-sm text-gray-500 mb-6">Importe le CSV fournisseur pour remplir le catalogue.</p>
          <Link href="/admin/import"
            className="inline-flex items-center gap-2 text-sm font-semibold bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
            <Upload size={14} /> Importer le CSV
          </Link>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {products.map(p => {
              const isPub  = published.has(p.sku);
              const isReq  = requested.has(p.sku);
              const isReqg = requesting.has(p.sku);
              const emoji  = DEPT_EMOJI[p.department] ?? '📦';
              const margin = p.rrp > 0
                ? ((p.rrp - p.wholesale_price) / p.rrp * 100).toFixed(0)
                : '—';

              return (
                <div key={p.sku} className={`bg-white rounded-xl border overflow-hidden flex flex-col hover:shadow-sm transition-shadow ${
                  isPub ? 'border-emerald-200' : 'border-gray-200'
                }`}>
                  <div className="h-28 bg-gray-50 relative flex items-center justify-center">
                    <ProductImg src={p.image_url} emoji={emoji} />
                    {isPub && (
                      <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                        <CheckCircle2 size={8} /> Publié
                      </span>
                    )}
                    {isReq && !isPub && (
                      <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 text-[9px] font-bold bg-amber-400 text-white px-1.5 py-0.5 rounded-full">
                        <Clock size={8} /> En attente
                      </span>
                    )}
                    <span className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      (p.stock_qty ?? 0) > 20 ? 'bg-green-100 text-green-700'
                      : (p.stock_qty ?? 0) > 5  ? 'bg-amber-100 text-amber-700'
                      : (p.stock_qty ?? 0) > 0  ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-600'
                    }`}>{(p.stock_qty ?? 0) > 0 ? p.stock_qty : '✕'}</span>
                  </div>

                  <div className="p-2.5 flex flex-col flex-1">
                    <p className="text-[9px] text-gray-400 mb-0.5">{emoji} {p.department}</p>
                    <p className="text-[11px] font-semibold text-gray-900 leading-snug mb-1.5 flex-1 line-clamp-2">{p.name}</p>
                    <div className="flex justify-between text-[9px] text-gray-500 mb-2">
                      <span>{p.wholesale_price?.toFixed(2)}€</span>
                      <span className="text-emerald-600 font-semibold">{margin}%</span>
                      <span className="text-gray-400 truncate max-w-12">{p.sku}</span>
                    </div>
                    {isPub ? (
                      <div className="text-center text-[10px] font-semibold py-1.5 rounded-lg bg-emerald-50 text-emerald-700">En ligne ✓</div>
                    ) : isReq ? (
                      <div className="text-center text-[10px] font-semibold py-1.5 rounded-lg bg-amber-50 text-amber-600">Demandé ✓</div>
                    ) : (
                      <button onClick={() => requestPublication(p)} disabled={isReqg || !p.in_stock}
                        className="text-[10px] font-semibold py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-40">
                        {isReqg ? '…' : !p.in_stock ? 'Rupture' : '+ Publier'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Page {page} / {totalPages} · {total.toLocaleString()} produits
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex items-center gap-1 text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">
                  <ChevronLeft size={14} /> Préc.
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="flex items-center gap-1 text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">
                  Suiv. <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
