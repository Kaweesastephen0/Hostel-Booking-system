import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Chip,
    Divider,
    Stack,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer
} from '@mui/material';
import { Close, Info, AccountCircle, Settings, CheckCircle, AccessTime } from '@mui/icons-material';
import { format } from 'date-fns';
import '../styles/ActivityDetailsDrawer.css';

const ActivityDetailsDrawer = ({ open, onClose, activity }) => {
    if (!activity) return null;

    const getCategoryColor = (category) => {
        const colors = {
            booking: { bg: '#e3f2fd', text: '#1976d2', icon: '📅' },
            payment: { bg: '#e8f5e9', text: '#2e7d32', icon: '💳' },
            user: { bg: '#f3e5f5', text: '#7b1fa2', icon: '👤' },
            hostel: { bg: '#fff3e0', text: '#f57c00', icon: '🏢' },
            room: { bg: '#e1f5fe', text: '#0288d1', icon: '🚪' },
            settings: { bg: '#fce4ec', text: '#c2185b', icon: '⚙️' },
            system: { bg: '#f5f5f5', text: '#616161', icon: '⚡' }
        };
        return colors[category] || colors.system;
    };

    const getUserTypeColor = (userType) => {
        const colors = {
            admin: '#6366f1',
            manager: '#3b82f6',
            frontUser: '#8b5cf6',
            system: '#6b7280'
        };
        return colors[userType] || '#6b7280';
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '—';
        try {
            return format(new Date(timestamp), 'PPpp');
        } catch {
            return '—';
        }
    };

    const formatRelativeTime = (timestamp) => {
        if (!timestamp) return '—';
        try {
            const now = new Date();
            const date = new Date(timestamp);
            const seconds = Math.floor((now - date) / 1000);
            
            if (seconds < 60) return 'Just now';
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;
            const days = Math.floor(hours / 24);
            if (days < 7) return `${days}d ago`;
            return format(date, 'MMM d');
        } catch {
            return '—';
        }
    };

    const categoryInfo = getCategoryColor(activity.category);
    const userTypeColor = getUserTypeColor(activity.userType);

    const detailsArray = activity.details 
        ? (typeof activity.details === 'string' 
            ? [{ key: 'details', value: activity.details }]
            : Array.isArray(activity.details) 
                ? activity.details
                : Object.entries(activity.details).map(([key, value]) => ({ key, value })))
        : [];

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 450, md: 500 },
                    boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)'
                }
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${categoryInfo.bg} 0%, rgba(255,255,255,0.5) 100%)`,
                    padding: 2.5,
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                }}
            >
                <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.5px' }}>
                            Activity Details
                        </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {activity.action}
                    </Typography>
                </Box>
                <IconButton size="small" onClick={onClose} sx={{ mt: -0.5 }}>
                    <Close fontSize="small" />
                </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ overflow: 'auto', height: 'calc(100vh - 140px)' }}>
                <Box sx={{ p: 2.5 }}>
                    {/* Category & Status */}
                    <Stack spacing={2} mb={3}>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, display: 'block', mb: 0.75 }}>
                                Category
                            </Typography>
                            <Chip
                                icon={<span style={{ fontSize: '0.9rem' }}>{categoryInfo.icon}</span>}
                                label={activity.category}
                                size="small"
                                sx={{
                                    background: categoryInfo.bg,
                                    color: categoryInfo.text,
                                    fontWeight: 600,
                                    textTransform: 'capitalize'
                                }}
                            />
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* User Information */}
                    <Box mb={3}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <AccountCircle sx={{ fontSize: '18px' }} /> User Information
                        </Typography>
                        <Paper
                            sx={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: 1.5,
                                p: 1.75
                            }}
                        >
                            <Stack spacing={1.5}>
                                {activity.user?.name && (
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, display: 'block', mb: 0.25 }}>
                                            User Name
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {activity.user.name}
                                        </Typography>
                                    </Box>
                                )}
                                {activity.user?.email && (
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, display: 'block', mb: 0.25 }}>
                                            Email
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#3b82f6', wordBreak: 'break-all' }}>
                                            {activity.user.email}
                                        </Typography>
                                    </Box>
                                )}
                                {activity.userType && (
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, display: 'block', mb: 0.25 }}>
                                            User Type
                                        </Typography>
                                        <Chip
                                            label={activity.userType}
                                            size="small"
                                            sx={{
                                                background: userTypeColor,
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'capitalize'
                                            }}
                                        />
                                    </Box>
                                )}
                            </Stack>
                        </Paper>
                    </Box>

                    {/* Timestamp Information */}
                    <Box mb={3}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <AccessTime sx={{ fontSize: '18px' }} /> Timestamp
                        </Typography>
                        <Paper
                            sx={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: 1.5,
                                p: 1.75
                            }}
                        >
                            <Stack spacing={1.5}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, display: 'block', mb: 0.25 }}>
                                        Exact Time
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                                        {formatTimestamp(activity.createdAt)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, display: 'block', mb: 0.25 }}>
                                        Relative Time
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#0288d1' }}>
                                        {formatRelativeTime(activity.createdAt)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Box>

                    {/* Activity Details */}
                    {detailsArray.length > 0 && (
                        <Box mb={3}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Info sx={{ fontSize: '18px' }} /> Activity Details
                            </Typography>
                            <Paper
                                sx={{
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 1.5,
                                    overflow: 'hidden'
                                }}
                            >
                                <Stack spacing={0}>
                                    {detailsArray.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                p: 1.75,
                                                borderBottom: index < detailsArray.length - 1 ? '1px solid #e2e8f0' : 'none',
                                                '&:hover': {
                                                    background: '#f1f5f9'
                                                }
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: '#6b7280',
                                                    fontWeight: 500,
                                                    display: 'block',
                                                    mb: 0.5,
                                                    textTransform: 'capitalize',
                                                    letterSpacing: '0.3px'
                                                }}
                                            >
                                                {item.key}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 500,
                                                    wordBreak: 'break-word',
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.8125rem',
                                                    color: '#1e293b',
                                                    whiteSpace: 'pre-wrap'
                                                }}
                                            >
                                                {typeof item.value === 'object'
                                                    ? JSON.stringify(item.value, null, 2)
                                                    : String(item.value)}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>
                        </Box>
                    )}

                    {/* Status */}
                    <Box mb={3}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <CheckCircle sx={{ fontSize: '18px' }} /> Status
                        </Typography>
                        <Chip
                            label={activity.status || 'completed'}
                            size="small"
                            sx={{
                                background: (activity.status === 'success' || !activity.status) ? '#e8f5e9' : '#ffebee',
                                color: (activity.status === 'success' || !activity.status) ? '#2e7d32' : '#c62828',
                                fontWeight: 600,
                                textTransform: 'capitalize'
                            }}
                        />
                    </Box>

                    {/* Metadata */}
                    {activity.metadata && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1.5 }}>
                                Metadata
                            </Typography>
                            <Paper
                                sx={{
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 1.5,
                                    p: 1.75
                                }}
                            >
                                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {typeof activity.metadata === 'string'
                                        ? activity.metadata
                                        : JSON.stringify(activity.metadata, null, 2)}
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    p: 2,
                    borderTop: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    position: 'sticky',
                    bottom: 0
                }}
            >
                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                    Activity ID: <Typography component="span" variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{activity._id}</Typography>
                </Typography>
            </Box>
        </Drawer>
    );
};

export default ActivityDetailsDrawer;
