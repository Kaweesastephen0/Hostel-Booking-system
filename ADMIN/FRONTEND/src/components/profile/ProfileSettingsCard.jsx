import React from 'react';
import { Settings, Key, UserX } from 'lucide-react';

const ProfileSettingsCard = ({
  user,
  password,
  isEditing,
  onPasswordChange,
  onUpdateProfile,
  onChangePassword,
  onDeleteAccount,
  setIsEditing
}) => {
  return (
    <div className="profile-settings-card">
      <div className="settings-section">
        <h3>
          <Settings size={20} className="icon" />
          Profile Settings
        </h3>
        <button
          onClick={onUpdateProfile}
          className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="settings-section">
        <h3>
          <Key size={20} className="icon" />
          Change Password
        </h3>
        <form onSubmit={onChangePassword} className="password-form">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={password.currentPassword}
              onChange={onPasswordChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={password.newPassword}
              onChange={onPasswordChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={password.confirmNewPassword}
              onChange={onPasswordChange}
              className="form-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Change Password
          </button>
        </form>
      </div>

      {user.role === 'user' && (
        <div className="settings-section danger-zone">
          <h3>
            <UserX size={20} className="icon" />
            Danger Zone
          </h3>
          <button
            onClick={onDeleteAccount}
            className="btn btn-danger"
          >
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSettingsCard;