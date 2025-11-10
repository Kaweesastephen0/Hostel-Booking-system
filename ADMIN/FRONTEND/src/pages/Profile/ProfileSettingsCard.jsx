import React, { useState } from 'react';
import { Key, Shield, Eye, EyeOff, AlertTriangle, User, Calendar } from 'lucide-react';

const ProfileSettingsCard = ({
  user,
  password,
  isEditing,
  isChangingPassword,
  onPasswordChange,
  onChangePassword,
  onDeleteAccount,
}) => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const passwordsMatch = password.newPassword && password.confirmNewPassword && password.newPassword === password.confirmNewPassword;
  const passwordsEmpty = !password.newPassword && !password.confirmNewPassword;
  const newPasswordError = password.newPassword && password.newPassword.length < 6;
  const confirmPasswordError = !passwordsEmpty && !passwordsMatch;

  return (
    <div className="profile-settings-container">
      <div className="settings-card password-card">
        <div className="settings-header">
          <div className="settings-title">
            <Key size={24} className="settings-icon" />
            <div>
              <h3>Security</h3>
              <p>Change your password regularly to keep your account secure</p>
            </div>
          </div>
        </div>

        <div className="settings-body">
          <form onSubmit={onChangePassword} className="password-form">
            <div className={`form-group password-group${isChangingPassword ? ' disabled' : ''}`}>
              <label htmlFor="currentPassword">
                <Shield size={16} />
                Current Password
              </label>
              <div className={`password-input-wrapper${isChangingPassword ? ' disabled' : ''}`}>
                <input
                  id="currentPassword"
                  type={showPassword.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={password.currentPassword}
                  onChange={onPasswordChange}
                  className="form-input"
                  placeholder="Enter your current password"
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('current')}
                  tabIndex="-1"
                >
                  {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={`form-group password-group${newPasswordError ? ' error' : ''}`}>
              <label htmlFor="newPassword">
                <Shield size={16} />
                New Password
              </label>
              <div className={`password-input-wrapper${isChangingPassword ? ' disabled' : ''}`}>
                <input
                  id="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  value={password.newPassword}
                  onChange={onPasswordChange}
                  className="form-input"
                  placeholder="Enter a new password (min. 6 characters)"
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('new')}
                  tabIndex="-1"
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.newPassword && password.newPassword.length < 6 && (
                <span className="form-hint error">Password must be at least 6 characters</span>
              )}
            </div>

            <div className={`form-group password-group${confirmPasswordError ? ' error' : ''}${passwordsMatch ? ' success' : ''}`}>
              <label htmlFor="confirmNewPassword">
                <Shield size={16} />
                Confirm Password
              </label>
              <div className={`password-input-wrapper${isChangingPassword ? ' disabled' : ''}`}>
                <input
                  id="confirmNewPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmNewPassword"
                  value={password.confirmNewPassword}
                  onChange={onPasswordChange}
                  className="form-input"
                  placeholder="Re-enter your new password"
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                  tabIndex="-1"
                >
                  {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!passwordsEmpty && !passwordsMatch && (
                <span className="form-hint error">Passwords do not match</span>
              )}
              {passwordsMatch && (
                <span className="form-hint success">Passwords match ✓</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      <div className="settings-card account-info-card">
        <div className="settings-header">
          <div className="settings-title">
            <Shield size={24} className="settings-icon" />
            <div>
              <h3>Account Information</h3>
              <p>View your account details</p>
            </div>
          </div>
        </div>

        <div className="settings-body">
          <div className="account-info">
            <div className="info-row">
              <span className="info-label"><User size={16} /> Account Type</span>
              <span className="info-value">
                <span className={`badge badge-${user.role}`}>
                  {user.role.toUpperCase()}
                </span>
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">
                <Calendar size={16} />
                Account Created
              </span>
              <span className="info-value">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {user.role === 'manager' && (
        <div className="settings-card danger-zone-card">
          <div className="settings-header danger">
            <div className="settings-title">
              <AlertTriangle size={24} className="settings-icon danger" />
              <div>
                <h3>Danger Zone</h3>
                <p>Irreversible actions</p>
              </div>
            </div>
          </div>
          <div className="settings-body danger">
            <p className="danger-description">
              Contact the admin if you need to delete your account. This action cannot be undone.
            </p>
            <button
              type="button"
              className="btn btn-danger btn-full"
              disabled
            >
              Delete Account (Contact Admin)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettingsCard;
