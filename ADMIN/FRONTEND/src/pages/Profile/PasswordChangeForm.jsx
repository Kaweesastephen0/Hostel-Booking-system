import React from 'react';
import { Lock } from 'lucide-react';

const PasswordChangeForm = ({ password, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="password-form">
      <div className="form-group">
        <label>
          <Lock size={16} />
          Current Password
        </label>
        <input
          type="password"
          name="currentPassword"
          value={password.currentPassword}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label>
          <Lock size={16} />
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          value={password.newPassword}
          onChange={onChange}
          required
          minLength={6}
        />
      </div>

      <div className="form-group">
        <label>
          <Lock size={16} />
          Confirm New Password
        </label>
        <input
          type="password"
          name="confirmNewPassword"
          value={password.confirmNewPassword}
          onChange={onChange}
          required
          minLength={6}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Update Password
        </button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;