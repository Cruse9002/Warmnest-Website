import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  if (!userId && !isAuthPage) {
    // Redirect to login if trying to access protected route without being logged in
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (userId && isAuthPage) {
    // Redirect to dashboard if trying to access auth pages while logged in
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
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