'use client';

import { useState } from 'react';
import { useApiKeys } from '@/hooks/useApiKeys';
import PlanOverview from '@/components/dashboard/PlanOverview';
import ApiKeysTable from '@/components/dashboard/ApiKeysTable';
import ApiKeyModal from '@/components/ApiKeyModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import NotificationManager from '@/components/NotificationManager';
import useNotifications from '@/hooks/useNotifications';
import ErrorMessage from '@/components/ErrorMessage';

export default function DashboardContent() {
  const { 
    apiKeys, 
    loading, 
    error, 
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
      }
    } catch (error) {
      showNotification({
        type: 'delete',
        message: '✕ ' + (error.message || 'Failed to delete API key')
      });
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

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
