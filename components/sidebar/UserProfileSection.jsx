'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function UserProfileSection() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  if (status === 'loading') {
    return (
      <div className="animate-pulse flex items-center">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="ml-3 space-y-1 flex-1">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn('google')}
        className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
        Sign In
      </button>
    );
  }

  const userInitial = session.user?.name?.charAt(0) || 'U';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center min-w-0">
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User'}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">{userInitial}</span>
          </div>
        )}
        <div className="ml-3 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {session.user?.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {session.user?.email}
          </p>
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-500"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm9.707 4.293a1 1 0 00-1.414-1.414L9 8.586 6.707 6.293a1 1 0 00-1.414 1.414L7.586 10l-2.293 2.293a1 1 0 101.414 1.414L9 11.414l2.293 2.293a1 1 0 001.414-1.414L10.414 10l2.293-2.293z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
