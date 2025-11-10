import React, { useState, useEffect } from 'react';
import { updateSettings } from '../../../services/settingsService';
import * as hostelService from '../../../services/hostelService';
import {
    Building, Globe, Clock, DollarSign, Shield, RefreshCw, Palette,
    MapPin, Phone, Mail, Calendar, Percent, BookOpen, Users, Eye,
    Save, XCircle, CheckCircle, AlertCircle, Loader
} from 'lucide-react';
import '../SettingsCards.css';

const GeneralSettings = ({ role = 'manager', settings = {}, onUpdate = () => {} }) => {
    const [hostels, setHostels] = useState([]);
    const [selectedHostelId, setSelectedHostelId] = useState('');
    const [hostelsLoading, setHostelsLoading] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        if (role === 'manager') {
            const fetchHostels = async () => {
                try {
                    setHostelsLoading(true);
                    const data = await hostelService.getAllHostels();
                    const hostelsList = Array.isArray(data) ? data : [];
                    setHostels(hostelsList);
                    if (hostelsList.length > 0 && !selectedHostelId) {
                        setSelectedHostelId(hostelsList[0]._id);
                    }
                } catch (err) {
                    console.error('Error fetching hostels:', err);
                    setHostels([]);
                } finally {
                    setHostelsLoading(false);
                }
            };
            fetchHostels();
        }
    }, [role, selectedHostelId]);

    useEffect(() => {
        setForm({
            siteName: settings.siteName || '',
            address: settings.address || '',
            contactEmail: settings.contactEmail || '',
            contactPhone: settings.contactPhone || '',
            checkInTime: settings.checkInTime || '14:00',
            checkOutTime: settings.checkOutTime || '11:00',
            currency: settings.currency || 'UGX',
            timeZone: settings.timeZone || 'EAT',
            logoUrl: settings.logoUrl || '',
            systemName: settings.systemName || '',
            systemLogoUrl: settings.systemLogoUrl || '',
            systemDomain: settings.systemDomain || '',
            numberOfHostels: settings.numberOfHostels || 0,
            defaultCountry: settings.defaultCountry || '',
            globalCheckInTime: settings.globalCheckInTime || '14:00',
            globalCheckOutTime: settings.globalCheckOutTime || '11:00',
            autoApprovalRules: settings.autoApprovalRules || '',
            paymentFlutterwaveKey: settings.paymentFlutterwaveKey || '',
            paymentPayPalKey: settings.paymentPayPalKey || '',
            userPermissions: settings.userPermissions || '',
            passwordPolicies: settings.passwordPolicies || '',
            dataBackup: settings.dataBackup || '',
            softwareVersion: settings.softwareVersion || '',
            maintenanceMode: settings.maintenanceMode || false,
            adminTheme: settings.adminTheme || '',
            faviconUrl: settings.faviconUrl || '',
            emailTemplates: settings.emailTemplates || '',
            hostelDescription: settings.hostelDescription || '',
            bookingWindow: settings.bookingWindow || '',
            depositRequirements: settings.depositRequirements || '',
            defaultRates: settings.defaultRates || '',
            taxes: settings.taxes || '',
            discounts: settings.discounts || '',
            cancellationPolicy: settings.cancellationPolicy || '',
            refundPolicy: settings.refundPolicy || '',
            guestBehaviorPolicy: settings.guestBehaviorPolicy || '',
            emailSmsPreferences: settings.emailSmsPreferences || '',
            autoReminders: settings.autoReminders || '',
            staffManagement: settings.staffManagement || '',
            enableListing: settings.enableListing || true,
            hostelMaintenanceMode: settings.hostelMaintenanceMode || false,
        });
    }, [settings]);

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!form.siteName.trim()) errors.siteName = 'Hostel/Site name is required';
        if (!form.contactEmail.trim()) {
            errors.contactEmail = 'Contact email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
            errors.contactEmail = 'Please enter a valid email address';
        }
        if (!form.contactPhone.trim()) errors.contactPhone = 'Contact phone is required';
        if (!form.checkInTime) errors.checkInTime = 'Check-in time is required';
        if (!form.checkOutTime) errors.checkOutTime = 'Check-out time is required';
        if (role === 'admin') {
            if (!form.systemName.trim()) errors.systemName = 'System name is required';
            if (!form.systemDomain.trim()) errors.systemDomain = 'System domain is required';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Please fix the validation errors below.' });
            return;
        }
        setSaving(true);
        setMessage(null);
        try {
            await updateSettings(form);
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
            setTimeout(() => {
                setMessage(null);
                onUpdate();
            }, 2000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to save settings.' });
        } finally {
            setSaving(false);
        }
    };

    const renderFormField = (label, name, value, type = 'text', placeholder = '', required = false, error = null) => (
        <div className="form-group">
            <label className="form-label">
                {label}
                {required && <span className="required">*</span>}
            </label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`form-input ${error ? 'error' : ''}`}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`form-input ${error ? 'error' : ''}`}
                />
            )}
            {error && <div className="error-message"><AlertCircle size={14} />{error}</div>}
        </div>
    );

    const renderAdminSettings = () => (
        <div className="settings-layout">
            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">System Identity</h3>
                    <p className="card-description">Manage the core identity of your booking platform.</p>
                </div>
                <div className="card-body">
                    {renderFormField('System Name', 'systemName', form.systemName, 'text', 'e.g., Hostel Booking Pro', true, validationErrors.systemName)}
                    {renderFormField('System Logo URL', 'systemLogoUrl', form.systemLogoUrl, 'text', 'https://...')}
                    {renderFormField('System Domain', 'systemDomain', form.systemDomain, 'text', 'e.g., hostelbooking.com', true, validationErrors.systemDomain)}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Business Setup</h3>
                    <p className="card-description">Configure global business parameters.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Number of Hostels', 'numberOfHostels', form.numberOfHostels, 'number')}
                    {renderFormField('Default Country', 'defaultCountry', form.defaultCountry, 'text', 'e.g., Uganda')}
                    {renderFormField('Default Currency', 'currency', form.currency, 'text', 'e.g., UGX')}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Operational Defaults</h3>
                    <p className="card-description">Set default operational timings and rules.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Global Check-in Time', 'globalCheckInTime', form.globalCheckInTime, 'time')}
                    {renderFormField('Global Check-out Time', 'globalCheckOutTime', form.globalCheckOutTime, 'time')}
                    {renderFormField('Auto-Approval Rules', 'autoApprovalRules', form.autoApprovalRules, 'textarea', 'e.g., Pre-approve bookings under 30 days')}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Payment Gateways</h3>
                    <p className="card-description">Securely manage API keys for payment processing.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Flutterwave Key', 'paymentFlutterwaveKey', form.paymentFlutterwaveKey, 'password', 'Keep this secure')}
                    {renderFormField('PayPal Key', 'paymentPayPalKey', form.paymentPayPalKey, 'password', 'Keep this secure')}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Security</h3>
                    <p className="card-description">Define security policies and backup settings.</p>
                </div>
                <div className="card-body">
                    {renderFormField('User Permissions', 'userPermissions', form.userPermissions, 'textarea', 'Define user permission levels')}
                    {renderFormField('Password Policies', 'passwordPolicies', form.passwordPolicies, 'textarea', 'e.g., Min 8 chars, special characters required')}
                    {renderFormField('Data Backup Settings', 'dataBackup', form.dataBackup, 'text', 'e.g., Daily at 2 AM')}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">System Updates & Maintenance</h3>
                    <p className="card-description">Manage software version and maintenance status.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Software Version', 'softwareVersion', form.softwareVersion, 'text', '', false, null)}
                    <div className="form-group checkbox-row">
                        <label>
                            <input type="checkbox" name="maintenanceMode" checked={form.maintenanceMode} onChange={handleChange} />
                            Enable Maintenance Mode
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Brand Customization</h3>
                    <p className="card-description">Customize the look and feel of the platform.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Admin Panel Theme', 'adminTheme', form.adminTheme, 'text', 'e.g., Dark, Light, Blue')}
                    {renderFormField('Favicon URL', 'faviconUrl', form.faviconUrl, 'text', 'https://...')}
                    {renderFormField('Email Templates', 'emailTemplates', form.emailTemplates, 'text', 'e.g., Modern, Classic')}
                </div>
            </div>
        </div>
    );

    const renderManagerSettings = () => (
        <div className="settings-layout">
            {hostels.length > 0 && (
                <div className="settings-card">
                    <div className="card-header">
                        <h3 className="card-title">Select Hostel</h3>
                        <p className="card-description">Choose which hostel's settings to manage.</p>
                    </div>
                    <div className="card-body">
                        {hostelsLoading ? (
                            <div className="loading-state"><Loader size={16} className="animate-spin" /> Loading hostels...</div>
                        ) : (
                            <select className="form-input" value={selectedHostelId} onChange={(e) => setSelectedHostelId(e.target.value)}>
                                <option value="">Select a hostel</option>
                                {hostels.map(hostel => (
                                    <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            )}

            {hostels.length === 0 && !hostelsLoading && (
                <div className="alert alert-info"><AlertCircle size={16} /> No hostels found. Please create one first.</div>
            )}

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Hostel Identity</h3>
                    <p className="card-description">Basic information about your hostel.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Hostel Name', 'siteName', form.siteName, 'text', 'e.g., Sunny Days Hostel', true, validationErrors.siteName)}
                    {renderFormField('Hostel Description', 'hostelDescription', form.hostelDescription, 'textarea', 'Tell guests about your hostel')}
                    {renderFormField('Hostel Logo URL', 'logoUrl', form.logoUrl, 'text', 'https://...')}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Location & Contact</h3>
                    <p className="card-description">How guests can find and contact you.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Address', 'address', form.address, 'text', 'e.g., 123 Main St, Kampala', true, validationErrors.address)}
                    {renderFormField('Contact Email', 'contactEmail', form.contactEmail, 'email', 'hostel@example.com', true, validationErrors.contactEmail)}
                    {renderFormField('Phone Number', 'contactPhone', form.contactPhone, 'tel', '+256...', true, validationErrors.contactPhone)}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Operational Rules</h3>
                    <p className="card-description">Set your hostel's operational hours and booking window.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Check-in Time', 'checkInTime', form.checkInTime, 'time', '', true, validationErrors.checkInTime)}
                    {renderFormField('Check-out Time', 'checkOutTime', form.checkOutTime, 'time', '', true, validationErrors.checkOutTime)}
                    {renderFormField('Booking Window', 'bookingWindow', form.bookingWindow, 'text', 'e.g., 90 days in advance')}
                    {renderFormField('Deposit Requirements', 'depositRequirements', form.depositRequirements, 'text', 'e.g., 20% of total')}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Pricing Defaults</h3>
                    <p className="card-description">Default currency, rates, taxes, and discounts.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Default Currency', 'currency', form.currency, 'text', 'e.g., UGX')}
                    {renderFormField('Default Rates (per room type)', 'defaultRates', form.defaultRates, 'textarea', 'Single: 50000, Double: 80000')}
                    {renderFormField('Taxes', 'taxes', form.taxes, 'text', 'e.g., 10% VAT')}
                    {renderFormField('Discounts', 'discounts', form.discounts, 'text', 'e.g., Weekly: 10%, Monthly: 15%')}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Policies</h3>
                    <p className="card-description">Define cancellation, refund, and guest behavior policies.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Cancellation Policy', 'cancellationPolicy', form.cancellationPolicy, 'textarea', 'Free cancellation up to 48 hours before check-in')}
                    {renderFormField('Refund Policy', 'refundPolicy', form.refundPolicy, 'textarea', 'Full refund for cancellations 7+ days before check-in')}
                    {renderFormField('Guest Behavior Policy', 'guestBehaviorPolicy', form.guestBehaviorPolicy, 'textarea', 'Be respectful, quiet hours 10 PM - 8 AM')}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Communication</h3>
                    <p className="card-description">Preferences for automated guest communication.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Email/SMS Preferences', 'emailSmsPreferences', form.emailSmsPreferences, 'textarea', 'e.g., Booking confirmations, Check-in reminders')}
                    {renderFormField('Auto Reminders', 'autoReminders', form.autoReminders, 'text', 'e.g., 24h before check-in, 7d before checkout')}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Staff Management</h3>
                    <p className="card-description">Information related to staff management.</p>
                </div>
                <div className="card-body">
                    {renderFormField('Staff Management Info', 'staffManagement', form.staffManagement, 'text', 'Link to staff management section or contact info')}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3 className="card-title">Visibility Controls</h3>
                    <p className="card-description">Control your hostel's public visibility.</p>
                </div>
                <div className="card-body">
                    <div className="form-group checkbox-row">
                        <label>
                            <input type="checkbox" name="enableListing" checked={form.enableListing} onChange={handleChange} />
                            Enable Hostel Listing (visible to guests)
                        </label>
                    </div>
                    <div className="form-group checkbox-row">
                        <label>
                            <input type="checkbox" name="hostelMaintenanceMode" checked={form.hostelMaintenanceMode} onChange={handleChange} />
                            Hostel Maintenance Mode (temporarily unavailable)
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="general-settings-form">
            {message && (
                <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                    {message.text}
                    {message.type === 'success' ? <CheckCircle className="inline-icon ml-2" /> : <XCircle className="inline-icon ml-2" />}
                </div>
            )}

            {role === 'admin' ? renderAdminSettings() : renderManagerSettings()}

            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? (
                        <><Loader size={16} className="animate-spin" /> Saving...</>
                    ) : (
                        <><Save size={16} /> Save Settings</>
                    )}
                </button>
            </div>
        </form>
    );
};

export default GeneralSettings;
