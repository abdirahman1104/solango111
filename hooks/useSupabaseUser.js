import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useSupabaseUser() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (session?.user?.email) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (error) {
            console.error('Error fetching user:', error);
            return;
          }

          setUser(data);
        } catch (error) {
          console.error('Error in fetchUser:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    }

    fetchUser();
  }, [session]);

  return { user, loading };
}
