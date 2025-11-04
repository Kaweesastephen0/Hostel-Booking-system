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
} from '@mui/material';
import { Search } from '@mui/icons-material';

import HostelTable from '../../components/hostels/HostelTable';
import HostelCard from '../../components/hostels/HostelCard';
import HostelForm from '../../components/hostels/HostelForm';
import InfoCard from '../../components/cards/InfoCard';
import Pagination from '../../components/pagination.jsx/Pagination';
import * as hostelService from '../../services/hostelService';

import './Hostels.css';

const ITEMS_PER_PAGE = 9;

const Hostels = () => {
  const [hostels, setHostels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
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

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setIsLoading(true);
        const data = await hostelService.getAllHostels();
        setHostels(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHostels();
  }, []);

  const handleAddNew = () => {
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleteModalOpen(false);
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
        const newHostel = await hostelService.createHostel(formData);
        const data = await hostelService.getAllHostels();
        setHostels(data);
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

  const uniqueLocations = useMemo(() => [...new Set(hostels.map(h => h.location))], [hostels]);

  return (
    <div className="hostels-page-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Hostel Management
        </Typography>
        <Box>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newView) => newView && setViewMode(newView)}
            aria-label="view mode"
            size="small"
            sx={{ marginRight: 2 }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <LayoutGrid size={18} />
            </ToggleButton>
            <ToggleButton value="table" aria-label="table view">
              <List size={18} />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" color="primary" onClick={handleAddNew} startIcon={<Plus size={16} />}>
            Add New Hostel
          </Button>
        </Box>
      </Box>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }}
          sx={{ minWidth: 250 }}
        />
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Location</InputLabel>
          <Select name="location" value={filters.location} onChange={handleFilterChange} label="Location">
            <MenuItem value="all">All Locations</MenuItem>
            {uniqueLocations.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Gender</InputLabel>
          <Select name="gender" value={filters.gender} onChange={handleFilterChange} label="Gender">
            <MenuItem value="all">All Genders</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="mixed">Mixed</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Availability</InputLabel>
          <Select name="availability" value={filters.availability} onChange={handleFilterChange} label="Availability">
            <MenuItem value="all">All Availabilities</MenuItem>
            <MenuItem value="true">Available</MenuItem>
            <MenuItem value="false">Not Available</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <div className="hostels-summary-cards">
        <InfoCard title="Total Hostels" value={filteredHostels.length} icon={<Building />} />
        <InfoCard title="Total Rooms" value={filteredHostels.reduce((acc, h) => acc + (h.rooms?.length || 0), 0)} icon={<BedDouble />} />
        <InfoCard title="Available Hostels" value={filteredHostels.filter(h => h.availability).length} icon={<CheckCircle />} />
      </div>

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
        open={isFormModalOpen}
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
    </div>
  );
};

export default Hostels;