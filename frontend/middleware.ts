import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/helpers/helper';

// Define protected paths that need authentication
const protectedPaths = ['/chat'];

// Define authentication paths
const authPaths = ['/signin', '/signup', '/verify', '/forgot-pin', '/reset-pin'];

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

  // Handle token validation first if token exists
  if (token) {
    try {
      const decoded = await verifyToken(token.value);

      // Token is valid - handle different paths
      if (isAuthPath) {
        // Special handling for reset-pin with token parameter
        if (pathname.startsWith('/reset-pin') && request.nextUrl.searchParams.has('token')) {
          return NextResponse.next();
        }
        // Redirect to home if trying to access auth paths with valid token
        return NextResponse.redirect(new URL('/', request.url));
      }

      // For all other paths with valid token, proceed with user data
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('user', JSON.stringify(decoded));

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Invalid token - clear it and redirect to signin
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // Handle cases without token
  if (isProtectedPath) {
    // Redirect to signin if trying to access protected route without token
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Special handling for reset-pin without token in URL
  if (pathname.startsWith('/reset-pin') && !request.nextUrl.searchParams.has('token')) {
    return NextResponse.redirect(new URL('/forgot-pin', request.url));
  }

  // Allow access to public routes and auth routes without token
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