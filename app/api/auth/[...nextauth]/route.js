import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Handle redirect after sign in
      if (url.startsWith('/')) {
        // Make sure to handle relative URLs
        return `${baseUrl}${url}`
      } else if (url.startsWith(baseUrl)) {
        // Handle URLs from the same origin
        return url
      }
      // Default to homepage for other cases
      return baseUrl
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token;
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST };
