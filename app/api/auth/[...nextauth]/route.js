import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '@/lib/supabase';

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
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists in Supabase
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select()
          .eq('email', user.email)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error checking user:', fetchError);
          return false;
        }

        // If user doesn't exist, create them
        if (!existingUser) {
          // Generate a UUID for the new user
          const { data: { user: supabaseUser }, error: authError } = await supabase.auth.admin.createUser({
            email: user.email,
            email_confirmed: true,
            user_metadata: {
              name: user.name,
              provider: account.provider
            }
          });

          if (authError) {
            console.error('Error creating Supabase auth user:', authError);
            return false;
          }

          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: supabaseUser.id, // This will be a UUID
                email: user.email,
                name: user.name,
                image: user.image,
                provider: account.provider,
                created_at: new Date().toISOString(),
              }
            ]);

          if (insertError) {
            console.error('Error creating user:', insertError);
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }
