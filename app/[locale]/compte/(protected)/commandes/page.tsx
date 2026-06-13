import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Package, ChevronRight, FileText } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  paid:       { label: 'Payée',           color: 'bg-green-100 text-green-700' },
  pending:    { label: 'En attente',      color: 'bg-amber-100 text-amber-700' },
  processing: { label: 'En préparation', color: 'bg-blue-100 text-blue-700' },
  shipped:    { label: 'Expédiée',        color: 'bg-indigo-100 text-indigo-700' },
  delivered:  { label: 'Livrée',          color: 'bg-emerald-100 text-emerald-700' },
  cancelled:  { label: 'Annulée',         color: 'bg-gray-100 text-gray-500' },
  failed:     { label: 'Échouée',         color: 'bg-red-100 text-red-600' },
};

export default async function CommandesPage({ params }: { params: { locale: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('email', user!.email!)
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-3xl lg:text-4xl text-zen-bark mb-8">Mes commandes</h1>

      {!orders?.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Package size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="font-serif text-xl text-zen-bark mb-2">Aucune commande</p>
          <p className="text-sm text-zen-muted font-sans mb-6">Votre historique de commandes apparaîtra ici.</p>
          <Link href={`/${params.locale}/boutique`}
            className="inline-flex items-center gap-2 bg-zen-terracotta text-white font-sans font-medium px-6 py-3 rounded-xl hover:bg-zen-terracotta/90 transition-colors">
            Aller à la boutique
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-gray-100 bg-gray-50">
            <p className="col-span-3 text-xs font-sans font-semibold uppercase tracking-widest text-zen-muted">Commande</p>
            <p className="col-span-2 text-xs font-sans font-semibold uppercase tracking-widest text-zen-muted">Date</p>
            <p className="col-span-3 text-xs font-sans font-semibold uppercase tracking-widest text-zen-muted">Statut</p>
            <p className="col-span-2 text-xs font-sans font-semibold uppercase tracking-widest text-zen-muted text-right">Total</p>
            <p className="col-span-2 text-xs font-sans font-semibold uppercase tracking-widest text-zen-muted text-right">Actions</p>
          </div>

          <div className="divide-y divide-gray-50">
            {orders.map(o => {
              const st = STATUS_CONFIG[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-500' };
              const date = new Date(o.created_at).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric' });
              const items: any[] = o.items ?? [];
              return (
                <div key={o.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-5 hover:bg-gray-50 transition-colors items-center">
                  <div className="md:col-span-3">
                    <p className="text-sm font-sans font-semibold text-zen-bark">#{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-zen-muted mt-0.5">{items.length} article{items.length > 1 ? 's' : ''}</p>
                  </div>
                  <p className="md:col-span-2 text-sm font-sans text-zen-muted">{date}</p>
                  <div className="md:col-span-3">
                    <span className={`text-xs font-sans font-medium px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                  </div>
                  <p className="md:col-span-2 font-serif font-bold text-zen-bark md:text-right">
                    {Number(o.total_eur).toFixed(2).replace('.', ',')} €
                  </p>
                  <div className="md:col-span-2 flex items-center justify-start md:justify-end gap-2">
                    <Link href={`/${params.locale}/compte/commandes/${o.id}`}
                      className="flex items-center gap-1.5 text-xs font-sans text-zen-bark border border-zen-sand rounded-lg px-3 py-2 hover:bg-zen-beige transition-colors">
                      <ChevronRight size={12} /> Détail
                    </Link>
                    <a href={`/api/invoice/${o.id}`} target="_blank"
                      className="flex items-center gap-1.5 text-xs font-sans text-zen-muted border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                      <FileText size={12} /> Facture
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
