'use client';

import { useState, useCallback } from 'react';
import { NOTIFICATION_DURATION } from '@/src/constants';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addNotification = useCallback(({ type = 'success', message }) => {
    const id = Date.now();
    const newNotification = {
      id,
      type,
      message,
      show: true
    };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto dismiss after specified duration
    setTimeout(() => {
      removeNotification(id);
    }, NOTIFICATION_DURATION);
  }, [removeNotification]);

  const showNotification = useCallback(({ type, message }) => {
    addNotification({ type, message });
  }, [addNotification]);

  return {
    notifications,
    showNotification,
    removeNotification
  };
};

export default useNotifications;
