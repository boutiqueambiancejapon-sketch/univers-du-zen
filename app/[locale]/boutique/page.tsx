import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import ShopGrid from '@/components/shop/ShopGrid';
import { ALL_PRODUCTS, CATEGORIES } from '@/lib/all-products';

export const metadata: Metadata = {
  title: 'Boutique bien-être | Univers du Zen',
  description:
    'Découvrez notre sélection de produits bien-être éthiques : aromathérapie, bougies, encens, cristaux et déco zen. Livraison en Belgique, France et Luxembourg.',
};

export default async function BoutiquePage() {
  const locale = await getLocale();

  return (
    <>
      <div className="bg-zen-beige border-b border-zen-sand">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="text-xs font-sans text-zen-muted mb-4 flex gap-1.5">
            <a href={`/${locale}`} className="hover:text-zen-bark">Accueil</a>
            <span>/</span>
            <span className="text-zen-bark">Boutique</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-3">
            Boutique Bien-être
          </h1>
          <p className="text-zen-muted max-w-2xl text-sm leading-relaxed">
            Plus de 500 produits wellness sélectionnés avec soin — aromathérapie, bougies naturelles,
            encens, cristaux et objets déco pour le corps, l&apos;esprit et la maison.
            Tous nos produits sont cruelty-free et expédiés depuis l&apos;Europe.
          </p>
        </div>
      </div>

      <ShopGrid
        products={ALL_PRODUCTS as any}
        categories={CATEGORIES}
        activeCategory={null}
      />
    </>
  );
}
