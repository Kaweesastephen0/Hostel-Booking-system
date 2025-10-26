import React, { useState, useEffect } from 'react';
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
  Avatar,
  Badge,
} from '@mui/material';
import { Add, Search, FilterList, CheckCircle, Cancel, Pending } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import { format } from 'date-fns';

const statusColors = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'error',
  completed: 'primary',
};

const statusIcons = {
  confirmed: <CheckCircle fontSize="small" />,
  pending: <Pending fontSize="small" />,
  cancelled: <Cancel fontSize="small" />,
  completed: <CheckCircle fontSize="small" />,
};

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [orderBy, setOrderBy] = useState('checkIn');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Mock data - replace with your API call
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        // const response = await fetch(`/api/bookings?page=${page + 1}&limit=${rowsPerPage}&sort=${orderBy}&order=${order}&search=${searchTerm}&status=${statusFilter}&dateRange=${dateRange}`);
        // const data = await response.json();

        // Mock data
        const mockBookings = Array.from({ length: 25 }, (_, i) => {
          const statuses = ['confirmed', 'pending', 'cancelled', 'completed'];
          const status = statuses[i % statuses.length];
          const checkIn = new Date();
          checkIn.setDate(checkIn.getDate() + i);
          const checkOut = new Date(checkIn);
          checkOut.setDate(checkIn.getDate() + Math.floor(Math.random() * 7) + 1);

          return {
            id: `B${1000 + i}`,
            guest: `Guest ${i + 1}`,
            room: `Room ${Math.floor(Math.random() * 100) + 100}`,
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString(),
            status,
            amount: (Math.random() * 1000 + 50).toFixed(2),
            nights: Math.floor(Math.random() * 7) + 1,
          };
        });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setBookings(mockBookings);
        setTotalRows(mockBookings.length);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page, rowsPerPage, orderBy, order, searchTerm, statusFilter, dateRange]);

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

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
    setPage(0);
  };

  const handleViewBooking = (booking) => {
    navigate(`/bookings/${booking.id}`);
  };

  const handleCheckIn = (booking) => {
    console.log('Check in booking:', booking.id);
    // check-in logic
  };

  const handleCheckOut = (booking) => {
    console.log('Check out booking:', booking.id);
    // check-out logic
  };

  const handleCancel = (booking) => {
    if (window.confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
      console.log('Cancelling booking:', booking.id);
      // cancel logic
    }
  };

  const columns = [
    {
      id: 'id',
      label: 'Booking ID',
      minWidth: 70,
      sortable: true,
    },
    {
      id: 'guest',
      label: 'Guest',
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {value.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2">{value}</Typography>
        </Box>
      )
    },
    {
      id: 'room',
      label: 'Room',
      minWidth: 70,
      sortable: true,
    },
    {
      id: 'checkIn',
      label: 'Check In',
      minWidth: 100,
      sortable: true,
      format: (value) => format(new Date(value), 'MMM d, yyyy')
    },
    {
      id: 'checkOut',
      label: 'Check Out',
      minWidth: 100,
      sortable: true,
      format: (value) => format(new Date(value), 'MMM d, yyyy')
    },
    {
      id: 'nights',
      label: 'Nights',
      minWidth: 40,
      align: 'center',
      sortable: true,
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 70,
      align: 'right',
      sortable: true,
      format: (value) => `$${parseFloat(value).toFixed(2)}`
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Chip
          icon={statusIcons[value]}
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={statusColors[value] || 'default'}
          size="small"
          variant="outlined"
        />
      )
    },
  ];

  const actions = [
    {
      icon: <CheckCircle fontSize="small" />,
      tooltip: 'Check In',
      onClick: handleCheckIn,
      color: 'success',
      disabled: (booking) => booking.status !== 'confirmed'
    },
    {
      icon: <CheckCircle fontSize="small" />,
      tooltip: 'Check Out',
      onClick: handleCheckOut,
      color: 'primary',
      disabled: (booking) => booking.status !== 'confirmed'
    },
    {
      icon: <Cancel fontSize="small" />,
      tooltip: 'Cancel Booking',
      onClick: handleCancel,
      color: 'error',
      disabled: (booking) => !['confirmed', 'pending'].includes(booking.status)
    },
  ];

  return (
    <Box marginLeft="280px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}  >
        <Typography variant="h5" component="h1">
          Bookings Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/bookings/new')}
        >
          New Booking
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap" marginLeft="290px">
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

        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={dateRange}
            onChange={handleDateRangeChange}
            label="Date Range"
          >
            <MenuItem value="all">All Dates</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="thisWeek">This Week</MenuItem>
            <MenuItem value="thisMonth">This Month</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
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
        onRowClick={handleViewBooking}
        actions={actions}
        emptyMessage="No bookings found. Try adjusting your search or filters."
      />
    </Box>
  );
};

export default Bookings;
