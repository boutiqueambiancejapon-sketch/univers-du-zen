'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lock, ShoppingBag, Truck, ChevronRight,
  Check, AlertCircle, ArrowLeft, Package,
  CreditCard, Building2, Smartphone,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { getVatRate } from '@/lib/vat';

/* ─── Seuil livraison gratuite ────────────────── */
const FREE_SHIPPING_THRESHOLD = 59;
const SHIPPING_COST = 4.95;

/* ─── Méthodes de paiement (marché belge + FR) ───────── */
const PAYMENT_METHODS = [
  {
    id: 'bancontact',
    label: 'Bancontact',
    sub: 'Le paiement préféré en Belgique',
    Icon: () => (
      <svg viewBox="0 0 48 32" className="h-7 w-auto" aria-hidden>
        <rect width="48" height="32" rx="4" fill="#005498"/>
        <rect x="0" y="10" width="48" height="12" fill="#F0A500"/>
        <rect x="0" y="10" width="48" height="6" fill="#000"/>
        <text x="24" y="28" textAnchor="middle" fill="white" fontSize="7" fontFamily="sans-serif" fontWeight="bold">Bancontact</text>
      </svg>
    ),
  },
  {
    id: 'creditcard',
    label: 'Carte bancaire',
    sub: 'Visa, Mastercard, American Express',
    Icon: () => <CreditCard size={28} className="text-zen-bark" />,
  },
  {
    id: 'paypal',
    label: 'PayPal',
    sub: 'Paiement rapide et sécurisé',
    Icon: () => (
      <svg viewBox="0 0 80 20" className="h-6 w-auto" aria-hidden>
        <text x="0" y="16" fontSize="16" fontWeight="bold" fill="#003087" fontFamily="sans-serif">Pay</text>
        <text x="32" y="16" fontSize="16" fontWeight="bold" fill="#009CDE" fontFamily="sans-serif">Pal</text>
      </svg>
    ),
  },
  {
    id: 'applepay',
    label: 'Apple Pay',
    sub: 'Paiement instantané sur Safari',
    Icon: () => <Smartphone size={26} className="text-zen-bark" />,
  },
  {
    id: 'klarnapaylater',
    label: 'Klarna — Payer plus tard',
    sub: 'Recevez maintenant, payez dans 30 jours',
    Icon: () => (
      <svg viewBox="0 0 60 20" className="h-6 w-auto" aria-hidden>
        <rect width="60" height="20" rx="3" fill="#FFB3C7"/>
        <text x="30" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#17120E" fontFamily="sans-serif">Klarna</text>
      </svg>
    ),
  },
  {
    id: 'banktransfer',
    label: 'Virement bancaire',
    sub: 'Délai de traitement : 1–2 jours ouvrés',
    Icon: () => <Building2 size={26} className="text-zen-bark" />,
  },
];

/* ─── Types ───────────────────── */
interface Field {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

const INITIAL_FORM: Field = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',
  country: 'BE',
};

/* ─── Helpers ────────────────── */
function fmt(n: number) {
  return n.toFixed(2).replace('.', ',');
}

/* ─── Composant principal ────────────── */
export default function CheckoutClient() {
  const locale    = useLocale();
  const items     = useCartStore(s => s.items);
  const getTotal  = useCartStore(s => s.total);
  const clearCart = useCartStore(s => s.clearCart);

  const [form, setForm]     = useState<Field>(INITIAL_FORM);
  const [method, setMethod] = useState('bancontact');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal    = getTotal();
  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping    = shippingFree ? 0 : SHIPPING_COST;
  const total       = subtotal + shipping;

  /* ── Panier vide ─── */
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-zen-beige flex items-center justify-center">
          <ShoppingBag size={28} className="text-zen-bark" />
        </div>
        <div>
          <h1 className="font-serif text-2xl text-zen-bark mb-2">Votre panier est vide</h1>
          <p className="text-zen-muted text-sm">Ajoutez des produits avant de procéder au paiement.</p>
        </div>
        <Link href={`/${locale}/boutique`}
          className="inline-flex items-center gap-2 bg-zen-bark text-white font-sans font-medium px-6 py-3 rounded-xl hover:bg-zen-terracotta transition-colors text-sm">
          <ArrowLeft size={15} /> Continuer mes achats
        </Link>
      </div>
    );
  }

  /* ── Validation ─── */
  function validate(): string | null {
    if (!form.email.includes('@')) return 'Email invalide.';
    if (!form.firstName.trim())   return 'Prénom requis.';
    if (!form.lastName.trim())    return 'Nom requis.';
    if (!form.address.trim())     return 'Adresse requise.';
    if (!form.postalCode.trim())  return 'Code postal requis.';
    if (!form.city.trim())        return 'Ville requise.';
    return null;
  }

  /* ── Soumission ─── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setError('');
    setLoading(true);

    try {
      const vatRate   = getVatRate(form.country);
      const vatAmount = Math.round((total - total / (1 + vatRate)) * 100) / 100;

      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:         form.email,
          locale,
          paymentMethod: method,
          countryCode:   form.country,
          shippingAddress: {
            firstName:   form.firstName,
            lastName:    form.lastName,
            phone:       form.phone,
            line1:       form.address,
            city:        form.city,
            postalCode:  form.postalCode,
            countryCode: form.country,
          },
          items: items.map(i => ({
            productId: i.product.id,
            name:      i.product.nameFr ?? '',
            quantity:  i.quantity,
            price:     i.product.retailPriceEur,
          })),
          subtotalEur:  Math.round(subtotal * 100) / 100,
          shippingEur:  Math.round(shipping * 100) / 100,
          totalEur:     Math.round(total * 100) / 100,
          vatRate,
          vatAmountEur: vatAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        setError(data.error ?? 'Une erreur est survenue. Veuillez réessayer.');
        return;
      }

      clearCart();
      window.location.href = data.checkoutUrl;
    } catch {
      setError('Impossible de contacter le serveur de paiement. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }

  function field(key: keyof Field, v: string) {
    setForm(prev => ({ ...prev, [key]: v }));
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* ── Header ─── */}
      <header className="bg-white border-b border-zen-sand">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="font-serif text-xl text-zen-bark tracking-wide">
            Univers du Zen
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-sans text-zen-muted">
            <Lock size={12} className="text-zen-sage" />
            Paiement 100% sécurisé
          </div>
        </div>
      </header>

      {/* ── Fil d'Ariane ─── */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-1.5 text-xs font-sans text-zen-muted">
        <Link href={`/${locale}/boutique`} className="hover:text-zen-bark transition-colors">Boutique</Link>
        <ChevronRight size={11} />
        <Link href={`/${locale}/boutique`} className="hover:text-zen-bark transition-colors">Panier</Link>
        <ChevronRight size={11} />
        <span className="text-zen-bark font-medium">Paiement</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">

        {/* ══ FORMULAIRE ══ */}
        <div>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* Contact */}
            <section className="bg-white rounded-2xl border border-zen-sand p-6">
              <h2 className="font-serif text-xl text-zen-bark mb-5">Contact</h2>
              <div className="space-y-4">
                <InputField label="Email *" type="email" value={form.email}
                  onChange={v => field('email', v)} placeholder="votre@email.com" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Prénom *" value={form.firstName}
                    onChange={v => field('firstName', v)} placeholder="Sophie" />
                  <InputField label="Nom *" value={form.lastName}
                    onChange={v => field('lastName', v)} placeholder="Dupont" />
                </div>
                <InputField label="Téléphone" type="tel" value={form.phone}
                  onChange={v => field('phone', v)} placeholder="+32 470 00 00 00" />
              </div>
            </section>

            {/* Adresse */}
            <section className="bg-white rounded-2xl border border-zen-sand p-6">
              <h2 className="font-serif text-xl text-zen-bark mb-5">Adresse de livraison</h2>
              <div className="space-y-4">
                <InputField label="Rue et numéro *" value={form.address}
                  onChange={v => field('address', v)} placeholder="Rue de la Paix 12" />
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <InputField label="Code postal *" value={form.postalCode}
                      onChange={v => field('postalCode', v)} placeholder="1000" />
                  </div>
                  <div className="col-span-3">
                    <InputField label="Ville *" value={form.city}
                      onChange={v => field('city', v)} placeholder="Bruxelles" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-zen-bark mb-1.5">Pays</label>
                  <select value={form.country} onChange={e => field('country', e.target.value)}
                    className="w-full rounded-xl border border-zen-sand px-4 py-3 text-sm font-sans text-zen-bark bg-white focus:outline-none focus:ring-2 focus:ring-zen-bark/20 focus:border-zen-bark transition-colors">
                    <option value="BE">🇧🇪 Belgique</option>
                    <option value="FR">🇫🇷 France</option>
                    <option value="NL">🇳🇱 Pays-Bas</option>
                    <option value="LU">🇱🇺 Luxembourg</option>
                    <option value="DE">🇩🇪 Allemagne</option>
                    <option value="CH">🇨🇭 Suisse</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Méthode de paiement */}
            <section className="bg-white rounded-2xl border border-zen-sand p-6">
              <h2 className="font-serif text-xl text-zen-bark mb-5">Méthode de paiement</h2>
              <div className="space-y-2.5">
                {PAYMENT_METHODS.map(pm => {
                  const isSelected = method === pm.id;
                  return (
                    <label key={pm.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-zen-bark bg-zen-bark/5' : 'border-zen-sand hover:border-zen-bark/40 bg-white'
                      }`}>
                      <input type="radio" name="paymentMethod" value={pm.id}
                        checked={isSelected} onChange={() => setMethod(pm.id)} className="sr-only" />
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-zen-bark' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-zen-bark" />}
                      </div>
                      <div className="w-10 flex items-center justify-center flex-shrink-0">
                        <pm.Icon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-sans font-semibold text-zen-bark">{pm.label}</p>
                        {pm.sub && <p className="text-xs text-zen-muted mt-0.5">{pm.sub}</p>}
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Erreur */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 font-sans">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
                {error}
              </div>
            )}

            {/* CTA */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-zen-bark text-white font-sans font-semibold py-4 px-8 rounded-2xl text-base hover:bg-zen-terracotta active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Redirection vers Mollie…
                </>
              ) : (
                <><Lock size={16} /> Commander — {fmt(total)} € <ChevronRight size={16} /></>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs font-sans text-zen-muted">
              <Lock size={11} className="text-zen-sage" />
              Paiement sécurisé SSL • Fourni par Mollie
            </div>
          </form>
        </div>

        {/* ══ RÉSUMÉ COMMANDE ══ */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <div className="bg-white rounded-2xl border border-zen-sand p-6">
            <h2 className="font-serif text-xl text-zen-bark mb-5 flex items-center gap-2">
              <Package size={18} className="text-zen-terracotta" /> Votre commande
            </h2>

            <div className="space-y-4 mb-5">
              {items.map(({ product, quantity }) => {
                const img   = product.images?.[0];
                const name  = product.nameFr ?? '—';
                const price = (product.retailPriceEur ?? 0) * quantity;
                return (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-zen-sand">
                      {img ? (
                        <Image src={img} alt={name} fill className="object-cover"
                          unoptimized={img.startsWith('https://raw.github')} />
                      ) : (
                        <div className="w-full h-full bg-zen-sand/60" />
                      )}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zen-bark text-white text-[12px] font-bold flex items-center justify-center">
                        {quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-medium text-zen-bark leading-snug line-clamp-2">{name}</p>
                    </div>
                    <p className="font-serif font-semibold text-zen-bark text-sm flex-shrink-0">{fmt(price)} €</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-zen-sand pt-4 space-y-2.5">
              <div className="flex justify-between text-sm font-sans text-zen-muted">
                <span>Sous-total</span><span>{fmt(subtotal)} €</span>
              </div>
              <div className="flex justify-between text-sm font-sans items-center">
                <span className="flex items-center gap-1.5 text-zen-muted"><Truck size={13} /> Livraison</span>
                {shippingFree
                  ? <span className="text-green-600 font-medium font-sans text-sm">Gratuite 🎉</span>
                  : <span className="text-zen-bark font-sans text-sm">{fmt(SHIPPING_COST)} €</span>}
              </div>
              {!shippingFree && (
                <p className="text-[12px] font-sans text-zen-muted bg-zen-beige rounded-lg px-3 py-2">
                  Plus que <strong className="text-zen-terracotta">{fmt(FREE_SHIPPING_THRESHOLD - subtotal)} €</strong> pour la livraison gratuite
                </p>
              )}
            </div>

            <div className="border-t border-zen-sand mt-4 pt-4 flex justify-between items-baseline">
              <span className="font-serif text-lg text-zen-bark">Total</span>
              <span className="font-serif text-2xl font-bold text-zen-bark">{fmt(total)} €</span>
            </div>
            <p className="text-[12px] font-sans text-zen-muted text-center mt-1">TVA incluse</p>
          </div>

          {/* Badges confiance */}
          <div className="bg-white rounded-2xl border border-zen-sand p-5 space-y-3">
            {[
              { Icon: Lock,  text: 'Paiement 100% sécurisé (SSL)' },
              { Icon: Truck, text: 'Livraison offerte dès 59 €' },
              { Icon: Check, text: 'Retour sous 30 jours garanti' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm font-sans text-zen-muted">
                <Icon size={15} className="text-zen-sage flex-shrink-0" /> {text}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-[12px] font-sans text-zen-muted">
            <Lock size={10} className="text-zen-sage" />
            Paiement sécurisé et fourni par Mollie
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── InputField ─────────────────── */
function InputField({
  label, value, onChange, placeholder = '', type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-sans font-medium text-zen-bark mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-zen-sand px-4 py-3 text-sm font-sans text-zen-bark placeholder:text-zen-muted/60 bg-white focus:outline-none focus:ring-2 focus:ring-zen-bark/20 focus:border-zen-bark transition-colors" />
    </div>
  );
}
