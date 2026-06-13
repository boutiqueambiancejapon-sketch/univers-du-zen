'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, CheckCircle2, Clock, Filter } from 'lucide-react';

interface RetinaProduct {
  id: number;
  name: string;
  category: { name: string; slug: string };
  price: number;
  wholesale: number;
  stock: number;
  images: string[];
}

interface PublishedProduct {
  retinaId: number;
  slug: string;
  name: string;
}

const REPO_RAW = 'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main';

function ProductImage({ src, fallback }: { src?: string; fallback: string }) {
  const [errored, setErrored] = useState(false);
  const proxied = src && !errored ? `/api/admin/retina-image?url=${encodeURIComponent(src)}` : null;
  if (!proxied) return <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">{fallback}</div>;
  return (
    <img
      src={proxied}
      alt=""
      className="w-full h-full object-contain p-3"
      onError={() => setErrored(true)}
    />
  );
}

const CATEGORY_EMOJI: Record<string, string> = {
  'Fragrance Oils': '🌿',
  'Reed Diffusers': '🪄',
  'Candles': '🕯️',
  'Incense': '🌸',
  'Crystals': '💎',
  'Clothing': '👘',
  default: '📦',
};

export default function CataloguePage() {
  const [products, setProducts]     = useState<RetinaProduct[]>([]);
  const [published, setPublished]   = useState<Map<number, PublishedProduct>>(new Map());
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [requesting, setRequesting] = useState<Set<number>>(new Set());
  const [requested, setRequested]   = useState<Set<number>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch full Retina catalog (all pages)
        const catalogRes = await fetch('/api/admin/retina-catalog');
        const catalogData = await catalogRes.json();
        if (catalogData.error) { setError(catalogData.error); setLoading(false); return; }
        const prods: RetinaProduct[] = catalogData.data ?? [];
        setProducts(prods);

        // 2. Fetch catalog.json index of published slugs
        const indexRes = await fetch(`${REPO_RAW}/products/catalog.json`).catch(() => null);
        if (!indexRes?.ok) { setLoading(false); return; }
        const index: { slug: string }[] = await indexRes.json();

        // 3. Fetch data.json for each published product to get its retina ID
        const dataResults = await Promise.allSettled(
          index.map(({ slug }) =>
            fetch(`${REPO_RAW}/products/${slug}/data.json`)
              .then(r => r.ok ? r.json() : null)
          )
        );

        const pubMap = new Map<number, PublishedProduct>();
        dataResults.forEach(r => {
          if (r.status === 'fulfilled' && r.value?.id) {
            const d = r.value;
            pubMap.set(parseInt(d.id, 10), { retinaId: parseInt(d.id, 10), slug: d.slug, name: d.name });
          }
        });
        setPublished(pubMap);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category?.name).filter(Boolean))).sort(),
    [products]
  );

  const filtered = useMemo(() => products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && p.category?.name !== catFilter) return false;
    if (statusFilter === 'published'   && !published.has(p.id)) return false;
    if (statusFilter === 'unpublished' && published.has(p.id))  return false;
    return true;
  }), [products, search, catFilter, statusFilter, published]);

  async function requestPublication(p: RetinaProduct) {
    setRequesting(s => new Set(s).add(p.id));
    try {
      await fetch('/api/admin/request-publication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, name: p.name, category: p.category?.name, price: p.wholesale }),
      });
      setRequested(s => new Set(s).add(p.id));
    } finally {
      setRequesting(s => { const n = new Set(s); n.delete(p.id); return n; });
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Chargement du catalogue fournisseur…</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
      <strong>Erreur :</strong> {error}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Catalogue fournisseur</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {products.length} produits disponibles · {published.size} publiés · {filtered.length} affichés
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-xl border border-gray-200">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit…"
            className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 focus:bg-white"
          />
        </div>

        <div className="relative">
          <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 appearance-none"
          >
            <option value="">Toutes catégories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
          {([['all', 'Tous'], ['unpublished', 'Non publiés'], ['published', 'Publiés']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setStatusFilter(val)}
              className={`px-4 py-2 font-medium transition-colors ${
                statusFilter === val ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map(p => {
          const isPub  = published.has(p.id);
          const isReq  = requested.has(p.id);
          const isReqg = requesting.has(p.id);
          const pubData = published.get(p.id);
          const emoji  = CATEGORY_EMOJI[p.category?.name] ?? CATEGORY_EMOJI.default;
          const imageUrl = p.images?.[0] ?? null;
          const margin = p.wholesale > 0 ? ((p.price - p.wholesale) / p.price * 100).toFixed(0) : '—';

          return (
            <div key={p.id} className={`bg-white rounded-xl border overflow-hidden flex flex-col transition-shadow hover:shadow-md ${
              isPub ? 'border-emerald-200' : 'border-gray-200'
            }`}>
              {/* Image */}
              <div className="h-36 bg-gray-50 relative flex items-center justify-center">
                <ProductImage src={imageUrl ?? undefined} fallback={emoji} />

                {/* Status badge */}
                {isPub ? (
                  <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                    <CheckCircle2 size={9} /> Publié
                  </span>
                ) : isReq ? (
                  <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-semibold bg-amber-400 text-white px-2 py-0.5 rounded-full shadow-sm">
                    <Clock size={9} /> En attente
                  </span>
                ) : null}

                {/* Stock indicator */}
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  p.stock > 20 ? 'bg-green-100 text-green-700'
                  : p.stock > 5  ? 'bg-amber-100 text-amber-700'
                  : p.stock > 0  ? 'bg-orange-100 text-orange-700'
                  : 'bg-red-100 text-red-600'
                }`}>
                  {p.stock > 0 ? `${p.stock}` : '✕'}
                </span>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <p className="text-[10px] font-medium text-gray-400 mb-0.5">{p.category?.name}</p>
                <p className="text-xs font-semibold text-gray-900 leading-snug mb-2 flex-1 line-clamp-2">
                  {isPub && pubData ? pubData.name : p.name}
                </p>

                <div className="flex items-center justify-between text-[10px] text-gray-500 mb-3">
                  <span>Achat <strong className="text-gray-800">{p.wholesale?.toFixed(2)}€</strong></span>
                  <span>Marge <strong className="text-emerald-600">{margin}%</strong></span>
                </div>

                {isPub ? (
                  <a
                    href={`https://univers-du-zen.vercel.app/fr-BE/boutique/${pubData?.slug}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-center text-[11px] font-semibold py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    Voir en boutique →
                  </a>
                ) : isReq ? (
                  <div className="text-center text-[11px] font-semibold py-2 rounded-lg bg-amber-50 text-amber-600">
                    Demande envoyée ✓
                  </div>
                ) : (
                  <button
                    onClick={() => requestPublication(p)}
                    disabled={isReqg || p.stock === 0}
                    className="text-[11px] font-semibold py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-40"
                  >
                    {isReqg ? '…' : p.stock === 0 ? 'Rupture' : 'Demander publication'}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400 text-sm">
            Aucun produit ne correspond aux filtres sélectionnés.
          </div>
        )}
      </div>
    </div>
  );
}
