import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Chip, TextField, InputAdornment, MenuItem, FormControl, InputLabel,
  Select, Alert, Snackbar, Paper, Grid
} from '@mui/material';
import { Add, FilterList, Search, Edit, Delete, Cancel, CheckCircle, Close, Info, Replay } from '@mui/icons-material';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { format } from 'date-fns';
import _ from 'lodash';

// Reusable FilterSelect component
const FilterSelect = ({ label, value, onChange, options }) => (
  <Grid>
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
);

// Add prop types for better development experience
FilterSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  gridProps: PropTypes.object
};

// Default props
FilterSelect.defaultProps = {
  gridProps: { xs: 6, sm: 4, md: 2 }
};

import DataTable from '../../components/common/DataTable';
import Swal from 'sweetalert2';
import BookingForm from './BookingForm';
import './Bookings.css';

let API_BASE_URL = import.meta.env.VITE_APP_API_URL;

// Constants for status options
const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

// Status color mapping
const statusColorMap = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'primary',
};

// Date range options
const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'upcoming', label: 'Upcoming' },
];

// Room type options
const ROOM_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
];

// Payment status options
const PAYMENT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Payments' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
  { value: 'refunded', label: 'Refunded' },
];

const User = localStorage.getItem('user');

if (User === null) {
  <Navigate to="/login" />
}

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy');
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') return value ?? '—';
  return `UGX ${value.toLocaleString()}`;
};

const Bookings = () => {
  const navigate = useNavigate();

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (err) {
      console.error('Failed to parse user from storage', err);
      return {};
    }
  }, []);

  const userRole = currentUser?.role || 'manager';


  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [orderBy, setOrderBy] = useState('checkIn');
  const [order, setOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    roomType: 'all',
    paymentStatus: 'all',
  });

  const [showFilters, setShowFilters] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [rowActionState, setRowActionState] = useState({});

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const updateRowActionState = useCallback((id, key, value) => {
    setRowActionState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterName) => (event) => {
    const value = event.target.value;
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterName]: value
      };
      
      // If changing date range, reset other date-related filters
      if (filterName === 'dateRange' && value === 'all') {
        newFilters.startDate = undefined;
        newFilters.endDate = undefined;
      }
      
      return newFilters;
    });
    
    // Reset to first page when filters change
    setPage(0);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      dateRange: 'all',
      roomType: 'all',
      paymentStatus: 'all',
    });
    setSearchTerm('');
    setPage(0);
  };

  // Helper function to build query params
  const buildQueryParams = (filters, searchTerm, page, rowsPerPage, orderBy, order) => {
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: rowsPerPage.toString(),
      sort: orderBy,
      order,
    });

    // Add search term if provided
    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }

    // Add status filter if not 'all'
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }

    // Add payment status filter if not 'all'
    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      params.append('paymentStatus', filters.paymentStatus);
    }

    // Add room type filter if not 'all'
    if (filters.roomType && filters.roomType !== 'all') {
      params.append('roomType', filters.roomType);
    }

    // Handle date range filters
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      switch (filters.dateRange) {
        case 'today': {
          const endOfDay = new Date(startOfDay);
          endOfDay.setHours(23, 59, 59, 999);
          params.append('checkIn[lte]', endOfDay.toISOString());
          params.append('checkOut[gte]', startOfDay.toISOString());
          break;
        }
        case 'thisWeek': {
          const startOfWeek = new Date(startOfDay);
          startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
          
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
          
          params.append('checkIn[lte]', endOfWeek.toISOString());
          params.append('checkOut[gte]', startOfWeek.toISOString());
          break;
        }
        case 'thisMonth': {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endOfMonth.setHours(23, 59, 59, 999);
          
          params.append('checkIn[lte]', endOfMonth.toISOString());
          params.append('checkOut[gte]', startOfMonth.toISOString());
          break;
        }
        case 'upcoming':
          params.append('checkIn[gte]', new Date().toISOString());
          break;
        default:
          break;
      }
    }

    return params;
  };

  // Debounced search to prevent too many API calls
  const debouncedSearch = useCallback(
    _.debounce((searchValue) => {
      setSearchTerm(searchValue);
      setPage(0);
    }, 500),
    []
  );

  // Fixed: Single handleSearch function
  const handleSearch = (event) => {
    const value = event.target.value;
    debouncedSearch(value);
  };

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      
      // Build query params with all filters
      const params = buildQueryParams(filters, searchTerm, page, rowsPerPage, orderBy, order);

      const token = localStorage.getItem('token');

      // Fixed: Use the built params in the API call
      const response = await fetch(`${API_BASE_URL}/bookings?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include'
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to fetch bookings.');
      }

      const rawBookings = Array.isArray(payload?.data?.bookings)
        ? payload.data.bookings
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.bookings)
            ? payload.bookings
            : [];

      const normalized = rawBookings.map((booking) => ({
        id: booking.id || booking._id,
        reference: booking.reference,
        guestName: booking.guestName || booking.guest || '',
        guestEmail: booking.guestEmail || '',
        guestPhone: booking.guestPhone || '',
        roomNumber: booking.roomNumber || booking.room || '',
        status: booking.status || 'pending',
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights: booking.nights,
        amount: booking.amount,
        notes: booking.notes,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      }));

      const total = payload?.data?.total
        ?? payload?.total
        ?? payload?.meta?.total
        ?? payload?.pagination?.total
        ?? normalized.length;

      setBookings(normalized);
      setRowActionState({});
      setTotalRows(typeof total === 'number' ? total : normalized.length);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setFetchError(error.message || 'Failed to load bookings.');
      setBookings([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, page, rowsPerPage, orderBy, order]); // Fixed: Added all dependencies

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property, direction) => {
    setOrderBy(property);
    setOrder(direction);
  };

  const handleEditBooking = useCallback((booking) => {
    navigate(`/bookings/${booking.id}`);
  }, [navigate]);

  const handleDeleteBooking = useCallback(async (booking) => {
    const displayName = booking.reference || booking.guestName || booking.roomNumber || 'this booking';

    const result = await Swal.fire({
      title: 'Delete booking?',
      text: `Are you sure you want to delete ${displayName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#1976d2',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) {
      return;
    }

    updateRowActionState(booking.id, 'deleting', true);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/bookings/${booking.id}`, {
        method: 'DELETE',
        headers: headers,
        credentials: 'include',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to delete booking.');
      }

      showSnackbar('Booking deleted successfully.');
      await fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      showSnackbar(error.message || 'Failed to delete booking.', 'error');
    } finally {
      updateRowActionState(booking.id, 'deleting', false);
    }
  }, [updateRowActionState, showSnackbar, fetchBookings]);

  const handleUpdateStatus = useCallback(async (booking, targetStatus) => {
    if (!targetStatus || targetStatus === booking.status) return;

    updateRowActionState(booking.id, 'updating', true);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/bookings/${booking.id}`, {
        method: 'PUT',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify({ status: targetStatus }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update booking status.');
      }

      showSnackbar(`Booking status updated to ${targetStatus}.`);
      await fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      showSnackbar(error.message || 'Failed to update booking status.', 'error');
    } finally {
      updateRowActionState(booking.id, 'updating', false);
    }
  }, [updateRowActionState, showSnackbar, fetchBookings]);

  const handleOpenDetails = useCallback(async (booking) => {
    setSelectedBooking(booking);
    setBookingDetails(null);
    setDetailsError(null);
    setLoadingDetails(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/bookings/${booking.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load booking details.');
      }

      const detail = payload?.data?.booking || payload?.booking || payload?.data;
      setBookingDetails(detail);
    } catch (error) {
      console.error('Error loading booking details:', error);
      setDetailsError(error.message || 'Failed to load booking details.');
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  const handleCloseDetails = () => {
    setSelectedBooking(null);
    setBookingDetails(null);
    setDetailsError(null);
  };

  const detailsStatusActions = useMemo(() => ({
    pending: [
      { label: 'Mark Confirmed', target: 'confirmed', icon: <CheckCircle fontSize="small" />, color: 'success' },
      { label: 'Cancel Booking', target: 'cancelled', icon: <Cancel fontSize="small" />, color: 'warning' },
    ],
    confirmed: [
      { label: 'Mark Completed', target: 'completed', icon: <CheckCircle fontSize="small" />, color: 'primary' },
      { label: 'Cancel Booking', target: 'cancelled', icon: <Cancel fontSize="small" />, color: 'warning' },
    ],
    cancelled: [
      { label: 'Reopen (Pending)', target: 'pending', icon: <Info fontSize="small" />, color: 'info' },
      { label: 'Mark Confirmed', target: 'confirmed', icon: <CheckCircle fontSize="small" />, color: 'success' },
    ],
    completed: [
      { label: 'Reopen (Pending)', target: 'pending', icon: <Info fontSize="small" />, color: 'info' },
      { label: 'Mark Confirmed', target: 'confirmed', icon: <CheckCircle fontSize="small" />, color: 'success' },
    ],
  }), []);

  const openAddDialog = () => {
    if (userRole === 'manager') {
      setIsAddDialogOpen(true);
    } else {
      showSnackbar('Admins cannot create new bookings.', 'error');
    }
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleBookingSuccess = async (message) => {
    showSnackbar(message);
    await fetchBookings();
  };

  const columns = useMemo(() => [
    {
      id: 'guestName',
      label: 'Guest',
      minWidth: 50,
      overflowY: "hidden",
      format: (_value, row) => (
        <Box display="flex" flexDirection="column">
          <Typography variant="body2">{row.guestName || '—'}</Typography>
          {(row.guestEmail || row.guestPhone) && (
            <Typography variant="caption" color="textSecondary">
              {[row.guestEmail, row.guestPhone].filter(Boolean).join(' · ') || '—'}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'roomNumber',
      label: 'Room',
      minWidth: 50,
      format: (value) => value || '—',
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 50,
      format: (value) => (
        <Chip
          label={value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending'}
          color={statusColorMap[value] || 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: 'checkIn',
      label: 'Check-In',
      minWidth: 100,
      format: (value) => formatDate(value),
    },
    {
      id: 'checkOut',
      label: 'Check-Out',
      minWidth: 100,
      format: (value) => formatDate(value),
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 50,
      align: 'right',
      format: (value) => formatCurrency(typeof value === 'number' ? value : Number(value) || 0),
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 50,
      format: (value) => formatDate(value),
    },
  ], []);

  const actions = useMemo(() => [
    {
      icon: <Info fontSize="small" />,
      tooltip: 'View Booking Details',
      onClick: handleOpenDetails,
      color: 'info',
      disabled: (row) => Boolean(rowActionState[row.id]?.deleting),
    },
    {
      icon: <Edit fontSize="small" />,
      tooltip: 'View / Edit Booking',
      onClick: handleEditBooking,
      color: 'primary',
      disabled: (row) => Boolean(rowActionState[row.id]?.deleting || rowActionState[row.id]?.updating),
    },
    {
      icon: (row) => {
        const status = row.status?.toLowerCase();
        if (status === 'pending') return <CheckCircle fontSize="small" />;
        if (status === 'confirmed') return <Cancel fontSize="small" />;
        if (status === 'cancelled') return <Replay fontSize="small" />;
        return <Info fontSize="small" />;
      },
      getTooltip: (row) => {
        const status = row.status?.toLowerCase();
        if (status === 'pending') return 'Mark as Confirmed';
        if (status === 'confirmed') return 'Cancel Booking';
        if (status === 'cancelled') return 'Reopen Booking';
        return 'View Details';
      },
      onClick: (row) => {
        const status = row.status?.toLowerCase();
        if (status === 'pending') return handleUpdateStatus(row, 'confirmed');
        if (status === 'confirmed') return handleUpdateStatus(row, 'cancelled');
        if (status === 'cancelled') return handleUpdateStatus(row, 'pending');
        handleOpenDetails(row);
      },
      get color() {
        return 'primary';
      },
      disabled: (row) => Boolean(rowActionState[row.id]?.updating || rowActionState[row.id]?.deleting)
    },
    {
      icon: <Delete fontSize="small" />,
      tooltip: 'Delete Booking',
      onClick: handleDeleteBooking,
      color: 'error',
      disabled: (row) => Boolean(rowActionState[row.id]?.deleting)
    }
  ], [handleDeleteBooking, handleEditBooking, handleOpenDetails, handleUpdateStatus, rowActionState]);

  if (fetchError) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {fetchError}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Bookings</Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={() => setShowFilters(!showFilters)}
              sx={{ mr: 2 }}
              startIcon={<FilterList />}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            {userRole === 'manager' && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={openAddDialog}
              >
                New Booking
              </Button>
            )}
          </Box>
        </Box>
        {showFilters && (
          <Box>
            <Paper className="bookings-filter-container" sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </Grid>
                
                {/* Filter Components */}
                <FilterSelect 
                  label="Status"
                  value={filters.status}
                  onChange={handleFilterChange('status')}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    ...STATUS_OPTIONS.map(status => ({
                      value: status,
                      label: status.charAt(0).toUpperCase() + status.slice(1)
                    }))
                  ]}
                
                />
                
                <FilterSelect 
                  label="Date Range"
                  value={filters.dateRange}
                  onChange={handleFilterChange('dateRange')}
                  options={DATE_RANGE_OPTIONS}
                
                />
                
                <FilterSelect 
                  label="Room Type"
                  value={filters.roomType}
                  onChange={handleFilterChange('roomType')}
                  options={ROOM_TYPES}
            
                />
                
                <FilterSelect 
                  label="Payment"
                  value={filters.paymentStatus}
                  onChange={handleFilterChange('paymentStatus')}
                  options={PAYMENT_STATUS_OPTIONS}
             
                />
                
                {/* Clear Filters Button */}
                <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearFilters}
                    fullWidth
                    size="small"
                    startIcon={<Replay fontSize="small" />}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </Box>

      <DataTable
        columns={columns}
        rows={bookings}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSort={handleSort}
        orderBy={orderBy}
        order={order}
        onRowClick={(booking) => navigate(`/bookings/${booking.id}`)}
        actions={actions}
        emptyMessage="No bookings found. Try adjusting your search or filters."
      />

      <BookingForm 
        open={isAddDialogOpen} 
        onClose={closeAddDialog} 
        onSuccess={handleBookingSuccess} 
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Drawer anchor="right" open={Boolean(selectedBooking)} onClose={handleCloseDetails} PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={1.5}>
          <Box>
            <Typography variant="h6">Booking Details</Typography>
            {selectedBooking && (
              <Typography variant="caption" color="textSecondary">
                Ref: {selectedBooking.reference || selectedBooking.id}
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleCloseDetails} size="small">
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
          {loadingDetails ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8} gap={2}>
              <CircularProgress size={28} />
              <Typography variant="body2" color="textSecondary">
                Loading booking details...
              </Typography>
            </Box>
          ) : detailsError ? (
            <Alert severity="error">{detailsError}</Alert>
          ) : bookingDetails ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="subtitle2">Guest</Typography>
                <Typography variant="body2">{bookingDetails.guestName}</Typography>
                <Typography variant="body2" color="textSecondary">{bookingDetails.guestEmail}</Typography>
                <Typography variant="body2" color="textSecondary">{bookingDetails.guestPhone}</Typography>
              </Box>

              <Divider />

              <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1.5}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Room</Typography>
                  <Typography variant="body2">{bookingDetails.roomNumber}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Status</Typography>
                  <Chip
                    label={bookingDetails.status?.charAt(0).toUpperCase() + bookingDetails.status?.slice(1) || 'Pending'}
                    color={statusColorMap[bookingDetails.status] || 'default'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Check-In</Typography>
                  <Typography variant="body2">{formatDate(bookingDetails.checkIn)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Check-Out</Typography>
                  <Typography variant="body2">{formatDate(bookingDetails.checkOut)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Nights</Typography>
                  <Typography variant="body2">{bookingDetails.nights ?? '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Amount</Typography>
                  <Typography variant="body2">{formatCurrency(bookingDetails.amount)}</Typography>
                </Box>
              </Box>

              {bookingDetails.notes && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Notes</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{bookingDetails.notes}</Typography>
                </Box>
              )}

              <Divider />

              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="subtitle2">Quick Actions</Typography>
                <Typography variant="body2" color="textSecondary">
                  Update status or jump to editing this booking.
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}
                  sx={{ '& > button': { justifyContent: 'flex-start' } }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Edit fontSize="small" />}
                    onClick={() => {
                      handleEditBooking(selectedBooking);
                      handleCloseDetails();
                    }}
                  >
                    Open in full editor
                  </Button>
                  {detailsStatusActions[bookingDetails.status || 'pending'].map((action) => (
                    <Button
                      key={action.label}
                      variant="contained"
                      color={action.color}
                      startIcon={action.icon}
                      disabled={Boolean(rowActionState[selectedBooking.id]?.updating)}
                      onClick={() => {
                        handleUpdateStatus(selectedBooking, action.target);
                        handleCloseDetails();
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Created: {formatDate(bookingDetails.createdAt)}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  Updated: {formatDate(bookingDetails.updatedAt)}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" color="textSecondary">
                Select a booking to view more details.
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Bookings;