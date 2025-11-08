import axios from './axios';

// API endpoints
const API = {
    settings: '/settings',
    maintenance: '/settings/maintenance',
    logs: '/logs'
};

// Generic API request handler with error handling
const apiRequest = async (method, url, data = null) => {
    try {
        const config = {
            method,
            url,
            ...(data && (method === 'get' ? { params: data } : { data }))
        };
        const { data: responseData } = await axios(config);
        return responseData;
    } catch (error) {
        const errorMessage = error.response?.data?.message ?? 'An error occurred';
        throw new Error(errorMessage);
    }
};

// Settings API functions
export const getSettings = () => apiRequest('get', API.settings);

export const updateSettings = (settingsData) => apiRequest('put', API.settings, settingsData);

export const getMaintenanceStatus = () => apiRequest('get', API.maintenance);

export const toggleMaintenanceMode = () => apiRequest('put', API.maintenance);

// Activity Logs API functions
export const getActivityLogs = async (params) => {
    try {
        console.log('Fetching activity logs with params:', params);
        const response = await apiRequest('get', API.logs, params);
        console.log('Activity logs response:', response);
        return response;
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
    }
};

export const createTestLog = async () => {
    return apiRequest('post', API.logs, {
        action: 'Test Action',
        category: 'system',
        details: { test: 'Testing activity logs' }
    });
};

export const getLogsByCategory = (category) => apiRequest('get', `${API.logs}/${category}`);

export const clearOldLogs = (days) => apiRequest('delete', API.logs, { days });