import { NextRequest, NextResponse } from 'next/server';
import { mollie } from '@/lib/mollie';
import { createAdminClient } from '@/lib/supabase/server';

function generateReference(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `UDZ-${ymd}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items, shippingAddress, email, countryCode, locale,
      paymentMethod, subtotalEur, shippingEur, totalEur, vatRate, vatAmountEur,
    } = body;

    const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const reference = generateReference();
    const supabase  = createAdminClient();

    // 1. Persist order (pending)
    const { data: order, error: dbErr } = await supabase
      .from('orders')
      .insert({
        reference,
        email,                        // column name is "email"
        items,
        shipping_address: shippingAddress,
        country_code:     countryCode,
        subtotal_eur:     subtotalEur,
        vat_rate:         vatRate,
        vat_amount_eur:   vatAmountEur,
        shipping_eur:     shippingEur,
        total_eur:        totalEur,
        status:           'pending_payment',
        locale,
        payment_method:   paymentMethod,
      })
      .select()
      .single();

    if (dbErr) throw new Error(`DB: ${dbErr.message}`);

    // 2. Create Mollie payment
    const mollieLocale = locale.replace('-', '_');
    const payment = await (mollie as any).payments.create({
      amount: { currency: 'EUR', value: totalEur.toFixed(2) },
      description:  `Commande Univers du Zen — ${reference}`,
      redirectUrl:  `${siteUrl}/${locale}/commande/confirmation?orderId=${order.id}`,
      webhookUrl:   `${siteUrl}/api/checkout/webhook`,
      method:       paymentMethod,
      locale:       mollieLocale,
      metadata:     { orderId: order.id, reference },
    });

    // 3. Save Mollie payment ID
    await supabase
      .from('orders')
      .update({ mollie_payment_id: payment.id })
      .eq('id', order.id);

    const checkoutUrl =
      payment._links?.checkout?.href ??
      payment.getCheckoutUrl?.() ??
      payment.checkoutUrl ?? null;

    if (!checkoutUrl) throw new Error('Mollie ne retourne pas d\'URL de checkout.');

    return NextResponse.json({ checkoutUrl });
  } catch (err: unknown) {
    console.error('[create-payment]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur interne' },
      { status: 500 },
    );
  }
}
