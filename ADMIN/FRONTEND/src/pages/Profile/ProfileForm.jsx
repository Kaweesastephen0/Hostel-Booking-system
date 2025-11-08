import React from 'react';
import { User, Mail, Shield } from 'lucide-react';

const ProfileForm = ({ user, isEditing, onSubmit, onChange }) => {
  return (
    <form onSubmit={onSubmit} className="profile-form">
      <div className="form-group">
        <label>
          <User size={16} />
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={user.fullName}
          onChange={onChange}
          disabled={!isEditing}
          required
        />
      </div>

      <div className="form-group">
        <label>
          <Mail size={16} />
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={onChange}
          disabled={!isEditing}
          required
        />
      </div>

      <div className="form-group">
        <label>
          <Shield size={16} />
          Role
        </label>
        <input
          type="text"
          value={user.role}
          disabled
          className="text-gray-500"
        />
      </div>

      {isEditing && (
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onSubmit()}>
            Cancel
          </button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;