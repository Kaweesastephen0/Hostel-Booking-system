import React from 'react';
import { Camera } from 'lucide-react';

const ProfileInfoCard = ({ user, isEditing, onUserChange }) => {
  return (
    <div className="profile-info-card">
      <div className="profile-header">
        <h2>Profile Information</h2>
        <div className="profile-avatar">
          <div className="avatar-container">
            <img
              src={user.avatar || '/default-avatar.png'}
              alt="Profile"
              className="avatar-image"
            />
            {isEditing && (
              <label className="avatar-upload">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e)}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="profile-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={onUserChange}
            disabled={!isEditing}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={onUserChange}
            disabled={!isEditing}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            value={user.role}
            disabled
            className="form-input"
          />
        </div>

        {user.lastLogin && (
          <div className="form-group">
            <label>Last Login</label>
            <input
              type="text"
              value={new Date(user.lastLogin).toLocaleString()}
              disabled
              className="form-input"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfoCard;