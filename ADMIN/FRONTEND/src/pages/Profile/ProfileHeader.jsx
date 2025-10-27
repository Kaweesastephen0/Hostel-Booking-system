import React from 'react';
import { Upload } from 'lucide-react';

const ProfileHeader = ({ user }) => {
  return (
    <div className="profile-header">
      <div className="profile-avatar-container">
        <img src={user.avatar} alt={user.name} className="profile-avatar" />
        <button className="avatar-upload-btn">
          <Upload size={16} />
        </button>
      </div>
      <div className="profile-header-info">
        <h1>{user.name}</h1>
        <span>{user.role}</span>
      </div>
    </div>
  );
};

export default ProfileHeader;