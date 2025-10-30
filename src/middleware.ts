
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth'; // Simple auth using cookies

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  const isPublicPage = pathname === '/login' || pathname === '/signup';
  const isApiOrStatic = pathname.startsWith('/api/') || 
                        pathname.startsWith('/static/') || 
                        pathname.startsWith('/_next/') || 
                        pathname.includes('.');

  if (isApiOrStatic) {
    return NextResponse.next();
  }

  // If the user is not logged in and is trying to access a protected page
  if (!session && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is logged in and tries to access a public page (like login)
  if (session && isPublicPage) {
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
