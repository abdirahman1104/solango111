'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  HomeIcon,
  UserIcon,
  BeakerIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import UserProfileSection from './UserProfileSection';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'My Account', href: '/dashboard/account', icon: UserIcon },
  { name: 'Research Assistant', href: '/dashboard/assistant', icon: BeakerIcon },
  { name: 'Research Reports', href: '/dashboard/reports', icon: DocumentTextIcon },
  { name: 'API Playground', href: '/playground', icon: CodeBracketIcon },
  { 
    name: 'Documentation', 
    href: '/docs', 
    icon: BookOpenIcon,
    external: true
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo section */}
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                fill="#4F46E5"
                d="M12 2L2 19h20L12 2zm0 3l7.5 13h-15L12 5z"
              />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-900">Solanga</span>
        </div>
      </div>

      {/* Personal/Team selector */}
      <div className="px-4 mt-4">
        <button className="w-full px-3 py-2 text-left text-sm font-medium text-gray-900 bg-gray-50 rounded-md hover:bg-gray-100">
          Personal
          <span className="float-right">▼</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 mt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                isActive
                  ? 'bg-gray-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
              )}
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <item.icon
                className={classNames(
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 h-5 w-5 shrink-0'
                )}
                aria-hidden="true"
              />
              {item.name}
              {item.external && (
                <svg
                  className="ml-2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="shrink-0 border-t border-gray-200 p-4">
        {session?.user && (
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <Image
                src={session.user.image || '/default-avatar.png'}
                alt="Profile"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">
                {session.user.email}
              </p>
              <button
                onClick={handleSignOut}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
