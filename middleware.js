import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // If user is not authenticated and tries to access protected routes
    if (!req.nextauth.token) {
      if (req.nextUrl.pathname.startsWith('/dashboard') || 
          req.nextUrl.pathname.startsWith('/playground')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // If user is authenticated and tries to access home page
    if (req.nextUrl.pathname === '/' && req.nextauth.token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Require authentication for dashboard and playground
        if (req.nextUrl.pathname.startsWith('/dashboard') || 
            req.nextUrl.pathname.startsWith('/playground')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/dashboard/:path*', '/playground/:path*'],
};
