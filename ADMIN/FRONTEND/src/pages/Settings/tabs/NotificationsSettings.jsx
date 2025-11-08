import React, { useState } from 'react';
import { updateSettings } from '../../../services/settingsService';

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

    return (
        <form onSubmit={handleSubmit} className="notifications-settings-form">
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
                <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Notifications'}</button>
            </div>
        </form>
    );
};

export default NotificationsSettings;
