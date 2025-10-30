
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth'; // Simple auth using cookies

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`\n[middleware] Nova requisição para: ${pathname}`);

  const isPublicPage = pathname === '/login' || pathname === '/signup';
  
  // Ignora rotas de API, arquivos estáticos, etc.
  const isApiOrStatic = pathname.startsWith('/api/') || 
                        pathname.startsWith('/static/') || 
                        pathname.startsWith('/_next/') || 
                        pathname.includes('.');

  if (isApiOrStatic) {
    console.log('[middleware] Rota de API/estática. Ignorando.');
    return NextResponse.next();
  }

  const session = await auth();

  // Se o usuário não está logado e tenta acessar uma página protegida
  if (!session && !isPublicPage) {
    console.log(`[middleware] Sem sessão. Redirecionando para /login.`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se o usuário está logado e tenta acessar uma página pública (como /login)
  if (session && isPublicPage) {
    console.log(`[middleware] Sessão ativa. Redirecionando para /.`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log(`[middleware] Acesso permitido para ${pathname}.`);
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
