import React from 'react';
import { User, Mail, Phone, Cake, MapPin, CheckCircle, Upload } from 'lucide-react';

// Internalized components from the original implementation

const AvatarUploader = ({ currentAvatar }) => (
  <div className="avatar-uploader">
    <div className="avatar-preview-container">
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


const ProfileInfoCard = ({ user, onFileChange, isEditing, onUserChange }) => {
  return (
    <>
      <div className="profile-card profile-overview-card">
        <AvatarUploader currentAvatar={user.avatar} />
        <input type="file" id="avatar-input-file" onChange={onFileChange} accept="image/*" style={{ display: 'none' }} />
        <h3>{user.fullName}</h3>
        <RoleBadge role={user.role} />
        <div className="info-item status-info">
          <strong>Status:</strong>
          <span className={`status-pill status-${user.status.toLowerCase()}`}>{user.status}</span>
        </div>
      </div>

      <div className="profile-card">
        <h2 className="profile-section-title">Account Information</h2>
        <div className="account-info">
          <div className="info-item"><User size={16} /><span>{user.fullName}</span></div>
          <div className="info-item"><Mail size={16} /><span>{user.email}</span></div>
          <div className="info-item"><Phone size={16} /><span>{user.phone}</span></div>
          <div className="info-item"><Cake size={16} /><span>{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</span></div>
          <div className="info-item"><MapPin size={16} /><span>{user.address}</span></div>
          <div className="info-item"><strong>Joined:</strong><span>{user.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'N/A'}</span></div>
          <div className="info-item"><strong>Last Login:</strong><span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</span></div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfoCard;