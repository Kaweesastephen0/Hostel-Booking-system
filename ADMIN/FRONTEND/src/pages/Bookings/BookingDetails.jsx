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
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ArrowBack, Edit, Delete, CheckCircle, Cancel, Info } from '@mui/icons-material';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

const statusColorMap = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'primary',
};

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

  const handleOpenEditDialog = () => {
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
        <Grid item xs={12} md={7}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Stay Dates
                </Typography>
                <Typography variant="body2">Check-In: {formatDate(booking.checkIn)}</Typography>
                <Typography variant="body2">Check-Out: {formatDate(booking.checkOut)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Amount
                </Typography>
                <Typography variant="body1">{formatCurrency(booking.amount)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
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

        <Grid item xs={12} md={5}>
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
        </Grid>
      </Grid>

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
