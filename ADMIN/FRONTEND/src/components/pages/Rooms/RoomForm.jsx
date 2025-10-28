import React, { useState, useEffect } from 'react';
import * as hostelService from '../../services/hostelService';
import './RoomForm.css';

const RoomForm = ({ room, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    price: '',
    hostel: '', // This will be the hostel's ID
  });
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const data = await hostelService.getAllHostels();
        setHostels(data);
      } catch (error) {
        console.error("Failed to fetch hostels for form", error);
      }
    };
    fetchHostels();

    if (room) {
      setFormData({
        roomNumber: room.roomNumber,
        price: room.price || '',
        hostel: room.hostel?._id || '',
      });
    } else {
      // Reset form for new entry
      setFormData({ roomNumber: '', price: '', hostel: '' });
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="room-form">
      <div className="form-group">
        <label htmlFor="hostel">Hostel</label>
        <select id="hostel" name="hostel" value={formData.hostel} onChange={handleChange} required>
          <option value="">Select a Hostel</option>
          {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="roomNumber">Room Number</label>
        <input type="text" id="roomNumber" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price (UGX)</label>
        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{room ? 'Update Room' : 'Create Room'}</button>
      </div>
    </form>
  );
};

export default RoomForm;