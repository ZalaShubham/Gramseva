import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1️⃣ Root path – send to default locale login page
  if (pathname === '/' || pathname === '/gu' || pathname === '/en' || pathname === '/hi') {
    const locale = pathname === '/' ? 'gu' : pathname.slice(1);
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2️⃣ If accessing a protected route without a session cookie, redirect to login
  const sessionCookie = request.cookies.get('gramseva_session');
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !sessionCookie) {
    // Preserve intended destination
    const redirectTo = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
    const locale = request.nextUrl.locale ?? 'gu';
    const loginUrl = new URL(`/${locale}/login?next=${redirectTo}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3️⃣ If a logged‑in user accesses the login page, forward them to dashboard
  if (pathname.includes('/login') && sessionCookie) {
    const locale = request.nextUrl.locale ?? 'gu';
    const dashUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
