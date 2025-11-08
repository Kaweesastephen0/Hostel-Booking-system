import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, BedDouble, Tag, DollarSign, Table, LayoutGrid, 
  Wrench, Users, CheckCircle
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
import InfoCard from '../../components/cards/InfoCard';
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
  });
  const [allHostels, setAllHostels] = useState([]);
  const [formError, setFormError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Stats for info cards
  const stats = useMemo(() => {
    return {
      totalRooms: rooms.length,
      availableRooms: rooms.filter(room => room.status === 'available').length,
      occupiedRooms: rooms.filter(room => room.status === 'booked').length,
      maintenanceRooms: rooms.filter(room => room.status === 'under_maintenance').length
    };
  }, [rooms]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const data = await roomService.getAllRooms();
        setRooms(data);
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
        setAllHostels(data);
      } catch (err) {
        console.error("Failed to fetch hostels for room filters:", err);
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormError(null);
    try {
      if (selectedRoom) {
        const updatedRoom = await roomService.updateRoom(selectedRoom._id, formData);
        setRooms(prev => prev.map(r => r._id === selectedRoom._id ? updatedRoom : r));
      } else {
        const newRoom = await roomService.createRoom(formData);
        const updatedRooms = await roomService.getAllRooms();
        setRooms(updatedRooms);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save room');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setCurrentPage(1); // Reset to first page on filter change
    setFilters(prev => ({ ...prev, [name]: value }));
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
      const typeMatch = filters.roomType === 'all' || room.roomType === filters.roomType; // Added roomType filter

      return searchMatch && hostelMatch && typeMatch;
    });
  }, [rooms, searchTerm, filters]);

  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRooms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRooms, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  }, [filteredRooms]);

  const uniqueHostelsForFilter = useMemo(() => {
    return allHostels.map(h => ({ _id: h._id, name: h.name }));
  }, [allHostels]);

  return (
    <div className={`rooms-page-container ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="600">Rooms Management</Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleAddNew}
          >
            Add New Room
          </Button>
        </Box>

        {/* Info Cards */}
        {/* Info Cards */}
        <Box sx={{ 
          mb: 4,
          width: '100%',
          maxWidth: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 }
        }}>
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'stretch',
              width: '100%'
            }}
          >
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3} 
              sx={{
                display: 'flex',
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 24px)' }
              }}
            >
              <InfoCard
                title="Total Rooms"
                value={stats.totalRooms}
                icon={<BedDouble size={22} />}
                color="primary"
                sx={{ 
                  height: '100%',
                  minHeight: '140px',
                  width: '100%',
                  flex: 1
                }}
              />
            </Grid>
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3}
              sx={{
                display: 'flex',
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 24px)' }
              }}
            >
              <InfoCard
                title="Available"
                value={stats.availableRooms}
                icon={<CheckCircle size={22} />}
                color="success"
                sx={{ 
                  height: '100%',
                  minHeight: '140px',
                  width: '100%',
                  flex: 1
                }}
              />
            </Grid>
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3}
              sx={{
                display: 'flex',
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 24px)' }
              }}
            >
              <InfoCard
                title="Occupied"
                value={stats.occupiedRooms}
                icon={<Users size={22} />}
                color="warning"
                sx={{ 
                  height: '100%',
                  minHeight: '140px',
                  width: '100%',
                  flex: 1
                }}
              />
            </Grid>
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3}
              sx={{
                display: 'flex',
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 24px)' }
              }}
            >
              <InfoCard
                title="Maintenance"
                value={stats.maintenanceRooms}
                icon={<Wrench size={22} />}
                color="error"
                sx={{ 
                  height: '100%',
                  minHeight: '140px',
                  width: '100%',
                  flex: 1
                }}
              />
            </Grid>
          </Grid>
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
              {allHostels.map((hostel) => (
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
              <MenuItem value="triple">Triple</MenuItem>
              <MenuItem value="quad">Quad</MenuItem>
              <MenuItem value="suite">Suite</MenuItem>
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
          <Button
            variant="outlined"
            startIcon={<Plus size={20} />}
            onClick={handleAddNew}
            sx={{ mt: 2 }}
          >
            Add New Room
          </Button>
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
        open={isFormModalOpen}
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
    </div>
  );
};

export default RoomsPage;