import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Package, TrendingUp, ChevronRight, ShoppingBag } from 'lucide-react';

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
    <span className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
      style={{ background: cfg.bg, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

export default async function ComptePage({ params }: { params: { locale: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select('id, reference, created_at, total_eur, status, items')
    .eq('email', user!.email!)
    .order('created_at', { ascending: false })
    .limit(5);

  const totalSpent = (orders ?? []).reduce((s, o) => s + (o.total_eur ?? 0), 0);
  const loyaltyPts = Math.floor(totalSpent);
  const nextReward = 100;
  const ptsInCycle = loyaltyPts % nextReward;
  const progress   = Math.min(100, (ptsInCycle / nextReward) * 100);
  const firstName  = (user!.user_metadata?.first_name as string | undefined) ?? user!.email!.split('@')[0];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="font-serif" style={{ fontSize: 'clamp(26px, 3vw, 36px)', color: '#2C2420', lineHeight: 1.1 }}>
          Bonjour, {firstName}
        </h1>
        <p className="font-sans text-sm mt-1" style={{ color: '#9a8878' }}>Bienvenue dans votre espace personnel.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Package,    label: 'Commandes',     value: (orders ?? []).length,                        suffix: '' },
          { icon: TrendingUp, label: 'Total dépensé', value: totalSpent.toFixed(2).replace('.', ','),      suffix: ' €' },
          { icon: null,       label: 'Points fidélité', value: loyaltyPts,                                 suffix: ' pts' },
        ].map(({ icon: Icon, label, value, suffix }, i) => (
          <div key={label} className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: i === 2 ? 'rgba(232,197,160,.15)' : '#F5F3EF' }}>
                {i === 2
                  ? <span style={{ fontSize: 14, color: '#C1714A' }}>✦</span>
                  : Icon && <Icon size={16} style={{ color: '#2C2420' }} />
                }
              </div>
              <p className="font-sans font-semibold uppercase text-[10px]" style={{ color: '#9a8878', letterSpacing: '0.08em' }}>
                {label}
              </p>
            </div>
            <p className="font-serif font-bold" style={{ fontSize: 28, color: '#2C2420' }}>
              {value}{suffix}
            </p>
          </div>
        ))}
      </div>

      {/* Loyalty card — dark */}
      <div className="rounded-2xl p-6 overflow-hidden relative" style={{
        background: 'linear-gradient(155deg, #3A332B 0%, #2C2420 100%)',
        color: '#F2ECE0',
      }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(193,113,74,.2), transparent 70%)', transform: 'translate(30%, -30%)' }} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="font-sans font-semibold uppercase text-[10px] mb-1.5" style={{ color: 'rgba(232,197,160,.7)', letterSpacing: '0.1em' }}>
                Programme fidélité
              </p>
              <p className="font-serif font-bold" style={{ fontSize: 36, color: '#F2ECE0', lineHeight: 1 }}>
                {loyaltyPts} <span style={{ fontSize: 16, color: '#E8C5A0', fontWeight: 400 }}>points</span>
              </p>
            </div>
            <span className="text-xs font-sans font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(232,197,160,.14)', border: '1px solid rgba(232,197,160,.3)', color: '#E8C5A0' }}>
              ✦ Membre Zen
            </span>
          </div>

          <div className="relative h-2 rounded-full mb-2 overflow-hidden" style={{ background: 'rgba(242,236,224,.12)' }}>
            <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #C1714A, #E8C5A0)' }} />
          </div>
          <p className="font-sans text-xs" style={{ color: 'rgba(242,236,224,.5)' }}>
            {ptsInCycle < nextReward
              ? `${nextReward - ptsInCycle} points avant votre prochaine récompense de 5 €`
              : '🎉 Récompense disponible — contactez-nous pour l\'activer'}
          </p>

          <p className="font-sans text-xs mt-3" style={{ color: 'rgba(242,236,224,.4)', letterSpacing: '0.03em' }}>
            1 point = 1 € dépensé · 100 points = −5 € sur votre prochaine commande
          </p>
        </div>
      </div>

      {/* Recent orders */}
      {(orders ?? []).length > 0 ? (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(44,36,32,.06)' }}>
            <h2 className="font-serif text-lg" style={{ color: '#2C2420' }}>Dernières commandes</h2>
            <Link href={`/${params.locale}/compte/commandes`}
              className="flex items-center gap-1 text-xs font-sans font-medium transition-colors"
              style={{ color: '#C1714A' }}>
              Tout voir <ChevronRight size={13} />
            </Link>
          </div>
          <div>
            {(orders ?? []).map(o => {
              const date = new Date(o.created_at).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' });
              const items: any[] = o.items ?? [];
              const ref = o.reference ?? `#${o.id.slice(0, 8).toUpperCase()}`;
              return (
                <Link key={o.id} href={`/${params.locale}/compte/commandes/${o.id}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors"
                  style={{ borderTop: '1px solid rgba(44,36,32,.05)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FCFAF4'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-semibold" style={{ color: '#2C2420' }}>{ref}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9a8878' }}>{date} · {items.length} article{items.length > 1 ? 's' : ''}</p>
                  </div>
                  <StatusBadge status={o.status} />
                  <p className="font-serif font-bold flex-shrink-0" style={{ color: '#2C2420' }}>
                    {Number(o.total_eur).toFixed(2).replace('.', ',')} €
                  </p>
                  <ChevronRight size={15} style={{ color: '#9a8878', flexShrink: 0 }} />
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-12 text-center" style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: '#F5F3EF' }}>
            <ShoppingBag size={28} style={{ color: '#9a8878' }} />
          </div>
          <p className="font-serif text-xl mb-2" style={{ color: '#2C2420' }}>Aucune commande pour l&apos;instant</p>
          <p className="text-sm font-sans mb-6" style={{ color: '#9a8878' }}>
            Découvrez notre sélection et commencez votre rituel bien-être.
          </p>
          <Link href={`/${params.locale}/boutique`}
            className="inline-flex items-center gap-2 text-sm font-sans font-semibold px-6 py-3 rounded-xl transition-colors text-white"
            style={{ background: '#C1714A' }}>
            Découvrir la boutique
          </Link>
        </div>
      )}
    </div>
  );
}
