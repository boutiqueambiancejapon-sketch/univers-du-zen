import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing, type Locale } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const COUNTRY_LOCALE_MAP: Record<string, Locale> = {
  BE: 'fr-BE',
  FR: 'fr-FR',
  LU: 'fr-BE',
  NL: 'nl-NL',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass assets, API routes and admin
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Géolocalisation Vercel — redirection à la racine uniquement
  const isRoot = pathname === '/';
  if (isRoot) {
    const country = request.headers.get('x-vercel-ip-country') ?? 'BE';
    const locale = COUNTRY_LOCALE_MAP[country] ?? 'fr-BE';
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|api|admin|favicon.ico|images|.*\..*).*)'],
};
