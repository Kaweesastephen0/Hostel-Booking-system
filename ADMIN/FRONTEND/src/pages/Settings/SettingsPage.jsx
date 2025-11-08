import React, { useState, useEffect, useCallback } from 'react';
import GeneralSettings from './tabs/GeneralSettings';
import UserManagement from './tabs/UserManagement';
import NotificationsSettings from './tabs/NotificationsSettings';
import SystemPreferences from './tabs/SystemPreferences';
import ActivityLogs from './tabs/ActivityLogs';
import { getSettings } from "../../services/settingsService";
import Tabs from './Tabs';
import { Settings, Users, Bell, Monitor, History } from 'lucide-react';
import Header from '../../components/header/Header';
import userService from '../../services/userService';
import './SettingsPage.css';
import './SettingsCards.css';

const SettingsPage = () => {
    const [state, setState] = useState({
        activeTab: 'general',
        settings: null,
        loading: true,
        error: null,
        user: null,
        userLoading: true
    });

    const { activeTab, settings, loading, error, user, userLoading } = state;

    const fetchSettings = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await getSettings();
            setState(prev => ({ ...prev, settings: response.data, loading: false }));
        } catch (err) {
            setState(prev => ({ ...prev, error: err?.message ?? 'Failed to load settings', loading: false }));
            console.error('Error loading settings:', err);
        }
    }, []);

    useEffect(() => {
        // fetch user first
        const init = async () => {
            try {
                const userResp = await userService.getCurrentUser();
                const currentUser = userResp.data;
                setState(prev => ({ ...prev, user: currentUser, userLoading: false }));
            } catch (err) {
                console.error('Error fetching user:', err);
                setState(prev => ({ ...prev, userLoading: false }));
            }

            // fetch settings regardless; backend will scope by role if applicable
            await fetchSettings();
        };

        init();
    }, [fetchSettings]);

    const setActiveTab = (tab) => setState(prev => ({ ...prev, activeTab: tab }));

    const handleSettingsUpdate = useCallback(() => {
        fetchSettings();
    }, [fetchSettings]);

    if (loading || userLoading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    // Build tabs based on role
    const tabs = (user && user.role === 'admin') ? [
        { id: 'general', label: 'General Settings', icon: <Settings /> },
        { id: 'users', label: 'User Management', icon: <Users /> },
        { id: 'notifications', label: 'Notifications & Communication', icon: <Bell /> },
        { id: 'system', label: 'System Preferences', icon: <Monitor /> },
        { id: 'activity', label: 'Activity Logs', icon: <History /> },
    ] : [
        // hostel manager: limited view
        { id: 'general', label: 'Hostel Settings', icon: <Settings /> },
        { id: 'notifications', label: 'Communications', icon: <Bell /> }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralSettings role={user?.role} settings={settings} onUpdate={handleSettingsUpdate} />;
            case 'users':
                return <UserManagement />;
            case 'notifications':
                return <NotificationsSettings settings={settings} onUpdate={handleSettingsUpdate} />;
            case 'system':
                return <SystemPreferences settings={settings} onUpdate={handleSettingsUpdate} />;
            case 'activity':
                return <ActivityLogs />;
            default:
                return null;
        }
    };

    return (
        <div className="settings-page">
            <Header 
                title="Settings" 
                subtitle="Manage system configuration" 
            />
            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="settings-content">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                <div className="tab-content">
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;