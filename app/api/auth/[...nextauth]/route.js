import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabaseAdmin } from '@/lib/supabase';

async function saveUserToSupabase(user) {
  try {
    console.log('Starting saveUserToSupabase for:', user.email);
    
    // Check if user exists using admin client
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing user:', fetchError);
      return null;
    }

    const now = new Date().toISOString();

    if (existingUser) {
      console.log('Updating existing user:', existingUser.email);
      // Update existing user using admin client
      const { data, error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          name: user.name,
          image: user.picture,
          last_sign_in: now
        })
        .eq('email', user.email)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        return existingUser;
      }
      return data;
    }

    console.log('Creating new user:', user.email);
    // Create new user using admin client
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email: user.email,
          name: user.name,
          image: user.picture,
          provider: 'google',
          created_at: now,
          last_sign_in: now
        }
      ])
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return {
        email: user.email,
        name: user.name,
        image: user.picture
      };
    }

    return newUser;
  } catch (error) {
    console.error('Error in saveUserToSupabase:', error);
    return {
      email: user.email,
      name: user.name,
      image: user.picture
    };
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log('SignIn callback started', { user, account });
        
        if (!user?.email) {
          console.error('No email provided in user object');
          return false;
        }

        const supabaseUser = await saveUserToSupabase({
          email: user.email,
          name: user.name,
          picture: user.image
        });

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return true;
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
        }
        return token;
      } catch (error) {
        console.error('Error in jwt callback:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user) {
          session.user.email = token.email;
          session.user.name = token.name;
          session.user.image = token.picture;
        }
        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        return session;
      }
    }
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST };
