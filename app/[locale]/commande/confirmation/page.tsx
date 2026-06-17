import { createAdminClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { XCircle, Clock, Package, MapPin, ArrowRight } from 'lucide-react';
import { getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const locale = await getLocale();
  const { orderId } = searchParams;

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F3EF' }}>
        <p className="font-sans text-sm" style={{ color: '#675A4E' }}>Commande introuvable.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();

  const status    = order?.status ?? 'unknown';
  const isPaid    = status === 'paid';
  const isPending = status === 'pending_payment';
  const isFailed  = !isPaid && !isPending;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ background: '#F5F3EF' }}>
      <div className="w-full max-w-lg space-y-5">

        {/* Status icon + title */}
        <div className="rounded-2xl p-8 text-center" style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
          {isPaid && (
            <>
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: '#F0FDF4' }}>
                <svg className="w-8 h-8" fill="none" stroke="#16A34A" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-serif mb-2" style={{ fontSize: 28, color: '#3B2A1F' }}>Commande confirmée !</h1>
              <p className="text-sm font-sans leading-relaxed" style={{ color: '#675A4E' }}>
                Votre commande <strong style={{ color: '#3B2A1F' }}>{order?.reference}</strong> a bien été reçue.
                Un email de confirmation vous sera envoyé sous peu.
              </p>
            </>
          )}
          {isPending && (
            <>
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: '#FFFBEB' }}>
                <Clock size={32} style={{ color: '#D97706' }} />
              </div>
              <h1 className="font-serif mb-2" style={{ fontSize: 28, color: '#3B2A1F' }}>Paiement en cours…</h1>
              <p className="text-sm font-sans" style={{ color: '#675A4E' }}>
                Votre paiement est en cours de traitement. Vous serez notifié par email dès confirmation.
              </p>
            </>
          )}
          {isFailed && (
            <>
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: '#FEF2F2' }}>
                <XCircle size={32} style={{ color: '#DC2626' }} />
              </div>
              <h1 className="font-serif mb-2" style={{ fontSize: 28, color: '#3B2A1F' }}>Paiement non abouti</h1>
              <p className="text-sm font-sans" style={{ color: '#675A4E' }}>
                Le paiement n&apos;a pas pu être finalisé. Votre panier a été conservé — vous pouvez réessayer.
              </p>
            </>
          )}
        </div>

        {/* Order details — dark card (paid only) */}
        {isPaid && order && (
          <div className="rounded-2xl p-7" style={{ background: '#3B2A1F', color: '#F2ECE0' }}>
            <p className="font-sans font-semibold uppercase text-[12px] mb-5"
              style={{ color: 'rgba(242,236,224,.45)', letterSpacing: '0.1em' }}>
              Détails de la commande
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: <Package size={14} style={{ color: '#E8C5A0' }} />,
                  label: 'Référence',
                  value: order.reference,
                  mono: true,
                },
                {
                  icon: null,
                  label: 'Total payé',
                  value: `${Number(order.total_eur).toFixed(2).replace('.', ',')} €`,
                  bold: true,
                },
                order.shipping_address && {
                  icon: <MapPin size={14} style={{ color: '#E8C5A0' }} />,
                  label: 'Livraison',
                  value: `${order.shipping_address.firstName} ${order.shipping_address.lastName}, ${order.shipping_address.city}`,
                },
                {
                  icon: null,
                  label: 'Délai estimé',
                  value: '3–5 jours ouvrés',
                },
              ].filter(Boolean).map((row: any, i) => (
                <div key={i} className="flex items-center justify-between gap-4"
                  style={{ borderTop: i > 0 ? '1px solid rgba(242,236,224,.07)' : 'none', paddingTop: i > 0 ? 16 : 0 }}>
                  <div className="flex items-center gap-2">
                    {row.icon}
                    <span className="text-xs font-sans" style={{ color: 'rgba(242,236,224,.5)' }}>{row.label}</span>
                  </div>
                  <span className="text-sm font-sans text-right"
                    style={{
                      color: '#F2ECE0',
                      fontWeight: row.bold ? 700 : 500,
                      fontFamily: row.mono ? 'var(--font-dm-sans), monospace' : undefined,
                    }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          {isPaid && (
            <Link href={`/${locale}/compte/commandes`}
              className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-sans font-semibold transition-all"
              style={{ background: '#3B2A1F', color: '#F2ECE0' }}>
              <Package size={15} /> Suivre ma commande <ArrowRight size={14} />
            </Link>
          )}
          <Link href={`/${locale}/boutique`}
            className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-sans font-semibold transition-all"
            style={{ background: isPaid ? '#F5F3EF' : '#C4714A', color: isPaid ? '#3B2A1F' : '#fff', border: isPaid ? '1px solid rgba(44,36,32,.12)' : 'none' }}>
            {isPaid ? 'Retourner à la boutique' : 'Aller à la boutique'}
          </Link>
          {isFailed && (
            <Link href={`/${locale}/checkout`}
              className="text-center text-sm font-sans transition-colors py-2"
              style={{ color: '#675A4E' }}>
              ↩ Réessayer le paiement
            </Link>
          )}
        </div>

        <p className="text-center text-[12px] font-sans" style={{ color: 'rgba(44,36,32,.3)', letterSpacing: '0.04em' }}>
          🔒 Paiement sécurisé · Univers du Zen © 2026
        </p>
      </div>
    </div>
  );
}
