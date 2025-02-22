import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // If the user is authenticated and trying to access the login page,
    // redirect them to the dashboard
    if (req.nextUrl.pathname === '/login' && req.nextauth.token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public paths that don't require authentication
        const publicPaths = ['/login', '/api/auth', '/', '/terms-of-service', '/privacy-policy'];
        const isPublicPath = publicPaths.some(path => 
          req.nextUrl.pathname.startsWith(path)
        );

        // Allow access to public paths without authentication
        if (isPublicPath) return true;

        // Require authentication for all other paths
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/dashboard/:path*', '/playground/:path*'],
};
