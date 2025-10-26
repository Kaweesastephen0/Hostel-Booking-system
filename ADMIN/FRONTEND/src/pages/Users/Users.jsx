import React, { useState, useEffect } from 'react';
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

  // Mock data - replace with your API call
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        // const response = await fetch(`/api/users?page=${page + 1}&limit=${rowsPerPage}&sort=${orderBy}&order=${order}&search=${searchTerm}&status=${statusFilter}`);
        // const data = await response.json();
        
        // Mock data
        const mockUsers = Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          role: i % 3 === 0 ? 'admin' : 'manager',
          status: i % 4 === 0 ? 'inactive' : 'active',
          lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        }));

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUsers(mockUsers);
        setTotalRows(mockUsers.length);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage, orderBy, order, searchTerm, statusFilter]);

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
    navigate(`/users/edit/${user.id}`);
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      // Delete user logic here
      console.log('Deleting user:', user.id);
    }
  };

  const handleToggleStatus = (user) => {
    // Toggle user status logic here
    console.log('Toggling status for user:', user.id);
  };

  const columns = [
    { 
      id: 'name', 
      label: 'Name', 
      minWidth: 100,
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
      id: 'status', 
      label: 'Status', 
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Chip 
          label={value === 'active' ? 'Active' : 'Inactive'}
          color={value === 'active' ? 'success' : 'default'}
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
      format: (value) => new Date(value).toLocaleString()
    },
  ];

  const actions = [
    {
      icon: <Edit fontSize="small" />,
      tooltip: 'Edit User',
      onClick: handleEditUser,
      color: 'primary',
    },
    {
      icon: <Delete fontSize="small" />,
      tooltip: 'Delete User',
      onClick: handleDeleteUser,
      color: 'error',
    },
    {
      getIcon: (user) => user.status === 'active' ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />,
      getTooltip: (user) => user.status === 'active' ? 'Deactivate User' : 'Activate User',
      onClick: handleToggleStatus,
      getColor: (user) => user.status === 'active' ? 'warning' : 'success',
    },
  ];

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
          onClick={() => navigate('/users/new')}
        >
          Add User
        </Button>
      </Box>

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
    </Box>
  );
};

export default Users;