import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { capitalize } from '../../utils/stringUtils';
import './RoomTable.css';

const RoomTable = ({ rooms, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Hostel</th>
            <th>Type</th>
            <th>Gender</th>
            <th>Occupancy</th>
            <th>Price (UGX)</th>
            <th>Booking Price (UGX)</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room._id}>
              <td className="room-number">{room.roomNumber || 'N/A'}</td>
              <td>{room.hostel?.name || 'Unassigned'}</td>
              <td>{room.roomType ? capitalize(room.roomType) : 'N/A'}</td>
              <td>{room.roomGender ? capitalize(room.roomGender) : 'N/A'}</td>
              <td>{room.maxOccupancy || 0}</td>
              <td className="room-price">{room.roomPrice?.toLocaleString() || 0}</td>
              <td className="room-price">{room.bookingPrice?.toLocaleString() || 0}</td>
              <td>
                <span className={`status-badge status-${room.isAvailable ? 'available' : 'occupied'}`}>
                  {room.isAvailable ? 'Available' : 'Occupied'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => onEdit(room)} className="btn-icon">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => onDelete(room)} className="btn-icon btn-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomTable;