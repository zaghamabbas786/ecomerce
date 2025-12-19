import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the session token from cookies
  const sessionToken = request.cookies.get('authjs.session-token')?.value ||
                       request.cookies.get('__Secure-authjs.session-token')?.value;
  
  const isLoggedIn = !!sessionToken;
  
  // For admin routes, we'll do server-side checks in the layout
  // Middleware just ensures basic auth requirement
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/auth');
  const isAccountRoute = pathname.startsWith('/account');

  // Protect admin routes - require login
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Protect account routes - require login
  if (isAccountRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

