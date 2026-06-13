import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import type { Product } from '@/lib/types';

interface Props {
  products: Partial<Product>[];
}

export default function BestSellers({ products }: Props) {
  if (!products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-sans uppercase tracking-widest mb-2"
            style={{ color: '#C1714A', letterSpacing: '0.1em' }}>
            Sélection
          </p>
          <h2 className="font-serif text-3xl md:text-4xl" style={{ color: '#2C2420' }}>
            Nos produits du moment
          </h2>
          <p className="font-sans mt-2" style={{ color: '#6B5C55' }}>
            Une sélection soigneusement choisie pour votre bien-être
          </p>
        </div>
        <Link href="/boutique"
          className="text-sm font-sans hidden md:block transition-opacity hover:opacity-60"
          style={{ color: '#2C2420' }}>
          Voir tout →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => (
          <ProductCard key={p.id ?? p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
