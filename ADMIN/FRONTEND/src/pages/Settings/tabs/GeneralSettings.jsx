import React, { useState, useEffect } from 'react';
import { updateSettings } from '../../../services/settingsService';
import {
    Building, Globe, Clock, DollarSign, Shield, RefreshCw, Palette, // System Admin Icons
    MapPin, Phone, Mail, Calendar, Percent, BookOpen, Users, Eye, // Hostel Manager Icons
    Save, XCircle, CheckCircle
} from 'lucide-react';

const GeneralSettings = ({ role = 'manager', settings = {}, onUpdate = () => {} }) => {
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await updateSettings(form);
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
            onUpdate();
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to save settings.' });
        } finally {
            setSaving(false);
        }
    };

    const renderAdminSettings = () => (
        <>
            <h2 className="text-xl font-semibold mb-4">Platform-Level Settings</h2>

            {/* System Identity */}
            <div className="settings-section">
                <div className="section-header"><Building className="icon" /><h3>System Identity</h3></div>
                <div className="form-row">
                    <label>System Name</label>
                    <input name="systemName" value={form.systemName} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>System Logo URL</label>
                    <input name="systemLogoUrl" value={form.systemLogoUrl} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>System Domain</label>
                    <input name="systemDomain" value={form.systemDomain} onChange={handleChange} />
                </div>
            </div>

            {/* Business Setup */}
            <div className="settings-section">
                <div className="section-header"><Globe className="icon" /><h3>Business Setup</h3></div>
                <div className="form-row">
                    <label>Number of Hostels</label>
                    <input type="number" name="numberOfHostels" value={form.numberOfHostels} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Default Country</label>
                    <input name="defaultCountry" value={form.defaultCountry} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Default Currency</label>
                    <input name="currency" value={form.currency} onChange={handleChange} />
                </div>
            </div>

            {/* Operational Defaults */}
            <div className="settings-section">
                <div className="section-header"><Clock className="icon" /><h3>Operational Defaults</h3></div>
                <div className="form-row">
                    <label>Global Check-in Time</label>
                    <input type="time" name="globalCheckInTime" value={form.globalCheckInTime} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Global Check-out Time</label>
                    <input type="time" name="globalCheckOutTime" value={form.globalCheckOutTime} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Auto-Approval Rules</label>
                    <textarea name="autoApprovalRules" value={form.autoApprovalRules} onChange={handleChange} />
                </div>
            </div>

            {/* Payment Gateways */}
            <div className="settings-section">
                <div className="section-header"><DollarSign className="icon" /><h3>Payment Gateways</h3></div>
                <div className="form-row">
                    <label>Flutterwave Key</label>
                    <input name="paymentFlutterwaveKey" value={form.paymentFlutterwaveKey} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>PayPal Key</label>
                    <input name="paymentPayPalKey" value={form.paymentPayPalKey} onChange={handleChange} />
                </div>
            </div>

            {/* Security */}
            <div className="settings-section">
                <div className="section-header"><Shield className="icon" /><h3>Security</h3></div>
                <div className="form-row">
                    <label>User Permissions</label>
                    <textarea name="userPermissions" value={form.userPermissions} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Password Policies</label>
                    <textarea name="passwordPolicies" value={form.passwordPolicies} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Data Backup Settings</label>
                    <input name="dataBackup" value={form.dataBackup} onChange={handleChange} />
                </div>
            </div>

            {/* System Updates */}
            <div className="settings-section">
                <div className="section-header"><RefreshCw className="icon" /><h3>System Updates</h3></div>
                <div className="form-row">
                    <label>Software Version</label>
                    <input name="softwareVersion" value={form.softwareVersion} onChange={handleChange} readOnly />
                </div>
                <div className="form-row checkbox-row">
                    <label>Maintenance Mode</label>
                    <input type="checkbox" name="maintenanceMode" checked={form.maintenanceMode} onChange={handleChange} />
                </div>
            </div>

            {/* Brand Customization */}
            <div className="settings-section">
                <div className="section-header"><Palette className="icon" /><h3>Brand Customization</h3></div>
                <div className="form-row">
                    <label>Admin Panel Theme</label>
                    <input name="adminTheme" value={form.adminTheme} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Favicon URL</label>
                    <input name="faviconUrl" value={form.faviconUrl} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Email Templates</label>
                    <input name="emailTemplates" value={form.emailTemplates} onChange={handleChange} />
                </div>
            </div>
        </>
    );

    const renderManagerSettings = () => (
        <>
            <h2 className="text-xl font-semibold mb-4">Hostel-Level Settings</h2>

            {/* Hostel Identity */}
            <div className="settings-section">
                <div className="section-header"><Building className="icon" /><h3>Hostel Identity</h3></div>
                <div className="form-row">
                    <label>Hostel Name</label>
                    <input name="siteName" value={form.siteName} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Hostel Description</label>
                    <textarea name="hostelDescription" value={form.hostelDescription} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Hostel Logo URL</label>
                    <input name="logoUrl" value={form.logoUrl} onChange={handleChange} />
                </div>
            </div>

            {/* Location & Contact */}
            <div className="settings-section">
                <div className="section-header"><MapPin className="icon" /><h3>Location & Contact</h3></div>
                <div className="form-row">
                    <label>Address</label>
                    <input name="address" value={form.address} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Contact Email</label>
                    <input name="contactEmail" value={form.contactEmail} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Phone Number</label>
                    <input name="contactPhone" value={form.contactPhone} onChange={handleChange} />
                </div>
            </div>

            {/* Operational Rules */}
            <div className="settings-section">
                <div className="section-header"><Calendar className="icon" /><h3>Operational Rules</h3></div>
                <div className="form-row">
                    <label>Check-in Time</label>
                    <input type="time" name="checkInTime" value={form.checkInTime} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Check-out Time</label>
                    <input type="time" name="checkOutTime" value={form.checkOutTime} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Booking Window</label>
                    <input name="bookingWindow" value={form.bookingWindow} onChange={handleChange} placeholder="e.g., 90 days in advance" />
                </div>
                <div className="form-row">
                    <label>Deposit Requirements</label>
                    <input name="depositRequirements" value={form.depositRequirements} onChange={handleChange} placeholder="e.g., 20% of total" />
                </div>
            </div>

            {/* Pricing Defaults */}
            <div className="settings-section">
                <div className="section-header"><DollarSign className="icon" /><h3>Pricing Defaults</h3></div>
                <div className="form-row">
                    <label>Default Currency</label>
                    <input name="currency" value={form.currency} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Default Rates (per room type)</label>
                    <textarea name="defaultRates" value={form.defaultRates} onChange={handleChange} placeholder="e.g., Single: 50, Double: 80" />
                </div>
                <div className="form-row">
                    <label>Taxes</label>
                    <input name="taxes" value={form.taxes} onChange={handleChange} placeholder="e.g., 10% VAT" />
                </div>
                <div className="form-row">
                    <label>Discounts</label>
                    <input name="discounts" value={form.discounts} onChange={handleChange} placeholder="e.g., Early Bird: 15%" />
                </div>
            </div>

            {/* Policies */}
            <div className="settings-section">
                <div className="section-header"><BookOpen className="icon" /><h3>Policies</h3></div>
                <div className="form-row">
                    <label>Cancellation Policy</label>
                    <textarea name="cancellationPolicy" value={form.cancellationPolicy} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Refund Policy</label>
                    <textarea name="refundPolicy" value={form.refundPolicy} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Guest Behavior Policy</label>
                    <textarea name="guestBehaviorPolicy" value={form.guestBehaviorPolicy} onChange={handleChange} />
                </div>
            </div>

            {/* Communication */}
            <div className="settings-section">
                <div className="section-header"><Mail className="icon" /><h3>Communication</h3></div>
                <div className="form-row">
                    <label>Email/SMS Preferences</label>
                    <textarea name="emailSmsPreferences" value={form.emailSmsPreferences} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Auto Reminders</label>
                    <input name="autoReminders" value={form.autoReminders} onChange={handleChange} placeholder="e.g., 24h before check-in" />
                </div>
            </div>

            {/* Staff Management (simplified for settings page) */}
            <div className="settings-section">
                <div className="section-header"><Users className="icon" /><h3>Staff Management</h3></div>
                <div className="form-row">
                    <label>Staff Management Link/Info</label>
                    <input name="staffManagement" value={form.staffManagement} onChange={handleChange} placeholder="Link to staff management section" />
                </div>
            </div>

            {/* Visibility Controls */}
            <div className="settings-section">
                <div className="section-header"><Eye className="icon" /><h3>Visibility Controls</h3></div>
                <div className="form-row checkbox-row">
                    <label>Enable Hostel Listing</label>
                    <input type="checkbox" name="enableListing" checked={form.enableListing} onChange={handleChange} />
                </div>
                <div className="form-row checkbox-row">
                    <label>Hostel Maintenance Mode</label>
                    <input type="checkbox" name="hostelMaintenanceMode" checked={form.hostelMaintenanceMode} onChange={handleChange} />
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
