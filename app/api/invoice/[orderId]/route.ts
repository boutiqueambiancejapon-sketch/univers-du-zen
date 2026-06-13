import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const STATUS_FR: Record<string, string> = {
  paid: 'Payée', pending: 'En attente', processing: 'En préparation',
  shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée', failed: 'Échouée',
};

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Non autorisé', { status: 401 });

  const admin = createAdminClient();
  const { data: order } = await admin
    .from('orders')
    .select('*')
    .eq('id', params.orderId)
    .eq('email', user.email!)
    .single();

  if (!order) return new NextResponse('Commande introuvable', { status: 404 });

  const addr = order.shipping_address ?? {};
  const items: any[] = order.items ?? [];
  const date = new Date(order.created_at).toLocaleDateString('fr-BE', { day: '2-digit', month: 'long', year: 'numeric' });
  const vatRate = ((order.vat_rate ?? 0.21) * 100).toFixed(0);
  const orderNum = order.id.slice(0, 8).toUpperCase();

  const itemsRows = items.map((item: any) => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;">${item.nameFr ?? item.sku}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;">${Number(item.unitPriceEur).toFixed(2).replace('.', ',')} €</td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${Number(item.totalEur).toFixed(2).replace('.', ',')} €</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Facture #${orderNum} — Univers du Zen</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #2C2418; background: #fff; padding: 48px; max-width: 800px; margin: 0 auto; font-size: 14px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
    .logo { font-size: 24px; font-weight: 300; letter-spacing: 0.15em; color: #2C2418; }
    .logo span { color: #B5694B; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { font-size: 32px; font-weight: 700; letter-spacing: 0.05em; color: #2C2418; }
    .invoice-title p { color: #888; font-size: 13px; margin-top: 4px; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
    .meta-block label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #aaa; display: block; margin-bottom: 6px; }
    .meta-block p { color: #2C2418; line-height: 1.6; }
    .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #e6f4ea; color: #2d7a45; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #FAF8F5; }
    thead th { padding: 12px 8px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; font-weight: 600; }
    thead th:last-child, thead th:nth-child(3), thead th:nth-child(2) { text-align: right; }
    thead th:nth-child(2) { text-align: center; }
    .totals { margin-left: auto; width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #555; }
    .totals-row.total { padding-top: 12px; border-top: 2px solid #2C2418; font-size: 18px; font-weight: 700; color: #2C2418; margin-top: 6px; }
    .footer { margin-top: 64px; padding-top: 24px; border-top: 1px solid #eee; font-size: 11px; color: #aaa; text-align: center; line-height: 1.8; }
    .print-btn { position: fixed; bottom: 24px; right: 24px; background: #2C2418; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
    @media print { .print-btn { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">UNIVERS DU <span>ZEN</span></div>
      <p style="font-size:12px;color:#aaa;margin-top:4px;">universduzen.com</p>
    </div>
    <div class="invoice-title">
      <h1>FACTURE</h1>
      <p>#${orderNum}</p>
      <p style="margin-top:8px;">${date}</p>
    </div>
  </div>

  <div class="meta">
    <div class="meta-block">
      <label>Vendeur</label>
      <p><strong>Univers du Zen SRL</strong><br>Belgique<br>boutiqueambiancejapon@gmail.com</p>
    </div>
    <div class="meta-block">
      <label>Livraison à</label>
      <p>${addr.firstName ?? ''} ${addr.lastName ?? ''}<br>${addr.line1 ?? ''}${addr.line2 ? ', ' + addr.line2 : ''}<br>${addr.postalCode ?? ''} ${addr.city ?? ''}<br>${addr.countryCode ?? ''}</p>
    </div>
    <div class="meta-block">
      <label>Email client</label>
      <p>${order.email}</p>
    </div>
    <div class="meta-block">
      <label>Statut</label>
      <p><span class="status-badge">${STATUS_FR[order.status] ?? order.status}</span></p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Produit</th>
        <th>Qté</th>
        <th>Prix unit.</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Sous-total</span><span>${Number(order.subtotal_eur ?? order.total_eur - (order.shipping_eur ?? 0)).toFixed(2).replace('.', ',')} €</span></div>
    <div class="totals-row"><span>Livraison</span><span>${Number(order.shipping_eur ?? 0).toFixed(2).replace('.', ',')} €</span></div>
    <div class="totals-row"><span>TVA (${vatRate}%)</span><span>${Number(order.vat_amount_eur ?? 0).toFixed(2).replace('.', ',')} €</span></div>
    <div class="totals-row total"><span>Total TTC</span><span>${Number(order.total_eur ?? 0).toFixed(2).replace('.', ',')} €</span></div>
  </div>

  <div class="footer">
    Univers du Zen — Paiement sécurisé — Retours sous 30 jours<br>
    Cette facture est générée électroniquement et fait foi sans signature.
  </div>

  <button class="print-btn" onclick="window.print()">⬇ Imprimer / PDF</button>
  <script>setTimeout(() => window.print(), 800);<\/script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="facture-${orderNum}.html"`,
    },
  });
}
