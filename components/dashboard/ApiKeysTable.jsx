import React, { useState } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

export default function ApiKeysTable({ apiKeys, onDelete, onEdit }) {
  const [visibleKeys, setVisibleKeys] = useState({});
  const [notification, setNotification] = useState(null);

  const toggleKeyVisibility = (id) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2000);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard!');
    } catch (err) {
      showNotification('Failed to copy', 'error');
    }
  };

  if (!apiKeys?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No API keys found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg animate-fade-in-out ${
            notification.type === 'error' ? 'bg-red-500' : 'bg-gray-800'
          } text-white z-50`}
        >
          {notification.message}
        </div>
      )}

      {/* Desktop view */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {key.key_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {visibleKeys[key.id] ? key.api_key : '•'.repeat(20)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={visibleKeys[key.id] ? "Hide API key" : "Show API key"}
                      >
                        {visibleKeys[key.id] ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(key.api_key)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Copy API key"
                      >
                        <DocumentDuplicateIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onEdit(key)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Edit API key"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(key.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        aria-label="Delete API key"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden space-y-4">
        {apiKeys.map((key) => (
          <div
            key={key.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900">{key.key_name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleKeyVisibility(key.id)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label={visibleKeys[key.id] ? "Hide API key" : "Show API key"}
                >
                  {visibleKeys[key.id] ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(key.api_key)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Copy API key"
                >
                  <DocumentDuplicateIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onEdit(key)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Edit API key"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(key.id)}
                  className="p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-gray-100 transition-colors"
                  aria-label="Delete API key"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="font-mono text-sm text-gray-500 break-all bg-gray-50 p-3 rounded">
              {visibleKeys[key.id] ? key.api_key : '•'.repeat(20)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}