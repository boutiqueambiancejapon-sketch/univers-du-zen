'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, ChevronDown, Truck, ArrowLeft, Check } from 'lucide-react';
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
  bancontact: { label: 'Bancontact',     icon: '🇧🇪' },
  creditcard: { label: 'Carte bancaire', icon: '💳' },
  paypal:     { label: 'PayPal',         icon: '🅿️' },
  ideal:      { label: 'iDEAL',          icon: '🇳🇱' },
};

function localeToCountry(locale: string): string {
  if (locale.includes('BE')) return 'BE';
  if (locale.includes('FR')) return 'FR';
  if (locale.includes('NL')) return 'NL';
  return 'BE';
}

const inputCls = `w-full px-4 py-3.5 rounded-xl text-sm font-sans transition-all outline-none`
  + ` bg-[#FCFAF4] border border-[rgba(44,36,32,.14)] text-[#2C2420] placeholder-[#9a8878]`
  + ` focus:border-[#C1714A] focus:shadow-[0_0_0_3px_rgba(193,113,74,.12)] focus:bg-white`;

const labelCls = `block text-[10px] font-sans font-semibold uppercase tracking-widest mb-1.5`
  + ` text-[#9a8878]`;

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

  return (
    <div className="min-h-screen" style={{ background: '#F5F3EF' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* Back + Stepper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <Link href={`/${locale}/panier`}
            className="flex items-center gap-2 text-sm font-sans transition-colors"
            style={{ color: '#9a8878' }}>
            <ArrowLeft size={14} /> Retour au panier
          </Link>
          <div className="flex items-center gap-2 text-xs font-sans" style={{ color: '#9a8878' }}>
            {['Panier', 'Livraison & paiement', 'Confirmation'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                {i > 0 && <span style={{ color: 'rgba(44,36,32,.2)' }}>—</span>}
                <span style={i === 1 ? { color: '#2C2420', fontWeight: 600 } : {}}>
                  {i === 0 && <span className="mr-1">✓</span>}{step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <h1 className="font-serif mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', color: '#2C2420' }}>
          Finaliser la commande
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">

            {/* ── LEFT: form ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Contact */}
              <div className="rounded-2xl p-7" style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
                <h2 className="font-serif text-lg mb-6" style={{ color: '#2C2420' }}>Contact</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Email *</label>
                    <input type="email" required value={form.email} onChange={set('email')}
                      className={inputCls} placeholder="vous@exemple.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Téléphone</label>
                    <input type="tel" value={form.phone} onChange={set('phone')}
                      className={inputCls} placeholder="+32 4xx xx xx xx" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="rounded-2xl p-7" style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
                <h2 className="font-serif text-lg mb-6" style={{ color: '#2C2420' }}>Adresse de livraison</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Prénom *</label>
                    <input required value={form.firstName} onChange={set('firstName')} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Nom *</label>
                    <input required value={form.lastName} onChange={set('lastName')} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Adresse *</label>
                    <input required value={form.line1} onChange={set('line1')}
                      className={inputCls} placeholder="Rue et numéro" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Complément</label>
                    <input value={form.line2} onChange={set('line2')}
                      className={inputCls} placeholder="Appartement, boîte…" />
                  </div>
                  <div>
                    <label className={labelCls}>Code postal *</label>
                    <input required value={form.postalCode} onChange={set('postalCode')} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Ville *</label>
                    <input required value={form.city} onChange={set('city')} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Pays *</label>
                    <div className="relative">
                      <select value={form.countryCode} onChange={set('countryCode')}
                        className={`${inputCls} appearance-none pr-10`}>
                        {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: '#9a8878' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl p-7" style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
                <h2 className="font-serif text-lg mb-6" style={{ color: '#2C2420' }}>Mode de paiement</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {methods.map(m => {
                    const selected = method === m;
                    return (
                      <button key={m} type="button" onClick={() => setMethod(m)}
                        className="relative flex items-center gap-3 rounded-xl p-4 text-sm font-sans text-left transition-all"
                        style={selected
                          ? { border: '1.5px solid #2C2420', background: 'rgba(44,36,32,.04)', color: '#2C2420', fontWeight: 600 }
                          : { border: '1.5px solid rgba(44,36,32,.14)', color: '#9a8878' }}>
                        {selected && (
                          <span className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ background: '#2C2420' }}>
                            <Check size={9} color="#F2ECE0" strokeWidth={3} />
                          </span>
                        )}
                        <span className="text-lg">{METHOD_LABELS[m]?.icon}</span>
                        <span>{METHOD_LABELS[m]?.label ?? m}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="rounded-2xl p-5 text-sm font-sans"
                  style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}>
                  {error}
                </div>
              )}
            </div>

            {/* ── RIGHT: order summary (dark) ── */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl p-7 sticky top-24 space-y-6"
                style={{ background: '#2C2420', color: '#F2ECE0' }}>
                <h2 className="font-serif text-lg" style={{ color: '#F2ECE0' }}>Votre commande</h2>

                {/* Items */}
                <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-xl flex-shrink-0 relative overflow-hidden"
                        style={{ background: 'rgba(242,236,224,.08)' }}>
                        {product.images?.[0] && (
                          <Image src={product.images[0]} alt={product.nameFr ?? ''} fill
                            className="object-contain p-1.5"
                            unoptimized={product.images[0].startsWith('https://raw.githubusercontent.com')} />
                        )}
                        {/* qty badge */}
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                          style={{ background: '#C1714A', color: '#fff' }}>{quantity}</span>
                      </div>
                      <p className="flex-1 text-xs font-sans leading-snug line-clamp-2"
                        style={{ color: 'rgba(242,236,224,.8)' }}>{product.nameFr}</p>
                      <p className="text-sm font-sans font-semibold flex-shrink-0" style={{ color: '#F2ECE0' }}>
                        {((product.retailPriceEur ?? 0) * quantity).toFixed(2).replace('.', ',')} €
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 text-sm font-sans pt-4"
                  style={{ borderTop: '1px solid rgba(242,236,224,.1)' }}>
                  <div className="flex justify-between" style={{ color: 'rgba(242,236,224,.55)' }}>
                    <span>Sous-total</span><span>{subtotal.toFixed(2).replace('.', ',')} €</span>
                  </div>
                  <div className="flex justify-between" style={{ color: shipping === 0 ? '#5C9E70' : 'rgba(242,236,224,.55)' }}>
                    <span>Livraison</span>
                    <span>{shipping === 0 ? 'Offerte ✓' : `${shipping.toFixed(2).replace('.', ',')} €`}</span>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: 'rgba(242,236,224,.35)' }}>
                    <span>TVA ({(vat.vatRate * 100).toFixed(0)}%)</span>
                    <span>{vat.vatAmount.toFixed(2).replace('.', ',')} €</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-4"
                  style={{ borderTop: '1px solid rgba(242,236,224,.1)' }}>
                  <span className="text-sm font-sans" style={{ color: 'rgba(242,236,224,.7)' }}>Total TTC</span>
                  <span className="font-serif font-bold text-2xl" style={{ color: '#F2ECE0' }}>
                    {orderTotal.toFixed(2).replace('.', ',')} €
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="flex items-center gap-2 text-xs font-sans rounded-xl p-3"
                    style={{ background: 'rgba(242,236,224,.06)', color: 'rgba(242,236,224,.5)' }}>
                    <Truck size={12} />
                    Livraison offerte dès 59 € d&apos;achat
                  </div>
                )}

                <button type="submit" disabled={loading || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-sans font-semibold text-sm transition-all disabled:opacity-50"
                  style={{ background: '#C1714A', color: '#fff', boxShadow: '0 10px 28px rgba(193,113,74,.3)' }}>
                  <Lock size={14} />
                  {loading ? 'Redirection…' : 'Payer en sécurité'}
                </button>

                <p className="text-center text-[10px] font-sans" style={{ color: 'rgba(242,236,224,.35)', letterSpacing: '0.04em' }}>
                  🔒 SSL 256 bits · Paiement sécurisé · Données protégées
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
