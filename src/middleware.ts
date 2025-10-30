
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth'; // Simple auth using cookies

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow requests for static files, API routes, and auth pages
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') || // Allows files with extensions
    pathname === '/login' ||
    pathname === '/signup'
  ) {
    return NextResponse.next();
  }
  
  const session = await auth();

  // If there's no session and the user is not on an auth page, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If the user is logged in and tries to access login/signup, redirect to dashboard
  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
