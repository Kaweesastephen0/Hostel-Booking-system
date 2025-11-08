import React, { useState } from 'react';
import { updateSettings } from '../../../services/settingsService';

const SystemPreferences = ({ settings = {}, onUpdate = () => {} }) => {
    const [form, setForm] = useState({
        theme: settings.theme || 'light',
        language: settings.language || 'English',
        autoLogout: settings.autoLogout || 15
    });

    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateSettings(form);
            setMsg({ type: 'success', text: 'System preferences saved.' });
            onUpdate();
        } catch (err) {
            setMsg({ type: 'error', text: err.message || 'Failed' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="system-preferences-form">
            {msg && <div className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success'}`}>{msg.text}</div>}

            <div className="form-row">
                <label>Theme</label>
                <select name="theme" value={form.theme} onChange={handleChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>

            <div className="form-row">
                <label>Language</label>
                <select name="language" value={form.language} onChange={handleChange}>
                    <option>English</option>
                    <option>Swahili</option>
                </select>
            </div>

            <div className="form-row">
                <label>Auto Logout (minutes)</label>
                <input type="number" name="autoLogout" value={form.autoLogout} onChange={handleChange} />
            </div>

            <div className="form-row">
                <label>Data Backup</label>
                <div>
                    <button type="button">Backup Now</button>
                    <button type="button" style={{ marginLeft: 8 }}>Restore</button>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Preferences'}</button>
            </div>
        </form>
    );
};

export default SystemPreferences;
