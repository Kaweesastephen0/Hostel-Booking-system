import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, BedDouble, Tag, DollarSign, Table, LayoutGrid, 
  Wrench, Users, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import {
  Box,
  Button,
  Typography,
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
  DialogContentText,
  Alert,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from '@mui/material';
import { Search } from '@mui/icons-material';

import RoomTable from './RoomTable';
import RoomCard from './RoomCard'; 
import RoomForm from './RoomForm';
import RoomInfoCard from './RoomInfoCard';
import * as roomService from '../../services/roomService';
import * as hostelService from '../../services/hostelService';
import Pagination from '../../components/pagination.jsx/Pagination';

import './Rooms.css';

const ITEMS_PER_PAGE = 10;
const RoomsPage = ({ isCreateMode = false }) => {
  const { isCollapsed } = useSidebar();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(isCreateMode);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    hostelId: 'all',
    roomType: 'all',
    status: 'all',
  });
  const [allHostels, setAllHostels] = useState([]);
  const [formError, setFormError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [isContactAdminModalOpen, setIsContactAdminModalOpen] = useState(false);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (err) {
      console.error('Failed to parse user from storage', err);
      return {};
    }
  }, []);

  const userRole = currentUser?.role || 'manager';

  const filterHostelsByRole = (list) => {
    // Backend already handles filtering based on user role
    // Admins receive all hostels, managers receive only their own
    return list;
  };

  const filterRoomsByRole = (list) => {
    // Backend already handles filtering based on user role
    // Admins receive all rooms, managers receive only rooms from their hostels or rooms they manage
    return list;
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const data = await roomService.getAllRooms();
        const roomsList = Array.isArray(data) ? data : [];
        const normalizedRooms = roomsList.map(room => {
          const status = (room.status || 'available').toLowerCase();
          return {
            ...room,
            status,
            isAvailable: room.isAvailable !== undefined ? room.isAvailable : status === 'available'
          };
        });
        setRooms(filterRoomsByRole(normalizedRooms));
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Fetch all hostels for the filter dropdown
  useEffect(() => {
    const fetchHostelsForFilter = async () => {
      try {
        const data = await hostelService.getAllHostels();
        const hostelsList = Array.isArray(data) ? data : [];
        setAllHostels(filterHostelsByRole(hostelsList));
      } catch (err) {
        console.error("Failed to fetch hostels for room filters:", err);
        setAllHostels([]);
      }
    };
    fetchHostelsForFilter();
  }, []);

  const handleAddNew = () => {
    setSelectedRoom(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleDelete = (room) => {
    setRoomToDelete(room);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;
    try {
      await roomService.deleteRoom(roomToDelete._id);
      setRooms(prev => prev.filter(r => r._id !== roomToDelete._id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.message?.includes('cannot delete')) {
        setIsDeleteModalOpen(false);
        setIsContactAdminModalOpen(true);
      } else {
        setError(err.message);
        setIsDeleteModalOpen(false);
      }
    } finally {
      setRoomToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormError(null);
    try {
      if (selectedRoom) {
        await roomService.updateRoom(selectedRoom._id, formData);
      } else {
        await roomService.createRoom(formData);
      }
      const refreshedRooms = await roomService.getAllRooms();
      const roomsList = Array.isArray(refreshedRooms) ? refreshedRooms : [];
      setRooms(filterRoomsByRole(roomsList));
      setIsFormModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save room');
    }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      if (!room.hostelId) return false;
      // Ensure room.hostelId exists and has a name property for search, and _id for filter
      if (!room.hostelId || !room.hostelId.name || !room.hostelId._id) {
        return false; // Skip rooms with incomplete hostel data
      }
      const searchMatch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.hostelId.name.toLowerCase().includes(searchTerm.toLowerCase());

      const hostelMatch = filters.hostelId === 'all' || room.hostelId._id === filters.hostelId;
      const typeMatch = filters.roomType === 'all' || room.roomType === filters.roomType;
      const statusMatch = filters.status === 'all' || (room.status || 'available') === filters.status;

      return searchMatch && hostelMatch && typeMatch && statusMatch;
    });
  }, [rooms, searchTerm, filters]);

  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRooms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRooms, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  }, [filteredRooms]);

  return (
    <div className={`rooms-page-container ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="600">Rooms Management</Typography>
          {(userRole === 'manager' || userRole === 'admin') && (
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={handleAddNew}
            >
              Add New Room
            </Button>
          )}
        </Box>

        {/* Info Cards */}
        <Box sx={{ mb: 3 }}>
          <RoomInfoCard loading={isLoading} rooms={rooms} />
        </Box>

        {/* Filters and Search */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          padding: 2,
          borderRadius: 1,
          boxShadow: 1
        }}>
          <TextField
            size="small"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: '200px' }}
          />

          <FormControl size="small" sx={{ minWidth: '200px' }}>
            <InputLabel>Hostel</InputLabel>
            <Select
              value={filters.hostelId}
              label="Hostel"
              onChange={(e) => setFilters({ ...filters, hostelId: e.target.value })}
            >
              <MenuItem value="all">All Hostels</MenuItem>
              {(allHostels ?? []).map((hostel) => (
                <MenuItem key={hostel._id} value={hostel._id}>
                  {hostel.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: '200px' }}>
            <InputLabel>Room Type</InputLabel>
            <Select
              value={filters.roomType}
              label="Room Type"
              onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="single">Single</MenuItem>
              <MenuItem value="double">Double</MenuItem>
              <MenuItem value="shared">Shared</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: '200px' }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="occupied">Occupied</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>

          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newView) => newView && setViewMode(newView)}
            size="small"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <LayoutGrid size={20} />
            </ToggleButton>
            <ToggleButton value="table" aria-label="table view">
              <Table size={20} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Main Content */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <Typography>Loading rooms...</Typography>
        </Box>
      ) : filteredRooms.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1
        }}>
          <BedDouble size={48} strokeWidth={1} style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }} />
          <Typography variant="h6" gutterBottom>No Rooms Found</Typography>
          <Typography color="text.secondary">
            {searchTerm || filters.hostelId !== 'all' || filters.roomType !== 'all' 
              ? 'Try adjusting your filters or search terms'
              : 'Get started by adding your first room'}
          </Typography>
          {(userRole === 'manager' || userRole === 'admin') && (
            <Button
              variant="outlined"
              startIcon={<Plus size={20} />}
              onClick={handleAddNew}
              sx={{ mt: 2 }}
            >
              Add New Room
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ mb: 4 }}>
          {viewMode === 'table' ? (
            <RoomTable
              rooms={paginatedRooms}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <Grid 
              container 
              spacing={3} 
              sx={{ 
                px: { xs: 1, sm: 2, md: 3 },
                width: '100%'
              }}
            >
              {paginatedRooms.map((room) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  lg={4}
                  sx={(theme) => ({
                    [theme.breakpoints.up('xl')]: {
                      flexBasis: '25%',
                      maxWidth: '25%',
                    },
                    '@media (min-width: 1200px)': {
                      '.sidebar-collapsed &': {
                        flexBasis: '25%',
                        maxWidth: '25%',
                      }
                    }
                  })}
                  key={room._id}
                >
                  <RoomCard
                    room={room}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalRecords={filteredRooms.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      <Dialog
        open={isFormModalOpen && (selectedRoom || userRole === 'manager' || userRole === 'admin')}
        onClose={() => setIsFormModalOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{selectedRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <RoomForm
            room={selectedRoom}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            allHostels={allHostels}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogTitle>Delete Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete room "{roomToDelete?.roomNumber}" from "{roomToDelete?.hostelId?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isContactAdminModalOpen} onClose={() => setIsContactAdminModalOpen(false)}>
        <DialogTitle sx={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle size={24} /> Delete Permission Denied
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <DialogContentText>
            As a manager, you don't have permission to delete rooms. Only administrators can perform deletion operations.
          </DialogContentText>
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            backgroundColor: '#f0f9ff',
            borderRadius: 2,
            border: '1px solid #3b82f6',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
              To delete this room, please:
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📧 Contact your administrator
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              💬 Send a deletion request with details
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsContactAdminModalOpen(false)} variant="contained" color="primary">
            Understood
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomsPage;