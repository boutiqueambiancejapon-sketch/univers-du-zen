import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import ShopGrid from '@/components/shop/ShopGrid';
import CollectionGrid from '@/components/shop/CollectionGrid';
import { getPublishedProducts } from '@/lib/get-products';
import { CATEGORIES } from '@/lib/demo-products';

export const metadata: Metadata = {
  title: 'Boutique bien-être naturelle | Aromathérapie, Encens, Cristaux',
  description:
    'Découvrez notre sélection de produits bien-être éthiques : aromathérapie, bougies naturelles, encens, cristaux et déco zen. Livraison rapide en Belgique, France et Luxembourg.',
};

export default async function BoutiquePage() {
  const locale   = await getLocale();
  const products = await getPublishedProducts();

  /* ── Première image par collection (pour CollectionGrid) ── */
  const categoryImages: Record<string, string> = {};
  for (const p of products) {
    if (p.category && p.images?.[0] && !categoryImages[p.category]) {
      categoryImages[p.category] = p.images[0];
    }
  }

  return (
    <>
      {/* ── Hero header ──────────────────────────────────────────────── */}
      <div style={{ background: '#F5F3EF', borderBottom: '1px solid rgba(44,36,32,.08)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          <nav className="flex items-center gap-1.5 mb-6"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: '0.06em', color: 'rgba(44,36,32,.45)' }}>
            <Link href={`/${locale}`} className="hover:opacity-100 transition-opacity">Accueil</Link>
            <span>/</span>
            <span style={{ color: '#2C2420' }}>Boutique</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-sans uppercase tracking-widest mb-3"
                style={{ color: '#C1714A', letterSpacing: '0.1em' }}>
                Toute la collection
              </p>
              <h1 className="font-serif"
                style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: '#2C2420', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
                Boutique Bien-être
              </h1>
              <p className="mt-3 text-sm font-sans leading-relaxed" style={{ color: '#6B5C55', maxWidth: 480 }}>
                Aromathérapie, huiles de fragrance, encens, cristaux et déco — sélection éthique cruelty-free, expédiée depuis l&apos;Europe en 3 à 5 jours.
              </p>
            </div>

            <div className="flex gap-6 flex-shrink-0">
              {[
                { v: `${products.length}`, l: 'produits' },
                { v: '100%',              l: 'cruelty-free' },
                { v: '3–5j',             l: 'livraison' },
              ].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <p className="font-serif font-bold" style={{ fontSize: 22, color: '#2C2420' }}>{v}</p>
                  <p className="text-xs font-sans" style={{ color: '#9a8878' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Collection cards visuelles ───────────────────────────────── */}
      <CollectionGrid
        categories={CATEGORIES}
        categoryImages={categoryImages}
        locale={locale}
        activeCategory={null}
      />

      {/* ── Grille produits ──────────────────────────────────────────── */}
      <ShopGrid
        products={products as any}
        categories={CATEGORIES}
        activeCategory={null}
      />
    </>
  );
}

export const revalidate = 300;
