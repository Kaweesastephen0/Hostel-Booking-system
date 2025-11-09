import React, { createContext, useState, useCallback } from 'react';

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Booking',
      message: 'A new booking has been received',
      type: 'booking',
      read: false,
      timestamp: new Date(Date.now() - 5 * 60000),
      actionUrl: '/bookings'
    },
    {
      id: 2,
      title: 'Payment Completed',
      message: 'Payment for booking BK-ABC123 has been confirmed',
      type: 'payment',
      read: false,
      timestamp: new Date(Date.now() - 15 * 60000),
      actionUrl: '/payments'
    },
    {
      id: 3,
      title: 'New User Registration',
      message: 'A new user has registered',
      type: 'user',
      read: true,
      timestamp: new Date(Date.now() - 1 * 60000),
      actionUrl: '/users'
    },
    {
      id: 4,
      title: 'Low Room Availability',
      message: 'Some rooms are running low on availability',
      type: 'warning',
      read: true,
      timestamp: new Date(Date.now() - 30 * 60000),
      actionUrl: '/rooms'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    unreadCount,
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
