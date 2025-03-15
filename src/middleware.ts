import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public paths that don't require authentication
const publicPaths = ['/login', '/api/auth'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow access to public paths
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // Allow access to static files and API routes
  if (
    path.includes('/_next') || 
    path.includes('/api/') ||
    path.includes('/static') ||
    path.match(/\.(ico|png|jpg|jpeg|gif|svg)$/)
  ) {
    return NextResponse.next();
  }

  // Check for Firebase auth token in the cookie
  const token = request.cookies.get('__session')?.value;

  // Redirect to login if no token exists
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)'],
}; 