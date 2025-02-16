'use client';

import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import { XMarkIcon, KeyIcon, CommandLineIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const environments = [
  {
    name: 'Development',
    value: 'development',
    icon: CommandLineIcon,
    description: 'For testing and development purposes'
  },
  {
    name: 'Production',
    value: 'production',
    icon: GlobeAltIcon,
    description: 'For live applications and production use'
  }
];

const ModalTitle = ({ children }) => (
  <Dialog.Title className="text-2xl font-bold text-gray-900 sm:text-3xl">
    {children}
  </Dialog.Title>
);

const FormField = ({ label, id, value, onChange, placeholder, error }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-900">
      {label}
    </label>
    <div className="relative rounded-lg shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full rounded-lg pl-10 pr-3 py-3 text-gray-900 ring-1 ring-inset ${
          error 
            ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500' 
            : 'ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'
        } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-200`}
      />
    </div>
    {error && (
      <p className="mt-2 text-sm text-red-600">{error}</p>
    )}
  </div>
);

export default function ApiKeyModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'development'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type || 'development'
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        type: 'development'
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter a name for your API key';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        type: formData.type
      });
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <ModalTitle>
                    {initialData ? 'Edit API Key' : 'Create New API Key'}
                  </ModalTitle>
                  <div className="mt-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <FormField
                        label="API Key Name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Production API Key"
                        error={errors.name}
                      />

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Environment
                        </label>
                        <RadioGroup value={formData.type} onChange={value => setFormData(prev => ({ ...prev, type: value }))}>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {environments.map((env) => (
                              <RadioGroup.Option
                                key={env.value}
                                value={env.value}
                                className={({ checked }) =>
                                  `${
                                    checked ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-300'
                                  } relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all duration-200`
                                }
                              >
                                {({ checked }) => (
                                  <>
                                    <div className="flex w-full items-center justify-between">
                                      <div className="flex items-center">
                                        <div className="text-sm">
                                          <RadioGroup.Label as="p" className="font-medium text-gray-900">
                                            {env.name}
                                          </RadioGroup.Label>
                                          <RadioGroup.Description as="p" className="text-gray-500">
                                            {env.description}
                                          </RadioGroup.Description>
                                        </div>
                                      </div>
                                      <env.icon 
                                        className={`h-5 w-5 ${checked ? 'text-indigo-600' : 'text-gray-400'}`}
                                        aria-hidden="true" 
                                      />
                                    </div>
                                  </>
                                )}
                              </RadioGroup.Option>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 transition-all duration-200"
                        >
                          {initialData ? 'Save Changes' : 'Create API Key'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 transition-all duration-200"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}