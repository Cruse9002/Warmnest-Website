import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateCSP, generateHSTS, securityHeaders, createHTTPSRedirect } from '@/lib/security';

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isDebugPage = request.nextUrl.pathname === '/debug';
  const isServiceWorker = request.nextUrl.pathname === '/sw.js';
  const isPublicAsset = request.nextUrl.pathname.startsWith('/assets/') || 
                       request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|mp3|wav|ogg)$/);
  const response = NextResponse.next();

  // Skip middleware for service worker and public assets
  if (isServiceWorker || isPublicAsset) {
    return response;
  }

  // HTTPS redirect (only in production)
  if (process.env.NODE_ENV === 'production') {
    const httpsRedirect = createHTTPSRedirect();
    const redirectResponse = httpsRedirect(request);
    if (redirectResponse) {
      return redirectResponse;
    }
  }

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // HSTS header (only for HTTPS)
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', generateHSTS());
  }

  // Content Security Policy
  response.headers.set('Content-Security-Policy', generateCSP());

  // Add caching headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Add caching headers for images
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Add caching headers for fonts
  if (request.nextUrl.pathname.match(/\.(woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Add compression headers
  response.headers.set('Accept-Encoding', 'gzip, deflate, br');

  // Skip authentication logic for debug page
  if (isDebugPage) {
    return response;
  }

  // Authentication logic
  if (!userId && !isAuthPage) {
    // Redirect to login if trying to access protected route without being logged in
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (userId && isAuthPage) {
    // Redirect to dashboard if trying to access auth pages while logged in
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 