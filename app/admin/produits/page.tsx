import Link from 'next/link';
import { CheckCircle2, ExternalLink, Package } from 'lucide-react';

interface CatalogEntry { slug: string; pushed_at: string }
interface ProductData {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  tags: string;
  images: string[];
  pushed_at: string;
}

const REPO_RAW = 'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main';

async function getCatalog(): Promise<CatalogEntry[]> {
  try {
    const res = await fetch(`${REPO_RAW}/products/catalog.json`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getProductData(slug: string): Promise<ProductData | null> {
  try {
    const res = await fetch(`${REPO_RAW}/products/${slug}/data.json`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function ProduitsPage() {
  const catalog = await getCatalog();

  const products = (
    await Promise.all(catalog.map(e => getProductData(e.slug)))
  ).filter((p): p is ProductData => p !== null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Produits publiés</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} produits en ligne</p>
        </div>
        <Link href="/admin/catalogue"
          className="flex items-center gap-2 text-sm font-medium bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          <Package size={14} /> Ajouter des produits
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Produit</th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Tags</th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Publié le</th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Statut</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const date = new Date(p.pushed_at).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' });
              const imageUrl = p.images?.[0] ? `${REPO_RAW}/products/${p.slug}/${p.images[0]}` : null;
              return (
                <tr key={p.slug} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                        {imageUrl
                          ? <img src={imageUrl} alt={p.name} className="w-full h-full object-contain p-1" />
                          : <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate max-w-xs">{p.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">{p.short_description?.slice(0, 60)}…</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(p.tags ?? '').split(',').slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t.trim()}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{date}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={11} /> En ligne
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <a
                      href={`https://univers-du-zen.vercel.app/fr-BE/boutique/${p.slug}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-700 transition-colors inline-flex items-center gap-1 text-xs"
                    >
                      Voir <ExternalLink size={11} />
                    </a>
                  </td>
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-gray-400 text-sm">
                  Aucun produit publié. <Link href="/admin/catalogue" className="text-blue-500 hover:underline">Aller au catalogue →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
