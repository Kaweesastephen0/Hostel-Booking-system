import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Stack,
  unstable_Grid2 as Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ArrowBack, Edit, Delete, CheckCircle, Cancel, Info, Add } from '@mui/icons-material';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

const PAYMENT_STATUS_OPTIONS = ['pending', 'completed', 'failed', 'refunded'];
const PAYMENT_METHOD_OPTIONS = ['cash', 'card', 'mobile', 'bank_transfer'];

const statusColorMap = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'primary',
};

const paymentStatusColorMap = {
  pending: 'warning',
  completed: 'success',
  failed: 'error',
  refunded: 'info',
};

const methodLabelMap = {
  cash: 'Cash',
  card: 'Card',
  mobile: 'Mobile Money',
  bank_transfer: 'Bank Transfer',
};

const paymentStatusActions = {
  pending: [
    { label: 'Mark Completed', target: 'completed', color: 'success', icon: <CheckCircle fontSize="small" /> },
    { label: 'Mark Failed', target: 'failed', color: 'error', icon: <Cancel fontSize="small" /> },
  ],
  completed: [
    { label: 'Mark Refunded', target: 'refunded', color: 'info', icon: <Info fontSize="small" /> },
  ],
  failed: [
    { label: 'Reopen (Pending)', target: 'pending', color: 'primary', icon: <Info fontSize="small" /> },
  ],
  refunded: [
    { label: 'Reopen (Pending)', target: 'pending', color: 'primary', icon: <Info fontSize="small" /> },
  ],
};

const INITIAL_PAYMENT_TOTALS = { total: 0, completed: 0, pending: 0, failed: 0, refunded: 0 };
const defaultPaymentForm = { amount: '', method: 'cash', status: 'pending', notes: '' };

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'PPpp');
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') return value ?? '—';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
};

const calculatePaymentTotals = (items) =>
  items.reduce(
    (acc, item) => {
      const amount = typeof item.amount === 'number' ? item.amount : Number(item.amount);
      if (!Number.isFinite(amount)) {
        return acc;
      }

      acc.total += amount;

      switch (item.status) {
        case 'completed':
          acc.completed += amount;
          break;
        case 'pending':
          acc.pending += amount;
          break;
        case 'failed':
          acc.failed += amount;
          break;
        case 'refunded':
          acc.refunded += amount;
          break;
        default:
          break;
      }

      return acc;
    },
    { total: 0, completed: 0, pending: 0, failed: 0, refunded: 0 }
  );

const blurEventTarget = (event) => {
  const node = event?.currentTarget;
  if (node && typeof node.blur === 'function') {
    node.blur();
  }
};

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [updating, setUpdating] = useState(false);
  const [statusDraft, setStatusDraft] = useState('pending');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    amount: '',
    status: 'pending',
    notes: '',
  });
  const [editError, setEditError] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [payments, setPayments] = useState([]);
  const [paymentTotals, setPaymentTotals] = useState({ ...INITIAL_PAYMENT_TOTALS });
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState(defaultPaymentForm);
  const [newPaymentError, setNewPaymentError] = useState(null);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [paymentEditTarget, setPaymentEditTarget] = useState(null);
  const [isEditPaymentDialogOpen, setIsEditPaymentDialogOpen] = useState(false);
  const [editPaymentForm, setEditPaymentForm] = useState(defaultPaymentForm);
  const [editPaymentError, setEditPaymentError] = useState(null);
  const [savingPaymentUpdate, setSavingPaymentUpdate] = useState(false);
  const [paymentActionState, setPaymentActionState] = useState({ updatingId: null, deletingId: null });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchBooking = useCallback(async () => {
    if (!id) {
      setFetchError('Booking ID is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to fetch booking details.');
      }

      const fetched = payload?.data?.booking || payload?.booking || payload?.data;

      if (!fetched) {
        throw new Error('Booking not found.');
      }

      setBooking(fetched);
      setStatusDraft(fetched.status || 'pending');
      setNotesDraft(fetched.notes || '');
      setEditForm({
        guestName: fetched.guestName || '',
        guestEmail: fetched.guestEmail || '',
        guestPhone: fetched.guestPhone || '',
        roomNumber: fetched.roomNumber || '',
        checkIn: toDateInputValue(fetched.checkIn),
        checkOut: toDateInputValue(fetched.checkOut),
        amount: typeof fetched.amount === 'number' ? fetched.amount.toString() : fetched.amount || '',
        status: fetched.status || 'pending',
        notes: fetched.notes || '',
      });
    } catch (error) {
      console.error('Error loading booking:', error);
      setFetchError(error.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const fetchPayments = useCallback(async () => {
    if (!id) return;

    setLoadingPayments(true);
    setPaymentError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/payments/booking/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load payments.');
      }

      const paymentsData = Array.isArray(payload?.data?.payments)
        ? payload.data.payments
        : Array.isArray(payload?.payments)
          ? payload.payments
          : [];

      setPayments(paymentsData);
      setPaymentTotals(calculatePaymentTotals(paymentsData));
      setPaymentActionState({ updatingId: null, deletingId: null });
    } catch (error) {
      console.error('Error loading payments:', error);
      setPaymentError(error.message || 'Failed to load payments.');
      setPayments([]);
      setPaymentTotals({ ...INITIAL_PAYMENT_TOTALS });
    } finally {
      setLoadingPayments(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleStatusChange = (event) => {
    setStatusDraft(event.target.value);
  };

  const handleNotesChange = (event) => {
    setNotesDraft(event.target.value);
  };

  const handleStartEditNotes = () => {
    setEditingNotes(true);
  };

  const handleCancelEditNotes = () => {
    if (!booking) return;
    setNotesDraft(booking.notes || '');
    setEditingNotes(false);
  };

  const handleUpdateBooking = async (updates, successMessage) => {
    if (!booking) return;

    setUpdating(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/bookings/${booking.id || booking._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update booking.');
      }

      const updated = payload?.data?.booking || payload?.booking || payload?.data;

      setBooking((prev) => ({
        ...prev,
        ...updates,
        ...updated,
      }));

      showSnackbar(successMessage || 'Booking updated successfully.');
      setEditingNotes(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      showSnackbar(error.message || 'Failed to update booking.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenAddPaymentDialog = (event) => {
    blurEventTarget(event);
    setNewPayment(defaultPaymentForm);
    setNewPaymentError(null);
    setIsAddPaymentDialogOpen(true);
  };

  const handleCloseAddPaymentDialog = () => {
    if (creatingPayment) return;
    setIsAddPaymentDialogOpen(false);
  };

  const handleNewPaymentChange = (field) => (event) => {
    const value = event.target.value;
    setNewPayment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreatePayment = async (event) => {
    event.preventDefault();
    if (!booking) return;

    const amountValue = Number(newPayment.amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setNewPaymentError('Please provide a valid payment amount.');
      return;
    }

    setCreatingPayment(true);
    setNewPaymentError(null);

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
          bookingId: booking.id || booking._id,
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
      setIsAddPaymentDialogOpen(false);
      setNewPayment(defaultPaymentForm);
      await fetchPayments();
    } catch (error) {
      console.error('Error creating payment:', error);
      setNewPaymentError(error.message || 'Failed to create payment.');
      showSnackbar(error.message || 'Failed to create payment.', 'error');
    } finally {
      setCreatingPayment(false);
    }
  };

  const handleUpdatePaymentStatus = async (payment, targetStatus) => {
    if (!payment || !targetStatus || targetStatus === payment.status) return;

    setPaymentActionState((prev) => ({ ...prev, updatingId: payment.id }));

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

      showSnackbar(`Payment marked as ${targetStatus}.`);
      await fetchPayments();
    } catch (error) {
      console.error('Error updating payment status:', error);
      showSnackbar(error.message || 'Failed to update payment status.', 'error');
    } finally {
      setPaymentActionState((prev) => ({ ...prev, updatingId: null }));
    }
  };

  const handleOpenEditPaymentDialog = (event, payment) => {
    blurEventTarget(event);
    if (!payment) return;
    setPaymentEditTarget(payment);
    setEditPaymentForm({
      amount: payment.amount?.toString() ?? '',
      method: payment.method || 'cash',
      status: payment.status || 'pending',
      notes: payment.notes || '',
    });
    setEditPaymentError(null);
    setIsEditPaymentDialogOpen(true);
  };

  const handleCloseEditPaymentDialog = () => {
    if (savingPaymentUpdate) return;
    setIsEditPaymentDialogOpen(false);
    setPaymentEditTarget(null);
  };

  const handleEditPaymentChange = (field) => (event) => {
    const value = event.target.value;
    setEditPaymentForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitEditPayment = async (event) => {
    event.preventDefault();
    if (!paymentEditTarget) return;

    const amountValue = Number(editPaymentForm.amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setEditPaymentError('Please provide a valid payment amount.');
      return;
    }

    setSavingPaymentUpdate(true);
    setEditPaymentError(null);
    setPaymentActionState((prev) => ({ ...prev, updatingId: paymentEditTarget.id }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/payments/${paymentEditTarget.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: amountValue,
          method: editPaymentForm.method,
          status: editPaymentForm.status,
          notes: editPaymentForm.notes.trim() || undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update payment.');
      }

      showSnackbar('Payment updated successfully.');
      setIsEditPaymentDialogOpen(false);
      setPaymentEditTarget(null);
      await fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
      setEditPaymentError(error.message || 'Failed to update payment.');
      showSnackbar(error.message || 'Failed to update payment.', 'error');
    } finally {
      setSavingPaymentUpdate(false);
      setPaymentActionState((prev) => ({ ...prev, updatingId: null }));
    }
  };

  const handleDeletePayment = async (payment) => {
    if (!payment) return;

    const displayName = payment.reference || formatCurrency(payment.amount) || 'this payment';

    if (!window.confirm(`Are you sure you want to delete ${displayName}? This action cannot be undone.`)) {
      return;
    }

    setPaymentActionState((prev) => ({ ...prev, deletingId: payment.id }));

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
      await fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
      showSnackbar(error.message || 'Failed to delete payment.', 'error');
    } finally {
      setPaymentActionState((prev) => ({ ...prev, deletingId: null }));
    }
  };

  const handleApplyStatus = () => {
    if (!booking) return;
    if (statusDraft === booking.status) {
      showSnackbar('Status unchanged.', 'info');
      return;
    }

    handleUpdateBooking({ status: statusDraft }, `Booking marked as ${statusDraft}.`);
  };

  const handleSaveNotes = () => {
    if (!booking) return;
    if ((booking.notes || '') === notesDraft.trim()) {
      setEditingNotes(false);
      return;
    }

    handleUpdateBooking({ notes: notesDraft.trim() || undefined }, 'Notes updated successfully.');
  };

  const handleDeleteBooking = async () => {
    if (!booking) return;

    const displayName = booking.reference || booking.guestName || booking.roomNumber || 'this booking';

    if (!window.confirm(`Are you sure you want to delete ${displayName}? This action cannot be undone.`)) {
      return;
    }

    setUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings/${booking.id || booking._id}`, {
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
      navigate('/bookings');
    } catch (error) {
      console.error('Error deleting booking:', error);
      showSnackbar(error.message || 'Failed to delete booking.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const quickStatusActions = useMemo(() => ({
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

  const handleQuickStatus = (target) => {
    if (!booking) return;
    if (target === booking.status) {
      showSnackbar('Status unchanged.', 'info');
      return;
    }

    setStatusDraft(target);
    handleUpdateBooking({ status: target }, `Booking marked as ${target}.`);
  };

  const handleOpenEditDialog = (event) => {
    blurEventTarget(event);
    setEditError(null);
    setSavingEdit(false);
    setEditForm({
      guestName: booking?.guestName || '',
      guestEmail: booking?.guestEmail || '',
      guestPhone: booking?.guestPhone || '',
      roomNumber: booking?.roomNumber || '',
      checkIn: toDateInputValue(booking?.checkIn),
      checkOut: toDateInputValue(booking?.checkOut),
      amount:
        typeof booking?.amount === 'number'
          ? booking.amount.toString()
          : booking?.amount || '',
      status: booking?.status || 'pending',
      notes: booking?.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    if (savingEdit) return;
    setIsEditDialogOpen(false);
  };

  const handleEditFieldChange = (field) => (event) => {
    const value = event.target.value;
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEditForm = () => {
    if (!editForm.guestName.trim()) {
      return 'Guest name is required.';
    }
    if (!editForm.roomNumber.trim()) {
      return 'Room number is required.';
    }
    if (!editForm.checkIn) {
      return 'Check-in date is required.';
    }
    if (!editForm.checkOut) {
      return 'Check-out date is required.';
    }

    const checkInDate = new Date(editForm.checkIn);
    const checkOutDate = new Date(editForm.checkOut);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      return 'Please provide valid check-in and check-out dates.';
    }

    if (checkOutDate <= checkInDate) {
      return 'Check-out date must be after check-in date.';
    }

    const amountValue = Number(editForm.amount);
    if (Number.isNaN(amountValue) || amountValue < 0) {
      return 'Please provide a valid booking amount.';
    }

    return null;
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();
    if (!booking) return;

    const validationError = validateEditForm();
    if (validationError) {
      setEditError(validationError);
      return;
    }

    setSavingEdit(true);
    setEditError(null);

    const payload = {
      guestName: editForm.guestName.trim(),
      guestEmail: editForm.guestEmail.trim() || undefined,
      guestPhone: editForm.guestPhone.trim() || undefined,
      roomNumber: editForm.roomNumber.trim(),
      status: editForm.status,
      checkIn: editForm.checkIn,
      checkOut: editForm.checkOut,
      amount: Number(editForm.amount),
      notes: editForm.notes.trim() || undefined,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings/${booking.id || booking._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseBody.message || 'Failed to update booking.');
      }

      const updated = responseBody?.data?.booking || responseBody?.booking || responseBody?.data;

      setBooking((prev) => ({
        ...prev,
        ...payload,
        ...updated,
      }));
      setStatusDraft(payload.status);
      setNotesDraft(payload.notes || '');
      showSnackbar('Booking updated successfully.');
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving booking:', error);
      setEditError(error.message || 'Failed to update booking.');
      showSnackbar(error.message || 'Failed to update booking.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box marginLeft="290px" p={4}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Booking Details
          </Typography>
          <Alert severity="error" sx={{ mb: 2 }}>
            {fetchError}
          </Alert>
          <Button variant="contained" onClick={fetchBooking}>
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <Box marginLeft="290px" p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" component="h1">
            Booking Details
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Reference: {booking.reference || booking.id}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/bookings')}
          >
            Back to list
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Edit />}
            onClick={handleOpenEditDialog}
            disabled={updating}
          >
            Edit Booking
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDeleteBooking}
            disabled={updating}
          >
            Delete
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
              <Chip
                label={booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                color={statusColorMap[booking.status] || 'default'}
                variant="outlined"
              />
              <Chip label={`Room: ${booking.roomNumber || '—'}`} variant="outlined" />
              {booking.nights && <Chip label={`${booking.nights} night(s)`} variant="outlined" />}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Guest Name
                </Typography>
                <Typography variant="body1">{booking.guestName || '—'}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {booking.guestEmail || '—'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {booking.guestPhone || '—'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Stay Dates
                </Typography>
                <Typography variant="body2">Check-In: {formatDate(booking.checkIn)}</Typography>
                <Typography variant="body2">Check-Out: {formatDate(booking.checkOut)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Amount
                </Typography>
                <Typography variant="body1">{formatCurrency(booking.amount)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Created / Updated
                </Typography>
                <Typography variant="body2">Created: {formatDate(booking.createdAt)}</Typography>
                <Typography variant="body2">Updated: {formatDate(booking.updatedAt)}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="subtitle1">Internal Notes</Typography>
                {!editingNotes ? (
                  <Button size="small" onClick={handleStartEditNotes} startIcon={<Edit fontSize="small" />}>
                    Edit
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={handleCancelEditNotes} disabled={updating}>
                      Cancel
                    </Button>
                    <Button size="small" variant="contained" onClick={handleSaveNotes} disabled={updating}>
                      Save
                    </Button>
                  </Stack>
                )}
              </Box>

              {editingNotes ? (
                <TextField
                  multiline
                  minRows={4}
                  fullWidth
                  value={notesDraft}
                  onChange={handleNotesChange}
                  disabled={updating}
                />
              ) : (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {booking.notes ? booking.notes : 'No notes yet.'}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Update Status
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusDraft} label="Status" onChange={handleStatusChange} disabled={updating}>
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleApplyStatus}
              disabled={updating}
              startIcon={<CheckCircle />}
              fullWidth
            >
              Apply Status
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" gutterBottom>
              Quick Actions
            </Typography>
            <Stack spacing={1}>
              {(quickStatusActions[booking.status || 'pending'] || quickStatusActions.pending).map((action) => (
                <Button
                  key={action.label}
                  variant="outlined"
                  color={action.color}
                  startIcon={action.icon}
                  onClick={() => handleQuickStatus(action.target)}
                  disabled={updating}
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Metadata
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Booking ID: {booking.id || booking._id}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Reference: {booking.reference || '—'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Created: {formatDate(booking.createdAt)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Updated: {formatDate(booking.updatedAt)}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Payments</Typography>
              <Button variant="outlined" startIcon={<Add />} onClick={handleOpenAddPaymentDialog}>
                Record Payment
              </Button>
            </Box>

            {paymentError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {paymentError}
              </Alert>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
              <Chip label={`Total: ${formatCurrency(paymentTotals.total)}`} color="primary" variant="outlined" />
              <Chip label={`Completed: ${formatCurrency(paymentTotals.completed)}`} color="success" variant="outlined" />
              <Chip label={`Pending: ${formatCurrency(paymentTotals.pending)}`} color="warning" variant="outlined" />
              <Chip label={`Refunded: ${formatCurrency(paymentTotals.refunded)}`} color="info" variant="outlined" />
            </Stack>

            {loadingPayments ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={28} />
              </Box>
            ) : payments.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No payments recorded for this booking yet.
              </Typography>
            ) : (
              <List>
                {payments.map((payment) => (
                  <ListItem key={payment.id || payment._id} sx={{ alignItems: 'flex-start' }}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1">{formatCurrency(payment.amount)}</Typography>
                          <Chip
                            label={payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1) || 'Pending'}
                            color={paymentStatusColorMap[payment.status] || 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Stack spacing={0.5} mt={1}>
                          <Typography variant="body2" color="textSecondary">
                            Method: {methodLabelMap[payment.method] || payment.method}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Created: {formatDate(payment.createdAt)}
                          </Typography>
                          {payment.paidAt && (
                            <Typography variant="caption" color="textSecondary">
                              Paid: {formatDate(payment.paidAt)}
                            </Typography>
                          )}
                          {payment.notes && (
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              Notes: {payment.notes}
                            </Typography>
                          )}
                          <Stack direction="row" spacing={1} mt={1}>
                            {(paymentStatusActions[payment.status || 'pending'] || []).map((action) => (
                              <Button
                                key={action.label}
                                size="small"
                                variant="outlined"
                                color={action.color}
                                startIcon={action.icon}
                                disabled={paymentActionState.updatingId === payment.id}
                                onClick={() => handleUpdatePaymentStatus(payment, action.target)}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </Stack>
                        </Stack>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Edit Payment">
                        <IconButton
                          edge="end"
                          sx={{ mr: 1 }}
                          onClick={(event) => handleOpenEditPaymentDialog(event, payment)}
                          disabled={paymentActionState.updatingId === payment.id}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Payment">
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDeletePayment(payment)}
                          disabled={paymentActionState.deletingId === payment.id}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={isAddPaymentDialogOpen} onClose={handleCloseAddPaymentDialog} fullWidth maxWidth="sm">
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent component="form" onSubmit={handleCreatePayment} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            {newPaymentError && <Alert severity="error">{newPaymentError}</Alert>}
            <TextField
              label="Amount"
              type="number"
              value={newPayment.amount}
              onChange={handleNewPaymentChange('amount')}
              inputProps={{ min: 0, step: 0.01 }}
              required
              fullWidth
              disabled={creatingPayment}
            />
            <FormControl fullWidth disabled={creatingPayment}>
              <InputLabel>Method</InputLabel>
              <Select value={newPayment.method} label="Method" onChange={handleNewPaymentChange('method')}>
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {methodLabelMap[option] || option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={creatingPayment}>
              <InputLabel>Status</InputLabel>
              <Select value={newPayment.status} label="Status" onChange={handleNewPaymentChange('status')}>
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
              onChange={handleNewPaymentChange('notes')}
              fullWidth
              disabled={creatingPayment}
            />
          </Stack>
          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={handleCloseAddPaymentDialog} disabled={creatingPayment}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={creatingPayment}>
              {creatingPayment ? 'Saving...' : 'Save Payment'}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditPaymentDialogOpen} onClose={handleCloseEditPaymentDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent component="form" onSubmit={handleSubmitEditPayment} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            {editPaymentError && <Alert severity="error">{editPaymentError}</Alert>}
            <TextField
              label="Amount"
              type="number"
              value={editPaymentForm.amount}
              onChange={handleEditPaymentChange('amount')}
              inputProps={{ min: 0, step: 0.01 }}
              required
              fullWidth
              disabled={savingPaymentUpdate}
            />
            <FormControl fullWidth disabled={savingPaymentUpdate}>
              <InputLabel>Method</InputLabel>
              <Select value={editPaymentForm.method} label="Method" onChange={handleEditPaymentChange('method')}>
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {methodLabelMap[option] || option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={savingPaymentUpdate}>
              <InputLabel>Status</InputLabel>
              <Select value={editPaymentForm.status} label="Status" onChange={handleEditPaymentChange('status')}>
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
              value={editPaymentForm.notes}
              onChange={handleEditPaymentChange('notes')}
              fullWidth
              disabled={savingPaymentUpdate}
            />
          </Stack>
          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={handleCloseEditPaymentDialog} disabled={savingPaymentUpdate}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={savingPaymentUpdate}>
              {savingPaymentUpdate ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent component="form" onSubmit={handleSubmitEdit} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            {editError && <Alert severity="error">{editError}</Alert>}
            <TextField
              label="Guest Name"
              value={editForm.guestName}
              onChange={handleEditFieldChange('guestName')}
              required
              fullWidth
              disabled={savingEdit}
            />
            <TextField
              label="Guest Email"
              type="email"
              value={editForm.guestEmail}
              onChange={handleEditFieldChange('guestEmail')}
              fullWidth
              disabled={savingEdit}
            />
            <TextField
              label="Guest Phone"
              value={editForm.guestPhone}
              onChange={handleEditFieldChange('guestPhone')}
              fullWidth
              disabled={savingEdit}
            />
            <TextField
              label="Room Number"
              value={editForm.roomNumber}
              onChange={handleEditFieldChange('roomNumber')}
              required
              fullWidth
              disabled={savingEdit}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Check-In"
                type="date"
                value={editForm.checkIn}
                onChange={handleEditFieldChange('checkIn')}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                disabled={savingEdit}
              />
              <TextField
                label="Check-Out"
                type="date"
                value={editForm.checkOut}
                onChange={handleEditFieldChange('checkOut')}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                disabled={savingEdit}
              />
            </Stack>
            <TextField
              label="Amount"
              type="number"
              value={editForm.amount}
              onChange={handleEditFieldChange('amount')}
              inputProps={{ min: 0, step: 0.01 }}
              required
              fullWidth
              disabled={savingEdit}
            />
            <FormControl fullWidth disabled={savingEdit}>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.status}
                onChange={handleEditFieldChange('status')}
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
              value={editForm.notes}
              onChange={handleEditFieldChange('notes')}
              fullWidth
              disabled={savingEdit}
            />
          </Stack>
          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={handleCloseEditDialog} disabled={savingEdit}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={savingEdit}>
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

export default BookingDetails;
