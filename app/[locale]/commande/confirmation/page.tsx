import { createAdminClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { CheckCircle2, XCircle, Clock, Package, MapPin } from 'lucide-react';
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
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <p className="text-zen-muted font-sans">Commande introuvable.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  const status    = order?.status ?? 'unknown';
  const isPaid    = status === 'paid';
  const isPending = status === 'pending_payment';
  const isFailed  = ['cancelled', 'unknown'].includes(status);

  return (
    <div className="min-h-screen bg-zen-cream flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-zen-sand p-8 text-center space-y-5">

        {/* Icon */}
        {isPaid    && <CheckCircle2 size={52} className="text-green-500 mx-auto" />}
        {isPending && <Clock        size={52} className="text-amber-400 mx-auto" />}
        {isFailed  && <XCircle      size={52} className="text-red-400 mx-auto" />}

        {/* Title */}
        <div>
          <h1 className="font-serif text-2xl text-zen-bark">
            {isPaid    && 'Commande confirmée !'}
            {isPending && 'Paiement en cours…'}
            {isFailed  && 'Paiement non abouti'}
          </h1>
          <p className="text-zen-muted font-sans text-sm mt-2">
            {isPaid    && `Votre commande ${order?.reference} a bien été reçue. Un email de confirmation vous sera envoyé sous peu.`}
            {isPending && 'Votre paiement est en cours de traitement. Vous serez notifié par email dès confirmation.'}
            {isFailed  && `Le paiement n'a pas pu être finalisé. Votre panier a été conservé — vous pouvez réessayer.`}
          </p>
        </div>

        {/* Order details (paid only) */}
        {isPaid && order && (
          <div className="bg-zen-cream rounded-xl p-4 text-left space-y-3">
            <div className="flex justify-between text-sm font-sans">
              <span className="text-zen-muted flex items-center gap-1.5"><Package size={13} /> Référence</span>
              <span className="font-semibold text-zen-bark">{order.reference}</span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span className="text-zen-muted">Total payé</span>
              <span className="font-semibold text-zen-bark">{Number(order.total_eur).toFixed(2).replace('.', ',')} €</span>
            </div>
            {order.shipping_address && (
              <div className="flex justify-between text-sm font-sans">
                <span className="text-zen-muted flex items-center gap-1.5"><MapPin size={13} /> Livraison</span>
                <span className="text-zen-bark text-right">
                  {order.shipping_address.firstName} {order.shipping_address.lastName}<br />
                  {order.shipping_address.city}, {order.shipping_address.countryCode}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm font-sans">
              <span className="text-zen-muted">Délai estimé</span>
              <span className="text-zen-bark">3–5 jours ouvrés</span>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3 pt-2">
          <Link href={`/${locale}/boutique`} className="btn-primary">
            Retourner à la boutique
          </Link>
          {isFailed && (
            <Link href={`/${locale}/checkout`} className="text-sm text-zen-muted hover:text-zen-bark font-sans transition-colors">
              Réessayer le paiement
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
