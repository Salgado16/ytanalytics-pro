import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');
  const { pathname } = request.nextUrl;

  // Rotas que exigem autenticação
  const protectedRoutes = ['/channels', '/dashboard', '/analytics', '/videos', '/ideas', '/viral', '/niche', '/settings'];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Se tentar acessar rota protegida sem token, permite modo demonstração ou redireciona
  if (isProtectedRoute && !token) {
    const isDemo = request.nextUrl.searchParams.get('demo') === 'true';
    if (!isDemo) {
      const url = new URL('/', request.url);
      url.searchParams.set('mensagem', 'faca_login');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|terms|privacy).*)'],
};
