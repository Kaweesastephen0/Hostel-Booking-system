import React, { useState, useEffect } from 'react';
import * as hostelService from '../../services/hostelService';
import './RoomForm.css';

const RoomForm = ({ room, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    hostel: '',
    roomNumber: '',
    roomType: 'single',
    roomGender: 'male',
    roomPrice: '',
    bookingPrice: '',
    roomDescription: '',
    maxOccupancy: '',
    isAvailable: true
  });
  const [hostels, setHostels] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const data = await hostelService.getAllHostels();
        setHostels(data || []);
      } catch (error) {
        console.error('Failed to fetch hostels for form', error);
      }
    };
    fetchHostels();

    if (room) {
      setFormData({
        hostel: room.hostel?._id || room.hostel || '',
        roomNumber: room.roomNumber || '',
        roomType: room.roomType || 'single',
        roomGender: room.roomGender || 'male',
        roomPrice: room.roomPrice ?? '',
        bookingPrice: room.bookingPrice ?? '',
        roomDescription: room.roomDescription || '',
        maxOccupancy: room.maxOccupancy ?? '',
        isAvailable: room.isAvailable ?? true
      });
    } else {
      setFormData({
        hostel: '',
        roomNumber: '',
        roomType: 'single',
        roomGender: 'male',
        roomPrice: '',
        bookingPrice: '',
        roomDescription: '',
        maxOccupancy: '',
        isAvailable: true
      });
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.hostel) errs.hostel = 'Hostel is required';
    if (!formData.roomNumber) errs.roomNumber = 'Room number is required';
    if (!formData.roomPrice || Number(formData.roomPrice) < 0) errs.roomPrice = 'Valid room price is required';
    if (!formData.bookingPrice || Number(formData.bookingPrice) < 0) errs.bookingPrice = 'Valid booking price is required';
    if (!formData.maxOccupancy || Number(formData.maxOccupancy) < 1) errs.maxOccupancy = 'Enter max occupancy';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Coerce numeric values
    const payload = {
      hostelId: formData.hostel,
      roomNumber: String(formData.roomNumber),
      roomType: formData.roomType,
      roomGender: formData.roomGender,
      roomPrice: Number(formData.roomPrice),
      bookingPrice: Number(formData.bookingPrice),
      roomDescription: formData.roomDescription,
      maxOccupancy: Number(formData.maxOccupancy),
      isAvailable: Boolean(formData.isAvailable)
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="room-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="hostel">Hostel</label>
          <select id="hostel" name="hostel" value={formData.hostel} onChange={handleChange}>
            <option value="">Select a hostel</option>
            {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
          {errors.hostel && <div className="error-message">{errors.hostel}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="roomNumber">Room Number</label>
          <input id="roomNumber" name="roomNumber" value={formData.roomNumber} onChange={handleChange} />
          {errors.roomNumber && <div className="error-message">{errors.roomNumber}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="roomType">Room Type</label>
          <select id="roomType" name="roomType" value={formData.roomType} onChange={handleChange}>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="shared">Shared</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="roomGender">Room Gender</label>
          <select id="roomGender" name="roomGender" value={formData.roomGender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="roomPrice">Room Price</label>
          <input id="roomPrice" name="roomPrice" type="number" min="0" value={formData.roomPrice} onChange={handleChange} />
          {errors.roomPrice && <div className="error-message">{errors.roomPrice}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="bookingPrice">Booking Price</label>
          <input id="bookingPrice" name="bookingPrice" type="number" min="0" value={formData.bookingPrice} onChange={handleChange} />
          {errors.bookingPrice && <div className="error-message">{errors.bookingPrice}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="maxOccupancy">Max Occupancy</label>
          <input id="maxOccupancy" name="maxOccupancy" type="number" min="1" value={formData.maxOccupancy} onChange={handleChange} />
          {errors.maxOccupancy && <div className="error-message">{errors.maxOccupancy}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="isAvailable">
            <input id="isAvailable" name="isAvailable" type="checkbox" checked={formData.isAvailable} onChange={handleChange} />{' '}
            Available
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="roomDescription">Description</label>
        <textarea id="roomDescription" name="roomDescription" value={formData.roomDescription} onChange={handleChange} rows={4} />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{room ? 'Update Room' : 'Create Room'}</button>
      </div>
    </form>
  );
};

export default RoomForm;