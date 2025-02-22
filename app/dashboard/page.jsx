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
  const { apiKeys = [], loading, error, deleteApiKey, updateApiKey } = useApiKeys();
  const { showNotification } = useNotifications();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState(null);

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

  const handleEditClick = (apiKey) => {
    setSelectedApiKey(apiKey);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (apiKey) => {
    setSelectedApiKey(apiKey);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = async (updatedKey) => {
    try {
      await updateApiKey(selectedApiKey.id, updatedKey);
      showNotification({
        type: 'success',
        message: 'API key updated successfully'
      });
      setIsEditModalOpen(false);
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Failed to update API key'
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApiKey(selectedApiKey.id);
      showNotification({
        type: 'success',
        message: 'API key deleted successfully'
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Failed to delete API key'
      });
    }
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
              onClick={() => setIsEditModalOpen(true)}
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
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ApiKeyModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedApiKey(null);
          }}
          onSubmit={handleEdit}
          apiKey={selectedApiKey}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedApiKey(null);
          }}
          onConfirm={handleDelete}
          title="Delete API Key"
          message="Are you sure you want to delete this API key? This action cannot be undone."
        />
      )}
    </div>
  );
}