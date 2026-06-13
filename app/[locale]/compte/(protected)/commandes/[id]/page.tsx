import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, Package, Truck, MapPin } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  paid:       { label: 'Payée',           color: 'bg-green-100 text-green-700',   icon: '✓' },
  pending:    { label: 'En attente',      color: 'bg-amber-100 text-amber-700',   icon: '⏳' },
  processing: { label: 'En préparation', color: 'bg-blue-100 text-blue-700',     icon: '⚙️' },
  shipped:    { label: 'Expédiée',        color: 'bg-indigo-100 text-indigo-700', icon: '📦' },
  delivered:  { label: 'Livrée',          color: 'bg-emerald-100 text-emerald-700', icon: '🏠' },
  cancelled:  { label: 'Annulée',         color: 'bg-gray-100 text-gray-500',    icon: '✕' },
  failed:     { label: 'Échouée',         color: 'bg-red-100 text-red-600',      icon: '!' },
};

export default async function CommandeDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .eq('email', user!.email!)
    .single();

  if (!order) notFound();

  const st    = STATUS_CONFIG[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-500', icon: '?' };
  const addr  = order.shipping_address ?? {};
  const items: any[] = order.items ?? [];
  const date  = new Date(order.created_at).toLocaleDateString('fr-BE', { day: '2-digit', month: 'long', year: 'numeric' });
  const orderNum = order.id.slice(0, 8).toUpperCase();
  const vatRate  = ((order.vat_rate ?? 0.21) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link href={`/${params.locale}/compte/commandes`}
            className="flex items-center gap-1.5 text-sm text-zen-muted hover:text-zen-bark font-sans mb-3 transition-colors">
            <ArrowLeft size={14} /> Mes commandes
          </Link>
          <h1 className="font-serif text-3xl text-zen-bark">Commande #{orderNum}</h1>
          <p className="text-sm text-zen-muted font-sans mt-1">{date}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-sans font-medium px-3 py-1.5 rounded-xl ${st.color}`}>
            {st.icon} {st.label}
          </span>
          <a href={`/api/invoice/${order.id}`} target="_blank"
            className="flex items-center gap-2 text-sm font-sans text-zen-bark border border-zen-sand rounded-xl px-4 py-2 hover:bg-zen-beige transition-colors">
            <FileText size={14} /> Facture PDF
          </a>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <Package size={18} className="text-zen-bark" />
          <h2 className="font-serif text-xl text-zen-bark">Articles commandés</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5">
              <div className="w-14 h-14 rounded-xl bg-gray-50 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans font-semibold text-zen-bark leading-snug">{item.nameFr ?? item.sku}</p>
                <p className="text-xs text-zen-muted mt-0.5">× {item.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-zen-muted">{Number(item.unitPriceEur).toFixed(2).replace('.', ',')} € / unité</p>
                <p className="font-serif font-bold text-zen-bark text-lg mt-0.5">{Number(item.totalEur).toFixed(2).replace('.', ',')} €</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin size={18} className="text-zen-bark" />
            <h2 className="font-serif text-xl text-zen-bark">Adresse de livraison</h2>
          </div>
          <p className="text-sm font-sans text-zen-bark font-semibold">{addr.firstName} {addr.lastName}</p>
          <p className="text-sm font-sans text-zen-muted mt-1 leading-relaxed">
            {addr.line1}<br />
            {addr.line2 && <>{addr.line2}<br /></>}
            {addr.postalCode} {addr.city}<br />
            {addr.countryCode}
          </p>
          {addr.phone && <p className="text-sm text-zen-muted mt-2">{addr.phone}</p>}
        </div>

        {/* Totals */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Truck size={18} className="text-zen-bark" />
            <h2 className="font-serif text-xl text-zen-bark">Récapitulatif</h2>
          </div>
          <div className="space-y-3 text-sm font-sans">
            <div className="flex justify-between text-zen-muted">
              <span>Sous-total</span>
              <span>{Number(order.subtotal_eur ?? order.total_eur - (order.shipping_eur ?? 0)).toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="flex justify-between text-zen-muted">
              <span>Livraison</span>
              <span className={order.shipping_eur === 0 ? 'text-green-600 font-medium' : ''}>
                {order.shipping_eur === 0 ? 'Offerte' : `${Number(order.shipping_eur ?? 0).toFixed(2).replace('.', ',')} €`}
              </span>
            </div>
            <div className="flex justify-between text-zen-muted text-xs">
              <span>TVA ({vatRate}%)</span>
              <span>{Number(order.vat_amount_eur ?? 0).toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="flex justify-between text-zen-bark font-bold pt-3 border-t border-gray-100 text-base">
              <span>Total TTC</span>
              <span className="font-serif text-xl">{Number(order.total_eur).toFixed(2).replace('.', ',')} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
