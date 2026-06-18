import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { hasPurchased } from '@/lib/reviews';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? '';
  const sku = searchParams.get('sku') ?? undefined;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ loggedIn: false, eligible: false, reason: 'not_logged_in' });
  }
  if (!slug) {
    return NextResponse.json({ loggedIn: true, eligible: false, reason: 'bad_request' });
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from('product_reviews')
    .select('id, status')
    .eq('product_slug', slug)
    .ilike('author_email', user.email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({
      loggedIn: true,
      eligible: false,
      reason: 'already_reviewed',
      status: (existing as any).status,
    });
  }

  const { purchased } = await hasPurchased(user.email, slug, sku ? String(sku) : undefined);
  if (!purchased) {
    return NextResponse.json({ loggedIn: true, eligible: false, reason: 'not_purchased' });
  }

  const suggestedName =
    (user.user_metadata?.first_name as string | undefined) ?? user.email.split('@')[0];

  return NextResponse.json({ loggedIn: true, eligible: true, suggestedName });
}
