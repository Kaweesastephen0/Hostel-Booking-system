import React from 'react';
import { Edit, Trash2, Bed, Users } from 'lucide-react';
import { capitalize } from '../../utils/stringUtils';
import './RoomTable.css';

const RoomTable = ({ rooms, onEdit, onDelete }) => {
  // Helper function to get status based on availability
  const getRoomStatus = (room) => {
    if (room.status) {
      return room.status;
    }
    return room.isAvailable === false ? 'occupied' : 'available';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'available':
        return 'status-available';
      case 'occupied':
        return 'status-occupied';
      case 'maintenance':
        return 'status-maintenance';
      default:
        return 'status-unknown';
    }
  };

  return (
    <div className="table-container">
      <table className="rooms-table">
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Hostel</th>
            <th>Type</th>
            <th>Gender</th>
            <th>Max Occupancy</th>
            <th>Price (UGX)</th>
            <th>Booking Price (UGX)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room._id} className="room-row">
              <td className="room-number">
                <div className="room-number-cell">
                  {room.roomNumber || 'N/A'}
                </div>
              </td>
              <td className="hostel-name">
                {room.hostelId?.name || 'Unassigned Hostel'}
              </td>
              <td>
                <span className={`room-type-badge type-${room.roomType}`}>
                  {room.roomType ? capitalize(room.roomType) : 'N/A'}
                </span>
              </td>
              <td>
                <span className={`gender-badge gender-${room.roomGender}`}>
                  {room.roomGender ? capitalize(room.roomGender) : 'N/A'}
                </span>
              </td>
              <td className="occupancy-cell">
                <div className="occupancy-info">
                  <Users size={14} />
                  <span>{room.maxOccupancy || 1}</span>
                </div>
              </td>
              <td className="price-cell">
                <div className="price-info">
                  <span>{(room.roomPrice || 0).toLocaleString()}</span>
                </div>
              </td>
              <td className="price-cell">
                <div className="price-info">
                  <span>{(room.bookingPrice || 0).toLocaleString()}</span>
                </div>
              </td>
              <td>
                <span className={`status-badge ${getStatusClass(getRoomStatus(room))}`}>
                  {capitalize(getRoomStatus(room))}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    onClick={() => onEdit(room)} 
                    className="btn-icon btn-edit"
                    title="Edit room"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(room)} 
                    className="btn-icon btn-delete"
                    title="Delete room"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {rooms.length === 0 && (
        <div className="no-rooms-message">
          <Bed size={48} />
          <p>No rooms found</p>
        </div>
      )}
    </div>
  );
};

export default RoomTable;