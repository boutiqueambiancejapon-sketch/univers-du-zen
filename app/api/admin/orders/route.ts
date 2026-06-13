import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: orders } = await admin
    .from('orders')
    .select('id, email, created_at, status, total_eur, country_code, items, supplier_order_id, tracking_number')
    .order('created_at', { ascending: false });

  return NextResponse.json({ orders: orders ?? [] });
}
