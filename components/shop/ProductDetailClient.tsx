'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  ShoppingBag, Heart, Star, Leaf, Shield, Truck,
  RotateCcw, Check, ChevronDown, ChevronUp,
  Plus, Minus, ChevronRight, Package,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import ProductCard from './ProductCard';
import BundleBuilder from './BundleBuilder';
import type { DemoProduct } from '@/lib/demo-products';

const CATEGORY_LABELS: Record<string, string> = {
  'huiles-fragrance':           'Huiles de Fragrance',
  'aromatherapie':              'Aromathérapie',
  'encens-rituels':             'Encens & Rituels',
  'cristaux-lithotherapie':     'Cristaux & Lithothérapie',
  'bougies-photophores':        'Bougies & Lumières',
  'bien-etre-corps':            'Bien-être Corps',
  'deco-maison-zen':            'Déco & Maison Zen',
  'the-tisanes':                'Thé & Tisanes',
  'instruments-sonotherapie':   'Instruments & Sonothérapie',
  'bijoux-cristaux':            'Bijoux & Cristaux Portés',
};

const VOLUME_TIERS = [
  { qty: 2, discount: 0.10, label: '2 exemplaires', badge: '-10%', color: 'bg-zen-terracotta/10 text-zen-terracotta' },
  { qty: 3, discount: 0.15, label: '3 exemplaires', badge: '-15%', color: 'bg-zen-terracotta/20 text-zen-terracotta' },
  { qty: 5, discount: 0.20, label: '5 exemplaires', badge: '-20%', color: 'bg-zen-terracotta text-white' },
];

const DEMO_REVIEWS = [
  {
    initials: 'SL', name: 'Sophie L.', rating: 5, date: 'mai 2026',
    text: "Qualité exceptionnelle, le parfum est exactement comme décrit. Livraison rapide et emballage soigné. Je recommande les yeux fermés !",
  },
  {
    initials: 'MA', name: 'Marc A.', rating: 4, date: 'avril 2026',
    text: "Très bon produit, correspond à la description. Petit moins : la notice est uniquement en anglais. Mais la qualité est au rendez-vous.",
  },
];

function getDeliveryDate(): string {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setHours(14, 0, 0, 0);
  const start = new Date(now);
  if (now >= cutoff) start.setDate(start.getDate() + 1);
  while (start.getDay() === 0 || start.getDay() === 6) start.setDate(start.getDate() + 1);
  const delivery = new Date(start);
  let added = 0;
  while (added < 3) {
    delivery.setDate(delivery.getDate() + 1);
    if (delivery.getDay() !== 0 && delivery.getDay() !== 6) added++;
  }
  return delivery.toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

type TabKey = 'description' | 'caracteristiques' | 'usage' | 'faq';

interface Props {
  product: DemoProduct;
  related: DemoProduct[];
  /** All published products — used as the BundleBuilder pool. */
  allProducts?: DemoProduct[];
}

export default function ProductDetailClient({ product, related, allProducts = [] }: Props) {
  const locale = useLocale();
  const addItem = useCartStore(s => s.addItem);
  const [qty, setQty] = useState(1);
  const [volumeTierIdx, setVolumeTierIdx] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>('description');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [viewers, setViewers] = useState(0);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const images = product.images?.length ? product.images : ['/images/udz-hero-homepage.jpeg'];
  const basePrice = product.retailPriceEur ?? 0;
  const discount = product.compareAtPriceEur
    ? Math.round((1 - basePrice / product.compareAtPriceEur) * 100)
    : null;
  const isOutOfStock = product.stockStatus === 'OutOfStock';
  const isLow = product.stockStatus === 'Low';
  const isVeryLow = product.stockStatus === 'VeryLow';

  const activeTier = volumeTierIdx !== null ? VOLUME_TIERS[volumeTierIdx] : null;
  const effectiveQty = activeTier ? activeTier.qty : qty;
  const effectiveUnitPrice = activeTier ? basePrice * (1 - activeTier.discount) : basePrice;
  const effectiveTotal = effectiveUnitPrice * effectiveQty;

  useEffect(() => {
    setDeliveryDate(getDeliveryDate());
    setViewers(8 + Math.floor(Math.random() * 39));
  }, []);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function handleAddToCart() {
    const productToAdd = activeTier
      ? {
          ...product,
          retailPriceEur: Math.round(effectiveUnitPrice * 100) / 100,
          nameFr: `${product.nameFr} — Lot ×${activeTier.qty} (${activeTier.badge})`,
        }
      : product;
    addItem(productToAdd as any, effectiveQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'description', label: 'Description' },
    { key: 'caracteristiques', label: 'Caractéristiques' },
    { key: 'usage', label: "Conseils d'utilisation" },
    { key: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs font-sans text-zen-muted mb-8 flex flex-wrap gap-1.5 items-center">
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

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* ===== GALLERY ===== */}
        <div className="space-y-3 md:sticky md:top-24 self-start">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-zen-sand">
            <Image src={images[activeImg]} alt={product.nameFr ?? ''} fill className="object-cover" priority />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isBestSeller && <span className="badge-bestseller text-[11px]">Best-seller</span>}
              {discount && <span className="badge-discount text-[11px]">-{discount}%</span>}
            </div>
            <span className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] font-sans px-2 py-1 rounded-full">
              {activeImg + 1}/{images.length}
            </span>
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-zen-bark' : 'border-transparent hover:border-zen-sand'}`}>
                  <Image src={src} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== PRODUCT INFO ===== */}
        <div>
          {product.category && (
            <p className="text-xs font-sans tracking-widest uppercase text-zen-terracotta mb-2">
              {CATEGORY_LABELS[product.category]}
            </p>
          )}

          <h1 className="font-serif text-3xl md:text-4xl text-zen-bark leading-tight mb-3">{product.nameFr}</h1>

          <button className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="flex">
              {[1,2,3,4,5].map(i => <Star key={i} size={14} className={i <= 4 ? 'fill-zen-gold text-zen-gold' : 'fill-zen-sand text-zen-sand'} />)}
            </div>
            <span className="text-sm text-zen-muted underline underline-offset-2">4,8 sur 5 (124 avis)</span>
          </button>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-serif text-4xl text-zen-bark">{basePrice} €</span>
            {product.compareAtPriceEur && <span className="text-xl text-zen-muted line-through">{product.compareAtPriceEur} €</span>}
            {discount && <span className="text-sm font-sans font-semibold text-zen-terracotta bg-zen-terracotta/10 px-2 py-0.5 rounded">Économisez {discount}%</span>}
          </div>

          {product.shortDescriptionFr && (
            <p className="text-zen-muted leading-relaxed mb-5 text-sm">{product.shortDescriptionFr}</p>
          )}

          {product.benefitsFr?.length ? (
            <ul className="space-y-2 mb-5">
              {product.benefitsFr.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zen-bark">
                  <Check size={15} className="text-zen-sage flex-shrink-0 mt-0.5" />{b}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex gap-2 flex-wrap mb-5">
            {product.isVegan && (
              <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-sans">
                <Leaf size={11} /> Végan
              </span>
            )}
            {product.isCrueltyFree && (
              <span className="flex items-center gap-1 text-xs bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full font-sans">
                ♥ Sans test animal
              </span>
            )}
            {product.isOrganic && (
              <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-sans">
                <Leaf size={11} /> Bio certifié
              </span>
            )}
          </div>

          {/* ===== SOCIAL PROOF — viewers ===== */}
          {viewers > 0 && !isOutOfStock && (
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="pulse-dot absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#C1714A' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#C1714A' }} />
              </span>
              <p className="text-xs font-sans" style={{ color: '#9a8878' }}>
                <strong className="text-zen-bark">{viewers} personnes</strong> regardent ce produit en ce moment
              </p>
            </div>
          )}

          {/* ===== STOCK URGENCY BADGE ===== */}
          {isVeryLow && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ background: '#FEF3F0', border: '1px solid #FECDB9' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0 pulse-dot" style={{ background: '#C1714A' }} />
              <p className="text-xs font-sans font-semibold" style={{ color: '#9B3D1A' }}>
                Presque épuisé — plus que {product.stockQty ?? 'quelques'} en stock
              </p>
            </div>
          )}
          {isLow && !isVeryLow && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
              <p className="text-xs font-sans font-semibold text-amber-800">
                Stock limité — commandez avant rupture
              </p>
            </div>
          )}

          {/* ===== VOLUME PRICING ===== */}
          {!isOutOfStock && (
            <div className="border border-zen-sand rounded-2xl overflow-hidden mb-5">
              <div className="flex items-center gap-2.5 px-5 py-3.5 bg-zen-beige border-b border-zen-sand">
                <Package size={16} className="text-zen-bark flex-shrink-0" />
                <p className="text-sm font-sans font-semibold text-zen-bark">Achetez en lot, économisez</p>
              </div>
              <div className="divide-y divide-zen-sand">
                {VOLUME_TIERS.map((tier, i) => {
                  const unitPrice = basePrice * (1 - tier.discount);
                  const totalPrice = unitPrice * tier.qty;
                  const isSelected = volumeTierIdx === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setVolumeTierIdx(isSelected ? null : i)}
                      className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-colors ${
                        isSelected ? 'bg-zen-bark/5' : 'hover:bg-zen-beige/60'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-zen-bark' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-zen-bark" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-sans font-semibold text-zen-bark">{tier.label}</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${tier.color}`}>{tier.badge}</span>
                        </div>
                        <p className="text-xs text-zen-muted font-sans">
                          {unitPrice.toFixed(2).replace('.', ',')} € / unité
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-serif font-bold text-zen-bark text-base">{totalPrice.toFixed(2).replace('.', ',')} €</p>
                        <p className="text-[10px] text-zen-muted font-sans">
                          économie {(basePrice * tier.discount * tier.qty).toFixed(2).replace('.', ',')} €
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery estimate */}
          {!isOutOfStock && deliveryDate && (
            <div className="border border-zen-sand rounded-xl p-4 mb-5 flex items-center gap-4 bg-white hover:border-zen-bark/30 transition-colors cursor-default">
              <div className="w-10 h-10 rounded-lg bg-zen-beige flex items-center justify-center flex-shrink-0">
                <Truck size={20} className="text-zen-bark" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans font-semibold text-zen-bark">Livré chez vous dès le {deliveryDate}</p>
                <p className="text-sm font-sans flex items-center gap-1.5 mt-0.5 text-green-600">
                  <span className="w-2 h-2 rounded-full inline-block flex-shrink-0 bg-green-500" />
                  En stock — expédié sous 24h
                </p>
              </div>
              <ChevronRight size={16} className="text-zen-muted flex-shrink-0" />
            </div>
          )}

          {isOutOfStock && (
            <div className="border border-red-100 rounded-xl p-4 mb-5 flex items-center gap-4 bg-red-50">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Truck size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-sans font-semibold text-red-600">Rupture de stock</p>
                <p className="text-xs text-red-400 mt-0.5">Inscrivez-vous pour être averti du réapprovisionnement</p>
              </div>
            </div>
          )}

          {/* Qty + CTA */}
          <div className="flex items-center gap-3 mb-3">
            {!activeTier ? (
              <div className="flex items-center border border-zen-sand rounded-xl overflow-hidden flex-shrink-0">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-11 h-12 flex items-center justify-center text-zen-bark hover:bg-zen-beige transition-colors" aria-label="Diminuer">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-sans text-zen-bark font-semibold text-sm">{qty}</span>
                <button onClick={() => setQty(q => Math.min(99, q + 1))}
                  className="w-11 h-12 flex items-center justify-center text-zen-bark hover:bg-zen-beige transition-colors" aria-label="Augmenter">
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-[88px] h-12 rounded-xl bg-zen-bark text-white font-sans font-semibold text-sm flex-shrink-0">
                ×{activeTier.qty}
              </div>
            )}

            <button
              ref={ctaRef}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-sans font-semibold text-sm transition-all ${
                added ? 'bg-green-600 text-white'
                : isOutOfStock ? 'bg-zen-sand text-zen-muted cursor-not-allowed'
                : 'bg-zen-bark text-white hover:bg-zen-terracotta active:scale-[0.98]'
              }`}
            >
              {added ? (
                <><Check size={16} /> Ajouté au panier ! 🎉</>
              ) : isOutOfStock ? 'Rupture de stock' : (
                <><ShoppingBag size={16} /> Ajouter au panier</>
              )}
            </button>

            <button
              className="w-12 h-12 flex items-center justify-center border border-zen-sand rounded-xl hover:border-zen-terracotta hover:text-zen-terracotta transition-colors flex-shrink-0"
              aria-label="Ajouter aux favoris"
            >
              <Heart size={18} className="text-zen-bark" />
            </button>
          </div>

          <p className="text-xs text-zen-muted text-center mb-6">
            Total :{' '}
            <strong className="text-zen-bark">
              {effectiveTotal.toFixed(2).replace('.', ',')} €
            </strong>{' '}
            TVA incluse
            {activeTier && (
              <span className="ml-2 text-zen-terracotta font-semibold">
                (économie {(basePrice * activeTier.discount * activeTier.qty).toFixed(2).replace('.', ',')} €)
              </span>
            )}
          </p>

          {/* Trust strip */}
          <div className="border-t border-zen-sand pt-5 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'Livraison offerte', sub: 'dès 59 €' },
              { icon: RotateCcw, label: 'Retours 30 jours', sub: 'satisfait ou remboursé' },
              { icon: Shield, label: 'Paiement sécurisé', sub: 'Bancontact, Visa, PayPal' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <Icon size={18} className="text-zen-sage" />
                <p className="text-xs font-sans font-semibold text-zen-bark leading-tight">{label}</p>
                <p className="text-[10px] text-zen-muted leading-tight">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="mt-16">
        <div className="flex gap-0 border-b border-zen-sand overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-shrink-0 px-5 py-3 text-sm font-sans font-medium border-b-2 transition-colors ${
                activeTab === t.key ? 'border-zen-bark text-zen-bark' : 'border-transparent text-zen-muted hover:text-zen-bark'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="py-8 max-w-3xl">
          {activeTab === 'description' && (
            <div className="space-y-4 text-zen-muted leading-relaxed text-sm">
              {(product.longDescriptionFr ?? product.descriptionFr ?? '').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}
          {activeTab === 'caracteristiques' && (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-zen-sand">
                {product.characteristics?.map(({ label, value }) => (
                  <tr key={label}>
                    <td className="py-3 pr-6 font-sans font-medium text-zen-bark w-40">{label}</td>
                    <td className="py-3 text-zen-muted">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'usage' && <p className="text-sm text-zen-muted leading-relaxed">{product.usageFr}</p>}
          {activeTab === 'faq' && (
            <div className="space-y-2">
              {product.faqFr?.map((item, i) => (
                <div key={i} className="border border-zen-sand rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm font-sans font-medium text-zen-bark hover:bg-zen-beige transition-colors">
                    {item.question}
                    {openFaq === i ? <ChevronUp size={16} className="flex-shrink-0 text-zen-muted" /> : <ChevronDown size={16} className="flex-shrink-0 text-zen-muted" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-zen-muted leading-relaxed border-t border-zen-sand pt-3">{item.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== REVIEWS ===== */}
      <section id="reviews" className="mt-12 pt-8 border-t border-zen-sand">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl text-zen-bark mb-1">Avis clients</h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i <= 4 ? 'fill-zen-gold text-zen-gold' : 'fill-zen-sand text-zen-sand'} />)}
              </div>
              <span className="font-serif text-2xl text-zen-bark">4,8</span>
              <span className="text-sm text-zen-muted">124 avis vérifiés</span>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {DEMO_REVIEWS.map((r, i) => (
            <div key={i} className="bg-zen-beige rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-zen-bark text-white flex items-center justify-center text-xs font-sans font-semibold">{r.initials}</div>
                <div>
                  <p className="text-sm font-sans font-semibold text-zen-bark">{r.name}</p>
                  <p className="text-[11px] text-zen-muted">{r.date}</p>
                </div>
                <div className="ml-auto flex">
                  {[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= r.rating ? 'fill-zen-gold text-zen-gold' : 'fill-zen-sand text-zen-sand'} />)}
                </div>
              </div>
              <p className="text-sm text-zen-muted leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BUNDLE BUILDER ===== */}
      {allProducts.length >= BUNDLE_SIZE * 3 && (
        <section className="mt-16 pt-12 border-t border-zen-sand">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-serif text-3xl lg:text-4xl text-zen-bark">Composez votre coffret</h2>
            <span className="text-sm font-sans text-zen-terracotta font-medium">-15% par coffret</span>
          </div>
          <p className="text-sm font-sans text-zen-muted mb-10 max-w-xl">
            Associez ce produit à d'autres favoris. Décochez ce que vous ne voulez pas, cliquez sur ↻ pour de nouvelles suggestions.
          </p>
          <BundleBuilder products={allProducts} />
        </section>
      )}

      {/* ===== RELATED PRODUCTS ===== */}
      {related.length > 0 && (
        <section className="mt-16 pt-12 border-t border-zen-sand">
          <h2 className="font-serif text-3xl text-zen-bark mb-8">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {related.map(p => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </section>
      )}

      {/* ===== STICKY BAR — all screens ===== */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ background: 'rgba(252,250,244,.95)', backdropFilter: 'blur(14px)', borderTop: '1px solid rgba(55,44,32,.1)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
          {images[0] && (
            <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={images[0]} alt="" fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zen-muted font-sans line-clamp-1">{product.nameFr}</p>
            <p className="font-serif text-zen-bark font-semibold text-base">{effectiveUnitPrice.toFixed(2).replace('.', ',')} €</p>
          </div>
          {isVeryLow && (
            <span className="hidden sm:block text-xs font-sans font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: '#FEF3F0', color: '#9B3D1A' }}>
              ⚡ Presque épuisé
            </span>
          )}
          <button onClick={handleAddToCart} disabled={isOutOfStock}
            className="flex items-center gap-2 text-white text-sm font-sans font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 flex-shrink-0"
            style={{ background: added ? '#16A34A' : '#C1714A' }}>
            {added ? <Check size={15} /> : <ShoppingBag size={15} />}
            {added ? 'Ajouté !' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  );
}
