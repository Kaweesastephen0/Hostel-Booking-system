import React, { useState, useEffect, useMemo } from 'react';
import { Plus, BedDouble, Tag, DollarSign } from 'lucide-react';
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
} from '@mui/material';
import { Search } from '@mui/icons-material';

import RoomTable from './RoomTable';
import RoomForm from './RoomForm';
import InfoCard from '../../components/cards/InfoCard';
import * as roomService from '../../services/roomService';
import * as hostelService from '../../services/hostelService';
import Pagination from '../../components/pagination.jsx/Pagination';

import './Rooms.css';

const ITEMS_PER_PAGE = 10;
const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
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
      if (!room.hostel) return false;
      // Ensure room.hostel exists and has a name property for search, and _id for filter
      if (!room.hostel || !room.hostel.name || !room.hostel._id) {
        return false; // Skip rooms with incomplete hostel data
      }
      const searchMatch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.hostel.name.toLowerCase().includes(searchTerm.toLowerCase());

      const hostelMatch = filters.hostelId === 'all' || room.hostel._id === filters.hostelId;
      const typeMatch = filters.roomType === 'all' || room.roomType === filters.roomType;

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

  // This `uniqueHostels` was previously derived from `rooms` state.
  // Now it should be derived from `allHostels` state to ensure all hostels are available in the filter,
  // even if no rooms are currently associated with them in the `rooms` array.
  const uniqueHostelsForFilter = useMemo(() => {
    return allHostels.map(h => ({ _id: h._id, name: h.name }));
  }, [allHostels]);

  return (
    <div className="rooms-page-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Room Management
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddNew} startIcon={<Plus size={16} />}>
          Add New Room
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by room number or hostel..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }}
          sx={{ minWidth: 300 }}
        />
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Hostel</InputLabel>
          <Select name="hostelId" value={filters.hostelId} onChange={handleFilterChange} label="Hostel">
            <MenuItem value="all">All Hostels</MenuItem>
            {uniqueHostelsForFilter.map(h => <MenuItem key={h._id} value={h._id}>{h.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Room Type</InputLabel>
          <Select name="roomType" value={filters.roomType} onChange={handleFilterChange} label="Room Type">
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="double">Double</MenuItem>
            <MenuItem value="shared">Shared</MenuItem>
            <MenuItem value="suite">Suite</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <div className="rooms-summary-cards">
        <InfoCard title="Total Rooms" value={filteredRooms.length} icon={<BedDouble />} />
        <InfoCard title="Unique Hostels" value={uniqueHostelsForFilter.length} icon={<Tag />} /> {/* Changed to uniqueHostelsForFilter */}
        <InfoCard title="Average Price" value={`UGX ${filteredRooms.length > 0 ? (filteredRooms.reduce((acc, r) => acc + r.roomPrice, 0) / filteredRooms.length).toLocaleString() : 0}`} icon={<DollarSign />} /> {/* Changed r.price to r.roomPrice */}
      </div>

      {isLoading && <div>Loading rooms...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {!isLoading && !error && (
        <RoomTable rooms={paginatedRooms} onEdit={handleEdit} onDelete={handleDelete} />
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
            Are you sure you want to delete room "{roomToDelete?.roomNumber}" from "{roomToDelete?.hostel?.name}"? This action cannot be undone.
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