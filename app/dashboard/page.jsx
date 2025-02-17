'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useApiKeys } from '@/hooks/useApiKeys';
import PlanOverview from '@/components/dashboard/PlanOverview';
import ApiKeysTable from '@/components/dashboard/ApiKeysTable';
import ApiKeyModal from '@/components/ApiKeyModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import NotificationManager from '@/components/NotificationManager';
import useNotifications from '@/hooks/useNotifications';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [visibleKeys, setVisibleKeys] = useState({});
  const { apiKeys = [], loading, error } = useApiKeys();
  const { showNotification } = useNotifications();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleToggleVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    showNotification({
      type: 'success',
      message: 'API key copied to clipboard'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 gap-8">
        <PlanOverview />
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <button
              onClick={() => {/* TODO: Implement create key */}}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create API Key
            </button>
          </div>
          <ApiKeysTable
            apiKeys={apiKeys}
            visibleKeys={visibleKeys}
            onToggleVisibility={handleToggleVisibility}
            onCopy={handleCopyKey}
          />
        </div>
      </div>
    </div>
  );
}