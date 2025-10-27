import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutGrid, List, Search, Filter, Building, BedDouble, CheckCircle, AlertTriangle } from 'lucide-react';

import Header from '../../components/header/Header';
import HostelTable from '../../components/hostels/HostelTable';
import HostelCard from '../../components/hostels/HostelCard';
import HostelForm from '../../components/hostels/HostelForm';
import Modal from '../../components/modal/Modal';
import ConfirmationModal from '../Profile/ConfirmationModal'; 
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
    setIsFormModalOpen(true);
  };

  const handleEdit = (hostel) => {
    setSelectedHostel(hostel);
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
    try {
      if (selectedHostel) {
        const updatedHostel = await hostelService.updateHostel(selectedHostel._id, formData);
        setHostels(prev => prev.map(h => (h._id === selectedHostel._id ? updatedHostel : h)));
      } else {
        const newHostel = await hostelService.createHostel(formData);
        setHostels(prev => [newHostel, ...prev]);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      setError(err.message);
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

  const headerCenterContent = (
    <div className="hostels-filter-bar">
      <div className="search-input-container">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search by name or location..." 
          value={searchTerm} 
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }} 
        />
      </div>
      <div className="filter-controls">
        <Filter size={16} />
        <select name="location" value={filters.location} onChange={handleFilterChange}>
          <option value="all">All Locations</option>
          {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        <select name="gender" value={filters.gender} onChange={handleFilterChange}>
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="mixed">Mixed</option>
        </select>
        <select name="availability" value={filters.availability} onChange={handleFilterChange}>
          <option value="all">All Availabilities</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="hostels-page-container">
      <Header title="Hostel Management" subtitle="Manage all hostels in the system" centerContent={headerCenterContent}>
        <div className="view-toggle">
          <button onClick={() => setViewMode('grid')} className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}><LayoutGrid size={18} /></button>
          <button onClick={() => setViewMode('table')} className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}><List size={18} /></button>
        </div>
        <button className="btn btn-primary" onClick={handleAddNew}><Plus size={16} /> Add New Hostel</button>
      </Header>

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

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedHostel ? 'Edit Hostel' : 'Add New Hostel'}
      >
        <HostelForm
          hostel={selectedHostel}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Hostel"
        message={`Are you sure you want to delete the hostel "${hostelToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete"
      />
    </div>
  );
};

export default Hostels;