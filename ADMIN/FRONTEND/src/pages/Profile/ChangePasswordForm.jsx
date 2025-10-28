import React, { useState } from 'react';

const ChangePasswordForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-group">
        <label htmlFor="currentPassword">Current Password</label>
        <input type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Update Password</button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;