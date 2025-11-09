import React, { useState, useEffect } from 'react';
import { updateSettings } from '../../../services/settingsService';
import * as hostelService from '../../../services/hostelService';
import {
    Building, Globe, Clock, DollarSign, Shield, RefreshCw, Palette, // System Admin Icons
    MapPin, Phone, Mail, Calendar, Percent, BookOpen, Users, Eye, // Hostel Manager Icons
    Save, XCircle, CheckCircle, AlertCircle, Loader
} from 'lucide-react';
import './GeneralSettings.css';

const GeneralSettings = ({ role = 'manager', settings = {}, onUpdate = () => {} }) => {
    const [hostels, setHostels] = useState([]);
    const [selectedHostelId, setSelectedHostelId] = useState('');
    const [hostelsLoading, setHostelsLoading] = useState(false);
    const [form, setForm] = useState({
        // Common fields (Hostel Manager will see these as their hostel's identity)
        siteName: settings.siteName || '',
        address: settings.address || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        checkInTime: settings.checkInTime || '14:00',
        checkOutTime: settings.checkOutTime || '11:00',
        currency: settings.currency || 'UGX',
        timeZone: settings.timeZone || 'EAT',
        logoUrl: settings.logoUrl || '',

        // System Admin specific fields
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

        // Hostel Manager specific fields (beyond common ones)
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
            // Common fields
            siteName: settings.siteName || '',
            address: settings.address || '',
            contactEmail: settings.contactEmail || '',
            contactPhone: settings.contactPhone || '',
            checkInTime: settings.checkInTime || '14:00',
            checkOutTime: settings.checkOutTime || '11:00',
            currency: settings.currency || 'UGX',
            timeZone: settings.timeZone || 'EAT',
            logoUrl: settings.logoUrl || '',

            // System Admin specific fields
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

            // Hostel Manager specific fields
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

        // Common validation
        if (!form.siteName.trim()) {
            errors.siteName = 'Hostel/Site name is required';
        }
        if (!form.contactEmail.trim()) {
            errors.contactEmail = 'Contact email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
            errors.contactEmail = 'Please enter a valid email address';
        }
        if (!form.contactPhone.trim()) {
            errors.contactPhone = 'Contact phone is required';
        }

        // Time validation
        if (!form.checkInTime) {
            errors.checkInTime = 'Check-in time is required';
        }
        if (!form.checkOutTime) {
            errors.checkOutTime = 'Check-out time is required';
        }

        // Admin-specific validation
        if (role === 'admin') {
            if (!form.systemName.trim()) {
                errors.systemName = 'System name is required';
            }
            if (!form.systemDomain.trim()) {
                errors.systemDomain = 'System domain is required';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
        <div className="form-row">
            <label>
                {label}
                {required && <span className="required">*</span>}
            </label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={error ? 'error' : ''}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={error ? 'error' : ''}
                />
            )}
            {error && <div className="error-message"><AlertCircle size={14} />{error}</div>}
        </div>
    );

    const renderAdminSettings = () => (
        <>
            <h2 className="text-xl font-semibold mb-4">Platform-Level Settings</h2>

            {/* System Identity */}
            <div className="settings-section">
                <div className="section-header"><Building className="icon" /><h3>System Identity</h3></div>
                {renderFormField('System Name', 'systemName', form.systemName, 'text', 'e.g., Hostel Booking Pro', true, validationErrors.systemName)}
                {renderFormField('System Logo URL', 'systemLogoUrl', form.systemLogoUrl, 'text', 'https://...')}
                {renderFormField('System Domain', 'systemDomain', form.systemDomain, 'text', 'e.g., hostelbooking.com', true, validationErrors.systemDomain)}
            </div>

            {/* Business Setup */}
            <div className="settings-section">
                <div className="section-header"><Globe className="icon" /><h3>Business Setup</h3></div>
                {renderFormField('Number of Hostels', 'numberOfHostels', form.numberOfHostels, 'number')}
                {renderFormField('Default Country', 'defaultCountry', form.defaultCountry, 'text', 'e.g., Uganda')}
                {renderFormField('Default Currency', 'currency', form.currency, 'text', 'e.g., UGX')}
            </div>

            {/* Operational Defaults */}
            <div className="settings-section">
                <div className="section-header"><Clock className="icon" /><h3>Operational Defaults</h3></div>
                {renderFormField('Global Check-in Time', 'globalCheckInTime', form.globalCheckInTime, 'time')}
                {renderFormField('Global Check-out Time', 'globalCheckOutTime', form.globalCheckOutTime, 'time')}
                {renderFormField('Auto-Approval Rules', 'autoApprovalRules', form.autoApprovalRules, 'textarea', 'e.g., Pre-approve bookings under 30 days')}
            </div>

            {/* Payment Gateways */}
            <div className="settings-section">
                <div className="section-header"><DollarSign className="icon" /><h3>Payment Gateways</h3></div>
                {renderFormField('Flutterwave Key', 'paymentFlutterwaveKey', form.paymentFlutterwaveKey, 'password', 'Keep this secure')}
                {renderFormField('PayPal Key', 'paymentPayPalKey', form.paymentPayPalKey, 'password', 'Keep this secure')}
            </div>

            {/* Security */}
            <div className="settings-section">
                <div className="section-header"><Shield className="icon" /><h3>Security</h3></div>
                {renderFormField('User Permissions', 'userPermissions', form.userPermissions, 'textarea', 'Define user permission levels')}
                {renderFormField('Password Policies', 'passwordPolicies', form.passwordPolicies, 'textarea', 'e.g., Min 8 chars, special characters required')}
                {renderFormField('Data Backup Settings', 'dataBackup', form.dataBackup, 'text', 'e.g., Daily at 2 AM')}
            </div>

            {/* System Updates */}
            <div className="settings-section">
                <div className="section-header"><RefreshCw className="icon" /><h3>System Updates</h3></div>
                {renderFormField('Software Version', 'softwareVersion', form.softwareVersion, 'text', '', false, null)}
                <div className="form-row checkbox-row">
                    <label>
                        <input type="checkbox" name="maintenanceMode" checked={form.maintenanceMode} onChange={handleChange} />
                        Enable Maintenance Mode
                    </label>
                </div>
            </div>

            {/* Brand Customization */}
            <div className="settings-section">
                <div className="section-header"><Palette className="icon" /><h3>Brand Customization</h3></div>
                {renderFormField('Admin Panel Theme', 'adminTheme', form.adminTheme, 'text', 'e.g., Dark, Light, Blue')}
                {renderFormField('Favicon URL', 'faviconUrl', form.faviconUrl, 'text', 'https://...')}
                {renderFormField('Email Templates', 'emailTemplates', form.emailTemplates, 'text', 'e.g., Modern, Classic')}
            </div>
        </>
    );

    const renderManagerSettings = () => (
        <>
            <h2 className="text-xl font-semibold mb-4">Hostel-Level Settings</h2>

            {/* Hostel Selector */}
            {hostels.length > 0 && (
                <div className="settings-section">
                    <div className="section-header"><Building className="icon" /><h3>Select Hostel</h3></div>
                    <div className="form-row">
                        <label>Choose Hostel to Configure <span className="required">*</span></label>
                        {hostelsLoading ? (
                            <div className="loading-state"><Loader size={16} className="animate-spin" /> Loading hostels...</div>
                        ) : (
                            <select value={selectedHostelId} onChange={(e) => setSelectedHostelId(e.target.value)}>
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
                <div className="alert alert-info" style={{ marginBottom: '20px' }}>
                    <AlertCircle size={16} className="inline-icon" />
                    No hostels found. Please create a hostel first.
                </div>
            )}

            {/* Hostel Identity */}
            <div className="settings-section">
                <div className="section-header"><Building className="icon" /><h3>Hostel Identity</h3></div>
                {renderFormField('Hostel Name', 'siteName', form.siteName, 'text', 'e.g., Sunny Days Hostel', true, validationErrors.siteName)}
                {renderFormField('Hostel Description', 'hostelDescription', form.hostelDescription, 'textarea', 'Tell guests about your hostel')}
                {renderFormField('Hostel Logo URL', 'logoUrl', form.logoUrl, 'text', 'https://...')}
            </div>

            {/* Location & Contact */}
            <div className="settings-section">
                <div className="section-header"><MapPin className="icon" /><h3>Location & Contact</h3></div>
                {renderFormField('Address', 'address', form.address, 'text', 'e.g., 123 Main St, Kampala', true, validationErrors.address)}
                {renderFormField('Contact Email', 'contactEmail', form.contactEmail, 'email', 'hostel@example.com', true, validationErrors.contactEmail)}
                {renderFormField('Phone Number', 'contactPhone', form.contactPhone, 'tel', '+256...', true, validationErrors.contactPhone)}
            </div>

            {/* Operational Rules */}
            <div className="settings-section">
                <div className="section-header"><Calendar className="icon" /><h3>Operational Rules</h3></div>
                {renderFormField('Check-in Time', 'checkInTime', form.checkInTime, 'time', '', true, validationErrors.checkInTime)}
                {renderFormField('Check-out Time', 'checkOutTime', form.checkOutTime, 'time', '', true, validationErrors.checkOutTime)}
                {renderFormField('Booking Window', 'bookingWindow', form.bookingWindow, 'text', 'e.g., 90 days in advance')}
                {renderFormField('Deposit Requirements', 'depositRequirements', form.depositRequirements, 'text', 'e.g., 20% of total')}
            </div>

            {/* Pricing Defaults */}
            <div className="settings-section">
                <div className="section-header"><DollarSign className="icon" /><h3>Pricing Defaults</h3></div>
                {renderFormField('Default Currency', 'currency', form.currency, 'text', 'e.g., UGX')}
                {renderFormField('Default Rates (per room type)', 'defaultRates', form.defaultRates, 'textarea', 'Single: 50000, Double: 80000')}
                {renderFormField('Taxes', 'taxes', form.taxes, 'text', 'e.g., 10% VAT')}
                {renderFormField('Discounts', 'discounts', form.discounts, 'text', 'e.g., Weekly: 10%, Monthly: 15%')}
            </div>

            {/* Policies */}
            <div className="settings-section">
                <div className="section-header"><BookOpen className="icon" /><h3>Policies</h3></div>
                {renderFormField('Cancellation Policy', 'cancellationPolicy', form.cancellationPolicy, 'textarea', 'Free cancellation up to 48 hours before check-in')}
                {renderFormField('Refund Policy', 'refundPolicy', form.refundPolicy, 'textarea', 'Full refund for cancellations 7+ days before check-in')}
                {renderFormField('Guest Behavior Policy', 'guestBehaviorPolicy', form.guestBehaviorPolicy, 'textarea', 'Be respectful, quiet hours 10 PM - 8 AM')}
            </div>

            {/* Communication */}
            <div className="settings-section">
                <div className="section-header"><Mail className="icon" /><h3>Communication</h3></div>
                {renderFormField('Email/SMS Preferences', 'emailSmsPreferences', form.emailSmsPreferences, 'textarea', 'e.g., Booking confirmations, Check-in reminders')}
                {renderFormField('Auto Reminders', 'autoReminders', form.autoReminders, 'text', 'e.g., 24h before check-in, 7d before checkout')}
            </div>

            {/* Staff Management */}
            <div className="settings-section">
                <div className="section-header"><Users className="icon" /><h3>Staff Management</h3></div>
                {renderFormField('Staff Management Info', 'staffManagement', form.staffManagement, 'text', 'Link to staff management section or contact info')}
            </div>

            {/* Visibility Controls */}
            <div className="settings-section">
                <div className="section-header"><Eye className="icon" /><h3>Visibility Controls</h3></div>
                <div className="form-row checkbox-row">
                    <label>
                        <input type="checkbox" name="enableListing" checked={form.enableListing} onChange={handleChange} />
                        Enable Hostel Listing (visible to guests)
                    </label>
                </div>
                <div className="form-row checkbox-row">
                    <label>
                        <input type="checkbox" name="hostelMaintenanceMode" checked={form.hostelMaintenanceMode} onChange={handleChange} />
                        Hostel Maintenance Mode (temporarily unavailable)
                    </label>
                </div>
            </div>
        </>
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
                <button type="submit" disabled={saving}>
                    {saving ? (
                        <><Save className="inline-icon animate-pulse" /> Saving...</>
                    ) : (
                        <><Save className="inline-icon" /> Save Settings</>
                    )}
                </button>
            </div>
        </form>
    );
};

export default GeneralSettings;
