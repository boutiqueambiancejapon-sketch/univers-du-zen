'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  ShoppingBag, Leaf, Shield, Truck,
  RotateCcw, Check, ChevronDown, ChevronUp,
  Plus, Minus, ChevronRight, Package,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import ProductCard from './ProductCard';
import BundleBuilder from './BundleBuilder';
import type { DemoProduct } from '@/lib/demo-products';

const BUNDLE_MIN_POOL = 9;

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

/** Extrait le volume depuis le nom du produit (ex. "100ml", "50g", "1L"). */
function extractVolume(name: string): string | null {
  const m = name.match(/(\d+(?:[.,]\d+)?\s*(?:ml|cl|l|g|kg|L))/i);
  return m ? m[1] : null;
}

/**
 * Génère des caractéristiques automatiques depuis les champs disponibles.
 * Complétées par les données explicites si le pipeline les a poussées.
 */
function buildCharacteristics(product: DemoProduct): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];

  // Caractéristiques explicites du pipeline (prioritaires)
  if ((product as any).characteristics?.length) {
    return (product as any).characteristics;
  }

  // Volume / format extrait du nom
  const vol = product.nameFr ? extractVolume(product.nameFr) : null;
  if (vol) rows.push({ label: 'Format', value: vol });

  // Catégorie
  if (product.category && CATEGORY_LABELS[product.category]) {
    rows.push({ label: 'Catégorie', value: CATEGORY_LABELS[product.category] });
  }

  // Tags → mots-clés produit
  const tags = (product as any).tags as string[] | undefined;
  if (tags?.length) {
    rows.push({ label: 'Mots-clés', value: tags.slice(0, 5).join(', ') });
  }

  // Flags éthiques
  const ethique: string[] = [];
  if (product.isVegan)       ethique.push('Végan');
  if (product.isCrueltyFree) ethique.push('Sans test animal');
  if ((product as any).isOrganic) ethique.push('Bio certifié');
  if (ethique.length) rows.push({ label: 'Engagements', value: ethique.join(' · ') });

  // Conditionnement
  rows.push({ label: 'Contenant', value: 'Flacon recyclable' });
  rows.push({ label: 'Origine', value: 'Sélection Europe & Monde' });
  rows.push({ label: 'Expédition', value: 'Depuis entrepôt européen' });

  return rows;
}

/**
 * FAQ par défaut basée sur la catégorie — remplacée dès que le pipeline
 * pousse des données `faqFr` dans data.json.
 */
function buildFaq(product: DemoProduct): { question: string; answer: string }[] {
  // FAQ explicite du pipeline (prioritaire)
  if ((product as any).faqFr?.length) return (product as any).faqFr;

  const cat = product.category ?? '';

  const FAQ_BY_CAT: Record<string, { question: string; answer: string }[]> = {
    'huiles-fragrance': [
      { question: "Comment utiliser une huile de fragrance ?", answer: "Ajoutez quelques gouttes dans un brûle-parfum, un diffuseur à bâtonnets ou mélangez à de la cire pour vos créations. Évitez l'application directe sur la peau." },
      { question: "Quelle différence avec une huile essentielle ?", answer: "Les huiles de fragrance sont formulées pour la diffusion olfactive et ne possèdent pas les propriétés thérapeutiques des huiles essentielles pures. Elles offrent une plus grande palette de senteurs." },
      { question: "La livraison est-elle rapide ?", answer: "Oui, nous expédions sous 24h depuis notre entrepôt européen. Livraison en 3 à 5 jours ouvrables en Belgique, France et Luxembourg. Livraison offerte dès 59 €." },
    ],
    'aromatherapie': [
      { question: "Comment diluer une huile essentielle ?", answer: "Diluez toujours dans une huile végétale avant application cutanée : 2 % en usage courant (2 gouttes d'HE pour 100 gouttes d'HV). Ne jamais appliquer pure sur une grande surface." },
      { question: "Peut-on diffuser en présence d'enfants ?", answer: "Privilégiez des diffusions courtes (20-30 min) et des huiles douces (lavande, orange douce, mandarine). Évitez certaines huiles (eucalyptus, menthe) avant 7 ans." },
      { question: "Comment conserver mes huiles essentielles ?", answer: "À l'abri de la lumière, de la chaleur et de l'humidité, dans leurs flacons en verre ambré d'origine. Durée de conservation : 3 à 5 ans selon la variété." },
    ],
    'encens-rituels': [
      { question: "Comment bien brûler un bâtonnet d'encens ?", answer: "Allumez l'extrémité, attendez 10 secondes puis soufflez délicatement. Posez sur un porte-encens adapté dans un espace ventilé. Durée : 30 à 60 minutes selon le format." },
      { question: "Le Palo Santo est-il écologique ?", answer: "Notre Palo Santo provient exclusivement de bois tombés naturellement. Aucun arbre n'est abattu. Les arbres doivent reposer au sol 4 ans minimum pour que les huiles s'y développent." },
      { question: "Puis-je utiliser l'encens en appartement ?", answer: "Oui, en aérant légèrement la pièce. Évitez les espaces très confinés ou en présence de personnes asthmatiques. Préférez des encens naturels sans charbon de bois ajouté." },
    ],
    'bougies-photophores': [
      { question: "Comment éviter l'effet tunnel sur ma bougie ?", answer: "Lors de la première utilisation, laissez brûler jusqu'à ce que toute la surface soit fondue (2 à 3h). Coupez la mèche à 5mm avant chaque allumage pour une flamme stable." },
      { question: "La cire de soja est-elle meilleure que la paraffine ?", answer: "Oui : la cire de soja est végétale, biodégradable, brûle 30 à 50 % plus longtemps et ne produit pas de suie. Nos bougies sont 100 % cire de soja sans additif pétroléchimique." },
      { question: "Puis-je réutiliser le contenant après ?", answer: "Absolument ! Remplissez le fond d'eau chaude, retirez la cire résiduelle et nettoyez. Le bocal en verre devient pot à crayon, vase ou rangement cosmétique." },
    ],
  };

  return FAQ_BY_CAT[cat] ?? [
    { question: "La livraison est-elle rapide ?", answer: "Nous expédions sous 24h depuis notre entrepôt européen. Livraison en 3 à 5 jours ouvrables en Belgique, France et Luxembourg. Livraison offerte dès 59 €." },
    { question: "Quels sont les modes de paiement acceptés ?", answer: "Bancontact, Visa, Mastercard, PayPal, Apple Pay et virement bancaire. Paiement 100 % sécurisé via Mollie." },
    { question: "Quelle est la politique de retour ?", answer: "Retours acceptés sous 30 jours, produit non ouvert dans son emballage d'origine. Remboursement intégral sous 5 jours ouvrables dès réception." },
  ];
}

/** Conseils d'utilisation : depuis le pipeline ou générique par catégorie. */
function buildUsage(product: DemoProduct): string {
  if ((product as any).usageFr) return (product as any).usageFr;

  const USAGE_BY_CAT: Record<string, string> = {
    'huiles-fragrance': "Ajoutez 5 à 10 gouttes dans un brûle-parfum, un diffuseur à bâtonnets ou mélangez à de la cire fondue pour créer vos bougies. Pour parfumer une pièce, vaporisez dans l'air ou sur les textiles à 30 cm. Conservez à l'abri de la lumière et de la chaleur.",
    'aromatherapie': "Diffusion : 5 à 10 gouttes dans un diffuseur ultrasonique, 20 à 30 minutes, 2 à 3 fois par jour. Application cutanée : diluez à 2 % dans une huile végétale (2 gouttes d'HE pour 100 gouttes d'huile de base). Inhalation : quelques gouttes sur un mouchoir ou en bol d'eau chaude.",
    'encens-rituels': "Allumez l'extrémité du bâtonnet, laissez prendre 10 secondes puis soufflez. Posez sur un porte-encens en laissant la braise active vers le bas. Brûlez dans un espace ventilé, loin des matières inflammables. Une baguette parfume une pièce de 20 m² pendant 30 à 60 minutes.",
    'bougies-photophores': "Coupez la mèche à 5 mm avant chaque allumage. Lors de la première utilisation, laissez brûler jusqu'à la fusion complète de la surface (2-3h). Ne brûlez jamais plus de 4h consécutives. Posez sur une surface résistante à la chaleur, à l'abri des courants d'air.",
    'cristaux-lithotherapie': "Tenez le cristal dans votre main non-dominante en vous concentrant sur votre intention. Pour la décoration, placez-le dans un espace chargé positivement. Nettoyez régulièrement à la lumière de la lune ou avec de la fumée de Palo Santo. Évitez l'eau pour les pierres tendres (sélénite, lapis-lazuli).",
    'bien-etre-corps': "Appliquez sur peau propre et sèche en massant doucement jusqu'à absorption. Pour un bain, dissolvez dans l'eau chaude avant d'entrer. Rincez si nécessaire. Évitez le contact avec les yeux. Patch test recommandé sur peaux sensibles.",
  };

  return USAGE_BY_CAT[product.category ?? ''] ?? "Suivez les recommandations inscrites sur l'emballage. Conservez à l'abri de la lumière, de la chaleur et de l'humidité. Tenez hors de portée des enfants. En cas de doute, consultez notre service client.";
}

type TabKey = 'description' | 'caracteristiques' | 'usage' | 'faq';

interface Props {
  product: DemoProduct;
  related: DemoProduct[];
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
  const ctaRef = useRef<HTMLButtonElement>(null);

  const images = product.images?.length ? product.images : ['/images/udz-hero-homepage.jpeg'];
  const basePrice = product.retailPriceEur ?? 0;
  const discount = product.compareAtPriceEur
    ? Math.round((1 - basePrice / product.compareAtPriceEur) * 100)
    : null;
  const isOutOfStock = product.stockStatus === 'OutOfStock';
  const isLow       = product.stockStatus === 'Low';
  const isVeryLow   = product.stockStatus === 'VeryLow';

  const activeTier = volumeTierIdx !== null ? VOLUME_TIERS[volumeTierIdx] : null;
  const effectiveQty       = activeTier ? activeTier.qty : qty;
  const effectiveUnitPrice = activeTier ? basePrice * (1 - activeTier.discount) : basePrice;
  const effectiveTotal     = effectiveUnitPrice * effectiveQty;

  // Contenu des onglets — généré automatiquement si le pipeline n'a pas encore enrichi data.json
  const characteristics = buildCharacteristics(product);
  const faqItems        = buildFaq(product);
  const usageText       = buildUsage(product);
  const descText        = (product as any).longDescriptionFr ?? (product as any).descriptionFr ?? '';

  // Les 4 onglets sont TOUJOURS visibles
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'description',    label: 'Description' },
    { key: 'caracteristiques', label: 'Caractéristiques' },
    { key: 'usage',          label: "Conseils d'utilisation" },
    { key: 'faq',            label: 'FAQ' },
  ];

  useEffect(() => {
    setDeliveryDate(getDeliveryDate());
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
      ? { ...product, retailPriceEur: Math.round(effectiveUnitPrice * 100) / 100, nameFr: `${product.nameFr} — Lot ×${activeTier.qty} (${activeTier.badge})` }
      : product;
    addItem(productToAdd as any, effectiveQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

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
              {product.isBestSeller && <span className="badge-bestseller text-[12px]">Best-seller</span>}
              {discount && <span className="badge-discount text-[12px]">-{discount}%</span>}
            </div>
            <span className="absolute bottom-3 right-3 bg-black/40 text-white text-[12px] font-sans px-2 py-1 rounded-full">
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

          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-serif text-4xl text-zen-bark">{basePrice > 0 ? `${basePrice.toFixed(2).replace('.', ',')} €` : '—'}</span>
            {product.compareAtPriceEur && (
              <span className="text-xl text-zen-muted line-through">{product.compareAtPriceEur.toFixed(2).replace('.', ',')} €</span>
            )}
            {discount && (
              <span className="text-sm font-sans font-semibold text-zen-terracotta bg-zen-terracotta/10 px-2 py-0.5 rounded">
                Économisez {discount}%
              </span>
            )}
          </div>

          {(product as any).shortDescriptionFr && (
            <p className="text-zen-muted leading-relaxed mb-5 text-sm">{(product as any).shortDescriptionFr}</p>
          )}

          {(product as any).benefitsFr?.length ? (
            <ul className="space-y-2 mb-5">
              {(product as any).benefitsFr.map((b: string, i: number) => (
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
            {(product as any).isOrganic && (
              <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-sans">
                <Leaf size={11} /> Bio certifié
              </span>
            )}
          </div>

          {isVeryLow && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ background: '#FEF3F0', border: '1px solid #FECDB9' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0 pulse-dot" style={{ background: '#C4714A' }} />
              <p className="text-xs font-sans font-semibold" style={{ color: '#9B3D1A' }}>
                Presque épuisé — plus que {product.stockQty ?? 'quelques'} en stock
              </p>
            </div>
          )}
          {isLow && !isVeryLow && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
              <p className="text-xs font-sans font-semibold text-amber-800">Stock limité — commandez avant rupture</p>
            </div>
          )}

          {/* Volume pricing */}
          {!isOutOfStock && basePrice > 0 && (
            <div className="border border-zen-sand rounded-2xl overflow-hidden mb-5">
              <div className="flex items-center gap-2.5 px-5 py-3.5 bg-zen-beige border-b border-zen-sand">
                <Package size={16} className="text-zen-bark flex-shrink-0" />
                <p className="text-sm font-sans font-semibold text-zen-bark">Achetez en lot, économisez</p>
              </div>
              <div className="divide-y divide-zen-sand">
                {VOLUME_TIERS.map((tier, i) => {
                  const unitPrice  = basePrice * (1 - tier.discount);
                  const totalPrice = unitPrice * tier.qty;
                  const isSelected = volumeTierIdx === i;
                  return (
                    <button key={i} type="button" onClick={() => setVolumeTierIdx(isSelected ? null : i)}
                      className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-colors ${isSelected ? 'bg-zen-bark/5' : 'hover:bg-zen-beige/60'}`}>
                      <div className={`w-4.5 h-4.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'border-zen-bark' : 'border-gray-300'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-zen-bark" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-sans font-semibold text-zen-bark">{tier.label}</span>
                          <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${tier.color}`}>{tier.badge}</span>
                        </div>
                        <p className="text-xs text-zen-muted font-sans">{unitPrice.toFixed(2).replace('.', ',')} € / unité</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-serif font-bold text-zen-bark text-base">{totalPrice.toFixed(2).replace('.', ',')} €</p>
                        <p className="text-[12px] text-zen-muted font-sans">économie {(basePrice * tier.discount * tier.qty).toFixed(2).replace('.', ',')} €</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-12 flex items-center justify-center text-zen-bark hover:bg-zen-beige transition-colors" aria-label="Diminuer"><Minus size={14} /></button>
                <span className="w-10 text-center font-sans text-zen-bark font-semibold text-sm">{qty}</span>
                <button onClick={() => setQty(q => Math.min(99, q + 1))} className="w-11 h-12 flex items-center justify-center text-zen-bark hover:bg-zen-beige transition-colors" aria-label="Augmenter"><Plus size={14} /></button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-[88px] h-12 rounded-xl bg-zen-bark text-white font-sans font-semibold text-sm flex-shrink-0">×{activeTier.qty}</div>
            )}
            <button ref={ctaRef} onClick={handleAddToCart} disabled={isOutOfStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-sans font-semibold text-sm transition-all ${added ? 'bg-green-600 text-white' : isOutOfStock ? 'bg-zen-sand text-zen-muted cursor-not-allowed' : 'bg-zen-bark text-white hover:bg-zen-terracotta active:scale-[0.98]'}`}>
              {added ? (<><Check size={16} /> Ajouté au panier ! 🎉</>) : isOutOfStock ? 'Rupture de stock' : (<><ShoppingBag size={16} /> Ajouter au panier</>)}
            </button>
          </div>

          <p className="text-xs text-zen-muted text-center mb-6">
            Total : <strong className="text-zen-bark">{effectiveTotal.toFixed(2).replace('.', ',')} €</strong> TVA incluse
            {activeTier && <span className="ml-2 text-zen-terracotta font-semibold">(économie {(basePrice * activeTier.discount * activeTier.qty).toFixed(2).replace('.', ',')} €)</span>}
          </p>

          <div className="border-t border-zen-sand pt-5 grid grid-cols-3 gap-3">
            {[
              { icon: Truck,     label: 'Livraison offerte', sub: 'dès 59 €' },
              { icon: RotateCcw, label: 'Retours 30 jours',  sub: 'satisfait ou remboursé' },
              { icon: Shield,    label: 'Paiement sécurisé', sub: 'Bancontact, Visa, PayPal' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <Icon size={18} className="text-zen-sage" />
                <p className="text-xs font-sans font-semibold text-zen-bark leading-tight">{label}</p>
                <p className="text-[12px] text-zen-muted leading-tight">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== TABS — toujours les 4 visibles ===== */}
      <div className="mt-16">
        <div className="flex gap-0 border-b border-zen-sand">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-shrink-0 px-5 py-3 text-sm font-sans font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-zen-bark text-zen-bark' : 'border-transparent text-zen-muted hover:text-zen-bark'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="py-8 max-w-3xl">
          {activeTab === 'description' && (
            <div className="space-y-4 text-zen-muted leading-relaxed text-sm">
              {descText ? (
                descText.split('\n\n').map((block: string, i: number) =>
                  block.startsWith('## ') ? (
                    <h2 key={i} className="font-serif text-lg text-zen-bark mt-2">{block.slice(3)}</h2>
                  ) : (
                    <p key={i}>{block}</p>
                  )
                )
              ) : (
                <p className="italic text-zen-muted/60">Description détaillée disponible prochainement.</p>
              )}
            </div>
          )}

          {activeTab === 'caracteristiques' && (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-zen-sand">
                {characteristics.map(({ label, value }) => (
                  <tr key={label}>
                    <td className="py-3 pr-6 font-sans font-medium text-zen-bark w-44">{label}</td>
                    <td className="py-3 text-zen-muted">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'usage' && (
            <p className="text-sm text-zen-muted leading-relaxed">{usageText}</p>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-2">
              {faqItems.map((item, i) => (
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

      {/* ===== BUNDLE BUILDER ===== */}
      {allProducts.length >= BUNDLE_MIN_POOL && (
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

      {/* ===== STICKY BAR ===== */}
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
            style={{ background: added ? '#16A34A' : '#C4714A' }}>
            {added ? <Check size={15} /> : <ShoppingBag size={15} />}
            {added ? 'Ajouté !' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  );
}
