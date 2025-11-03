import React, { useState, useEffect } from 'react';
import * as hostelService from '../../../services/hostelService';
import './RoomForm.css';

const RoomForm = ({ room, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    hostel: '',
    roomNumber: '',
    roomType: 'single',
    roomGender: 'mixed',
    roomPrice: '',
    bookingPrice: '',
    roomDescription: '',
    maxOccupancy: 1,
    isAvailable: true,
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
        hostel: room.hostel?._id || '',
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        roomGender: room.roomGender,
        roomPrice: room.roomPrice,
        bookingPrice: room.bookingPrice,
        roomDescription: room.roomDescription,
        maxOccupancy: room.maxOccupancy,
        isAvailable: room.isAvailable,
      });
    } else {
      // Reset form for new entry
      setFormData({
        hostel: '',
        roomNumber: '',
        roomType: 'single',
        roomGender: 'mixed',
        roomPrice: '',
        bookingPrice: '',
        roomDescription: '',
        maxOccupancy: 1,
        isAvailable: true,
      });
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
        <label htmlFor="roomType">Room Type</label>
        <select id="roomType" name="roomType" value={formData.roomType} onChange={handleChange} required>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="shared">Shared</option>
          <option value="suite">Suite</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="roomGender">Room Gender</label>
        <select id="roomGender" name="roomGender" value={formData.roomGender} onChange={handleChange} required>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="roomPrice">Room Price (UGX)</label>
        <input type="number" id="roomPrice" name="roomPrice" value={formData.roomPrice} onChange={handleChange} required min="0" />
      </div>
      <div className="form-group">
        <label htmlFor="bookingPrice">Booking Price (UGX)</label>
        <input type="number" id="bookingPrice" name="bookingPrice" value={formData.bookingPrice} onChange={handleChange} required min="0" />
      </div>
      <div className="form-group">
        <label htmlFor="roomDescription">Room Description</label>
        <textarea id="roomDescription" name="roomDescription" value={formData.roomDescription} onChange={handleChange} maxLength="1000" />
      </div>
      <div className="form-group">
        <label htmlFor="maxOccupancy">Max Occupancy</label>
        <input type="number" id="maxOccupancy" name="maxOccupancy" value={formData.maxOccupancy} onChange={handleChange} required min="1" />
      </div>
      <div className="form-group">
        <label htmlFor="isAvailable">Is Available</label>
        <input type="checkbox" id="isAvailable" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{room ? 'Update Room' : 'Create Room'}</button>
      </div>
    </form>
  );
};

export default RoomForm;