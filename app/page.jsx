'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="max-w-5xl w-full items-center justify-between font-mono text-sm">
          <div className="flex justify-center">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Solango</h1>
          <div className="flex justify-center">
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </main>
    );
  }

  return null;
}