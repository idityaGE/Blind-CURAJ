import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/helpers/helper';

export async function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get('token');

  // Define public paths that don't need authentication
  const publicPaths = ['/signin', '/signup', '/verify', '/'];

  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path)
  );

  // If no token and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If has token and trying to access auth routes (signin/signup/verify)
  if (token && isPublicPath && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // For protected routes or home route with token, verify the token
  if (token && (!isPublicPath || request.nextUrl.pathname === '/')) {
    try {
      const decoded = verifyToken(token.value);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('user', JSON.stringify(decoded));

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // If token is invalid, clear it and redirect to signin
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};