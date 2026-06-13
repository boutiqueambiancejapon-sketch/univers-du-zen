/**
 * POST /api/mollie/create-payment
 * Crée un paiement Mollie et renvoie l'URL checkout hébergée.
 */
export async function POST(req: Request) {
  try {
    const {
      amount,
      method,
      description,
      locale,
      returnUrl,
      cancelUrl,
      customer,
      orderItems,
    } = await req.json();

    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'MOLLIE_API_KEY manquante' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://universduzen.com';

    const body: Record<string, unknown> = {
      amount: {
        currency: 'EUR',
        value: Number(amount).toFixed(2),
      },
      description: description ?? 'Commande Univers du Zen',
      redirectUrl: returnUrl ?? `${siteUrl}/${locale}/checkout/succes`,
      cancelUrl:   cancelUrl  ?? `${siteUrl}/${locale}/checkout`,
      webhookUrl:  `${siteUrl}/api/mollie/webhook`,
      locale: (locale === 'nl-BE' || locale === 'nl-NL') ? 'nl_BE' : 'fr_BE',
      metadata: JSON.stringify({ customer, orderItems }),
    };

    // Méthode optionnelle — si non fournie, Mollie affiche toutes les méthodes
    if (method && method !== 'auto') {
      body.method = method;
    }

    const res = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Mollie] Erreur création paiement:', data);
      return Response.json({ error: data.detail ?? 'Erreur Mollie' }, { status: res.status });
    }

    return Response.json({
      paymentId:   data.id,
      checkoutUrl: data._links?.checkout?.href,
      status:      data.status,
    });
  } catch (err) {
    console.error('[Mollie] Exception:', err);
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
