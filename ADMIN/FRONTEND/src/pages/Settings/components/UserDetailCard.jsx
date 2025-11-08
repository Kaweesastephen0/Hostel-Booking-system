import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    Stack,
    IconButton,
    Grid
} from '@mui/material';
import { Close, Mail, Badge, AccessTime, CheckCircle } from '@mui/icons-material';
import { format } from 'date-fns';
import '../styles/UserDetailCard.css';

const UserDetailCard = ({ open, onClose, user }) => {
    if (!user) return null;

    const getUserRoleColor = (role) => {
        const colors = {
            admin: '#6366f1',
            manager: '#3b82f6',
            frontUser: '#8b5cf6',
            system: '#6b7280'
        };
        return colors[role] || '#6b7280';
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '—';
        try {
            return format(new Date(timestamp), 'PPpp');
        } catch {
            return '—';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    backgroundImage: 'none'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1, pt: 2, px: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        User Information
                    </Typography>
                    <IconButton size="small" onClick={onClose}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Card
                    sx={{
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        border: 'none',
                        mb: 2,
                        borderRadius: '12px'
                    }}
                >
                    <CardContent sx={{ pb: '16px !important' }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    background: getUserRoleColor(user.role),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '28px',
                                    fontWeight: 600
                                }}
                            >
                                {user.name?.[0]?.toUpperCase() || 'U'}
                            </Box>
                            <Box flex={1}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {user.name || 'Unknown User'}
                                </Typography>
                                <Chip
                                    label={user.role}
                                    size="small"
                                    sx={{
                                        background: getUserRoleColor(user.role),
                                        color: 'white',
                                        fontWeight: 500,
                                        textTransform: 'capitalize'
                                    }}
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                    {user.email && (
                        <Box display="flex" alignItems="flex-start" gap={1.5}>
                            <Mail sx={{ color: '#3b82f6', mt: 0.5, fontSize: '20px' }} />
                            <Box flex={1}>
                                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.25 }}>
                                    Email Address
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {user.role && (
                        <Box display="flex" alignItems="flex-start" gap={1.5}>
                            <Badge sx={{ color: '#8b5cf6', mt: 0.5, fontSize: '20px' }} />
                            <Box flex={1}>
                                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.25 }}>
                                    Role
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                    {user.role}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {user.createdAt && (
                        <Box display="flex" alignItems="flex-start" gap={1.5}>
                            <CheckCircle sx={{ color: '#10b981', mt: 0.5, fontSize: '20px' }} />
                            <Box flex={1}>
                                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.25 }}>
                                    Member Since
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {formatTimestamp(user.createdAt)}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {user.updatedAt && (
                        <Box display="flex" alignItems="flex-start" gap={1.5}>
                            <AccessTime sx={{ color: '#f59e0b', mt: 0.5, fontSize: '20px' }} />
                            <Box flex={1}>
                                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.25 }}>
                                    Last Updated
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {formatTimestamp(user.updatedAt)}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ p: 2, background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 500 }}>
                        ℹ️ This user performed the activity recorded in the log entry above.
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailCard;
