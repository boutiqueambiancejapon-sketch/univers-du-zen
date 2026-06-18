import { NextRequest, NextResponse } from 'next/server';
import { mollie } from '@/lib/mollie';
import { createAdminClient } from '@/lib/supabase/server';
import { getPublishedProducts } from '@/lib/get-products';
import { getVatRate } from '@/lib/vat';

const FREE_SHIPPING_THRESHOLD = 59;
const SHIPPING_COST = 4.95;

function generateReference(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `UDZ-${ymd}-${rand}`;
}

interface IncomingItem { productId?: string | number; quantity?: number }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items, shippingAddress, email, countryCode, locale, paymentMethod,
    } = body as {
      items: IncomingItem[];
      shippingAddress: Record<string, unknown>;
      email: string;
      countryCode: string;
      locale: string;
      paymentMethod: string;
    };

    if (!email || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Commande invalide.' }, { status: 400 });
    }

    // ─── Source de vérité : prix + stock réels (serveur), jamais le client ───
    const catalog = await getPublishedProducts();
    const byId = new Map(catalog.map(p => [String(p.id), p]));

    const issues: string[] = [];
    let subtotal = 0;
    const safeItems: { productId: string; name: string; quantity: number; price: number }[] = [];

    for (const it of items) {
      const id = String(it.productId ?? '');
      const qty = Math.max(1, Math.floor(Number(it.quantity ?? 1)));
      const p = byId.get(id);

      if (!p) { issues.push(`Un produit n'est plus disponible et a été retiré.`); continue; }
      if (p.stockStatus === 'OutOfStock' || (p.stockQty ?? 0) <= 0) {
        issues.push(`« ${p.nameFr} » est en rupture de stock.`);
        continue;
      }
      if ((p.stockQty ?? 0) < qty) {
        issues.push(`« ${p.nameFr} » : seulement ${p.stockQty} en stock.`);
        continue;
      }
      const price = p.retailPriceEur ?? 0;
      subtotal += price * qty;
      safeItems.push({ productId: id, name: p.nameFr ?? '', quantity: qty, price });
    }

    if (issues.length > 0) {
      return NextResponse.json({ error: issues.join(' '), issues }, { status: 409 });
    }
    if (safeItems.length === 0) {
      return NextResponse.json({ error: 'Aucun produit disponible dans votre panier.' }, { status: 409 });
    }

    // ─── Montants recalculés côté serveur ───
    subtotal = Math.round(subtotal * 100) / 100;
    const shippingEur = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totalEur = Math.round((subtotal + shippingEur) * 100) / 100;
    const vatRate = getVatRate(countryCode ?? 'BE');
    const vatAmountEur = Math.round((totalEur - totalEur / (1 + vatRate)) * 100) / 100;

    const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const reference = generateReference();
    const supabase  = createAdminClient();

    // 1. Persiste la commande (pending) avec les valeurs serveur
    const { data: order, error: dbErr } = await supabase
      .from('orders')
      .insert({
        reference,
        email,
        items: safeItems,
        shipping_address: shippingAddress,
        country_code:     countryCode,
        subtotal_eur:     subtotal,
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

    // 2. Crée le paiement Mollie sur le montant serveur
    const mollieLocale = (locale ?? 'fr-BE').replace('-', '_');
    const payment = await (mollie as any).payments.create({
      amount: { currency: 'EUR', value: totalEur.toFixed(2) },
      description:  `Commande Univers du Zen — ${reference}`,
      redirectUrl:  `${siteUrl}/${locale}/commande/confirmation?orderId=${order.id}`,
      webhookUrl:   `${siteUrl}/api/checkout/webhook`,
      method:       paymentMethod,
      locale:       mollieLocale,
      metadata:     { orderId: order.id, reference },
    });

    // 3. Sauve l'ID de paiement Mollie
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
