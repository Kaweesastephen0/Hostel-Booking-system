import React, { useState, useEffect } from 'react';
import './HostelForm.css';
import { Building, MapPin, Milestone, Users, Image as ImageIcon, Info, Tag, Layers, CheckCircle } from 'lucide-react';

const HostelForm = ({ hostel, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    distance: '',
    description: '',
    amenities: '',
    HostelGender: 'mixed',
    category: 'standard',
    status: 'operational',
    images: [{ url: '', isPrimary: true }],
  });

  const [errors, setErrors] = useState({}); // ✅ Add error state

  useEffect(() => {
    if (hostel) {
      setFormData({
        name: hostel.name || '',
        location: hostel.location || '',
        distance: hostel.distance || '',
        description: hostel.description || '',
        amenities: Array.isArray(hostel.amenities) ? hostel.amenities.join(', ') : '',
        HostelGender: hostel.HostelGender || 'mixed',
        category: hostel.category || 'standard',
        status: hostel.status || 'operational',
        images: hostel.images && hostel.images.length > 0 
          ? hostel.images 
          : [{ url: '', isPrimary: true }]
      });
    }
  }, [hostel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      images: [{ url, isPrimary: true }]
    }));
    // Clear image error when user starts typing
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ✅ Custom validation instead of browser validation
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Hostel name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.distance.trim()) newErrors.distance = 'Distance is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.images[0]?.url?.trim()) newErrors.image = 'Image URL is required';
    
    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors if validation passes
    setErrors({});

    const status = formData.status.toLowerCase();
    const category = formData.category.toLowerCase();

    const finalData = {
      ...formData,
      status,
      category,
      availability: status === 'operational',
      amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean),
      images: formData.images.filter(img => img.url && img.url.trim() !== '')
    };
    
    console.log('Submitting data:', finalData);
    onSubmit(finalData);
  };

  return (
    <form className="hostel-form" onSubmit={handleSubmit} noValidate> {/* ✅ Add noValidate */}
      <div className="form-grid">
        {/* Hostel Name */}
        <div className="form-group">
          <label htmlFor="name"><Building size={14} /> Hostel Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="e.g., Nana Hostel" 
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location"><MapPin size={14} /> Location / City</label>
          <input 
            type="text" 
            id="location" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            placeholder="e.g., Wandegeya" 
            className={errors.location ? 'error' : ''}
          />
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>

        {/* Distance */}
        <div className="form-group">
          <label htmlFor="distance"><Milestone size={14} /> Distance from Campus</label>
          <input 
            type="text" 
            id="distance" 
            name="distance" 
            value={formData.distance} 
            onChange={handleChange} 
            placeholder="e.g., 0.5 km" 
            className={errors.distance ? 'error' : ''}
          />
          {errors.distance && <span className="error-message">{errors.distance}</span>}
        </div>

        {/* Hostel Gender */}
        <div className="form-group">
          <label htmlFor="HostelGender"><Users size={14} /> Hostel Gender</label>
          <select id="HostelGender" name="HostelGender" value={formData.HostelGender} onChange={handleChange}>
            <option value="mixed">Mixed</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category"><Layers size={14} /> Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'error' : ''}
          >
            <option value="budget">Budget</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="luxury">Luxury</option>
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="status"><CheckCircle size={14} /> Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={errors.status ? 'error' : ''}
          >
            <option value="operational">Operational</option>
            <option value="maintenance">Maintenance</option>
            <option value="closed">Closed</option>
          </select>
          {errors.status && <span className="error-message">{errors.status}</span>}
        </div>

        {/* Description */}
        <div className="form-group form-group-full">
          <label htmlFor="description"><Info size={14} /> Description</label>
          <textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="4"
            placeholder="Describe the hostel facilities, environment, etc."
          ></textarea>
        </div>
        
        {/* ✅ FIXED: Image URL Input - removed 'required' attribute */}
        <div className="form-group form-group-full">
          <label htmlFor="image"><ImageIcon size={14} /> Image URL</label>
          <input 
            type="url" 
            id="image" 
            name="image" 
            value={formData.images[0]?.url || ''} 
            onChange={handleImageChange} 
            placeholder="https://example.com/image.jpg" 
            className={errors.image ? 'error' : ''}
          />
          {errors.image && <span className="error-message">{errors.image}</span>}
          <small className="field-hint">Enter a valid image URL (jpg, png, etc.)</small>
        </div>
        
        {/* Amenities */}
        <div className="form-group form-group-full">
          <label htmlFor="amenities"><Tag size={14} /> Amenities (comma-separated)</label>
          <input 
            type="text" 
            id="amenities" 
            name="amenities" 
            value={formData.amenities} 
            onChange={handleChange} 
            placeholder="e.g., WiFi, Security, Reading Area" 
          />
          <small className="field-hint">Separate multiple amenities with commas</small>
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