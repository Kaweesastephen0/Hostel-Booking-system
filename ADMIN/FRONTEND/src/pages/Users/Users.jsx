import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Chip, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, Tabs, Tab, Paper
} from '@mui/material';
import { Add, Edit, Delete, Search, Block, CheckCircle, Person, AdminPanelSettings } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import Swal from 'sweetalert2';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState('all');
  const [fetchError, setFetchError] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'manager',
    confirmPassword: '',
  });
  const [createError, setCreateError] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [rowActionState, setRowActionState] = useState({});

  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  const passwordMismatch =
    Boolean(newUser.password) &&
    Boolean(newUser.confirmPassword) &&
    newUser.password !== newUser.confirmPassword;

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



  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      // Determine the correct endpoint based on the active tab
      let endpoint = '/users';
      if (tabValue === 'admins') {
        endpoint = '/users/admins';
      } else if (tabValue === 'clients') {
        endpoint = '/users/clients';
      }

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

      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}${endpoint}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to fetch users.');
      }

      const rawUsers = Array.isArray(payload?.data?.users)
        ? payload.data.users
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.users)
            ? payload.users
            : [];

      const normalizedUsers = rawUsers.map((user) => ({
        id: user.id || user._id,
        fullName: user.fullName || `${user.firstName || ''} ${user.surname || ''}`.trim() || 'N/A',
        email: user.email || '',
        role: user.role || (user.userType === 'client' ? 'client' : 'manager'),
        userType: user.userType || (user.source === 'client' ? 'client' : 'admin'),
        source: user.source || 'admin',
        isActive: user.isActive !== undefined ? user.isActive : true,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        phoneNumber: user.phoneNumber || 'N/A',
      }));

      const total = payload?.data?.total
        ?? payload?.total
        ?? payload?.meta?.total
        ?? payload?.pagination?.total
        ?? normalizedUsers.length;

      setUsers(normalizedUsers);
      setRowActionState({});
      setTotalRows(typeof total === 'number' ? total : normalizedUsers.length);
    } catch (error) {
      console.error('Error fetching users:', error);
      setFetchError(error.message || 'Failed to load users.');
      setUsers([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, order, orderBy, page, rowsPerPage, searchTerm, statusFilter, tabValue]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (event, newPage) => {
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleEditUser = (user) => {
    navigate(`/users/${user.id}`);
  };

  const handleDeleteUser = async (user) => {
    const displayName = user.fullName || user.email || 'this user';
    const result = await Swal.fire({
      title: 'Delete User?',
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

    updateRowActionState(user.id, 'deleting', true);

    try {
      const token = localStorage.getItem('token');


      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to delete user.');
      }

      showSnackbar('User deleted successfully.');
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar(error.message || 'Failed to delete user.', 'error');
    } finally {
      updateRowActionState(user.id, 'deleting', false);
    }
  };

  const handleToggleStatus = async (user) => {
    updateRowActionState(user.id, 'toggling', true);

    try {
      const token = localStorage.getItem('token');
      
      // Determine the source from the user object (default to 'admin' if not specified)
      const source = user.source || 'admin';

      const response = await fetch(`${API_BASE_URL}/users/${source}/${user.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update user status.');
      }

      const updatedUser = payload?.data?.user;
      const nextIsActive = typeof updatedUser?.isActive === 'boolean' ? updatedUser.isActive : !user.isActive;

      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id
            ? {
              ...item,
              isActive: nextIsActive,
            }
            : item
        )
      );

      showSnackbar(`User ${nextIsActive ? 'activated' : 'deactivated'} successfully.`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      showSnackbar(error.message || 'Failed to update user status.', 'error');
    } finally {
      updateRowActionState(user.id, 'toggling', false);
    }
  };

  // Fixed columns format for DataTable component
  const columns = [
    {
      id: 'fullName',
      label: 'User',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {row.role?.toLowerCase() === 'admin' || row.role?.toLowerCase() === 'manager' ? (
            <AdminPanelSettings color="primary" />
          ) : (
            <Person color="action" />
          )}
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>{value || 'N/A'}</Typography>
            <Typography variant="caption" color="text.primary" display="block" sx={{ opacity: 0.8 }}>
              {row.email || 'No email'}
            </Typography>
          </Box>
        </Box>
      ),
    },

    {
      id: 'role',
      label: 'Role',
      minWidth: 120,
      sortable: true,
      format: (value) => {
        const role = value?.toLowerCase() || '';
        return (
          <Chip
            label={value || 'N/A'}
            size="small"
            color={
              role === 'admin'
                ? 'primary'
                : role === 'manager'
                  ? 'secondary'
                  : 'default'
            }
            variant="outlined"
            sx={{ minWidth: 80 }}
          />
        );
      },
    },
    {
      id: 'isActive',
      label: 'Status',
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          color={value ? 'success' : 'default'}
          size="small"
          variant={value ? 'filled' : 'outlined'}
        />
      )
    },
    {
      id: 'lastLogin',
      label: 'Last Login',
      minWidth: 160,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {value ? new Date(value).toLocaleString() : 'Never'}
        </Typography>
      )
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </Typography>
      )
    },
  ];

  const actions = [
    {
      icon: <Edit fontSize="small" />,
      tooltip: 'Edit User',
      onClick: handleEditUser,
      color: 'primary',
      disabled: (row) => Boolean(rowActionState[row.id]?.deleting || rowActionState[row.id]?.toggling),
    },
    {
      icon: (row) => row.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />,
      tooltip: (row) => row.isActive ? 'Deactivate User' : 'Activate User',
      onClick: handleToggleStatus,
      color: (row) => {
        // Ensure we return a valid MUI color string
        const color = row.isActive ? 'warning' : 'success';
        return ['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(color)
          ? color
          : 'primary';
      },
      disabled: (row) => Boolean(rowActionState[row.id]?.toggling || rowActionState[row.id]?.deleting),
    },
    {
      icon: <Delete fontSize="small" />,
      tooltip: 'Delete User',
      onClick: handleDeleteUser,
      color: 'error',
      disabled: (row) => Boolean(rowActionState[row.id]?.deleting || rowActionState[row.id]?.toggling),
    },
  ];

  const handleOpenAddDialog = () => {
    setNewUser({
      fullName: '',
      email: '',
      password: '',
      role: 'manager',
      confirmPassword: ''
    });
    setCreateError(null);
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    if (creatingUser) return;
    setIsAddDialogOpen(false);
  };

  const handleNewUserChange = (field) => (event) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setCreateError(null);

    const { fullName, email, password, confirmPassword, role } = newUser;

    // Validation
    if (!fullName.trim()) {
      setCreateError('Full name is required.');
      return;
    }

    if (!email.trim()) {
      setCreateError('Email is required.');
      return;
    }

    if (!password) {
      setCreateError('Password is required.');
      return;
    }

    if (password.length < 6) {
      setCreateError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setCreateError('Passwords do not match.');
      return;
    }

    setCreatingUser(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to create user.');
      }

      showSnackbar('User created successfully.');
      setIsAddDialogOpen(false);
      setNewUser({
        fullName: '',
        email: '',
        password: '',
        role: 'manager',
        confirmPassword: ''
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setCreateError(error.message || 'Failed to create user.');
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" component="h1">
            Users Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
            sx={{ minWidth: 'auto' }}
          >
            Add User
          </Button>
        </Box>

        {/* Tabs Section */}
        <Paper sx={{ mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="user tabs"
            sx={{
              '& .MuiTab-root': {
                minHeight: 60,
                fontSize: '0.875rem'
              }
            }}
          >
            <Tab
              value="all"
              label="All Users"
              icon={<Person />}
              iconPosition="start"
            />
            <Tab
              value="admins"
              label="Admins & Managers"
              icon={<AdminPanelSettings />}
              iconPosition="start"
            />
            <Tab
              value="clients"
              label="Client Users"
              icon={<Person />}
              iconPosition="start"
            />
          </Tabs>
        </Paper>
      </Box>

      {/* Error Alert */}
      {fetchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fetchError}
        </Alert>
      )}

      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'flex-end'
        }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search users..."
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
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Data Table */}
      <DataTable
        columns={columns}
        rows={users}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSort={handleSort}
        orderBy={orderBy}
        order={order}
        onRowClick={(user) => navigate(`/users/${user.id}`)}
        actions={actions}
        emptyMessage="No users found. Try adjusting your search or filters."
      />

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateUser} sx={{ mt: 1 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              {createError && (
                <Alert severity="error">{createError}</Alert>
              )}
              <TextField
                label="Full Name"
                value={newUser.fullName}
                onChange={handleNewUserChange('fullName')}
                required
                fullWidth
                disabled={creatingUser}
              />
              <TextField
                label="Email"
                type="email"
                value={newUser.email}
                onChange={handleNewUserChange('email')}
                required
                fullWidth
                disabled={creatingUser}
              />
              <TextField
                label="Password"
                type="password"
                value={newUser.password}
                onChange={handleNewUserChange('password')}
                required
                fullWidth
                disabled={creatingUser}
                inputProps={{ minLength: 6 }}
                helperText="Password must be at least 6 characters long"
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={newUser.confirmPassword}
                onChange={handleNewUserChange('confirmPassword')}
                required
                fullWidth
                disabled={creatingUser}
                error={passwordMismatch}
                helperText={passwordMismatch ? 'Passwords do not match' : ''}
              />
              <FormControl fullWidth disabled={creatingUser}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newUser.role}
                  onChange={handleNewUserChange('role')}
                  label="Role"
                >
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <DialogActions sx={{ mt: 3, px: 0 }}>
              <Button onClick={handleCloseAddDialog} disabled={creatingUser}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={creatingUser || passwordMismatch || !newUser.fullName || !newUser.email || !newUser.password || !newUser.confirmPassword}
              >
                {creatingUser ? 'Adding...' : 'Add User'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default Users;