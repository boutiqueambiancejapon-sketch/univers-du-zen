import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  let body: any;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 }); }

  const action = body?.action as string;
  const admin = createAdminClient();

  if (action === 'delete') {
    const { error } = await admin.from('product_reviews').delete().eq('id', params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'Action inconnue.' }, { status: 400 });
  }

  const patch: Record<string, unknown> = {
    status: action === 'approve' ? 'approved' : 'rejected',
    approved_at: action === 'approve' ? new Date().toISOString() : null,
  };

  const { error } = await admin.from('product_reviews').update(patch).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
