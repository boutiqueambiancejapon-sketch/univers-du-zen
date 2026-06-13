'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, ChevronDown, Truck, ArrowLeft } from 'lucide-react';
import { computeShipping } from '@/lib/shipping';
import { computeVat } from '@/lib/vat';
import { PAYMENT_METHODS_BY_LOCALE } from '@/lib/mollie';

const COUNTRIES = [
  { code: 'BE', name: 'Belgique' },
  { code: 'FR', name: 'France' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'NL', name: 'Pays-Bas' },
  { code: 'DE', name: 'Allemagne' },
];

const METHOD_LABELS: Record<string, { label: string; icon: string }> = {
  bancontact: { label: 'Bancontact',    icon: '🇧🇪' },
  creditcard: { label: 'Carte bancaire', icon: '💳' },
  paypal:     { label: 'PayPal',        icon: '🅿️' },
  ideal:      { label: 'iDEAL',         icon: '🇳🇱' },
};

function localeToCountry(locale: string): string {
  if (locale.includes('BE')) return 'BE';
  if (locale.includes('FR')) return 'FR';
  if (locale.includes('NL')) return 'NL';
  return 'BE';
}

export default function CheckoutPage() {
  const locale = useLocale();
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [method, setMethod]   = useState('');

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', phone: '',
    line1: '', line2: '', postalCode: '', city: '',
    countryCode: localeToCountry(locale),
  });

  const methods    = PAYMENT_METHODS_BY_LOCALE[locale] ?? ['creditcard'];
  const subtotal   = total();
  const shipping   = computeShipping(form.countryCode, subtotal);
  const orderTotal = subtotal + shipping;
  const vat        = computeVat(orderTotal, form.countryCode);

  useEffect(() => {
    if (!method && methods.length > 0) setMethod(methods[0]);
  }, [locale]); // eslint-disable-line

  useEffect(() => {
    if (items.length === 0) router.replace(`/${locale}/boutique`);
  }, [items.length]); // eslint-disable-line

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!method) { setError('Veuillez choisir un mode de paiement.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId:    i.product.id,
            sku:          i.product.slug,
            nameFr:       i.product.nameFr,
            quantity:     i.quantity,
            unitPriceEur: i.product.retailPriceEur,
            totalEur:     (i.product.retailPriceEur ?? 0) * i.quantity,
          })),
          shippingAddress: {
            firstName:   form.firstName,
            lastName:    form.lastName,
            line1:       form.line1,
            line2:       form.line2 || undefined,
            city:        form.city,
            postalCode:  form.postalCode,
            countryCode: form.countryCode,
            phone:       form.phone || undefined,
          },
          email:         form.email,
          countryCode:   form.countryCode,
          locale,
          paymentMethod: method,
          subtotalEur:   subtotal,
          shippingEur:   shipping,
          totalEur:      orderTotal,
          vatRate:       vat.vatRate,
          vatAmountEur:  vat.vatAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur de paiement');
      clearCart();
      window.location.href = data.checkoutUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-sans text-zen-bark placeholder-gray-300 focus:outline-none focus:border-zen-bark bg-white transition-colors';
  const labelClass = 'block text-xs font-sans font-medium text-zen-muted mb-1.5 uppercase tracking-wide';

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">

        <Link
          href={`/${locale}/panier`}
          className="flex items-center gap-2 text-sm text-zen-muted hover:text-zen-bark font-sans mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Retour au panier
        </Link>

        <h1 className="font-serif text-4xl text-zen-bark mb-10">Finaliser la commande</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

            {/* Left: form */}
            <div className="lg:col-span-2 space-y-6">

              {/* Contact */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="font-serif text-xl text-zen-bark mb-6">Informations de contact</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Email *</label>
                    <input type="email" required value={form.email} onChange={set('email')} className={inputClass} placeholder="votre@email.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Téléphone</label>
                    <input type="tel" value={form.phone} onChange={set('phone')} className={inputClass} placeholder="+32 4xx xx xx xx" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="font-serif text-xl text-zen-bark mb-6">Adresse de livraison</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Prénom *</label>
                    <input required value={form.firstName} onChange={set('firstName')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Nom *</label>
                    <input required value={form.lastName} onChange={set('lastName')} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Adresse *</label>
                    <input required value={form.line1} onChange={set('line1')} className={inputClass} placeholder="Rue et numéro" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Complément</label>
                    <input value={form.line2} onChange={set('line2')} className={inputClass} placeholder="Appartement, boîte…" />
                  </div>
                  <div>
                    <label className={labelClass}>Code postal *</label>
                    <input required value={form.postalCode} onChange={set('postalCode')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Ville *</label>
                    <input required value={form.city} onChange={set('city')} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Pays *</label>
                    <div className="relative">
                      <select value={form.countryCode} onChange={set('countryCode')} className={`${inputClass} appearance-none pr-10`}>
                        {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                      <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-zen-muted pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="font-serif text-xl text-zen-bark mb-6">Mode de paiement</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {methods.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`border rounded-xl p-4 text-sm font-sans text-left transition-all flex items-center gap-3 ${
                        method === m
                          ? 'border-zen-bark bg-zen-bark/5 text-zen-bark font-medium'
                          : 'border-gray-200 text-zen-muted hover:border-zen-bark/40'
                      }`}
                    >
                      <span className="text-xl">{METHOD_LABELS[m]?.icon}</span>
                      <span>{METHOD_LABELS[m]?.label ?? m}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm font-sans text-red-600">
                  {error}
                </div>
              )}
            </div>

            {/* Right: order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 sticky top-24 space-y-6">
                <h2 className="font-serif text-xl text-zen-bark">Votre commande</h2>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 relative overflow-hidden">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.nameFr ?? ''}
                            fill
                            className="object-contain p-1"
                            unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-sans text-zen-bark leading-snug line-clamp-2">{product.nameFr}</p>
                        <p className="text-xs text-zen-muted mt-0.5">× {quantity}</p>
                      </div>
                      <p className="text-sm font-sans font-semibold text-zen-bark flex-shrink-0">
                        {((product.retailPriceEur ?? 0) * quantity).toFixed(2).replace('.', ',')} €
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 text-sm font-sans">
                  <div className="flex justify-between text-zen-muted">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
                  </div>
                  <div className="flex justify-between text-zen-muted">
                    <span>Livraison</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'Offerte' : `${shipping.toFixed(2).replace('.', ',')} €`}
                    </span>
                  </div>
                  <div className="flex justify-between text-zen-muted text-xs">
                    <span>TVA ({(vat.vatRate * 100).toFixed(0)}%)</span>
                    <span>{vat.vatAmount.toFixed(2).replace('.', ',')} €</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                  <span className="font-sans font-medium text-zen-bark">Total TTC</span>
                  <span className="font-serif font-bold text-zen-bark text-2xl">
                    {orderTotal.toFixed(2).replace('.', ',')} €
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="flex items-center gap-2 text-xs text-zen-muted font-sans bg-gray-50 rounded-xl p-3">
                    <Truck size={13} />
                    <span>Livraison offerte dès 59 € d’achat</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full bg-zen-terracotta text-white font-sans font-medium py-4 rounded-xl hover:bg-zen-terracotta/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Lock size={15} />
                  {loading ? 'Redirection…' : 'Payer en sécurité'}
                </button>

                <p className="text-xs text-zen-muted font-sans text-center">
                  Paiement sécurisé · SSL 256 bits · Données protégées
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
