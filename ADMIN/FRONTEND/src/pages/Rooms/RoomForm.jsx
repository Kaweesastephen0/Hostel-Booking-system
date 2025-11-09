import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import * as hostelService from '../../services/hostelService';
import * as roomService from '../../services/roomService';
import './RoomForm.css';

const RoomForm = ({ room, onSubmit, onCancel }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const initialFormState = {
    hostelId: '',
    roomNumber: '',
    roomType: 'single',
    roomGender: 'mixed',
    roomPrice: '',
    bookingPrice: '',
    roomDescription: '',
    maxOccupancy: 1,
    roomImages: [{ url: '', isPrimary: true }]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [hostels, setHostels] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await hostelService.getAllHostels();
        setHostels(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Failed to fetch hostels for form', error);
        setSnackbar({
          open: true,
          message: 'Failed to load hostels',
          severity: 'error'
        });
      }
    };
    fetchHostels();

    if (room) {
      const existingImages = Array.isArray(room.roomImages) && room.roomImages.length > 0
        ? room.roomImages.map((img, index) => ({
            url: img.url,
            isPrimary: index === 0 ? true : Boolean(img.isPrimary)
          }))
        : [{ url: room.primaryRoomImage || '', isPrimary: true }];

      setFormData({
        hostelId: room.hostelId?._id || room.hostelId || '',
        roomNumber: room.roomNumber || '',
        roomType: room.roomType || 'single',
        roomGender: room.roomGender || 'mixed',
        roomPrice: room.roomPrice || '',
        bookingPrice: room.bookingPrice || '',
        roomDescription: room.roomDescription || '',
        maxOccupancy: room.maxOccupancy || 1,
        roomImages: existingImages
      });
    } else {
      setFormData(initialFormState);
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePrimaryImageChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      roomImages: [{ url: value, isPrimary: true }]
    }));
    if (errors.roomImages) {
      setErrors((prev) => ({ ...prev, roomImages: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.hostelId) newErrors.hostelId = 'Hostel is required';
    if (!formData.roomNumber?.trim()) newErrors.roomNumber = 'Room number is required';
    if (!formData.roomType) newErrors.roomType = 'Room type is required';
    if (!formData.roomGender) newErrors.roomGender = 'Room gender is required';
    if (!formData.roomPrice || formData.roomPrice <= 0) newErrors.roomPrice = 'Valid room price is required';
    if (!formData.bookingPrice || formData.bookingPrice <= 0) newErrors.bookingPrice = 'Valid booking price is required';
    if (!formData.roomDescription?.trim()) newErrors.roomDescription = 'Room description is required';
    if (!formData.maxOccupancy || formData.maxOccupancy < 1) newErrors.maxOccupancy = 'Maximum occupancy must be at least 1';
    if (!formData.roomImages[0]?.url?.trim()) newErrors.roomImages = 'Image URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix the errors in the form',
        severity: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const roomImages = formData.roomImages
        .filter((img) => img?.url?.trim())
        .map((img, index) => ({
          url: img.url.trim(),
          isPrimary: index === 0 ? true : Boolean(img.isPrimary)
        }));

      const roomData = {
        hostelId: formData.hostelId,
        roomNumber: formData.roomNumber.trim(),
        roomType: formData.roomType,
        roomGender: formData.roomGender,
        roomPrice: Number(formData.roomPrice),
        bookingPrice: Number(formData.bookingPrice),
        roomDescription: formData.roomDescription.trim(),
        maxOccupancy: Number(formData.maxOccupancy),
        roomImages
      };

      let response;
      if (room) {
        response = await roomService.updateRoom(room._id, roomData);
      } else {
        response = await roomService.createRoom(roomData);
      }

      setSnackbar({
        open: true,
        message: room ? 'Room updated successfully!' : 'Room created successfully!',
        severity: 'success'
      });

      if (onSubmit) onSubmit(response);
      
    } catch (error) {
      console.error('Error submitting room:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save room. Please try again.';
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="room-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="hostelId">Hostel *</label>
          <select 
            id="hostelId" 
            name="hostelId" 
            value={formData.hostelId} 
            onChange={handleChange}
            className={errors.hostelId ? 'error' : ''}
          >
            <option value="">Select a hostel</option>
            {hostels.map(h => (
              <option key={h._id} value={h._id}>{h.name}</option>
            ))}
          </select>
          {errors.hostelId && <div className="error-message">{errors.hostelId}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="roomNumber">Room Number *</label>
          <input 
            id="roomNumber" 
            name="roomNumber" 
            value={formData.roomNumber} 
            onChange={handleChange}
            className={errors.roomNumber ? 'error' : ''}
          />
          {errors.roomNumber && <div className="error-message">{errors.roomNumber}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="roomType">Room Type *</label>
          <select 
            id="roomType" 
            name="roomType" 
            value={formData.roomType} 
            onChange={handleChange}
            className={errors.roomType ? 'error' : ''}
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="shared">Shared</option>
          </select>
          {errors.roomType && <div className="error-message">{errors.roomType}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="roomGender">Room Gender *</label>
          <select 
            id="roomGender" 
            name="roomGender" 
            value={formData.roomGender} 
            onChange={handleChange}
            className={errors.roomGender ? 'error' : ''}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="mixed">Mixed</option>
          </select>
          {errors.roomGender && <div className="error-message">{errors.roomGender}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="roomPrice">Room Price (UGX) *</label>
          <input 
            id="roomPrice" 
            name="roomPrice" 
            type="number" 
            min="0" 
            step="0.01"
            value={formData.roomPrice} 
            onChange={handleChange}
            className={errors.roomPrice ? 'error' : ''}
          />
          {errors.roomPrice && <div className="error-message">{errors.roomPrice}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="bookingPrice">Booking Price (UGX) *</label>
          <input 
            id="bookingPrice" 
            name="bookingPrice" 
            type="number" 
            min="0" 
            step="0.01"
            value={formData.bookingPrice} 
            onChange={handleChange}
            className={errors.bookingPrice ? 'error' : ''}
          />
          {errors.bookingPrice && <div className="error-message">{errors.bookingPrice}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="maxOccupancy">Max Occupancy *</label>
          <input 
            id="maxOccupancy" 
            name="maxOccupancy" 
            type="number" 
            min="1" 
            value={formData.maxOccupancy} 
            onChange={handleChange}
            className={errors.maxOccupancy ? 'error' : ''}
          />
          {errors.maxOccupancy && <div className="error-message">{errors.maxOccupancy}</div>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="roomDescription">Description *</label>
        <textarea
          id="roomDescription"
          name="roomDescription"
          value={formData.roomDescription}
          onChange={handleChange}
          rows={4}
          maxLength="200"
          className={errors.roomDescription ? 'error' : ''}
          placeholder="Describe the room features, amenities, etc."
        />
        <div className="char-count">{formData.roomDescription.length}/200</div>
        {errors.roomDescription && <div className="error-message">{errors.roomDescription}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="roomImage">Primary Image URL *</label>
        <input
          id="roomImage"
          name="roomImage"
          type="text"
          value={formData.roomImages[0]?.url || ''}
          onChange={handlePrimaryImageChange}
          className={errors.roomImages ? 'error' : ''}
          placeholder="https://example.com/image.png"
        />
        {errors.roomImages && <div className="error-message">{errors.roomImages}</div>}
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (room ? 'Update Room' : 'Create Room')}
        </button>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default RoomForm;