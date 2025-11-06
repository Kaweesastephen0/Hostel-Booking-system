import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Divider,
} from '@mui/material';

const initialFormState = {
  fullName: '',
  email: '',
  role: 'manager',
  isActive: true,
  password: '',
  confirmPassword: '',
};

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [userMeta, setUserMeta] = useState({ lastLogin: null, createdAt: null, updatedAt: null });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const passwordMismatch = useMemo(
    () =>
      Boolean(form.password) &&
      Boolean(form.confirmPassword) &&
      form.password !== form.confirmPassword,
    [form.password, form.confirmPassword]
  );

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleFieldChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchUser = useCallback(async () => {
    if (!id) {
      setFetchError('User ID is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to fetch user details.');
      }

      const user = payload?.data?.user || payload?.user;

      if (!user) {
        throw new Error('User not found.');
      }

      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        role: user.role || 'manager',
        isActive: typeof user.isActive === 'boolean' ? user.isActive : true,
        password: '',
        confirmPassword: '',
      });

      setUserMeta({
        lastLogin: user.lastLogin || null,
        createdAt: user.createdAt || null,
        updatedAt: user.updatedAt || null,
      });
    } catch (error) {
      console.error('Error loading user:', error);
      setFetchError(error.message || 'Failed to load user details.');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveError(null);

    if (passwordMismatch) {
      setSaveError('Passwords do not match.');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        fullName: form.fullName?.trim() ?? '',
        email: form.email?.trim() ?? '',
        role: form.role,
        isActive: form.isActive,
      };

      if (form.password) {
        payload.password = form.password;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
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
        throw new Error(responseBody.message || 'Failed to update user.');
      }

      const updatedUser = responseBody?.data?.user || responseBody?.user;

      if (updatedUser) {
        setForm((prev) => ({
          ...prev,
          fullName: updatedUser.fullName || prev.fullName,
          email: updatedUser.email || prev.email,
          role: updatedUser.role || prev.role,
          isActive: typeof updatedUser.isActive === 'boolean' ? updatedUser.isActive : prev.isActive,
          password: '',
          confirmPassword: '',
        }));

        setUserMeta({
          lastLogin: updatedUser.lastLogin || userMeta.lastLogin,
          createdAt: updatedUser.createdAt || userMeta.createdAt,
          updatedAt: updatedUser.updatedAt || new Date().toISOString(),
        });
      }

      showSnackbar('User updated successfully.');
    } catch (error) {
      console.error('Error updating user:', error);
      setSaveError(error.message || 'Failed to update user.');
      showSnackbar(error.message || 'Failed to update user.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderMetaChip = (label, value, color = 'default') => {
    if (!value) return null;
    return (
      <Chip
        label={`${label}: ${new Date(value).toLocaleString()}`}
        color={color}
        variant="outlined"
        sx={{ mr: 1, mb: 1 }}
      />
    );
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
      <Box p={4}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            User Details
          </Typography>
          <Alert severity="error" sx={{ mb: 2 }}>
            {fetchError}
          </Alert>
          <Button variant="contained" onClick={fetchUser}>
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          User Profile
        </Typography>
        <Button variant="outlined" onClick={handleGoBack}>
          Back
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Box display="flex" flexWrap="wrap" mb={2}>
          {renderMetaChip('Created', userMeta.createdAt, 'default')}
          {renderMetaChip('Updated', userMeta.updatedAt, 'primary')}
          {renderMetaChip('Last Login', userMeta.lastLogin, 'success')}
        </Box>

        {saveError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
            <TextField
              label="Full Name"
              value={form.fullName}
              onChange={handleFieldChange('fullName')}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleFieldChange('email')}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select value={form.role} label="Role" onChange={handleFieldChange('role')}>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={handleFieldChange('isActive')}
                  color="primary"
                />
              }
              label={form.isActive ? 'Active' : 'Inactive'}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Leave password fields blank to keep the current password unchanged.
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
            <TextField
              label="New Password"
              type="password"
              value={form.password}
              onChange={handleFieldChange('password')}
              inputProps={{ minLength: 6 }}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={handleFieldChange('confirmPassword')}
              error={passwordMismatch}
              helperText={passwordMismatch ? 'Passwords do not match' : ''}
              fullWidth
            />
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  password: '',
                  confirmPassword: '',
                }));
                setSaveError(null);
              }}
              disabled={saving}
            >
              Clear Password
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving || passwordMismatch}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>

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

export default UserProfile;
