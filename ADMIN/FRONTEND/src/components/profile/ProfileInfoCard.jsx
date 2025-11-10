import React from 'react';
import { Camera, CheckCircle2, User, Mail, Calendar, Clock } from 'lucide-react';

const ProfileInfoCard = ({ user, isEditing, onUserChange, onFileChange, onUpdateProfile, setIsEditing }) => {
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="profile-info-card">
      <div className="profile-avatar-section">
        <div className="avatar-container">
          {user.avatar ? (
            <img src={user.avatar} alt="Profile" className="avatar-image" />
          ) : (
            <div className="avatar-initials">
              {getInitials(user.fullName)}
            </div>
          )}
          {isEditing && (
            <label className="avatar-upload-btn" title="Change avatar">
              <Camera size={18} />
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>
        <div className="avatar-info">
          <h2>{user.fullName}</h2>
          <div className="status-indicator">
            <CheckCircle2 size={14} className="status-icon" />
            <span>Active Account</span>
          </div>
        </div>
      </div>

      <div className="profile-card-body">
        <div className="profile-divider"></div>

        <form className="profile-form">
          <div className="form-group">
            <label htmlFor="fullName">
              <User size={16} />
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={onUserChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={user.email}
              onChange={onUserChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="info-section info-grid">
            <div className="info-item">
              <span className="info-label">Role</span>
              <span className="info-value role-badge">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            </div>
            {user.createdAt && (
              <div className="info-item">
                <span className="info-label">
                  <Calendar size={14} />
                  Joined
                </span>
                <span className="info-value">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
            {user.lastLogin && (
              <div className="info-item">
                <span className="info-label">
                  <Clock size={14} />
                  Last Login
                </span>
                <span className="info-value">
                  {new Date(user.lastLogin).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        </form>

        <div className="form-actions">
          {!isEditing ? (
            <button onClick={onUpdateProfile} className="btn btn-primary btn-full">
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={onUpdateProfile} className="btn btn-primary">
                Save Changes
              </button>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoCard;