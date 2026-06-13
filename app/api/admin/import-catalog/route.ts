import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const { products } = body as { products: any[] };

  if (!Array.isArray(products) || products.length === 0) {
    return NextResponse.json({ error: 'Aucun produit reçu' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from('supplier_catalog').upsert(products, { onConflict: 'sku' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, count: products.length });
}
