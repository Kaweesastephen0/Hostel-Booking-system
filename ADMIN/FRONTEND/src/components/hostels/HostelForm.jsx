import React, { useState, useEffect } from 'react';
import './HostelForm.css';
import { Building, MapPin, Milestone, Users, Image as ImageIcon, Info, Tag } from 'lucide-react';

const HostelForm = ({ hostel, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    distance: '',
    description: '',
    amenities: '',
    HostelGender: 'mixed',
    image: '',
  });

  useEffect(() => {
    if (hostel) {
      setFormData({
        name: hostel.name || '',
        location: hostel.location || '',
        distance: hostel.distance || '',
        description: hostel.description || '',
        amenities: Array.isArray(hostel.amenities) ? hostel.amenities.join(', ') : '',
        HostelGender: hostel.HostelGender || 'mixed',
        image: hostel.image || '',
      });
    }
  }, [hostel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean),
    };
    onSubmit(finalData);
  };

  return (
    <form className="hostel-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name"><Building size={14} /> Hostel Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Nana Hostel" required />
        </div>
        <div className="form-group">
          <label htmlFor="location"><MapPin size={14} /> Location / City</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Wandegeya" required />
        </div>
        <div className="form-group">
          <label htmlFor="distance"><Milestone size={14} /> Distance from Campus</label>
          <input type="text" id="distance" name="distance" value={formData.distance} onChange={handleChange} placeholder="e.g., 0.5 km" required />
        </div>
        <div className="form-group">
          <label htmlFor="HostelGender"><Users size={14} /> Hostel Gender</label>
          <select id="HostelGender" name="HostelGender" value={formData.HostelGender} onChange={handleChange} required>
            <option value="mixed">Mixed</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="form-group form-group-full">
          <label htmlFor="description"><Info size={14} /> Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
        </div>
        <div className="form-group form-group-full">
          <label htmlFor="image"><ImageIcon size={14} /> Image URL</label>
          <input type="url" id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" required />
        </div>
        <div className="form-group form-group-full">
          <label htmlFor="amenities"><Tag size={14} /> Amenities (comma-separated)</label>
          <input type="text" id="amenities" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="e.g., WiFi, Security, Reading Area" />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary-form">
          {hostel ? 'Update Hostel' : 'Add Hostel'}
        </button>
      </div>
    </form>
  );
};

export default HostelForm;