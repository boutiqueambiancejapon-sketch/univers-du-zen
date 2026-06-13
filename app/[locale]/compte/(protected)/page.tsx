import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Package, Star, TrendingUp, ChevronRight } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  paid:       { label: 'Payée',           color: 'bg-green-100 text-green-700' },
  pending:    { label: 'En attente',      color: 'bg-amber-100 text-amber-700' },
  processing: { label: 'En préparation', color: 'bg-blue-100 text-blue-700' },
  shipped:    { label: 'Expédiée',        color: 'bg-indigo-100 text-indigo-700' },
  delivered:  { label: 'Livrée',          color: 'bg-emerald-100 text-emerald-700' },
  cancelled:  { label: 'Annulée',         color: 'bg-gray-100 text-gray-500' },
  failed:     { label: 'Échouée',         color: 'bg-red-100 text-red-600' },
};

export default async function ComptePage({ params }: { params: { locale: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select('id, created_at, total_eur, status, items')
    .eq('email', user!.email!)
    .order('created_at', { ascending: false })
    .limit(5);

  const totalSpent  = (orders ?? []).reduce((s, o) => s + (o.total_eur ?? 0), 0);
  const loyaltyPts  = Math.floor(totalSpent);
  const nextReward  = 100;
  const progress    = Math.min(100, (loyaltyPts % nextReward) / nextReward * 100);
  const firstName   = (user!.user_metadata?.first_name as string | undefined) ?? user!.email!.split('@')[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl lg:text-4xl text-zen-bark">
          Bonjour, {firstName} 👋
        </h1>
        <p className="text-zen-muted font-sans text-sm mt-1">Bienvenue dans votre espace personnel.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-zen-beige flex items-center justify-center">
              <Package size={18} className="text-zen-bark" />
            </div>
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-zen-muted">Commandes</p>
          </div>
          <p className="font-serif text-3xl text-zen-bark">{(orders ?? []).length}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-zen-beige flex items-center justify-center">
              <TrendingUp size={18} className="text-zen-bark" />
            </div>
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-zen-muted">Total dépensé</p>
          </div>
          <p className="font-serif text-3xl text-zen-bark">{totalSpent.toFixed(2).replace('.', ',')} €</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star size={18} className="text-amber-500" />
            </div>
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-zen-muted">Points fidélité</p>
          </div>
          <p className="font-serif text-3xl text-zen-bark">{loyaltyPts}</p>
        </div>
      </div>

      {/* Loyalty card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-serif text-xl text-zen-bark">Programme fidélité</h2>
            <p className="text-xs font-sans text-zen-muted mt-1">1 point par euro dépensé · 100 points = 5 € de réduction</p>
          </div>
          <span className="text-sm font-sans font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl">
            ★ {loyaltyPts} pts
          </span>
        </div>
        <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className="absolute inset-y-0 left-0 bg-amber-400 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-zen-muted font-sans">
          {loyaltyPts % nextReward < nextReward
            ? `${nextReward - (loyaltyPts % nextReward)} points avant votre prochaine récompense`
            : `🎉 Récompense disponible ! Contactez-nous pour l'activer.`
          }
        </p>
      </div>

      {/* Recent orders */}
      {(orders ?? []).length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-serif text-xl text-zen-bark">Dernières commandes</h2>
            <Link href={`/${params.locale}/compte/commandes`} className="text-sm font-sans text-zen-muted hover:text-zen-bark transition-colors flex items-center gap-1">
              Tout voir <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(orders ?? []).map(o => {
              const st = STATUS_CONFIG[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-500' };
              const date = new Date(o.created_at).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' });
              const items: any[] = o.items ?? [];
              return (
                <Link key={o.id} href={`/${params.locale}/compte/commandes/${o.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-semibold text-zen-bark">#{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-zen-muted mt-0.5">{date} · {items.length} article{items.length > 1 ? 's' : ''}</p>
                  </div>
                  <span className={`text-xs font-sans font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${st.color}`}>{st.label}</span>
                  <p className="font-serif font-bold text-zen-bark flex-shrink-0">{Number(o.total_eur).toFixed(2).replace('.', ',')} €</p>
                  <ChevronRight size={16} className="text-zen-muted flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Package size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="font-serif text-xl text-zen-bark mb-2">Aucune commande pour l'instant</p>
          <p className="text-sm text-zen-muted font-sans mb-6">Découvrez notre sélection et commencez votre rituel bien-être.</p>
          <Link href={`/${params.locale}/boutique`}
            className="inline-flex items-center gap-2 bg-zen-terracotta text-white font-sans font-medium px-6 py-3 rounded-xl hover:bg-zen-terracotta/90 transition-colors">
            Découvrir la boutique
          </Link>
        </div>
      )}
    </div>
  );
}
