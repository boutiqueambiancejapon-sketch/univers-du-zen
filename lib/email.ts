/**
 * Emails transactionnels via Resend (server-only).
 * Envoi best-effort : ne lève jamais d'exception bloquante.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL ?? 'commandes@universduzen.com';
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://universduzen.com';

const BARK = '#3B2A1F';
const TERRA = '#C4714A';
const MUTED = '#675A4E';
const BEIGE = '#F5EFE6';
const CREAM = '#FAF8F5';

function euro(n: unknown): string {
  const v = typeof n === 'number' ? n : parseFloat(String(n ?? 0));
  return (Number.isFinite(v) ? v : 0).toFixed(2).replace('.', ',') + ' €';
}

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface OrderItem { name?: string; quantity?: number; price?: number }
interface OrderRow {
  reference?: string;
  email?: string;
  locale?: string;
  items?: OrderItem[];
  shipping_address?: Record<string, any>;
  subtotal_eur?: number;
  shipping_eur?: number;
  total_eur?: number;
}

async function sendViaResend(to: string, subject: string, html: string, bcc?: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY manquante — email non envoyé');
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Univers du Zen <${FROM}>`,
        to: [to],
        ...(bcc ? { bcc: [bcc] } : {}),
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error('[email] Resend error', res.status, await res.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] exception', err);
    return false;
  }
}

function orderConfirmationHtml(order: OrderRow): string {
  const locale = order.locale ?? 'fr-BE';
  const addr = order.shipping_address ?? {};
  const items = Array.isArray(order.items) ? order.items : [];

  const rows = items.map((it) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BEIGE};color:${BARK};font-size:14px;font-family:Helvetica,Arial,sans-serif;">
        ${esc(it.name)} <span style="color:${MUTED};">× ${esc(it.quantity ?? 1)}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${BEIGE};text-align:right;color:${BARK};font-size:14px;font-family:Helvetica,Arial,sans-serif;white-space:nowrap;">
        ${euro((it.price ?? 0) * (it.quantity ?? 1))}
      </td>
    </tr>`).join('');

  const addrLine = [addr.line1, `${esc(addr.postalCode ?? '')} ${esc(addr.city ?? '')}`.trim(), addr.countryCode]
    .filter(Boolean).map(esc).join(', ');

  return `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${CREAM};margin:0;padding:32px 0;font-family:Georgia,'Times New Roman',serif;">
  <tr><td align="center">
    <table width="540" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border:1px solid #ECE4D8;border-radius:16px;overflow:hidden;">
      <tr><td style="background:${BARK};padding:26px 32px;text-align:center;">
        <span style="color:#F2ECE0;font-size:18px;letter-spacing:3px;font-weight:700;">UNIVERS DU ZEN</span>
      </td></tr>
      <tr><td style="padding:36px 36px 8px;">
        <h1 style="margin:0 0 8px;color:${BARK};font-size:24px;">Merci pour votre commande&nbsp;!</h1>
        <p style="margin:0 0 4px;color:${MUTED};font-size:15px;line-height:1.6;font-family:Helvetica,Arial,sans-serif;">
          Bonjour ${esc(addr.firstName ?? '')}, votre paiement a bien été reçu. Voici le récapitulatif de votre commande.
        </p>
        <p style="margin:8px 0 0;color:${BARK};font-size:14px;font-family:Helvetica,Arial,sans-serif;">
          Référence&nbsp;: <strong>${esc(order.reference ?? '')}</strong>
        </p>
      </td></tr>
      <tr><td style="padding:20px 36px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          ${rows}
          <tr>
            <td style="padding:14px 0 4px;color:${MUTED};font-size:14px;font-family:Helvetica,Arial,sans-serif;">Sous-total</td>
            <td style="padding:14px 0 4px;text-align:right;color:${MUTED};font-size:14px;font-family:Helvetica,Arial,sans-serif;">${euro(order.subtotal_eur)}</td>
          </tr>
          <tr>
            <td style="padding:2px 0;color:${MUTED};font-size:14px;font-family:Helvetica,Arial,sans-serif;">Livraison</td>
            <td style="padding:2px 0;text-align:right;color:${MUTED};font-size:14px;font-family:Helvetica,Arial,sans-serif;">${(order.shipping_eur ?? 0) > 0 ? euro(order.shipping_eur) : 'Offerte'}</td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;color:${BARK};font-size:17px;font-weight:700;border-top:2px solid ${BEIGE};font-family:Helvetica,Arial,sans-serif;">Total</td>
            <td style="padding:10px 0 0;text-align:right;color:${BARK};font-size:17px;font-weight:700;border-top:2px solid ${BEIGE};font-family:Helvetica,Arial,sans-serif;">${euro(order.total_eur)}</td>
          </tr>
        </table>
        <p style="margin:6px 0 0;color:${MUTED};font-size:12px;font-family:Helvetica,Arial,sans-serif;">TVA incluse</p>
      </td></tr>
      <tr><td style="padding:24px 36px 0;">
        <p style="margin:0 0 4px;color:${BARK};font-size:13px;font-weight:700;font-family:Helvetica,Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;">Livraison</p>
        <p style="margin:0;color:${MUTED};font-size:14px;line-height:1.6;font-family:Helvetica,Arial,sans-serif;">
          ${esc(addr.firstName ?? '')} ${esc(addr.lastName ?? '')}<br>${addrLine}
        </p>
        <p style="margin:10px 0 0;color:${MUTED};font-size:14px;font-family:Helvetica,Arial,sans-serif;">
          Expédition sous 24h ouvrées · livraison estimée sous 3 à 5 jours ouvrables.
        </p>
      </td></tr>
      <tr><td style="padding:28px 36px 36px;text-align:center;">
        <a href="${SITE}/${locale}/compte/commandes" style="display:inline-block;padding:13px 30px;background:${TERRA};color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;font-family:Helvetica,Arial,sans-serif;">
          Suivre ma commande
        </a>
      </td></tr>
      <tr><td style="background:${BEIGE};padding:20px 36px;text-align:center;">
        <p style="margin:0;color:#9A8C80;font-size:12px;font-family:Helvetica,Arial,sans-serif;">
          Une question&nbsp;? Répondez simplement à cet email.<br>
          Univers du Zen · Bien-être naturel &amp; éthique · © 2026
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>`;
}

/** Envoie l'email de confirmation de commande au client (+ copie admin si configurée). */
export async function sendOrderConfirmationEmail(order: OrderRow): Promise<boolean> {
  if (!order.email) return false;
  const subject = `Confirmation de votre commande ${order.reference ?? ''} — Univers du Zen`;
  const html = orderConfirmationHtml(order);
  const bcc = process.env.ADMIN_EMAIL || undefined;
  return sendViaResend(order.email, subject, html, bcc);
}
