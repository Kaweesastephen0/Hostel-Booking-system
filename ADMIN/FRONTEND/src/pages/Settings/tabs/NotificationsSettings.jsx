import React, { useState } from 'react';
import { updateSettings } from '../../../services/settingsService';
import { useNotifications } from '../../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const NotificationsSettings = ({ settings = {}, onUpdate = () => {} }) => {
    const [form, setForm] = useState({
        emailNotifications: settings.bookingNotifications ?? true,
        smsAlerts: settings.smsAlerts ?? false,
        newBookingAlert: settings.newBookingAlert ?? true,
        reminderHours: settings.reminderHours ?? 24,
        paymentTemplate: settings.paymentTemplate || 'Your booking is confirmed!'
    });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const { notifications, unreadCount, loading, markAllAsRead, refreshNotifications } = useNotifications();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg(null);
        try {
            await updateSettings(form);
            setMsg({ type: 'success', text: 'Notification settings saved.' });
            onUpdate();
        } catch (err) {
            setMsg({ type: 'error', text: err.message || 'Failed' });
        } finally {
            setSaving(false);
        }
    };

    const handleRefresh = () => {
        if (typeof refreshNotifications === 'function') {
            refreshNotifications();
        }
    };

    const handleMarkAll = () => {
        if (typeof markAllAsRead === 'function' && unreadCount > 0) {
            markAllAsRead();
        }
    };

    const formatTimestamp = (value) => {
        if (!value) {
            return '';
        }
        try {
            return formatDistanceToNow(new Date(value), { addSuffix: true });
        } catch {
            return '';
        }
    };

    return (
        <div className="notifications-settings-grid">
            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Communication Preferences</h3>
                    <p className="card-description">Control host notifications and automated messaging</p>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="notifications-form">
                        {msg && <div className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success'}`}>{msg.text}</div>}
                        <div className="form-row">
                            <label>
                                <input type="checkbox" name="emailNotifications" checked={form.emailNotifications} onChange={handleChange} /> Email Notifications
                            </label>
                        </div>
                        <div className="form-row">
                            <label>
                                <input type="checkbox" name="smsAlerts" checked={form.smsAlerts} onChange={handleChange} /> SMS Alerts (requires SMS API config)
                            </label>
                        </div>
                        <div className="form-row">
                            <label>New Booking Alert</label>
                            <select name="newBookingAlert" value={form.newBookingAlert} onChange={handleChange}>
                                <option value={true}>On</option>
                                <option value={false}>Off</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <label>Reminder Settings (hours before)</label>
                            <input type="number" name="reminderHours" value={form.reminderHours} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Payment Confirmation Template</label>
                            <textarea name="paymentTemplate" value={form.paymentTemplate} onChange={handleChange} />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Notifications'}</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="settings-card">
                <div className="card-header notifications-card-header">
                    <div>
                        <h3 className="card-title">Notifications</h3>
                        <p className="card-description">View activity alerts synced with the navbar indicator</p>
                    </div>
                    <div className="notifications-card-actions">
                        <span className="notifications-pill">{notifications.length} total</span>
                        {unreadCount > 0 && <span className="notifications-pill notifications-pill-unread">{unreadCount} unread</span>}
                        <button type="button" className="btn btn-secondary" onClick={handleRefresh} disabled={loading}>Refresh</button>
                        <button type="button" className="btn btn-primary" onClick={handleMarkAll} disabled={unreadCount === 0}>Mark all read</button>
                    </div>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="notifications-loading">Loading notifications...</div>
                    ) : notifications.length > 0 ? (
                        <ul className="notifications-list">
                            {notifications.map(notification => (
                                <li key={notification.id} className={`notifications-list-item${notification.read ? '' : ' notifications-list-item-unread'}`}>
                                    <div className="notifications-list-item-header">
                                        <span className="notifications-list-item-title">{notification.title}</span>
                                        <span className="notifications-list-item-time">{formatTimestamp(notification.timestamp)}</span>
                                    </div>
                                    <p className="notifications-list-item-message">{notification.message}</p>
                                    {notification.actionUrl && (
                                        <a href={notification.actionUrl} className="notifications-list-item-link">Open</a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="notifications-empty">No notifications available.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsSettings;
