import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Allow access to playground without redirection
    if (req.nextUrl.pathname.startsWith('/playground')) {
      return NextResponse.next();
    }

    // If the user is authenticated and trying to access the home page,
    // redirect them to the dashboard
    if (req.nextUrl.pathname === '/' && req.nextauth.token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only require auth for dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token;
        }
        // Allow all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/dashboard/:path*', '/playground/:path*'],
};
