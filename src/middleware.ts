
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth'; // Simple auth using cookies

export async function middleware(request: NextRequest) {
  // DEVELOPMENT BYPASS: if the flag is set, allow all requests.
  if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  
  const isPublicPage = pathname === '/login' || pathname === '/signup';
  
  // Ignora rotas de API, arquivos estáticos, etc.
  const isApiOrStatic = pathname.startsWith('/api/') || 
                        pathname.startsWith('/static/') || 
                        pathname.startsWith('/_next/') || 
                        pathname.includes('.');

  if (isApiOrStatic) {
    return NextResponse.next();
  }

  const session = await auth();

  // Se o usuário não está logado e tenta acessar uma página protegida
  if (!session && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se o usuário está logado e tenta acessar uma página pública (como /login)
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

    