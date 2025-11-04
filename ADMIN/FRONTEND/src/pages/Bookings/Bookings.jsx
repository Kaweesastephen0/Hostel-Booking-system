import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Chip, TextField, InputAdornment, MenuItem, FormControl, InputLabel,
  Select, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, Grid, Paper
} from '@mui/material';
import { Add, FilterList, Search, Edit, Delete, Cancel, CheckCircle, Close, Info, Replay } from '@mui/icons-material';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { format } from 'date-fns';
import DataTable from '../../components/common/DataTable';
import Swal from 'sweetalert2';

let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

const statusColorMap = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'primary',
};

const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'upcoming', label: 'Upcoming' },
];

const User = localStorage.getItem('user');

if (User === null) {
  <Navigate to="/login" />
}
const defaultBookingForm = {
  // Guest Information
  fullName: '',
  gender: '',
  age: '',
  occupation: '',
  idNumber: '',
  phone: '',
  email: '',
  location: '',

  // Booking Information
  hostelName: '',
  roomNumber: '',
  roomType: '',
  duration: '',
  checkIn: '',

  // Payment Information
  paymentMethod: '',
  bookingFee: '',
  paymentNumber: '',

  // System Fields
  status: 'pending',
};

const durationMap = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  quarterly: 90,
  yearly: 365
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy');
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') return value ?? '—';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
};

// const toDateInputValue = (value) => {
//   if (!value) return '';
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return '';
//   return date.toISOString().slice(0, 10);
// };

const Bookings = () => {
  const navigate = useNavigate();

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
  const [newBooking, setNewBooking] = useState(defaultBookingForm);
  const [createError, setCreateError] = useState(null);
  const [creatingBooking, setCreatingBooking] = useState(false);

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

  // Handle filter changes for all filter types
  const handleFilterChange = (filterName) => (event) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
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

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        sort: orderBy,
        order,
      });

      // Add search term
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      // Add filters to the request
      const { status, dateRange, roomType, paymentStatus } = filters;

      // Add status filter
      if (status && status !== 'all') {
        params.append('status', status);
      }

      // Add date range filter
      if (dateRange && dateRange !== 'all') {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));

        switch (dateRange) {
          case 'today':
            params.append('startDate', startOfDay.toISOString());
            params.append('endDate', new Date(now.setHours(23, 59, 59, 999)).toISOString());
            break;
          case 'thisWeek':
            { const startOfWeek = new Date(startOfDay);
            startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay()); // Start of current week (Sunday)
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // End of current week (Saturday)

            params.append('startDate', startOfWeek.toISOString());
            params.append('endDate', new Date(endOfWeek.setHours(23, 59, 59, 999)).toISOString());
            break; }
          case 'thisMonth':
           { const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            params.append('startDate', startOfMonth.toISOString());
            params.append('endDate', new Date(endOfMonth.setHours(23, 59, 59, 999)).toISOString());
            break;}
          case 'upcoming':
            params.append('startDate', new Date().toISOString());
            break;
          default:
            break;
        }
      }

      // Add room type filter
      if (roomType && roomType !== 'all') {
        params.append('roomType', roomType);
      }

      // Add payment status filter
      if (paymentStatus && paymentStatus !== 'all') {
        params.append('paymentStatus', paymentStatus);
      }

      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
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
  }, [filters, order, orderBy, page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings, filters]);

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
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

      const response = await fetch(`${API_BASE_URL}/api/bookings/${booking.id}`, {
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

      const response = await fetch(`${API_BASE_URL}/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify({ status: targetStatus }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update booking status.');
      }

      const updatedBooking = payload?.data?.booking;
      const nextStatus = updatedBooking?.status || targetStatus;

      setBookings((prev) =>
        prev.map((item) =>
          item.id === booking.id
            ? {
              ...item,
              status: nextStatus,
            }
            : item
        )
      );

      showSnackbar(`Booking marked as ${nextStatus}.`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      showSnackbar(error.message || 'Failed to update booking status.', 'error');
    } finally {
      updateRowActionState(booking.id, 'updating', false);
    }
  }, [ showSnackbar, updateRowActionState]);

  const handleOpenDetails = useCallback(async (booking) => {
    setSelectedBooking(booking);
    setBookingDetails(null);
    setDetailsError(null);
    setLoadingDetails(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings/${booking.id}`, {
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
    setNewBooking(defaultBookingForm);
    setCreateError(null);
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    if (creatingBooking) return;
    setIsAddDialogOpen(false);
  };

  const handleNewBookingChange = (field) => (event) => {
    setNewBooking((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleCreateBooking = async (event) => {
    event.preventDefault();
    setCreateError(null);

    // Destructure and validate required fields
    const {
      fullName, gender, age, idNumber, phone, email, location,
      hostelName, roomNumber, roomType, duration, checkIn,
      paymentMethod, bookingFee, paymentNumber
    } = newBooking;

    // Validate required fields
    const requiredFields = [
      { field: 'fullName', label: 'Guest name' },
      { field: 'roomNumber', label: 'Room number' },
      { field: 'checkIn', label: 'Check-in date' },
      { field: 'duration', label: 'Duration' },
      { field: 'bookingFee', label: 'Amount' },
    ];

    const missingField = requiredFields.find(({ field }) => !newBooking[field]?.toString().trim());
    if (missingField) {
      setCreateError(`${missingField.label} is required`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setCreateError('Please enter a valid email address');
      return;
    }

    // Validate age is a positive number
    const ageValue = parseInt(age, 10);
    if (isNaN(ageValue) || ageValue <= 0) {
      setCreateError('Age must be a positive number');
      return;
    }

    // Validate booking fee is a positive number
    const bookingFeeValue = parseFloat(bookingFee);
    if (isNaN(bookingFeeValue) || bookingFeeValue <= 0) {
      setCreateError('Booking fee must be a positive number');
      return;
    }

    const durationDays = durationMap[duration];
    if (!durationDays) {
      setCreateError('Please select a valid duration');
      return;
    }

    setCreatingBooking(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        fullName,
        gender,
        age: ageValue,
        occupation: newBooking.occupation,
        idNumber,
        phone,
        email,
        location,
        hostelName,
        roomNumber,
        roomType,
        duration: durationDays,
        checkIn,
        paymentMethod,
        bookingFee: bookingFeeValue,
        paymentNumber,
        status: newBooking.status,
      };

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking.');
      }

      showSnackbar('Booking created successfully.');
      await fetchBookings();
      closeAddDialog();
    } catch (error) {
      console.error('Error creating booking:', error);
      setCreateError(error.message || 'Failed to create booking.');
    } finally {
      setCreatingBooking(false);
    }
  };

  // const handleBookingUpdated = (updatedBooking) => {
  //   fetchBookings();
  //   setSnackbar({
  //     open: true,
  //     message: 'Booking updated successfully',
  //     severity: 'success'
  //   });
  // };

  // const handleError = (error) => {
  //   console.error('Error:', error);
  //   setSnackbar({
  //     open: true,
  //     message: error.message || 'An error occurred',
  //     severity: 'error'
  //   });
  // };

  const columns = useMemo(() => [
    // {
    //   id: 'reference',
    //   label: 'Reference',
    //   minWidth: 50,
    //   format: (value, row) => value || row.id || '—',
    // },
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
      tooltip: (row) => {
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
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={openAddDialog}
            >
              New Booking
            </Button>
          </Box>
        </Box>
        {showFilters && (
          <Box>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={2}>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={handleFilterChange('status')}
                      label="Status"
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Date Range</InputLabel>
                    <Select
                      value={filters.dateRange}
                      onChange={handleFilterChange('dateRange')}
                      label="Date Range"
                    >
                      <MenuItem value="all">All Dates</MenuItem>
                      <MenuItem value="today">Today</MenuItem>
                      <MenuItem value="thisWeek">This Week</MenuItem>
                      <MenuItem value="thisMonth">This Month</MenuItem>
                      <MenuItem value="upcoming">Upcoming</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Room Type</InputLabel>
                    <Select
                      value={filters.roomType}
                      onChange={handleFilterChange('roomType')}
                      label="Room Type"
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="double">Double</MenuItem>

                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Payment Status</InputLabel>
                    <Select
                      value={filters.paymentStatus}
                      onChange={handleFilterChange('paymentStatus')}
                      label="Payment Status"
                    >
                      <MenuItem value="all">All Payments</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="partial">Partial</MenuItem>
                      <MenuItem value="refunded">Refunded</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={1} display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearFilters}
                    fullWidth
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

      <Dialog open={isAddDialogOpen} onClose={closeAddDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleCreateBooking}>
          <DialogTitle>Add New Booking</DialogTitle>
          <DialogContent>
            {createError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {createError}
              </Alert>
            )}
            <Box sx={{ mt: 2, maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
              <Typography variant="h6" gutterBottom>Guest Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={newBooking.fullName}
                    onChange={handleNewBookingChange('fullName')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={newBooking.gender}
                      onChange={handleNewBookingChange('gender')}
                      label="Gender"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={newBooking.age}
                    onChange={handleNewBookingChange('age')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ID/STN Number"
                    value={newBooking.idNumber}
                    onChange={handleNewBookingChange('idNumber')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={newBooking.phone}
                    onChange={handleNewBookingChange('phone')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={newBooking.email}
                    onChange={handleNewBookingChange('email')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location/Address"
                    value={newBooking.location}
                    onChange={handleNewBookingChange('location')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Occupation"
                    value={newBooking.occupation}
                    onChange={handleNewBookingChange('occupation')}
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>Booking Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Hostel Name"
                    value={newBooking.hostelName}
                    onChange={handleNewBookingChange('hostelName')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Room Number"
                    value={newBooking.roomNumber}
                    onChange={handleNewBookingChange('roomNumber')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Room Type</InputLabel>
                    <Select
                      value={newBooking.roomType}
                      onChange={handleNewBookingChange('roomType')}
                      label="Room Type"
                    >
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="double">Double</MenuItem>
                      <MenuItem value="dormitory">Dormitory</MenuItem>
                      <MenuItem value="suite">Suite</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Duration</InputLabel>
                    <Select
                      value={newBooking.duration}
                      onChange={handleNewBookingChange('duration')}
                      label="Duration"
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="quarterly">Quarterly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Check-in Date"
                    type="date"
                    value={newBooking.checkIn}
                    onChange={handleNewBookingChange('checkIn')}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>Payment Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={newBooking.paymentMethod}
                      onChange={handleNewBookingChange('paymentMethod')}
                      label="Payment Method"
                    >
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="mobile_money">Mobile Money</MenuItem>
                      <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                      <MenuItem value="credit_card">Credit Card</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Booking Fee"
                    type="number"
                    value={newBooking.bookingFee}
                    onChange={handleNewBookingChange('bookingFee')}
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Payment Reference/Number"
                    value={newBooking.paymentNumber}
                    onChange={handleNewBookingChange('paymentNumber')}
                    margin="normal"
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              onClick={closeAddDialog}
              disabled={creatingBooking}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={creatingBooking}
              startIcon={creatingBooking ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 150 }}
            >
              {creatingBooking ? 'Creating...' : 'Create Booking'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
                <Typography variant="body2">{bookingDetails.guestName || '—'}</Typography>
                <Typography variant="body2" color="textSecondary">{bookingDetails.guestEmail || '—'}</Typography>
                <Typography variant="body2" color="textSecondary">{bookingDetails.guestPhone || '—'}</Typography>
              </Box>

              <Divider />

              <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1.5}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Room</Typography>
                  <Typography variant="body2">{bookingDetails.roomNumber || '—'}</Typography>
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
