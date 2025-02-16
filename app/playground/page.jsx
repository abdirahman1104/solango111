'use client';

import { useState } from 'react';

export default function APIPlayground() {
  const [apiKey, setApiKey] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setResult({
        success: false,
        message: 'Please enter an API key'
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await response.json();
      console.log('Validation response:', data); // Add debug logging
      
      setResult({
        success: data.success,
        message: data.message,
        status: response.status,
        debug: data.debug // Include debug info in result
      });

    } catch (error) {
      console.error('Validation error:', error);
      setResult({
        success: false,
        message: 'Error validating API key',
        status: 500,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">API Key Playground</h1>
      <p className="text-gray-600 mb-6">
        Test your API key to verify if it's valid and active.
      </p>

      <div className="max-w-xl">
        <div className="mb-6">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your API key"
          />
        </div>

        <button
          onClick={handleValidate}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Validating...' : 'Validate API Key'}
        </button>

        {result && (
          <div className={`mt-6 p-4 rounded-md ${
            result.success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <p className="font-medium">{result.message}</p>
            {result.status && <p className="text-sm mt-1">Status: {result.status}</p>}
            {result.debug && (
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(result.debug, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
