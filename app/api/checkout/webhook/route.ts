import { NextRequest, NextResponse } from 'next/server';
import { mollie } from '@/lib/mollie';
import { createAdminClient } from '@/lib/supabase/server';
import { placeOrder } from '@/lib/retina';

export async function POST(req: NextRequest) {
  try {
    const body      = await req.formData();
    const paymentId = body.get('id') as string | null;
    if (!paymentId) return NextResponse.json({ error: 'No payment ID' }, { status: 400 });

    const payment = await (mollie as any).payments.get(paymentId);
    const orderId = payment.metadata?.orderId as string | undefined;
    if (!orderId) return NextResponse.json({ ok: true });

    const STATUS_MAP: Record<string, string> = {
      paid:       'paid',
      pending:    'pending_payment',
      authorized: 'paid',
      failed:     'cancelled',
      canceled:   'cancelled',
      expired:    'cancelled',
    };
    const newStatus = STATUS_MAP[payment.status] ?? 'pending_payment';

    const supabase = createAdminClient();

    await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    // Paiement confirmé → passer commande fournisseur automatiquement
    if (newStatus === 'paid') {
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      const fulfillmentEnabled = process.env.RETINA_FULFILLMENT_ENABLED === 'true';

      if (order && !order.supplier_order_id && !fulfillmentEnabled) {
        // Sécurité : tant que RETINA_FULFILLMENT_ENABLED n'est pas activé dans Vercel,
        // on n'envoie PAS la commande au fournisseur (évite de payer Retina pendant les tests).
        console.warn('[webhook] Fulfillment Retina désactivé — commande payée non transmise:', orderId);
      } else if (order && !order.supplier_order_id) {
        try {
          const addr = order.shipping_address ?? {};

          const retinaOrder = await placeOrder(
            (order.items ?? []).map((i: any) => ({
              product_id: parseInt(String(i.productId), 10), // Retina attend un entier
              quantity:   i.quantity,
            })),
            {
              first_name: addr.firstName  ?? '',
              last_name:  addr.lastName   ?? '',
              email:      order.email     ?? '',
              phone:      addr.phone,
              address1:   addr.line1      ?? '',
              address2:   addr.line2,
              city:       addr.city       ?? '',
              zip:        addr.postalCode ?? '',
              country:    addr.countryCode ?? 'BE',
            },
            order.reference,
          );

          await supabase
            .from('orders')
            .update({ supplier_order_id: retinaOrder.id, status: 'processing' })
            .eq('id', orderId);

        } catch (retinaErr) {
          console.error('[webhook] Retina order failed:', retinaErr);
          await supabase
            .from('orders')
            .update({ status: 'paid_retina_error' })
            .eq('id', orderId);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[mollie-webhook]', err);
    return NextResponse.json({ ok: true }); // toujours 200 pour Mollie
  }
}
