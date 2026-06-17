import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Package, ChevronRight, FileText, ShoppingBag } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  paid:             { label: 'Payée',           dot: '#16A34A', bg: '#F0FDF4', text: '#15803D' },
  pending_payment:  { label: 'En attente',      dot: '#D97706', bg: '#FFFBEB', text: '#B45309' },
  pending:          { label: 'En attente',      dot: '#D97706', bg: '#FFFBEB', text: '#B45309' },
  processing:       { label: 'En préparation',  dot: '#2563EB', bg: '#EFF6FF', text: '#1D4ED8' },
  shipped:          { label: 'Expédiée',        dot: '#7C3AED', bg: '#F5F3FF', text: '#6D28D9' },
  delivered:        { label: 'Livrée',          dot: '#059669', bg: '#ECFDF5', text: '#047857' },
  cancelled:        { label: 'Annulée',         dot: '#9CA3AF', bg: '#F9FAFB', text: '#6B7280' },
  failed:           { label: 'Échouée',         dot: '#DC2626', bg: '#FEF2F2', text: '#B91C1C' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, dot: '#9CA3AF', bg: '#F9FAFB', text: '#6B7280' };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

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
      <div className="mb-8">
        <h1 className="font-serif" style={{ fontSize: 'clamp(24px, 3vw, 34px)', color: '#3B2A1F' }}>
          Mes commandes
        </h1>
        <p className="text-sm font-sans mt-1" style={{ color: '#675A4E' }}>
          {orders?.length
            ? `${orders.length} commande${orders.length > 1 ? 's' : ''} au total`
            : 'Votre historique apparaîtra ici'}
        </p>
      </div>

      {!orders?.length ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: '#F5F3EF' }}>
            <ShoppingBag size={28} style={{ color: '#675A4E' }} />
          </div>
          <p className="font-serif text-xl mb-2" style={{ color: '#3B2A1F' }}>Aucune commande</p>
          <p className="text-sm font-sans mb-6" style={{ color: '#675A4E' }}>Votre historique de commandes apparaîtra ici.</p>
          <Link href={`/${params.locale}/boutique`}
            className="inline-flex items-center gap-2 text-sm font-sans font-semibold px-6 py-3 rounded-xl text-white transition-colors"
            style={{ background: '#C4714A' }}>
            Aller à la boutique
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
          {/* Table header — desktop */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5"
            style={{ borderBottom: '1px solid rgba(44,36,32,.06)', background: '#F9F8F6' }}>
            {['Référence', 'Date', 'Statut', 'Total', 'Actions'].map((h, i) => (
              <p key={h}
                className="font-sans font-semibold uppercase text-[12px]"
                style={{
                  color: '#675A4E',
                  letterSpacing: '0.08em',
                  gridColumn: i === 0 ? 'span 3' : i === 1 ? 'span 2' : i === 2 ? 'span 3' : i === 3 ? 'span 2' : 'span 2',
                  textAlign: i >= 3 ? 'right' : 'left',
                }}>
                {h}
              </p>
            ))}
          </div>

          <div>
            {orders.map((o, idx) => {
              const date = new Date(o.created_at).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' });
              const items: any[] = o.items ?? [];
              const ref = o.reference ?? `#${o.id.slice(0, 8).toUpperCase()}`;

              return (
                <div key={o.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-5 items-center transition-colors hover:bg-[#FCFAF4]"
                  style={{ borderTop: idx > 0 ? '1px solid rgba(44,36,32,.05)' : 'none' }}>

                  {/* Ref */}
                  <div className="md:col-span-3">
                    <p className="text-sm font-sans font-semibold" style={{ color: '#3B2A1F' }}>{ref}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#675A4E' }}>
                      {items.length} article{items.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Date */}
                  <p className="md:col-span-2 text-sm font-sans" style={{ color: '#675A4E' }}>{date}</p>

                  {/* Status */}
                  <div className="md:col-span-3">
                    <StatusBadge status={o.status} />
                  </div>

                  {/* Total */}
                  <p className="md:col-span-2 font-serif font-bold md:text-right" style={{ color: '#3B2A1F', fontSize: 15 }}>
                    {Number(o.total_eur).toFixed(2).replace('.', ',')} €
                  </p>

                  {/* Actions */}
                  <div className="md:col-span-2 flex items-center md:justify-end gap-2">
                    <Link href={`/${params.locale}/compte/commandes/${o.id}`}
                      className="flex items-center gap-1.5 text-xs font-sans font-medium px-3 py-2 rounded-xl transition-all"
                      style={{ border: '1px solid rgba(44,36,32,.15)', color: '#3B2A1F' }}>
                      <ChevronRight size={12} /> Détail
                    </Link>
                    <a href={`/api/invoice/${o.id}`} target="_blank"
                      className="flex items-center gap-1.5 text-xs font-sans px-3 py-2 rounded-xl transition-all"
                      style={{ border: '1px solid rgba(44,36,32,.1)', color: '#675A4E' }}>
                      <FileText size={12} /> PDF
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
