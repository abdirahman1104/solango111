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
      setResult({
        success: data.success,
        message: data.success ? 'Valid API Key' : 'Invalid API Key'
      });

    } catch (error) {
      setResult({
        success: false,
        message: 'Error validating API key'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API Key Playground
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Test your API key in our interactive playground to verify if it's valid and ready to use.
          </p>
        </div>

        {/* Card Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            {/* Input Section */}
            <div>
              <label 
                htmlFor="apiKey" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter Your API Key
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="solango_xxxxxxxxxxxxxxxx"
                />
              </div>
            </div>

            {/* Button Section */}
            <button
              onClick={handleValidate}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating...
                </span>
              ) : (
                'Validate API Key'
              )}
            </button>

            {/* Result Section */}
            {result && (
              <div className={`mt-6 p-6 rounded-md ${
                result.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              } text-center transition-all duration-200`}>
                <div className="flex items-center justify-center mb-2">
                  {result.success ? (
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <p className={`text-lg font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need help? Check out our <a href="#" className="text-indigo-600 hover:text-indigo-500">documentation</a>
          </p>
        </div>
      </div>
    </div>
  );
}
