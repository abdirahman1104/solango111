'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useApiKeys } from '@/hooks/useApiKeys';
import PlanOverview from '@/components/dashboard/PlanOverview';
import ApiKeysTable from '@/components/dashboard/ApiKeysTable';
import ApiKeyModal from '@/components/ApiKeyModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import NotificationManager from '@/components/NotificationManager';
import useNotifications from '@/hooks/useNotifications';
import ErrorMessage from '@/components/ErrorMessage';

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });

  const [error, setError] = useState(null);

  // Add error boundary
  useEffect(() => {
    const handleError = (error) => {
      console.error('Dashboard Error:', error);
      setError(error.message);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const { 
    apiKeys, 
    loading, 
    error: apiKeysError, 
    createApiKey, 
    updateApiKey, 
    deleteApiKey 
  } = useApiKeys();

  const {
    notifications,
    showNotification,
    hideNotification
  } = useNotifications();

  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState({});

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || apiKeysError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error || apiKeysError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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
      message: '✓ API key copied to clipboard'
    });
  };

  const handleEditKey = (key) => {
    setEditingKey(key);
    setShowModal(true);
  };

  const handleDeleteClick = (key) => {
    setDeleteConfirm(key);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingKey(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingKey) {
        await updateApiKey(editingKey.id, formData);
        showNotification({
          type: 'update',
          message: '↻ API key updated successfully'
        });
      } else {
        await createApiKey(formData);
        showNotification({
          type: 'success',
          message: '+ New API key created successfully'
        });
      }
      handleCloseModal();
    } catch (error) {
      showNotification({
        type: 'delete',
        message: '✕ ' + (error.message || 'Failed to process API key')
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteConfirm) {
        await deleteApiKey(deleteConfirm.id);
        showNotification({
          type: 'delete',
          message: '- API key deleted successfully'
        });
        setDeleteConfirm(null);
      }
    } catch (error) {
      showNotification({
        type: 'error',
        message: '✕ ' + (error.message || 'Failed to delete API key')
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 text-center">Overview</h1>
      
      <PlanOverview />
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create API Key
          </button>
        </div>

        <ApiKeysTable
          apiKeys={apiKeys}
          onToggleVisibility={handleToggleVisibility}
          onCopy={handleCopyKey}
          onEdit={handleEditKey}
          onDelete={handleDeleteClick}
          visibleKeys={visibleKeys}
        />
      </div>

      {showModal && (
        <ApiKeyModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={editingKey}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmationModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      <NotificationManager
        notifications={notifications}
        onDismiss={hideNotification}
      />
    </div>
  );
}