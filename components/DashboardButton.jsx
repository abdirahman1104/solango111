import Link from 'next/link';

export default function DashboardButton() {
  return (
    <Link href="/dashboard">
      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Manage API Keys
      </button>
    </Link>
  );
} 