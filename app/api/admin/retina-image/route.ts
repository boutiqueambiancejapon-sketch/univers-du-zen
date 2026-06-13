import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';
const TOKEN = process.env.RETINA_API_TOKEN ?? '';

const ALLOWED = ['app.aiku.io', 'media.aiku.io', 'ancient-wisdom.co.uk', 'ancient-wisdom.com'];

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  let hostname: string;
  try { hostname = new URL(url).hostname; }
  catch { return new NextResponse('Invalid url', { status: 400 }); }

  if (!ALLOWED.some(d => hostname === d || hostname.endsWith('.' + d))) {
    return new NextResponse('Domain not allowed', { status: 403 });
  }

  // media.aiku.io URLs are signed CDN links — try without auth first, fall back with token
  const headers: Record<string, string> = {};
  if (TOKEN && !hostname.includes('media.aiku.io')) {
    headers['Authorization'] = `Bearer ${TOKEN}`;
  }

  const res = await fetch(url, { headers });
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
