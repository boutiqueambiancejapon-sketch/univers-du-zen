'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ShoppingBag, Heart, Star, Leaf, Shield, Truck, RotateCcw, Check } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

const CATEGORY_LABELS: Record<string, string> = {
  aromatherapie: 'Aromathérapie',
  bougies: 'Bougies',
  encens: 'Encens',
  'pierres-cristaux': 'Pierres & Cristaux',
  'maison-deco': 'Maison & Déco',
  'thes-artisanaux': 'Thés Artisanaux',
};

interface Props {
  product: Partial<Product>;
  related: Partial<Product>[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const locale = useLocale();
  const addItem = useCartStore(s => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const images = product.images?.length ? product.images : [
    '/images/udz-hero-homepage.jpeg',
  ];

  const discount = product.compareAtPriceEur
    ? Math.round((1 - product.retailPriceEur! / product.compareAtPriceEur) * 100)
    : null;

  const isOutOfStock = product.stockStatus === 'OutOfStock';

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) addItem(product as Product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs font-sans text-zen-muted mb-8 flex gap-2">
        <Link href={`/${locale}`} className="hover:text-zen-bark">Accueil</Link>
        <span>/</span>
        <Link href={`/${locale}/boutique`} className="hover:text-zen-bark">Boutique</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/${locale}/boutique/${product.category}`} className="hover:text-zen-bark">
              {CATEGORY_LABELS[product.category] ?? product.category}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-zen-bark line-clamp-1">{product.nameFr}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* === Galerie === */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-zen-sand">
            <Image
              src={images[activeImg]}
              alt={product.nameFr ?? ''}
              fill
              className="object-cover"
              priority
            />
            {discount && (
              <span className="badge-discount absolute top-4 left-4 text-sm px-3 py-1">-{discount}%</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImg === i ? 'border-zen-bark' : 'border-transparent'
                  }`}
                >
                  <Image src={src} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* === Info produit === */}
        <div>
          {/* Catégorie */}
          {product.category && (
            <p className="text-xs font-sans tracking-widest uppercase text-zen-terracotta mb-2">
              {CATEGORY_LABELS[product.category] ?? product.category}
            </p>
          )}

          {/* Titre */}
          <h1 className="font-serif text-3xl md:text-4xl text-zen-bark leading-tight mb-4">
            {product.nameFr}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={14} className={i <= 4 ? 'fill-zen-gold text-zen-gold' : 'text-zen-sand fill-zen-sand'} />
              ))}
            </div>
            <span className="text-sm text-zen-muted">4.8 sur 5 (124 avis)</span>
          </div>

          {/* Prix */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif text-3xl text-zen-bark">{product.retailPriceEur} €</span>
            {product.compareAtPriceEur && (
              <span className="text-lg text-zen-muted line-through">{product.compareAtPriceEur} €</span>
            )}
            {discount && (
              <span className="text-sm text-zen-terracotta font-sans font-medium">Économisez {discount}%</span>
            )}
          </div>

          {/* Eco badges */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {product.isVegan && (
              <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                <Leaf size={11} /> Vegan
              </span>
            )}
            {product.isCrueltyFree && (
              <span className="flex items-center gap-1 text-xs bg-pink-50 text-pink-600 px-3 py-1 rounded-full">
                ♥ Sans test animal
              </span>
            )}
            {product.isOrganic && (
              <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                <Leaf size={11} /> Bio
              </span>
            )}
          </div>

          {/* Description courte */}
          {product.descriptionFr && (
            <p className="text-zen-muted leading-relaxed mb-6 text-sm">
              {product.descriptionFr}
            </p>
          )}

          {/* Stock */}
          {product.stockStatus === 'Low' && (
            <p className="text-amber-600 text-sm font-sans mb-4">⚠️ Dernières pièces disponibles</p>
          )}
          {product.stockStatus === 'VeryLow' && (
            <p className="text-red-500 text-sm font-sans mb-4">⚠️ Presque épuisé — commandez vite</p>
          )}

          {/* Quantité + ajout */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-zen-sand rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-12 flex items-center justify-center text-zen-bark hover:bg-zen-beige transition-colors text-lg"
              >
                −
              </button>
              <span className="w-10 text-center font-sans text-zen-bark font-medium">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(99, q + 1))}
                className="w-10 h-12 flex items-center justify-center text-zen-bark hover:bg-zen-beige transition-colors text-lg"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-sans font-medium transition-all ${
                added
                  ? 'bg-green-600 text-white'
                  : isOutOfStock
                  ? 'bg-zen-sand text-zen-muted cursor-not-allowed'
                  : 'bg-zen-bark text-white hover:bg-zen-bark/90 active:scale-[0.98]'
              }`}
            >
              {added ? (
                <><Check size={16} /> Ajouté !</>
              ) : isOutOfStock ? (
                'Rupture de stock'
              ) : (
                <><ShoppingBag size={16} /> Ajouter au panier</>
              )}
            </button>

            <button className="w-12 h-12 flex items-center justify-center border border-zen-sand rounded-lg hover:border-zen-terracotta hover:text-zen-terracotta transition-colors">
              <Heart size={18} className="text-zen-bark" />
            </button>
          </div>

          <p className="text-xs text-zen-muted text-center mb-8">
            Total : <strong className="text-zen-bark">{((product.retailPriceEur ?? 0) * qty).toFixed(2)} €</strong> · TVA incluse
          </p>

          {/* Réassurance */}
          <div className="border-t border-zen-sand pt-6 space-y-3">
            {[
              { icon: Truck, text: 'Livraison offerte dès 59 € — 3 à 5 jours ouvrés' },
              { icon: RotateCcw, text: 'Retours gratuits sous 30 jours' },
              { icon: Shield, text: 'Paiement 100% sécurisé — Bancontact, Visa, PayPal' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-zen-muted">
                <Icon size={16} className="text-zen-sage flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl text-zen-bark mb-6">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
