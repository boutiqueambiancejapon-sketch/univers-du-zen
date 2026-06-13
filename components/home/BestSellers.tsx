import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { DEMO_PRODUCTS } from '@/lib/demo-products';

const BEST_SELLERS = DEMO_PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

export default function BestSellers() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-zen-bark">Nos best-sellers</h2>
          <p className="text-zen-muted mt-2">Les favoris de notre communauté</p>
        </div>
        <Link
          href="/boutique"
          className="text-sm text-zen-muted hover:text-zen-bark transition-colors hidden md:block"
        >
          Voir tout →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {BEST_SELLERS.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
