import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) return false;
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        // Get user data from Supabase
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (userData) {
          session.user.id = userData.id;
          session.user.role = userData.role;
        }
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        // Check if user exists in Supabase
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('email', token.email)
          .single();

        if (!existingUser) {
          // Create new user in Supabase
          await supabase.from('users').insert([
            {
              email: token.email,
              name: token.name,
              image: token.picture,
              provider: 'google',
            },
          ]);
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
