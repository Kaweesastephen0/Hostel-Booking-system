import React, { useState, useCallback, useEffect } from 'react';
import { NotificationsContext } from './notificationsContext';
import instance from '../services/axios';

const normalizeNotification = (notification) => {
  return {
    id: String(notification.id ?? Date.now()),
    title: notification.title || 'Notification',
    message: notification.message || notification.title || '',
    type: notification.type || 'system',
    read: Boolean(notification.read),
    timestamp: notification.timestamp ? new Date(notification.timestamp).toISOString() : new Date().toISOString(),
    actionUrl: notification.actionUrl || null
  };
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await instance.get('/logs/notifications', { params: { limit: 12 } });
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      console.log('Fetched notifications:', data);
      setNotifications((prev) => {
        const previousMap = new Map(prev.map((item) => [item.id, item]));
        const normalized = data.map((item) => {
          const normalizedItem = normalizeNotification({ ...item, read: false });
          const existing = previousMap.get(normalizedItem.id);
          if (existing) {
            return { ...normalizedItem, read: existing.read };
          }
          return normalizedItem;
        });
        const incomingIds = new Set(normalized.map((item) => item.id));
        const manualNotifications = prev.filter((item) => !incomingIds.has(item.id));
        return [...normalized, ...manualNotifications];
      });
    } catch (error) {
      console.error('Failed to load notifications', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const addNotification = useCallback((notification) => {
    const normalizedNotification = normalizeNotification(notification);
    const newNotification = {
      ...normalizedNotification,
      id: normalizedNotification.id || String(Date.now()),
      read: false,
      timestamp: normalizedNotification.timestamp || new Date().toISOString()
    };
    setNotifications((prev) => [newNotification, ...prev]);
    return newNotification;
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === String(id) ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== String(id)));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    refreshNotifications: fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
