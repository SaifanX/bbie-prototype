import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedRoutes = ['/dashboard', '/live-resolution', '/review', '/intelligence', '/search'];
  const pathname = request.nextUrl.pathname;

  // Check if pathname matches any protected route
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    const hasAuth = request.cookies.has('bbie_pin_auth');
    if (!hasAuth) {
      const url = request.nextUrl.clone();
      url.pathname = '/pin-auth';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/live-resolution/:path*',
    '/review/:path*',
    '/intelligence/:path*',
    '/search/:path*'
  ]
};
