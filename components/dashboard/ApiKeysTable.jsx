import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, ClipboardIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatApiKey } from '@/src/utils/apiKeyUtils';

const TableHeader = () => (
  <thead>
    <tr className="bg-gray-50">
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
);

const ActionButton = ({ onClick, icon: Icon, label, className = "" }) => (
  <button
    onClick={onClick}
    className={`text-gray-400 hover:text-gray-500 ${className}`}
    title={label}
  >
    <Icon className="h-5 w-5" />
  </button>
);

const ApiKeyRow = ({ apiKey, onToggleVisibility, onCopy, onEdit, onDelete, isVisible }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">
        {apiKey.key_name}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-500 font-mono">
        {formatApiKey(apiKey.api_key, isVisible)}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
      <ActionButton
        onClick={() => onToggleVisibility(apiKey.id)}
        icon={isVisible ? EyeSlashIcon : EyeIcon}
        label={isVisible ? "Hide API Key" : "Show API Key"}
      />
      <ActionButton
        onClick={() => onCopy(apiKey.api_key)}
        icon={ClipboardIcon}
        label="Copy API Key"
      />
      <ActionButton
        onClick={() => onEdit(apiKey)}
        icon={PencilIcon}
        label="Edit API Key"
      />
      <ActionButton
        onClick={() => onDelete(apiKey)}
        icon={TrashIcon}
        label="Delete API Key"
        className="text-red-400 hover:text-red-500"
      />
    </td>
  </tr>
);

const EmptyState = () => (
  <tr>
    <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
      No API keys found. Create one to get started.
    </td>
  </tr>
);

export default function ApiKeysTable({ 
  apiKeys = [], 
  onToggleVisibility = () => {}, 
  onCopy = () => {},
  onEdit = () => {},
  onDelete = () => {},
  visibleKeys = {} 
}) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <TableHeader />
              <tbody className="bg-white divide-y divide-gray-200">
                {(!apiKeys || apiKeys.length === 0) ? (
                  <EmptyState />
                ) : (
                  apiKeys.map((apiKey) => (
                    <ApiKeyRow
                      key={apiKey.id}
                      apiKey={apiKey}
                      onToggleVisibility={onToggleVisibility}
                      onCopy={onCopy}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isVisible={visibleKeys[apiKey.id]}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}