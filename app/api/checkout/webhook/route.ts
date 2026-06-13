import { NextRequest, NextResponse } from 'next/server';
import { mollie } from '@/lib/mollie';
import { createAdminClient } from '@/lib/supabase/server';

// Mollie envoie le payment ID en POST form-data
export async function POST(req: NextRequest) {
  try {
    const body      = await req.formData();
    const paymentId = body.get('id') as string | null;
    if (!paymentId) return NextResponse.json({ error: 'No payment ID' }, { status: 400 });

    // Fetch payment status from Mollie
    const payment = await (mollie as any).payments.get(paymentId);
    const orderId = payment.metadata?.orderId as string | undefined;
    if (!orderId) return NextResponse.json({ ok: true }); // unknown order, ignore

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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[mollie-webhook]', err);
    // Always return 200 to Mollie to prevent retries on non-critical errors
    return NextResponse.json({ ok: true });
  }
}
