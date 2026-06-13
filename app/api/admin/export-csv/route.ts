import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';

function escapeCSV(val: unknown): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: Request) {
  // Auth
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const from   = url.searchParams.get('from');
  const to     = url.searchParams.get('to');

  const admin = createAdminClient();
  let query = admin.from('orders').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  if (from)   query = query.gte('created_at', from);
  if (to)     query = query.lte('created_at', to);

  const { data: orders } = await query;

  const headers = [
    'ID', 'Date', 'Email', 'Statut', 'Pays',
    'Total TTC', 'Livraison', 'TVA', 'CA HT',
    'Prenom', 'Nom', 'Adresse', 'Ville', 'CP',
    'ID Fournisseur', 'Tracking', 'Articles',
  ];

  const rows = (orders ?? []).map(o => {
    const addr  = o.shipping_address ?? {};
    const items: any[] = o.items ?? [];
    const articlesStr = items.map((i: any) => `${i.quantity}x ${i.nameFr ?? i.sku}`).join(' | ');
    return [
      o.id,
      new Date(o.created_at).toISOString().slice(0, 10),
      o.email,
      o.status,
      o.country_code ?? '',
      (o.total_eur ?? 0).toFixed(2),
      (o.shipping_eur ?? 0).toFixed(2),
      (o.vat_amount_eur ?? 0).toFixed(2),
      ((o.total_eur ?? 0) - (o.vat_amount_eur ?? 0)).toFixed(2),
      addr.firstName ?? '',
      addr.lastName ?? '',
      addr.line1 ?? '',
      addr.city ?? '',
      addr.postalCode ?? '',
      o.supplier_order_id ?? '',
      o.tracking_number ?? '',
      articlesStr,
    ];
  });

  const csv = [headers, ...rows]
    .map(row => row.map(escapeCSV).join(','))
    .join('\n');

  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="commandes-${date}.csv"`,
    },
  });
}
