import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, BedDouble, Tag, DollarSign } from 'lucide-react';

import Header from '../../components/header/Header';
import RoomTable from './RoomTable';
import RoomForm from './RoomForm';
import Modal from '../../components/modal/Modal';
import InfoCard from '../../components/cards/InfoCard';
import * as roomService from '../../services/roomService';
import * as hostelService from '../../services/hostelService';
import ConfirmationModal from '../Profile/ConfirmationModal';
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
    setIsFormModalOpen(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
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
    try {
      if (selectedRoom) {
        const updatedRoom = await roomService.updateRoom(selectedRoom._id, formData);
        setRooms(prev => prev.map(r => r._id === selectedRoom._id ? updatedRoom : r));
      } else {
        const newRoom = await roomService.createRoom(formData);
        setRooms(prev => [newRoom, ...prev]);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      setError(err.message); // You might want to show this error on the form instead
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

  const headerCenterContent = (
    <div className="rooms-filter-bar">
      <div className="search-input-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by room number or hostel..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>
      <div className="filter-controls">
        <Filter size={16} />
        <select name="hostelId" value={filters.hostelId} onChange={handleFilterChange}>
          <option value="all">All Hostels</option>
          {uniqueHostelsForFilter.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
        </select>
        <select name="roomType" value={filters.roomType} onChange={handleFilterChange}>
          <option value="all">All Types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="shared">Shared</option> {/* Corrected from triple */}
          <option value="suite">Suite</option>   {/* Corrected from quad */}
        </select>
      </div>
    </div>
  );

  return (
    <div className="rooms-page-container">
      <Header title="Room Management" subtitle="Manage all rooms across hostels" centerContent={headerCenterContent}>
        <button className="btn btn-primary" onClick={handleAddNew}><Plus size={16} /> Add New Room</button>
      </Header>

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

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedRoom ? 'Edit Room' : 'Add New Room'}
      >
        <RoomForm
          room={selectedRoom}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Room"
        message={`Are you sure you want to delete room "${roomToDelete?.roomNumber}" from "${roomToDelete?.hostel?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete"
      />
    </div>
  );
};

export default RoomsPage;