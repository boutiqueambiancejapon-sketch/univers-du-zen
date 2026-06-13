'use client';

import { useEffect, useState } from 'react';
import { Search, ExternalLink, CheckCircle2, Clock } from 'lucide-react';

interface RetinaProduct {
  id: number;
  name: string;
  category: { name: string };
  price: number;
  wholesale: number;
  stock: number;
  images: string[];
}

interface CatalogEntry { slug: string; pushed_at: string }

const REPO_RAW = 'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main';

export default function CataloguePage() {
  const [products, setProducts]   = useState<RetinaProduct[]>([]);
  const [published, setPublished] = useState<Set<number>>(new Set());
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [requesting, setRequesting] = useState<Set<number>>(new Set());
  const [requested, setRequested]   = useState<Set<number>>(new Set());

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/retina-catalog').then(r => r.json()),
      fetch(`${REPO_RAW}/products/catalog.json`).then(r => r.json()).catch(() => []),
    ]).then(([catalog, catalogJson]) => {
      if (catalog.error) { setError(catalog.error); setLoading(false); return; }
      const prods: RetinaProduct[] = catalog.data ?? [];
      setProducts(prods);

      // Build set of published product IDs by matching catalog.json slugs to product names
      // We store the retina_id in data.json — fetch a few to cross-reference
      const entries: CatalogEntry[] = catalogJson ?? [];
      // For now mark any product whose name fragment appears in a published slug
      const publishedIds = new Set<number>();
      prods.forEach(p => {
        const nameSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (entries.some(e => e.slug.includes(nameSlug.slice(0, 10)))) {
          publishedIds.add(p.id);
        }
      });
      setPublished(publishedIds);
      setLoading(false);
    }).catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category?.name).filter(Boolean))).sort();

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && p.category?.name !== catFilter) return false;
    if (statusFilter === 'published'   && !published.has(p.id)) return false;
    if (statusFilter === 'unpublished' && published.has(p.id))  return false;
    return true;
  });

  async function requestPublication(p: RetinaProduct) {
    setRequesting(s => new Set(s).add(p.id));
    await fetch('/api/admin/request-publication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, name: p.name, category: p.category?.name, price: p.wholesale }),
    });
    setRequested(s => new Set(s).add(p.id));
    setRequesting(s => { const n = new Set(s); n.delete(p.id); return n; });
  }

  const margin = (p: RetinaProduct) => {
    const sell = p.price * 1.4;
    return ((sell - p.wholesale) / sell * 100).toFixed(0);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">{error}</div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Catalogue fournisseur</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {products.length} produits disponibles · {published.size} publiés
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-52">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
          />
        </div>

        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-gray-400"
        >
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(['all', 'unpublished', 'published'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                statusFilter === s ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'Tous' : s === 'published' ? 'Publiés' : 'Non publiés'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => {
          const isPub  = published.has(p.id);
          const isReq  = requested.has(p.id);
          const isReqg = requesting.has(p.id);

          return (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
              {/* Image placeholder */}
              <div className="h-40 bg-gray-50 flex items-center justify-center relative">
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-contain p-4" />
                ) : (
                  <div className="text-3xl text-gray-200">📦</div>
                )}
                {isPub && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} /> Publié
                  </span>
                )}
                {isReq && !isPub && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    <Clock size={10} /> En attente
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs font-medium text-gray-400 mb-1">{p.category?.name}</p>
                <p className="text-sm font-semibold text-gray-900 leading-snug mb-2 flex-1">{p.name}</p>

                <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                  <span>Achat : <strong className="text-gray-800">{p.wholesale?.toFixed(2)} €</strong></span>
                  <span>Marge : <strong className="text-emerald-600">~{margin(p)}%</strong></span>
                  <span className={p.stock > 10 ? 'text-emerald-600' : p.stock > 0 ? 'text-amber-600' : 'text-red-500'}>
                    Stock : {p.stock}
                  </span>
                </div>

                <div className="flex gap-2">
                  {!isPub && !isReq && (
                    <button
                      onClick={() => requestPublication(p)}
                      disabled={isReqg}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {isReqg ? '...' : 'Demander publication'}
                    </button>
                  )}
                  {isReq && (
                    <div className="flex-1 text-xs font-semibold py-2 rounded-lg bg-amber-50 text-amber-700 text-center">
                      Demande envoyée ✓
                    </div>
                  )}
                  {isPub && (
                    <div className="flex-1 text-xs font-semibold py-2 rounded-lg bg-emerald-50 text-emerald-700 text-center">
                      En ligne ✓
                    </div>
                  )}
                  <a
                    href={`https://app.aiku.io/app/re-api/dropshipping/products/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400 text-sm">
            Aucun produit ne correspond aux filtres.
          </div>
        )}
      </div>
    </div>
  );
}
