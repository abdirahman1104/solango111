'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NOTIFICATION_TYPES } from '@/src/constants';
import Notification from '@/components/ui/Notification';

export default function APIPlayground() {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: NOTIFICATION_TYPES.SUCCESS });
  const router = useRouter();

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type: type === 'success' ? NOTIFICATION_TYPES.SUCCESS : NOTIFICATION_TYPES.ERROR
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      showNotification('Please enter an API key', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showNotification('Valid API key', 'success');
        // Store the API key in session storage for protected routes
        sessionStorage.setItem('apiKey', data.apiKey);
        showNotification('success', 'API key generated successfully');
        router.push('/dashboard');
      } else {
        showNotification(data.message || 'Invalid API key', 'error');
      }
    } catch (error) {
      showNotification('Error validating API key', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">API Playground</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <div className="mt-1">
              <input
                id="apiKey"
                name="apiKey"
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your API key"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Validating...' : 'Validate API Key'}
          </button>
        </form>
      </div>
      {notification.show && (
        <div className="fixed bottom-4 right-4">
          <Notification
            show={notification.show}
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(prev => ({ ...prev, show: false }))}
          />
        </div>
      )}
    </div>
  );
}
