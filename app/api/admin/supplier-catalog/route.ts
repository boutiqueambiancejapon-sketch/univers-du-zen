import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dept    = searchParams.get('dept') ?? '';
  const family  = searchParams.get('family') ?? '';
  const search  = searchParams.get('search') ?? '';
  const inStock = searchParams.get('in_stock') === 'true';
  const page    = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const per     = Math.min(100, parseInt(searchParams.get('per') ?? '48', 10));

  const admin = createAdminClient();
  let query = admin.from('supplier_catalog').select('*', { count: 'exact' });

  if (dept)    query = query.eq('dept', dept);
  if (family)  query = query.eq('family_code', family);
  if (inStock) query = query.eq('in_stock', true);
  if (search)  query = query.ilike('name', `%${search}%`);

  query = query
    .order('dept')
    .order('name')
    .range((page - 1) * per, page * per - 1);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, total: count, page, per });
}
