import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Cancel,
  CheckCircle,
  Close,
  Info,
} from '@mui/icons-material';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { format } from 'date-fns';
import DataTable from '../../components/common/DataTable';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

const defaultBookingForm = {
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  roomNumber: '',
  status: 'pending',
  checkIn: '',
  checkOut: '',
  amount: '',
  notes: '',
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

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
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

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const updateRowActionState = (id, key, value) => {
    setRowActionState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
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

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (dateRange !== 'all') {
        params.append('dateRange', dateRange);
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
  }, [dateRange, order, orderBy, page, rowsPerPage, searchTerm, statusFilter]);

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
    setPage(0);
  };

  const handleEditBooking = (booking) => {
    navigate(`/bookings/${booking.id}`);
  };

  const handleDeleteBooking = async (booking) => {
    const displayName = booking.reference || booking.guestName || booking.roomNumber || 'this booking';

    if (!window.confirm(`Are you sure you want to delete ${displayName}? This action cannot be undone.`)) {
      return;
    }

    updateRowActionState(booking.id, 'deleting', true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/bookings/${booking.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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
  };

  const handleUpdateStatus = async (booking, targetStatus) => {
    if (!targetStatus || targetStatus === booking.status) return;

    updateRowActionState(booking.id, 'updating', true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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
  };

  const handleOpenDetails = async (booking) => {
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
  };

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

    const { guestName, roomNumber, checkIn, checkOut, amount } = newBooking;

    if (!guestName.trim() || !roomNumber.trim() || !checkIn || !checkOut) {
      setCreateError('Guest name, room number, check-in, and check-out are required.');
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      setCreateError('Please provide valid check-in and check-out dates.');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setCreateError('Check-out date must be after check-in date.');
      return;
    }

    const amountValue = Number(amount);
    if (Number.isNaN(amountValue) || amountValue < 0) {
      setCreateError('Please provide a valid booking amount.');
      return;
    }

    setCreatingBooking(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          guestName: newBooking.guestName.trim(),
          guestEmail: newBooking.guestEmail.trim() || undefined,
          guestPhone: newBooking.guestPhone.trim() || undefined,
          roomNumber: newBooking.roomNumber.trim(),
          status: newBooking.status,
          checkIn,
          checkOut,
          amount: amountValue,
          notes: newBooking.notes.trim() || undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to create booking.');
      }

      showSnackbar('Booking created successfully.');
      setIsAddDialogOpen(false);
      setNewBooking(defaultBookingForm);
      fetchBookings();
    } catch (error) {
      console.error('Error creating booking:', error);
      setCreateError(error.message || 'Failed to create booking.');
      showSnackbar(error.message || 'Failed to create booking.', 'error');
    } finally {
      setCreatingBooking(false);
    }
  };

  const columns = useMemo(() => [
    {
      id: 'reference',
      label: 'Reference',
      minWidth: 140,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" noWrap>{value || row.id}</Typography>
          <Typography variant="caption" color="textSecondary">{row.guestName}</Typography>
        </Box>
      ),
    },
    {
      id: 'guestEmail',
      label: 'Guest Email',
      minWidth: 180,
      sortable: true,
      format: (value) => value || '—',
    },
    {
      id: 'roomNumber',
      label: 'Room',
      minWidth: 100,
      sortable: true,
    },
    {
      id: 'checkIn',
      label: 'Check-In',
      minWidth: 140,
      sortable: true,
      format: (value) => formatDate(value),
    },
    {
      id: 'checkOut',
      label: 'Check-Out',
      minWidth: 140,
      sortable: true,
      format: (value) => formatDate(value),
    },
    {
      id: 'nights',
      label: 'Nights',
      minWidth: 70,
      align: 'center',
      sortable: true,
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 110,
      align: 'right',
      sortable: true,
      format: (value) => formatCurrency(typeof value === 'number' ? value : Number(value)),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 110,
      sortable: true,
      format: (value) => (
        <Chip
          label={value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending'}
          color={statusColorMap[value] || 'default'}
          size="small"
          variant="outlined"
        />
      ),
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
      getIcon: (row) => {
        switch (row.status) {
          case 'pending':
            return <CheckCircle fontSize="small" />;
          case 'confirmed':
            return <Cancel fontSize="small" />;
          case 'cancelled':
            return <CheckCircle fontSize="small" />;
          case 'completed':
            return <Info fontSize="small" />;
          default:
            return <CheckCircle fontSize="small" />;
        }
      },
      getTooltip: (row) => {
        switch (row.status) {
          case 'pending':
            return 'Mark Confirmed';
          case 'confirmed':
            return 'Cancel Booking';
          case 'cancelled':
            return 'Reopen Booking';
          case 'completed':
            return 'Reopen Booking';
          default:
            return 'Update Booking Status';
        }
      },
      onClick: (row) => {
        const target = row.status === 'pending'
          ? 'confirmed'
          : row.status === 'confirmed'
            ? 'cancelled'
            : 'pending';
        handleUpdateStatus(row, target);
      },
      getColor: (row) => {
        switch (row.status) {
          case 'pending':
            return 'success';
          case 'confirmed':
            return 'warning';
          case 'cancelled':
          case 'completed':
            return 'info';
          default:
            return 'primary';
        }
      },
      disabled: (row) => Boolean(rowActionState[row.id]?.updating || rowActionState[row.id]?.deleting),
    },
    {
      icon: <Delete fontSize="small" />,
      tooltip: 'Delete Booking',
      onClick: handleDeleteBooking,
      color: 'error',
      disabled: (row) => Boolean(rowActionState[row.id]?.deleting),
    },
  ], [handleDeleteBooking, handleEditBooking, handleUpdateStatus, rowActionState]);

  return (
    <Box marginLeft="290px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Bookings Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={openAddDialog}
        >
          New Booking
        </Button>
      </Box>

      {fetchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fetchError}
        </Alert>
      )}

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
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
          sx={{ minWidth: 250 }}
        />

        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} onChange={handleStatusFilterChange} label="Status">
            <MenuItem value="all">All Status</MenuItem>
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Date Range</InputLabel>
          <Select value={dateRange} onChange={handleDateRangeChange} label="Date Range">
            {DATE_RANGE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

      <Dialog open={isAddDialogOpen} onClose={closeAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>Create Booking</DialogTitle>
        <DialogContent component="form" onSubmit={handleCreateBooking} sx={{ mt: 1 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            {createError && <Alert severity="error">{createError}</Alert>}
            <TextField
              label="Guest Name"
              value={newBooking.guestName}
              onChange={handleNewBookingChange('guestName')}
              required
              fullWidth
            />
            <TextField
              label="Guest Email"
              type="email"
              value={newBooking.guestEmail}
              onChange={handleNewBookingChange('guestEmail')}
              fullWidth
            />
            <TextField
              label="Guest Phone"
              value={newBooking.guestPhone}
              onChange={handleNewBookingChange('guestPhone')}
              fullWidth
            />
            <TextField
              label="Room Number"
              value={newBooking.roomNumber}
              onChange={handleNewBookingChange('roomNumber')}
              required
              fullWidth
            />
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                label="Check-In"
                type="date"
                value={newBooking.checkIn}
                onChange={handleNewBookingChange('checkIn')}
                InputLabelProps={{ shrink: true }}
                required
                sx={{ flex: 1, minWidth: 180 }}
              />
              <TextField
                label="Check-Out"
                type="date"
                value={newBooking.checkOut}
                onChange={handleNewBookingChange('checkOut')}
                InputLabelProps={{ shrink: true }}
                required
                sx={{ flex: 1, minWidth: 180 }}
              />
            </Box>
            <TextField
              label="Amount"
              type="number"
              value={newBooking.amount}
              onChange={handleNewBookingChange('amount')}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newBooking.status}
                onChange={handleNewBookingChange('status')}
                label="Status"
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Notes"
              multiline
              minRows={3}
              value={newBooking.notes}
              onChange={handleNewBookingChange('notes')}
              fullWidth
            />
          </Box>
          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={closeAddDialog} disabled={creatingBooking}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={creatingBooking}>
              {creatingBooking ? 'Creating...' : 'Create Booking'}
            </Button>
          </DialogActions>
        </DialogContent>
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
            <Typography variant="body2" color="textSecondary">
              Select a booking to view more details.
            </Typography>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Bookings;
