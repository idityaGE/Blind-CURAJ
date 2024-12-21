import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/helpers/helper';

// Define protected paths that need authentication
const protectedPaths = ['/chat', '/profile', '/settings'];

// Define authentication paths
const authPaths = ['/signin', '/signup', '/verify'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  );

  // Check if the current path is an auth path
  const isAuthPath = authPaths.some(path =>
    pathname.startsWith(path)
  );

  // If no token and trying to access protected route
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If has token and trying to access auth routes
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // For protected routes or when token exists, verify the token
  if (token && (isProtectedPath || !isAuthPath)) {
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