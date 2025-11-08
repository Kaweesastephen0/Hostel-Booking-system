import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    MenuItem,
    Box,
    Grid,
    Button,
    Card,
    CardContent,
    InputAdornment,
    Chip,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';
import { Search, FilterList, CalendarMonth, Person, Assessment, Info } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getActivityLogs, createTestLog } from '../../../services/settingsService';
import UserDetailCard from '../components/UserDetailCard';
import ActivityDetailsDrawer from '../components/ActivityDetailsDrawer';
import './ActivityLogs.css';

const CATEGORIES = ['all', 'booking', 'payment', 'user', 'hostel', 'room', 'settings', 'system'];
const USER_TYPES = ['all', 'admin', 'manager', 'frontUser'];

const ActivityLogs = () => {
    // States for filtering and pagination
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        category: 'all',
        userType: 'all',
        search: '',
        dateFrom: null,
        dateTo: null
    });
    const [totalCount, setTotalCount] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetailOpen, setUserDetailOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activityDetailOpen, setActivityDetailOpen] = useState(false);

    // Fetch logs with filters
    const fetchLogs = async () => {
        try {
            setLoading(true);
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                ...(filters.category !== 'all' && { category: filters.category }),
                ...(filters.userType !== 'all' && { userType: filters.userType }),
                ...(filters.search && { search: filters.search }),
                ...(filters.dateFrom && { startDate: filters.dateFrom.toISOString() }),
                ...(filters.dateTo && { endDate: filters.dateTo.toISOString() })
            };
            
            const response = await getActivityLogs(params);
            console.log('Activity Logs Response:', response);
            setLogs(response.data || []);
            setTotalCount(response.count || 0);
        } catch (err) {
            console.error('Error in fetchLogs:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch activity logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, rowsPerPage, filters]);

    // Handle filter changes
    const handleFilterChange = (field) => (event) => {
        setFilters(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        setPage(0); // Reset page when filters change
    };

    const handleDateChange = (field) => (date) => {
        setFilters(prev => ({
            ...prev,
            [field]: date
        }));
        setPage(0);
    };

    // Status chip color mapping
    const getStatusChipProps = (action) => {
        if (action.toLowerCase().includes('create') || action.toLowerCase().includes('success')) {
            return { color: 'success', label: 'Successful' };
        }
        if (action.toLowerCase().includes('delete') || action.toLowerCase().includes('fail')) {
            return { color: 'error', label: 'Failed' };
        }
        if (action.toLowerCase().includes('update')) {
            return { color: 'primary', label: 'Updated' };
        }
        return { color: 'default', label: 'Completed' };
    };

    return (
        <div className="activity-logs">
            {/* Debug Section */}
            <Box mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                        try {
                            await createTestLog();
                            fetchLogs();
                        } catch (err) {
                            console.error('Error creating test log:', err);
                        }
                    }}
                >
                    Create Test Log
                </Button>
            </Box>

            {/* Filters Section */}
            <Card className="filters-card">
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Search activities..."
                                value={filters.search}
                                onChange={handleFilterChange('search')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                select
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={filters.category}
                                onChange={handleFilterChange('category')}
                                label="Category"
                            >
                                {CATEGORIES.map(cat => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                select
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={filters.userType}
                                onChange={handleFilterChange('userType')}
                                label="User Type"
                            >
                                {USER_TYPES.map(type => (
                                    <MenuItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <DatePicker
                                label="From Date"
                                value={filters.dateFrom}
                                onChange={handleDateChange('dateFrom')}
                                slotProps={{
                                    textField: {
                                        variant: "outlined",
                                        size: "small",
                                        fullWidth: true
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <DatePicker
                                label="To Date"
                                value={filters.dateTo}
                                onChange={handleDateChange('dateTo')}
                                slotProps={{
                                    textField: {
                                        variant: "outlined",
                                        size: "small",
                                        fullWidth: true
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Table Section */}
            <TableContainer component={Paper} className="logs-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center" sx={{ width: 60 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="loading-cell">
                                    Loading activity logs...
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={6} className="error-cell">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No activity logs found
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => {
                                const statusProps = getStatusChipProps(log.action);
                                return (
                                    <TableRow key={log._id}>
                                        <TableCell>
                                            {new Date(log.createdAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1} justifyContent="space-between">
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Person fontSize="small" />
                                                    {log.user?.name || 'System'}
                                                </Box>
                                                {log.user && (
                                                    <Tooltip title="View user details">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedUser(log.user);
                                                                setUserDetailOpen(true);
                                                            }}
                                                            sx={{ ml: 1, p: 0.5 }}
                                                        >
                                                            <Info fontSize="small" sx={{ color: '#3b82f6' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={log.category}
                                                className={`category-chip ${log.category}`}
                                            />
                                        </TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" className="details-cell">
                                                {typeof log.details === 'string' 
                                                    ? log.details 
                                                    : JSON.stringify(log.details)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                {...statusProps}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="View activity details">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setSelectedActivity(log);
                                                        setActivityDetailOpen(true);
                                                    }}
                                                    sx={{
                                                        color: '#3b82f6',
                                                        '&:hover': {
                                                            background: 'rgba(59, 130, 246, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    <Info fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                />
            </TableContainer>

            <UserDetailCard
                open={userDetailOpen}
                onClose={() => setUserDetailOpen(false)}
                user={selectedUser}
            />

            <ActivityDetailsDrawer
                open={activityDetailOpen}
                onClose={() => setActivityDetailOpen(false)}
                activity={selectedActivity}
            />
        </div>
    );
};

export default ActivityLogs;
