import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : null;

// Ensure Supabase is properly initialized
if (!supabase) {
  console.error('Supabase client could not be initialized. Check your environment variables.');
}

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
      
      // Skip Supabase operations if client isn't initialized
      if (!supabase) {
        console.error('Supabase client not initialized during sign in');
        return true; // Still allow sign in even if Supabase fails
      }

      try {
        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('email', user.email)
          .single();

        if (!existingUser) {
          // Create new user
          await supabase.from('users').insert([
            {
              email: user.email,
              name: user.name,
              image: user.image,
              provider: 'google',
            },
          ]);
        }
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return true; // Still allow sign in even if Supabase operations fail
      }
    },
    async session({ session, token }) {
      if (session?.user && supabase) {
        try {
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
        } catch (error) {
          console.error('Error in session callback:', error);
        }
      }
      return session;
    },
    async jwt({ token, account }) {
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
