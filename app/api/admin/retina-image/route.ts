import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';
const BASE  = process.env.RETINA_API_BASE ?? 'https://app.aiku.io/app/re-api';
const TOKEN = process.env.RETINA_API_TOKEN ?? '';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  // Only allow Retina/Aiku domains
  const allowed = ['app.aiku.io', 'ancient-wisdom.co.uk', 'ancient-wisdom.com'];
  const hostname = new URL(url).hostname;
  if (!allowed.some(d => hostname.endsWith(d))) {
    return new NextResponse('Domain not allowed', { status: 403 });
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) return new NextResponse('Image not found', { status: 404 });

  const blob = await res.arrayBuffer();
  const contentType = res.headers.get('content-type') ?? 'image/jpeg';

  return new NextResponse(blob, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
