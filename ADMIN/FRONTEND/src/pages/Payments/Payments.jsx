import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Drawer,
  IconButton,
  Divider,
  CircularProgress,
  Tooltip,
  Stack,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Add,
  Search,
  Info,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Close,
} from '@mui/icons-material';
import { format } from 'date-fns';
import DataTable from '../../components/common/DataTable';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PAYMENT_STATUS_OPTIONS = ['pending', 'completed', 'failed', 'refunded'];
const PAYMENT_METHOD_OPTIONS = ['cash', 'card', 'mobile', 'bank_transfer'];

const statusColorMap = {
  pending: 'warning',
  completed: 'success',
  failed: 'error',
  refunded: 'info',
};

const statusActionLabel = {
  pending: 'Mark Completed',
  completed: 'Mark Refunded',
  refunded: 'Reopen Pending',
  failed: 'Reopen Pending',
};

const statusActionTarget = {
  pending: 'completed',
  completed: 'refunded',
  refunded: 'pending',
  failed: 'pending',
};

const methodLabelMap = {
  cash: 'Cash',
  card: 'Card',
  mobile: 'Mobile Money',
  bank_transfer: 'Bank Transfer',
};

const defaultPaymentForm = {
  booking: null,
  amount: '',
  method: 'cash',
  status: 'pending',
  notes: '',
};

const defaultEditForm = {
  amount: '',
  method: 'cash',
  status: 'pending',
  notes: '',
};

const formatDate = (value, withTime = false) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, withTime ? 'PPpp' : 'PP');
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return value ?? '—';
    return formatCurrency(numeric);
  }
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
};

const Payments = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [fetchError, setFetchError] = useState(null);
  const [rowActionState, setRowActionState] = useState({});

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState(defaultPaymentForm);
  const [createError, setCreateError] = useState(null);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [bookingOptions, setBookingOptions] = useState([]);
  const [bookingOptionsLoading, setBookingOptionsLoading] = useState(false);
  const [bookingSearchTerm, setBookingSearchTerm] = useState('');
  const bookingSearchTimeout = useRef(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editPayment, setEditPayment] = useState(defaultEditForm);
  const [editError, setEditError] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

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

  const fetchPayments = useCallback(async () => {
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

      if (methodFilter !== 'all') {
        params.append('method', methodFilter);
      }

      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/payments?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to fetch payments.');
      }

      const rawPayments = Array.isArray(payload?.data?.payments)
        ? payload.data.payments
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.payments)
            ? payload.payments
            : [];

      const normalized = rawPayments.map((payment) => ({
        id: payment.id || payment._id,
        reference: payment.reference,
        amount: payment.amount,
        method: payment.method || 'cash',
        status: payment.status || 'pending',
        notes: payment.notes || '',
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        bookingId:
          payment.booking?.id || payment.booking?._id || payment.booking?.booking || payment.booking,
        bookingReference: payment.booking?.reference || '',
        bookingGuestName: payment.booking?.guestName || '',
        bookingRoomNumber: payment.booking?.roomNumber || '',
      }));

      const total = payload?.data?.total
        ?? payload?.total
        ?? payload?.meta?.total
        ?? payload?.pagination?.total
        ?? normalized.length;

      setPayments(normalized);
      setRowActionState({});
      setTotalRows(typeof total === 'number' ? total : normalized.length);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setFetchError(error.message || 'Failed to load payments.');
      setPayments([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [methodFilter, order, orderBy, page, rowsPerPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const fetchBookingOptions = useCallback(async (search = '') => {
    setBookingOptionsLoading(true);

    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '20',
        sort: 'checkIn',
        order: 'desc',
      });

      if (search.trim()) {
        params.append('search', search.trim());
      }

      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/bookings?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load bookings.');
      }

      const rawBookings = Array.isArray(payload?.data?.bookings)
        ? payload.data.bookings
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.bookings)
            ? payload.bookings
            : [];

      const options = rawBookings.map((booking) => ({
        id: booking.id || booking._id,
        reference: booking.reference,
        guestName: booking.guestName || booking.guest || '',
        roomNumber: booking.roomNumber || booking.room || '',
        checkIn: booking.checkIn,
        label: `${booking.reference || 'No Ref'} • ${booking.guestName || 'Unknown'} (${booking.roomNumber || 'N/A'})`,
      }));

      setBookingOptions(options);
    } catch (error) {
      console.error('Error loading booking options:', error);
      setBookingOptions([]);
    } finally {
      setBookingOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAddDialogOpen) return;

    if (bookingSearchTimeout.current) {
      clearTimeout(bookingSearchTimeout.current);
    }

    bookingSearchTimeout.current = setTimeout(() => {
      const term = bookingSearchTerm.trim();
      fetchBookingOptions(term);
    }, 350);

    return () => {
      if (bookingSearchTimeout.current) {
        clearTimeout(bookingSearchTimeout.current);
      }
    };
  }, [bookingSearchTerm, fetchBookingOptions, isAddDialogOpen]);

  useEffect(() => {
    if (!isAddDialogOpen) return;
    fetchBookingOptions('');
  }, [fetchBookingOptions, isAddDialogOpen]);

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

  const handleMethodFilterChange = (event) => {
    setMethodFilter(event.target.value);
    setPage(0);
  };

  const openAddDialog = () => {
    setNewPayment(defaultPaymentForm);
    setCreateError(null);
    setBookingSearchTerm('');
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    if (creatingPayment) return;
    setIsAddDialogOpen(false);
  };

  const handleCreatePayment = async (event) => {
    event.preventDefault();
    setCreateError(null);

    if (!newPayment.booking) {
      setCreateError('Please select a booking for this payment.');
      return;
    }

    const amountValue = Number(newPayment.amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setCreateError('Please provide a valid payment amount.');
      return;
    }

    setCreatingPayment(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          bookingId: newPayment.booking.id,
          amount: amountValue,
          method: newPayment.method,
          status: newPayment.status,
          notes: newPayment.notes.trim() || undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to create payment.');
      }

      showSnackbar('Payment recorded successfully.');
      setIsAddDialogOpen(false);
      setNewPayment(defaultPaymentForm);
      setBookingSearchTerm('');
      fetchPayments();
    } catch (error) {
      console.error('Error creating payment:', error);
      setCreateError(error.message || 'Failed to create payment.');
      showSnackbar(error.message || 'Failed to create payment.', 'error');
    } finally {
      setCreatingPayment(false);
    }
  };

  const handleOpenDetails = async (payment) => {
    setSelectedPayment(payment);
    setPaymentDetails(null);
    setDetailsError(null);
    setLoadingDetails(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/payments/${payment.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load payment details.');
      }

      const detail = payload?.data?.payment || payload?.payment || payload?.data;

      if (detail) {
        setPaymentDetails({
          id: detail.id || detail._id,
          reference: detail.reference,
          amount: detail.amount,
          method: detail.method || 'cash',
          status: detail.status || 'pending',
          notes: detail.notes || '',
          paidAt: detail.paidAt,
          createdAt: detail.createdAt,
          updatedAt: detail.updatedAt,
          booking: detail.booking
            ? {
                id: detail.booking.id || detail.booking._id,
                reference: detail.booking.reference,
                guestName: detail.booking.guestName,
                roomNumber: detail.booking.roomNumber,
              }
            : null,
        });
      }
    } catch (error) {
      console.error('Error loading payment details:', error);
      setDetailsError(error.message || 'Failed to load payment details.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedPayment(null);
    setPaymentDetails(null);
    setDetailsError(null);
  };

  const handleUpdateStatus = async (payment, targetStatus) => {
    if (!targetStatus || targetStatus === payment.status) return;

    updateRowActionState(payment.id, 'updating', true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/payments/${payment.id}`, {
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
        throw new Error(payload.message || 'Failed to update payment status.');
      }

      const updated = payload?.data?.payment || payload?.payment || payload?.data;
      const nextStatus = updated?.status || targetStatus;

      setPayments((prev) =>
        prev.map((item) =>
          item.id === payment.id
            ? {
                ...item,
                status: nextStatus,
                paidAt: updated?.paidAt ?? item.paidAt,
                updatedAt: updated?.updatedAt ?? item.updatedAt,
              }
            : item
        )
      );

      setPaymentDetails((prev) =>
        prev && prev.id === payment.id
          ? {
              ...prev,
              status: nextStatus,
              paidAt: updated?.paidAt ?? prev.paidAt,
              updatedAt: updated?.updatedAt ?? prev.updatedAt,
            }
          : prev
      );

      showSnackbar(`Payment marked as ${nextStatus}.`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      showSnackbar(error.message || 'Failed to update payment status.', 'error');
    } finally {
      updateRowActionState(payment.id, 'updating', false);
    }
  };

  const handleDeletePayment = async (payment) => {
    const displayName = payment.reference || payment.bookingGuestName || payment.bookingRoomNumber || 'this payment';

    if (!window.confirm(`Are you sure you want to delete ${displayName}? This action cannot be undone.`)) {
      return;
    }

    updateRowActionState(payment.id, 'deleting', true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/payments/${payment.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to delete payment.');
      }

      showSnackbar('Payment deleted successfully.');
      setPayments((prev) => prev.filter((item) => item.id !== payment.id));
      setTotalRows((prev) => Math.max(0, prev - 1));
      if (selectedPayment?.id === payment.id) {
        handleCloseDetails();
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      showSnackbar(error.message || 'Failed to delete payment.', 'error');
    } finally {
      updateRowActionState(payment.id, 'deleting', false);
    }
  };

  const handleOpenEditDialog = () => {
    const source = paymentDetails || selectedPayment;
    if (!source) return;

    setEditError(null);
    setSavingEdit(false);
    setEditPayment({
      amount: source.amount?.toString() ?? '',
      method: source.method || 'cash',
      status: source.status || 'pending',
      notes: source.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    if (savingEdit) return;
    setIsEditDialogOpen(false);
  };

  const handleEditFieldChange = (field) => (event) => {
    const value = event.target.value;
    setEditPayment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();
    const source = paymentDetails || selectedPayment;
    if (!source) return;

    const amountValue = Number(editPayment.amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setEditError('Please provide a valid payment amount.');
      return;
    }

    setSavingEdit(true);
    setEditError(null);
    updateRowActionState(source.id, 'updating', true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/payments/${source.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: amountValue,
          method: editPayment.method,
          status: editPayment.status,
          notes: editPayment.notes.trim() || undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update payment.');
      }

      const updated = payload?.data?.payment || payload?.payment || payload?.data;

      setPayments((prev) =>
        prev.map((item) =>
          item.id === source.id
            ? {
                ...item,
                amount: amountValue,
                method: editPayment.method,
                status: editPayment.status,
                notes: editPayment.notes,
                paidAt: updated?.paidAt ?? item.paidAt,
                updatedAt: updated?.updatedAt ?? item.updatedAt,
              }
            : item
        )
      );

      setPaymentDetails((prev) =>
        prev && prev.id === source.id
          ? {
              ...prev,
              amount: amountValue,
              method: editPayment.method,
              status: editPayment.status,
              notes: editPayment.notes,
              paidAt: updated?.paidAt ?? prev.paidAt,
              updatedAt: updated?.updatedAt ?? prev.updatedAt,
            }
          : prev
      );

      setSelectedPayment((prev) =>
        prev && prev.id === source.id
          ? {
              ...prev,
              amount: amountValue,
              method: editPayment.method,
              status: editPayment.status,
              notes: editPayment.notes,
              paidAt: updated?.paidAt ?? prev.paidAt,
              updatedAt: updated?.updatedAt ?? prev.updatedAt,
            }
          : prev
      );

      showSnackbar('Payment updated successfully.');
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating payment:', error);
      setEditError(error.message || 'Failed to update payment.');
      showSnackbar(error.message || 'Failed to update payment.', 'error');
    } finally {
      setSavingEdit(false);
      updateRowActionState(source.id, 'updating', false);
    }
  };

  const columns = useMemo(() => [
    {
      id: 'reference',
      label: 'Reference',
      minWidth: 150,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" noWrap>{value || row.id}</Typography>
          <Typography variant="caption" color="textSecondary">
            {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Pending'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'bookingReference',
      label: 'Booking',
      minWidth: 100,
      sortable: false,
      format: (_value, row) => (
        <Box>
          <Typography variant="subtitle2" noWrap>{row.bookingReference || '—'}</Typography>
          <Typography variant="caption" color="textSecondary">
            {row.bookingGuestName || 'Unknown Guest'}
            {row.bookingRoomNumber ? ` • Room ${row.bookingRoomNumber}` : ''}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 100,
      align: 'right',
      sortable: true,
      format: (value) => formatCurrency(value),
    },
    {
      id: 'method',
      label: 'Method',
      minWidth: 120,
      sortable: true,
      format: (value) => methodLabelMap[value] || value,
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
    {
      id: 'paidAt',
      label: 'Paid At',
      minWidth: 120,
      sortable: true,
      format: (value) => formatDate(value, true),
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 150,
      sortable: true,
      format: (value) => formatDate(value, true),
    },
  ], []);

  const actions = useMemo(() => [
    {
      icon: <Info fontSize="small" />,
      tooltip: 'View Payment Details',
      onClick: handleOpenDetails,
      color: 'info',
      disabled: (row) => Boolean(rowActionState[row.id]?.deleting),
    },
    {
      getIcon: (row) => {
        const target = statusActionTarget[row.status] || 'completed';
        return target === 'completed' ? <CheckCircle fontSize="small" /> : <Info fontSize="small" />;
      },
      getTooltip: (row) => statusActionLabel[row.status] || 'Update Status',
      onClick: (row) => handleUpdateStatus(row, statusActionTarget[row.status] || 'completed'),
      getColor: (row) => (statusActionTarget[row.status] === 'completed' ? 'success' : 'primary'),
      disabled: (row) => Boolean(rowActionState[row.id]?.updating || rowActionState[row.id]?.deleting),
    },
    {
      icon: <Delete fontSize="small" />,
      tooltip: 'Delete Payment',
      onClick: handleDeletePayment,
      color: 'error',
      disabled: (row) => Boolean(rowActionState[row.id]?.deleting),
    },
  ], [handleDeletePayment, handleOpenDetails, handleUpdateStatus, rowActionState]);

  const detailsStatusActions = useMemo(() => ({
    pending: [
      { label: 'Mark Completed', target: 'completed', icon: <CheckCircle fontSize="small" />, color: 'success' },
      { label: 'Mark Failed', target: 'failed', icon: <Cancel fontSize="small" />, color: 'error' },
    ],
    completed: [
      { label: 'Mark Refunded', target: 'refunded', icon: <Info fontSize="small" />, color: 'info' },
    ],
    refunded: [
      { label: 'Reopen (Pending)', target: 'pending', icon: <Info fontSize="small" />, color: 'primary' },
    ],
    failed: [
      { label: 'Reopen (Pending)', target: 'pending', icon: <Info fontSize="small" />, color: 'primary' },
    ],
  }), []);

  return (
    <Box >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Payments Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={openAddDialog}
        >
          Record Payment
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
          placeholder="Search payments..."
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
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Method</InputLabel>
          <Select value={methodFilter} onChange={handleMethodFilterChange} label="Method">
            <MenuItem value="all">All Methods</MenuItem>
            {PAYMENT_METHOD_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {methodLabelMap[option] || option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DataTable
        columns={columns}
        rows={payments}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSort={handleSort}
        orderBy={orderBy}
        order={order}
        onRowClick={handleOpenDetails}
        actions={actions}
        emptyMessage="No payments found. Try adjusting your search or filters."
      />

      <Dialog open={isAddDialogOpen} onClose={closeAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent component="form" onSubmit={handleCreatePayment} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            {createError && <Alert severity="error">{createError}</Alert>}
            <Autocomplete
              options={bookingOptions}
              getOptionLabel={(option) => option.label || ''}
              loading={bookingOptionsLoading}
              value={newPayment.booking}
              onChange={(_event, value) => {
                setNewPayment((prev) => ({
                  ...prev,
                  booking: value,
                }));
              }}
              inputValue={bookingSearchTerm}
              onInputChange={(_event, value) => setBookingSearchTerm(value)}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Booking"
                  required
                  placeholder="Search booking by reference or guest"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {bookingOptionsLoading ? <CircularProgress color="inherit" size={18} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  disabled={creatingPayment}
                />
              )}
            />
            <TextField
              label="Amount"
              type="number"
              value={newPayment.amount}
              onChange={(event) =>
                setNewPayment((prev) => ({
                  ...prev,
                  amount: event.target.value,
                }))
              }
              inputProps={{ min: 0, step: 0.01 }}
              required
              fullWidth
              disabled={creatingPayment}
            />
            <FormControl fullWidth disabled={creatingPayment}>
              <InputLabel>Method</InputLabel>
              <Select
                value={newPayment.method}
                label="Method"
                onChange={(event) =>
                  setNewPayment((prev) => ({
                    ...prev,
                    method: event.target.value,
                  }))
                }
              >
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {methodLabelMap[option] || option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={creatingPayment}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newPayment.status}
                label="Status"
                onChange={(event) =>
                  setNewPayment((prev) => ({
                    ...prev,
                    status: event.target.value,
                  }))
                }
              >
                {PAYMENT_STATUS_OPTIONS.map((option) => (
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
              value={newPayment.notes}
              onChange={(event) =>
                setNewPayment((prev) => ({
                  ...prev,
                  notes: event.target.value,
                }))
              }
              fullWidth
              disabled={creatingPayment}
            />
          </Stack>
          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={closeAddDialog} disabled={creatingPayment}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" onClick={handleCreatePayment} disabled={creatingPayment}>
              {creatingPayment ? 'Saving...' : 'Save Payment'}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Drawer
        anchor="right"
        open={Boolean(selectedPayment)}
        onClose={handleCloseDetails}
        PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={1.5}>
          <Box>
            <Typography variant="h6">Payment Details</Typography>
            {selectedPayment && (
              <Typography variant="caption" color="textSecondary">
                Ref: {selectedPayment.reference || selectedPayment.id}
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
                Loading payment details...
              </Typography>
            </Box>
          ) : detailsError ? (
            <Alert severity="error">{detailsError}</Alert>
          ) : paymentDetails ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="subtitle2">Amount</Typography>
                <Typography variant="h6">{formatCurrency(paymentDetails.amount)}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Method: {methodLabelMap[paymentDetails.method] || paymentDetails.method}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle2">Status:</Typography>
                <Chip
                  label={paymentDetails.status?.charAt(0).toUpperCase() + paymentDetails.status?.slice(1) || 'Pending'}
                  color={statusColorMap[paymentDetails.status] || 'default'}
                  size="small"
                  variant="outlined"
                />
              </Box>

              {paymentDetails.booking && (
                <Box>
                  <Typography variant="subtitle2">Booking</Typography>
                  <Typography variant="body2">{paymentDetails.booking.reference || paymentDetails.booking.id}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {paymentDetails.booking.guestName || 'Unknown Guest'}
                    {paymentDetails.booking.roomNumber ? ` • Room ${paymentDetails.booking.roomNumber}` : ''}
                  </Typography>
                  <Button
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => navigate(`/bookings/${paymentDetails.booking.id}`)}
                  >
                    View booking
                  </Button>
                </Box>
              )}

              <Divider />

              <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1.5}>
                <Box>
                  <Typography variant="subtitle2">Created</Typography>
                  <Typography variant="body2">{formatDate(paymentDetails.createdAt, true)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Updated</Typography>
                  <Typography variant="body2">{formatDate(paymentDetails.updatedAt, true)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Paid At</Typography>
                  <Typography variant="body2">{formatDate(paymentDetails.paidAt, true)}</Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>Notes</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {paymentDetails.notes || 'No notes recorded.'}
                </Typography>
              </Box>

              <Divider />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Quick Actions</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Edit fontSize="small" />}
                  onClick={handleOpenEditDialog}
                  disabled={Boolean(rowActionState[paymentDetails.id]?.updating)}
                >
                  Edit payment
                </Button>
                {(detailsStatusActions[paymentDetails.status || 'pending'] || []).map((action) => (
                  <Button
                    key={action.label}
                    variant="contained"
                    color={action.color}
                    startIcon={action.icon}
                    disabled={Boolean(rowActionState[paymentDetails.id]?.updating)}
                    onClick={() => handleUpdateStatus(paymentDetails, action.target)}
                  >
                    {action.label}
                  </Button>
                ))}
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete fontSize="small" />}
                  disabled={Boolean(rowActionState[paymentDetails.id]?.deleting)}
                  onClick={() => handleDeletePayment(paymentDetails)}
                >
                  Delete payment
                </Button>
              </Stack>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Select a payment to view more details.
            </Typography>
          )}
        </Box>
      </Drawer>

      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent component="form" onSubmit={handleSubmitEdit} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            {editError && <Alert severity="error">{editError}</Alert>}
            <TextField
              label="Amount"
              type="number"
              value={editPayment.amount}
              onChange={handleEditFieldChange('amount')}
              inputProps={{ min: 0, step: 0.01 }}
              required
              fullWidth
              disabled={savingEdit}
            />
            <FormControl fullWidth disabled={savingEdit}>
              <InputLabel>Method</InputLabel>
              <Select value={editPayment.method} label="Method" onChange={handleEditFieldChange('method')}>
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {methodLabelMap[option] || option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={savingEdit}>
              <InputLabel>Status</InputLabel>
              <Select value={editPayment.status} label="Status" onChange={handleEditFieldChange('status')}>
                {PAYMENT_STATUS_OPTIONS.map((option) => (
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
              value={editPayment.notes}
              onChange={handleEditFieldChange('notes')}
              fullWidth
              disabled={savingEdit}
            />
          </Stack>
          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={handleCloseEditDialog} disabled={savingEdit}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" onClick={handleSubmitEdit} color="primary" disabled={savingEdit}>
              {savingEdit ? 'Saving...' : 'Save Changes'}
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
    </Box>
  );
};

export default Payments;
