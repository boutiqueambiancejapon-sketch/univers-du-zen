import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  await supabase.auth.signOut();
  const referer = request.headers.get('referer') ?? '/';
  const locale = referer.match(/\/(fr-BE|fr-FR|nl-BE|nl-NL)\//)?.[1] ?? 'fr-BE';
  return NextResponse.redirect(new URL(`/${locale}/compte/connexion`, request.url));
}
