import React from 'react';
import { User, Mail, Phone, Cake, MapPin, Upload, Edit, X } from 'lucide-react';

// Internalized components from the original implementation

const AvatarUploader = ({ currentAvatar, onFileChange }) => (
  <div className="avatar-uploader">
    <div className="avatar-preview-container" onClick={() => document.getElementById('avatar-input-file')?.click()}>
      <img src={currentAvatar || 'https://via.placeholder.com/150'} alt="Profile Avatar" className="avatar-preview" />
      <button type="button" className="upload-overlay" onClick={() => document.getElementById('avatar-input-file')?.click()}>
        <Upload size={24} />
        <span>Change</span>
      </button>
    </div>
  </div>
  
);

const RoleBadge = ({ role }) => {
  const getRoleClass = (roleName) => {
    if (!roleName) return 'role-default';
    const lowerRole = roleName.toLowerCase();
    if (lowerRole.includes('admin')) return 'role-admin';
    if (lowerRole.includes('manager')) return 'role-manager';
    if (lowerRole.includes('student')) return 'role-student';
    return 'role-default';
  };

  return (
    <span className={`role-badge ${getRoleClass(role)}`}>{role}</span>
  );
};

const StatItem = ({ label, value, icon }) => (
  <div className="stat-item">
    {icon && <div className="stat-icon">{icon}</div>}
    <div className="stat-content">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

const ProfileSectionCard = ({ title, children }) => (
  <div className="profile-section-card">
    <h2 className="profile-section-title">{title}</h2>
    <div className="profile-section-content">
      {children}
    </div>
  </div>
);


const ProfileInfoCard = ({ user, onFileChange, isEditing, onUserChange, onUpdateProfile, setIsEditing }) => {
  return (
    <>
      <div className="profile-card profile-overview-card">
        <AvatarUploader currentAvatar={user.avatar} onFileChange={onFileChange} />
        <input type="file" id="avatar-input-file" onChange={onFileChange} accept="image/*" style={{ display: 'none' }} />
        <h3>{user.fullName}</h3>
        <RoleBadge role={user.role} />
      </div>

      <div className="profile-card">
        <div className="profile-section-header">
          <h2 className="profile-section-title">Account Information</h2>
          {!isEditing ? (
            <button className="btn btn-icon" onClick={() => setIsEditing(true)}>
              <Edit size={16} />
            </button>
          ) : (
            <button className="btn btn-icon" onClick={() => setIsEditing(false)}>
              <X size={16} />
            </button>
          )}
        </div>
        <form onSubmit={onUpdateProfile}>
          <div className="form-group">
            <label htmlFor="fullName"><User size={16} /> Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={user.fullName}
              onChange={onUserChange}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email"><Mail size={16} /> Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={onUserChange}
              disabled={!isEditing}
              required
            />
          </div>
          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ProfileInfoCard;