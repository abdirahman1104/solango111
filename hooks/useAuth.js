import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';

export function useAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (session?.user?.email) {
        const userData = await getCurrentUser(session.user.email);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    if (status === 'loading') {
      return;
    }

    loadUser();
  }, [session, status]);

  return {
    user,
    loading: status === 'loading' || loading,
    isAuthenticated: !!session,
  };
}
