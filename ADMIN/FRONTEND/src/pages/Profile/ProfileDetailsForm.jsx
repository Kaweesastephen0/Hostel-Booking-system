import React, { useState } from 'react';

const ProfileDetailsForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </div>
    </form>
  );
};

export default ProfileDetailsForm;