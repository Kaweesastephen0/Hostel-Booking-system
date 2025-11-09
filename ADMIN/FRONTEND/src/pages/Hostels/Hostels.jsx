import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutGrid, List, Building, BedDouble, CheckCircle, AlertTriangle } from 'lucide-react';
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
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  Grid,
} from '@mui/material';
import { Search } from '@mui/icons-material';

import HostelTable from '../../components/hostels/HostelTable';
import HostelCard from '../../components/hostels/HostelCard';
import HostelForm from '../../components/hostels/HostelForm';
import HostelInfoCard from './HostelInfoCard';
import Pagination from '../../components/pagination.jsx/Pagination';
import * as hostelService from '../../services/hostelService';
import * as roomService from '../../services/roomService';

import './Hostels.css';

const ITEMS_PER_PAGE = 9;

const Hostels = ({ isCreateMode = false }) => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isFormModalOpen, setIsFormModalOpen] = useState(isCreateMode);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (err) {
      console.error('Failed to parse user from storage', err);
      return {};
    }
  }, []);

  const userRole = currentUser?.role || 'manager';
  const canCreateHostel = userRole === 'manager' || userRole === 'admin';

  const filterHostelsByRole = (list) => {
    // Backend already handles filtering based on user role
    // Admins receive all hostels, managers receive only their own
    // This frontend filter serves as a safety measure
    return list;
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [hostelToDelete, setHostelToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: 'all',
    gender: 'all',
    availability: 'all',
  });
  const [formError, setFormError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isContactAdminModalOpen, setIsContactAdminModalOpen] = useState(false);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setIsLoading(true);
        const [hostelData, roomData] = await Promise.all([
          hostelService.getAllHostels(),
          roomService.getAllRooms()
        ]);
        let hostelsList = Array.isArray(hostelData) ? hostelData : [];
        const roomsList = Array.isArray(roomData) ? roomData : [];

        // Calculate room count for each hostel
        const hostelsWithRoomCount = hostelsList.map(hostel => {
          const roomCount = roomsList.filter(room => room.hostelId?._id === hostel._id).length;
          return {
            ...hostel,
            roomCount: roomCount
          };
        });
        setHostels(filterHostelsByRole(hostelsWithRoomCount));
        setRooms(roomsList);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHostels();
  }, []);

  useEffect(() => {
    if (!canCreateHostel && isFormModalOpen) {
      setIsFormModalOpen(false);
    }
  }, [canCreateHostel, isFormModalOpen]);

  const handleAddNew = () => {
    if (!canCreateHostel) {
      return;
    }
    setSelectedHostel(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (hostel) => {
    setSelectedHostel(hostel);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleDelete = (hostel) => {
    setHostelToDelete(hostel);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!hostelToDelete) return;
    try {
      await hostelService.deleteHostel(hostelToDelete._id);
      setHostels(prev => prev.filter(h => h._id !== hostelToDelete._id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      if (err.response?.status === 403) {
        setIsDeleteModalOpen(false);
        setIsContactAdminModalOpen(true);
      } else {
        setError(err.response?.data?.message || err.message);
        setIsDeleteModalOpen(false);
      }
    } finally {
      setHostelToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormError(null);
    try {
      if (selectedHostel) {
        const updatedHostel = await hostelService.updateHostel(selectedHostel._id, formData);
        setHostels(prev => prev.map(h => (h._id === selectedHostel._id ? updatedHostel : h)));
      } else {
        await hostelService.createHostel(formData);
        const allHostels = await hostelService.getAllHostels();
        const hostelsList = Array.isArray(allHostels) ? allHostels : [];
        setHostels(filterHostelsByRole(hostelsList));
      }
      setIsFormModalOpen(false);
    } catch (err) {
      console.error('Error submitting hostel:', err);
      setFormError(err.response?.data?.message || err.message || 'Failed to save hostel');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setCurrentPage(1); // Reset to first page on filter change
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredHostels = useMemo(() => {
    return hostels.filter(hostel => {
      const searchMatch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hostel.location.toLowerCase().includes(searchTerm.toLowerCase());

      const locationMatch = filters.location === 'all' || hostel.location === filters.location;
      const genderMatch = filters.gender === 'all' || hostel.HostelGender?.toLowerCase() === filters.gender;
      const availabilityMatch = filters.availability === 'all' || hostel.availability.toString() === filters.availability;

      return searchMatch && locationMatch && genderMatch && availabilityMatch;
    });
  }, [hostels, searchTerm, filters]);

  const paginatedHostels = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHostels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredHostels, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredHostels.length / ITEMS_PER_PAGE);
  }, [filteredHostels]);

  const uniqueLocations = useMemo(() => [...new Set((hostels || []).map(h => h.location))], [hostels]);

  return (
    <div className="hostels-page-container">
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Hostel Management
          </Typography>
          {canCreateHostel && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddNew} 
              startIcon={<Plus size={16} />}
            >
              Add New Hostel
            </Button>
          )}
        </Box>

        {/* Info Cards */}
        <Box sx={{ mb: 3 }}>
          <HostelInfoCard loading={isLoading} hostels={hostels} rooms={rooms} />
        </Box>

        {/* Filters and Search Section */}
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
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
            <InputLabel>Location</InputLabel>
            <Select name="location" value={filters.location} onChange={handleFilterChange} label="Location">
              <MenuItem value="all">All Locations</MenuItem>
              {uniqueLocations.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: '180px' }}>
            <InputLabel>Gender</InputLabel>
            <Select name="gender" value={filters.gender} onChange={handleFilterChange} label="Gender">
              <MenuItem value="all">All Genders</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="mixed">Mixed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: '180px' }}>
            <InputLabel>Availability</InputLabel>
            <Select name="availability" value={filters.availability} onChange={handleFilterChange} label="Availability">
              <MenuItem value="all">All Availabilities</MenuItem>
              <MenuItem value="true">Available</MenuItem>
              <MenuItem value="false">Not Available</MenuItem>
            </Select>
          </FormControl>

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
              <List size={20} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {isLoading && <div className="loading-indicator">Loading hostels...</div>}
      
      {error && (
        <div className="error-message">
          <AlertTriangle /> {error}
        </div>
      )}

      {!isLoading && !error && filteredHostels.length === 0 && (
        <div className="no-results">
          No hostels found matching your criteria.
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="hostels-grid">
          {paginatedHostels.map(hostel => (
            <HostelCard key={hostel._id} hostel={hostel} onSelect={() => handleEdit(hostel)} />
          ))}
        </div>
      ) : (
        <HostelTable hostels={paginatedHostels} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalRecords={filteredHostels.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      <Dialog
        open={canCreateHostel && isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{selectedHostel ? 'Edit Hostel' : 'Add New Hostel'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <HostelForm
            hostel={selectedHostel}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogTitle>Delete Hostel</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the hostel "{hostelToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isContactAdminModalOpen} onClose={() => setIsContactAdminModalOpen(false)}>
        <DialogTitle sx={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle size={24} /> Delete Permission Denied
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <DialogContentText>
            As a manager, you don't have permission to delete hostels. Only administrators can perform deletion operations.
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
              To delete this hostel, please:
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

export default Hostels;