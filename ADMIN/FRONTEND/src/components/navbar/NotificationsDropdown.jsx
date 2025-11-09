import React, { useRef, useEffect } from 'react';
import { X, Trash2, CheckCheck, Clock, AlertCircle, BookOpen, CreditCard, Users, Building2, BedDouble, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationsDropdown = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    refreshNotifications
  } = useNotifications();

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <BookOpen size={18} className="text-blue-500" />;
      case 'payment':
        return <CreditCard size={18} className="text-green-500" />;
      case 'user':
        return <Users size={18} className="text-purple-500" />;
      case 'hostel':
        return <Building2 size={18} className="text-indigo-500" />;
      case 'room':
        return <BedDouble size={18} className="text-teal-500" />;
      case 'settings':
        return <SettingsIcon size={18} className="text-slate-500" />;
      case 'warning':
        return <AlertCircle size={18} className="text-yellow-500" />;
      default:
        return <Clock size={18} className="text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notifications-dropdown-overlay">
      <div className="notifications-dropdown" ref={dropdownRef}>
        <div className="notifications-header">
          <div>
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} new</span>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="notifications-actions">
            {unreadCount > 0 && (
              <button className="action-btn" onClick={markAllAsRead}>
                <CheckCheck size={16} />
                Mark all as read
              </button>
            )}
            <button className="action-btn danger" onClick={clearAll}>
              <Trash2 size={16} />
              Clear all
            </button>
          </div>
        )}

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <Clock size={32} />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {formatTime(notification.timestamp)}
                  </span>
                </div>

                <button
                  className="notification-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="notifications-footer">
            <a href="/settings" className="view-all-link">
              View all notifications →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
