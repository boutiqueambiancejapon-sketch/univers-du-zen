/**
 * POST /api/mollie/webhook
 * Reçoit les notifications de statut Mollie.
 * Mollie envoie: id=tr_xxxxx (form-encoded)
 */
export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const paymentId = params.get('id');

    if (!paymentId) {
      return new Response('Missing id', { status: 400 });
    }

    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) return new Response('Config error', { status: 500 });

    // Vérification du statut réel (ne jamais faire confiance au webhook seul)
    const res = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      console.error('[Mollie webhook] Impossible de vérifier le paiement:', paymentId);
      return new Response('Error', { status: 500 });
    }

    const payment = await res.json();
    const status = payment.status; // paid | failed | canceled | expired | pending

    console.log(`[Mollie webhook] Paiement ${paymentId} — statut: ${status}`);

    // TODO: mettre à jour la commande en base (Supabase)
    // if (status === 'paid') { await createOrder(payment); }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('[Mollie webhook] Exception:', err);
    return new Response('Error', { status: 500 });
  }
}
