import { API_KEY_PREFIX } from '@/src/constants';

export const generateApiKey = () => {
  const randomString = () => Math.random().toString(36).substring(2, 15);
  const prefix = API_KEY_PREFIX || 'solango_'; // Fallback to ensure we always have a prefix
  return `${prefix}${randomString()}${randomString()}`;
};

export const formatApiKey = (key, isVisible) => {
  if (isVisible) return key;
  return `${key.substring(0, 8)}${'*'.repeat(35)}`;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};
