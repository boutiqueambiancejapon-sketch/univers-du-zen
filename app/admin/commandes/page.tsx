'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, RefreshCw, ExternalLink, Check, AlertCircle } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  paid:       { label: 'Payée',          color: 'bg-green-100 text-green-700' },
  pending:    { label: 'En attente',     color: 'bg-amber-100 text-amber-700' },
  processing: { label: 'En préparation', color: 'bg-blue-100 text-blue-700' },
  shipped:    { label: 'Expédiée',       color: 'bg-indigo-100 text-indigo-700' },
  delivered:  { label: 'Livrée',         color: 'bg-emerald-100 text-emerald-700' },
  cancelled:  { label: 'Annulée',        color: 'bg-gray-100 text-gray-500' },
  failed:     { label: 'Échouée',        color: 'bg-red-100 text-red-600' },
};

type Order = {
  id: string; email: string; created_at: string; status: string;
  total_eur: number; country_code: string;
  supplier_order_id: string | null; tracking_number: string | null;
  items: any[];
};

export default function AdminCommandesPage() {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [filter, setFilter]         = useState<string>('all');
  const [loading, setLoading]       = useState(true);
  const [pushing, setPushing]       = useState<string | null>(null);
  const [pushResults, setPushResults] = useState<Record<string, { ok: boolean; msg: string }>>({});

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(d => { setOrders(d.orders ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function pushOrder(orderId: string) {
    setPushing(orderId);
    try {
      const res = await fetch(`/api/admin/push-order/${orderId}`, { method: 'POST' });
      const data = await res.json();
      setPushResults(r => ({ ...r, [orderId]: { ok: res.ok, msg: data.message ?? data.error ?? 'OK' } }));
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'processing', supplier_order_id: data.supplierOrderId ?? '—' } : o));
      }
    } catch {
      setPushResults(r => ({ ...r, [orderId]: { ok: false, msg: 'Erreur réseau' } }));
    }
    setPushing(null);
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pipeline fournisseur</h1>
          <p className="text-sm text-gray-500 mt-0.5">Transmettez les commandes payées au fournisseur AW</p>
        </div>
        <a href="/api/admin/export-csv"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors bg-white">
          ⬇ Export CSV
        </a>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              filter === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {s === 'all' ? 'Tous' : (STATUS_CONFIG[s]?.label ?? s)}
            <span className="ml-1.5 text-[12px] opacity-70">
              {s === 'all' ? orders.length : orders.filter(o => o.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Chargement…</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Commande', 'Client', 'Date', 'Statut', 'Total', 'Fournisseur', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(o => {
                const cfg = STATUS_CONFIG[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-500' };
                const date = new Date(o.created_at).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: '2-digit' });
                const result = pushResults[o.id];
                const canPush = o.status === 'paid' && !o.supplier_order_id;
                return (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-gray-700">#{o.id.slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-700 truncate max-w-[140px]">{o.email}</p>
                      <p className="text-[12px] text-gray-400">{o.country_code}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{Number(o.total_eur).toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      {o.supplier_order_id ? (
                        <span className="flex items-center gap-1 text-[12px] text-emerald-600">
                          <Check size={10} /> {o.supplier_order_id}
                        </span>
                      ) : (
                        <span className="text-[12px] text-gray-400">—</span>
                      )}
                      {o.tracking_number && (
                        <p className="text-[12px] text-blue-600 mt-0.5 flex items-center gap-1">
                          <Truck size={10} /> {o.tracking_number}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {result && (
                        <p className={`text-[12px] mb-1 ${result.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                          {result.ok ? <Check size={10} className="inline mr-0.5" /> : <AlertCircle size={10} className="inline mr-0.5" />}
                          {result.msg}
                        </p>
                      )}
                      {canPush ? (
                        <button onClick={() => pushOrder(o.id)} disabled={pushing === o.id}
                          className="flex items-center gap-1.5 text-[12px] font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
                          {pushing === o.id ? <RefreshCw size={10} className="animate-spin" /> : <ExternalLink size={10} />}
                          {pushing === o.id ? 'Envoi…' : 'Push AW'}
                        </button>
                      ) : o.status === 'paid' && o.supplier_order_id ? (
                        <span className="text-[12px] text-gray-400">Déjà envoyée</span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-sm text-gray-400">Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
