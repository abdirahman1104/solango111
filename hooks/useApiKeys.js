'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { generateApiKey } from '@/src/utils/apiKeyUtils';

const TABLE_NAME = 'api_keys';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleError = (error, customMessage) => {
    console.error('Error:', error);
    setError(customMessage);
    return { success: false, error: customMessage };
  };

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
      return { success: true, data };
    } catch (err) {
      return handleError(err, 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (formData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const newKey = {
        key_name: formData.name,
        api_key: generateApiKey(),
        is_active: true,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([newKey])
        .select()
        .single();

      if (error) throw error;
      await fetchApiKeys(); // Refresh the list after creating
      return { success: true, data };
    } catch (err) {
      return handleError(err, 'Failed to create API key');
    }
  };

  const updateApiKey = async (id, formData) => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          key_name: formData.name
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchApiKeys(); // Refresh the list after updating
      return { success: true, data };
    } catch (err) {
      return handleError(err, 'Failed to update API key');
    }
  };

  const deleteApiKey = async (id) => {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchApiKeys(); // Refresh the list after deleting
      return { success: true };
    } catch (err) {
      return handleError(err, 'Failed to delete API key');
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return {
    apiKeys,
    loading,
    error,
    createApiKey,
    updateApiKey,
    deleteApiKey
  };
}