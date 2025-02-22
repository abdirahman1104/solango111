'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto w-20 h-20 relative mb-8">
            <Image
              src="/logo.png"
              alt="Solanga Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to continue to Solanga
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 space-x-3"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.571,1.707-1.573,3.161-2.854,4.293 c-1.281,1.132-2.796,1.698-4.545,1.698c-2.108,0-3.904-0.747-5.389-2.24c-1.484-1.494-2.227-3.292-2.227-5.392 c0-2.099,0.743-3.897,2.227-5.391c1.484-1.494,3.281-2.24,5.389-2.24c1.188,0,2.311,0.223,3.371,0.67 c1.061,0.447,1.957,1.058,2.691,1.835l2.144-2.144C16.715,3.594,14.664,2.75,12,2.75c-2.927,0-5.432,1.042-7.516,3.125 C2.401,7.958,1.359,10.464,1.359,13.391s1.042,5.432,3.125,7.516c2.083,2.083,4.589,3.125,7.516,3.125 c2.916,0,5.417-1.037,7.5-3.109c2.083-2.073,3.125-4.573,3.125-7.5v-1.272H14.454C13.4,12.151,12.545,12.151,12.545,12.151z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-indigo-50 to-white text-gray-500">
                Protected by Solanga
              </span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          By signing in, you agree to our{' '}
          <a href="/terms-of-service" className="font-medium text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy-policy" className="font-medium text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
