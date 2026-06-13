import { createAdminClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { TrendingUp, Package, AlertCircle, ChevronRight, FileText } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  paid:       { label: 'Payée',          color: 'bg-green-100 text-green-700' },
  pending:    { label: 'En attente',     color: 'bg-amber-100 text-amber-700' },
  processing: { label: 'En préparation', color: 'bg-blue-100 text-blue-700' },
  shipped:    { label: 'Expédiée',       color: 'bg-indigo-100 text-indigo-700' },
  delivered:  { label: 'Livrée',         color: 'bg-emerald-100 text-emerald-700' },
  cancelled:  { label: 'Annulée',        color: 'bg-gray-100 text-gray-500' },
  failed:     { label: 'Échouée',        color: 'bg-red-100 text-red-600' },
};

const COUNTRY_NAMES: Record<string, string> = { BE: 'Belgique', FR: 'France', NL: 'Pays-Bas', LU: 'Luxembourg', DE: 'Allemagne' };

export default async function AdminPage() {
  const supabase = createAdminClient();

  const { data: allOrders } = await supabase
    .from('orders')
    .select('id, created_at, email, total_eur, shipping_eur, vat_amount_eur, status, country_code, items, supplier_order_id')
    .order('created_at', { ascending: false });

  const orders = allOrders ?? [];

  // Revenue
  const revenue = orders
    .filter(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status))
    .reduce((s, o) => s + (o.total_eur ?? 0), 0);

  const now = new Date();
  const thisMonth = orders.filter(o => {
    const d = new Date(o.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = orders.filter(o => {
    const d = new Date(o.created_at);
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
  });

  const revenueThisMonth = thisMonth.filter(o => ['paid','processing','shipped','delivered'].includes(o.status)).reduce((s, o) => s + (o.total_eur ?? 0), 0);
  const revenueLastMonth = lastMonth.filter(o => ['paid','processing','shipped','delivered'].includes(o.status)).reduce((s, o) => s + (o.total_eur ?? 0), 0);
  const monthGrowth = revenueLastMonth > 0 ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100).toFixed(0) : '—';

  // By status
  const byStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // TVA par pays
  const vatByCountry = orders
    .filter(o => ['paid','processing','shipped','delivered'].includes(o.status))
    .reduce((acc, o) => {
      const c = o.country_code ?? 'BE';
      acc[c] = (acc[c] ?? 0) + (o.vat_amount_eur ?? 0);
      return acc;
    }, {} as Record<string, number>);

  // Pending orders (paid but not yet sent to supplier)
  const pendingPush = orders.filter(o => o.status === 'paid' && !o.supplier_order_id).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} commandes au total</p>
        </div>
        <div className="flex gap-3">
          <a href="/api/admin/export-csv"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-4 py-2 hover:bg-white transition-colors bg-gray-50">
            <FileText size={14} /> Export CSV
          </a>
          <Link href="/admin/commandes"
            className="flex items-center gap-2 text-sm font-medium text-white bg-gray-900 rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors">
            <Package size={14} /> Pipeline fournisseur
            {pendingPush > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingPush}</span>}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'CA total', value: `${revenue.toFixed(2).replace('.', ',')} €`, sub: 'commandes validées', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Ce mois-ci', value: `${revenueThisMonth.toFixed(2).replace('.', ',')} €`, sub: `${monthGrowth !== '—' ? (Number(monthGrowth) >= 0 ? '+' : '') + monthGrowth + '% vs mois préc.' : 'premier mois'}`, icon: TrendingUp, color: 'text-blue-600' },
          { label: 'Commandes', value: orders.length.toString(), sub: `${byStatus['paid'] ?? 0} payées, ${byStatus['pending'] ?? 0} en attente`, icon: Package, color: 'text-violet-600' },
          { label: 'À transmettre', value: pendingPush.toString(), sub: 'commandes payées non envoyées', icon: AlertCircle, color: pendingPush > 0 ? 'text-red-500' : 'text-gray-400' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
              <Icon size={16} className={color} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Status breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Par statut</h2>
          <div className="space-y-2.5">
            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                <span className="text-sm font-semibold text-gray-700">{byStatus[status] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TVA OSS */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">TVA OSS collectée</h2>
            <Link href="/admin/tva" className="text-xs text-blue-600 hover:underline">Détail →</Link>
          </div>
          <div className="space-y-3">
            {Object.entries(vatByCountry).sort((a, b) => b[1] - a[1]).map(([country, vat]) => (
              <div key={country} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{COUNTRY_NAMES[country] ?? country}</span>
                <span className="text-sm font-semibold text-gray-900">{vat.toFixed(2).replace('.', ',')} €</span>
              </div>
            ))}
            {Object.keys(vatByCountry).length === 0 && <p className="text-sm text-gray-400">Aucune donnée</p>}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-700">Total</span>
              <span className="text-sm font-bold text-gray-900">
                {Object.values(vatByCountry).reduce((s, v) => s + v, 0).toFixed(2).replace('.', ',')} €
              </span>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Activité récente</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map(o => {
              const cfg = STATUS_CONFIG[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-500' };
              const date = new Date(o.created_at).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short' });
              return (
                <div key={o.id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{o.email}</p>
                    <p className="text-[10px] text-gray-400">{date} · #{o.id.slice(0, 6).toUpperCase()}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-xs font-semibold text-gray-700 flex-shrink-0">{Number(o.total_eur).toFixed(0)} €</span>
                </div>
              );
            })}
          </div>
          <Link href="/admin/commandes" className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-4">
            Voir toutes les commandes <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
