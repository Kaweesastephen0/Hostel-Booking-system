import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add, Edit, Delete, Search, Block, CheckCircle } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';

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

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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

      const response = await fetch(`${API_BASE_URL}/api/users?${params.toString()}`, {
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
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        role: user.role || 'manager',
        isActive:
          typeof user.isActive === 'boolean'
            ? user.isActive
            : user.status
              ? user.status === 'active'
              : true,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
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
  }, [API_BASE_URL, order, orderBy, page, rowsPerPage, searchTerm, statusFilter]);

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

  const handleEditUser = (user) => {
    navigate(`/users/${user.id}`);
  };

  const handleDeleteUser = async (user) => {
    const displayName = user.fullName || user.email || 'this user';
    if (!window.confirm(`Are you sure you want to delete ${displayName}? This action cannot be undone.`)) {
      return;
    }

    updateRowActionState(user.id, 'deleting', true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
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
      updateRowActionState(user.id, 'deleting', false);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar(error.message || 'Failed to delete user.', 'error');
      updateRowActionState(user.id, 'deleting', false);
    }
  };

  const handleToggleStatus = async (user) => {
    updateRowActionState(user.id, 'toggling', true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/status`, {
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

  const columns = [
    { 
      id: 'fullName', 
      label: 'Name', 
      minWidth: 150,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" noWrap>{value}</Typography>
          <Typography variant="caption" color="textSecondary">{row.email}</Typography>
        </Box>
      )
    },
    { 
      id: 'role', 
      label: 'Role', 
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Chip 
          label={value.charAt(0).toUpperCase() + value.slice(1)} 
          color={value === 'admin' ? 'primary' : 'default'}
          size="small"
        />
      )
    },
    { 
      id: 'isActive', 
      label: 'Status', 
      minWidth: 80,
      sortable: true,
      format: (value) => (
        <Chip 
          label={value ? 'Active' : 'Inactive'}
          color={value ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
      )
    },
    { 
      id: 'lastLogin', 
      label: 'Last Login', 
      minWidth: 150,
      sortable: true,
      format: (value) => value ? new Date(value).toLocaleString() : 'Never'
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
      icon: <Delete fontSize="small" />,
      tooltip: 'Delete User',
      onClick: handleDeleteUser,
      color: 'error',
      disabled: (row) => Boolean(rowActionState[row.id]?.deleting),
    },
    {
      getIcon: (user) => user.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />,
      getTooltip: (user) => user.isActive ? 'Deactivate User' : 'Activate User',
      onClick: handleToggleStatus,
      getColor: (user) => user.isActive ? 'warning' : 'success',
      disabled: (row) => Boolean(rowActionState[row.id]?.toggling || rowActionState[row.id]?.deleting),
    },
  ];

  const handleOpenAddDialog = () => {
    setNewUser({ fullName: '', email: '', password: '', role: 'manager', confirmPassword: '' });
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

    if (password !== confirmPassword) {
      setCreateError('Passwords do not match.');
      return;
    }

    setCreatingUser(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: fullName?.trim() ?? '',
          email: email?.trim() ?? '',
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
      setNewUser({ fullName: '', email: '', password: '', role: 'manager', confirmPassword: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setCreateError(error.message || 'Failed to create user.');
      showSnackbar(error.message || 'Failed to create user.', 'error');
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <Box marginLeft="290px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} >
        <Typography variant="h5" component="h1">
          Users Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
        >
          Add User
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

      <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent component="form" onSubmit={handleCreateUser} sx={{ mt: 1 }}>
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
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={handleNewUserChange('email')}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={newUser.password}
              onChange={handleNewUserChange('password')}
              required
              fullWidth
              inputProps={{ minLength: 6 }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={newUser.confirmPassword}
              onChange={handleNewUserChange('confirmPassword')}
              required
              fullWidth
              error={passwordMismatch}
              helperText={passwordMismatch ? 'Passwords do not match' : ''}
            />
            <FormControl fullWidth>
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
          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={handleCloseAddDialog} disabled={creatingUser}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={creatingUser || passwordMismatch}
            >
              {creatingUser ? 'Adding...' : 'Add User'}
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

export default Users;