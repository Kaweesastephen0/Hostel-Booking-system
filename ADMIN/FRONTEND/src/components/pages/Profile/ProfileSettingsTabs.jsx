import React, { useState } from 'react';
import { KeyRound, Trash2, User, Lock, AlertTriangle } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
// Internalized components for password strength and confirmation modal
const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 5);
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  return (
    <div className="password-strength-meter">
      <div className="strength-bar-container">
        <div className={`strength-bar strength-level-${strength}`}></div>
      </div>
      {password && (
        <span className={`strength-label strength-label-${strength}`}>
          {strengthLabels[strength]}
        </span>
      )}
    </div>
  );
};

const ProfileSettingsTabs = ({
  user,
  password,
  isEditing,
  onUserChange,
  onPasswordChange,
  onUpdateProfile,
  onChangePassword,
  onDeleteAccount,
  setIsEditing
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = () => setIsModalOpen(true);
  const handleConfirmDelete = () => {
    onDeleteAccount();
    setIsModalOpen(false);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'security', label: 'Password & Security', icon: <Lock size={18} /> },
    { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle size={18} /> },
  ];

  return (
    <div className="profile-settings-card">
      <div className="settings-tabs-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-tabs-content">
        {activeTab === 'personal' && (
          <div className="tab-pane">
            <h2 className="profile-section-title">Personal Information</h2>
            <form onSubmit={onUpdateProfile}>
              <div className="form-grid">
                <div className="form-group"><label htmlFor="fullName">Full Name</label><input type="text" id="fullName" name="fullName" value={user.fullName} onChange={onUserChange} disabled={!isEditing} required /></div>
                <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" name="email" value={user.email} onChange={onUserChange} disabled={!isEditing} required /></div>
                <div className="form-group"><label htmlFor="phone">Phone Number</label><input type="tel" id="phone" name="phone" value={user.phone} onChange={onUserChange} disabled={!isEditing} /></div>
                <div className="form-group"><label htmlFor="gender">Gender</label><select id="gender" name="gender" value={user.gender} onChange={onUserChange} disabled={!isEditing} required><option value="Male">Male</option><option value="Female">Female</option></select></div>
                <div className="form-group"><label htmlFor="dob">Date of Birth</label><input type="date" id="dob" name="dob" value={user.dob} onChange={onUserChange} disabled={!isEditing} /></div>
                <div className="form-group"><label htmlFor="address">Address</label><input type="text" id="address" name="address" value={user.address} onChange={onUserChange} disabled={!isEditing} /></div>
                <div className="form-group form-group-full"><label htmlFor="nationalId">National ID / Passport No.</label><input type="text" id="nationalId" name="nationalId" value={user.nationalId} onChange={onUserChange} disabled={!isEditing} /></div>
              </div>
              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  </>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="tab-pane">
            <h2 className="profile-section-title">Password & Security</h2>
            <form onSubmit={onChangePassword}>
              <div className="form-grid">
                <div className="form-group"><label htmlFor="currentPassword">Current Password</label><input type="password" id="currentPassword" name="currentPassword" value={password.currentPassword} onChange={onPasswordChange} required /></div>
                <div className="form-group"><label htmlFor="newPassword">New Password</label><input type="password" id="newPassword" name="newPassword" value={password.newPassword} onChange={onPasswordChange} minLength="8" required /><PasswordStrengthMeter password={password.newPassword} /></div>
                <div className="form-group"><label htmlFor="confirmNewPassword">Confirm New Password</label><input type="password" id="confirmNewPassword" name="confirmNewPassword" value={password.confirmNewPassword} onChange={onPasswordChange} minLength="8" required /></div>
              </div>
              <div className="profile-actions"><button type="submit" className="btn btn-primary"><KeyRound size={16} /> Change Password</button></div>
            </form>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="tab-pane">
            <h2 className="profile-section-title">Danger Zone</h2>
            <div className="danger-zone">
              <div className="danger-zone-item">
                <h4>Deactivate Account</h4>
                <p>Deactivating your account will suspend it until you log back in. Your data will not be deleted.</p>
                <button className="btn btn-danger" onClick={handleDeleteClick}><Trash2 size={16} /> Deactivate Account</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Deactivate Account"
        message="Are you sure you want to deactivate your account? This action can be reversed by logging in again."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
        confirmText="Deactivate"
      />
    </div>
  );
};

export default ProfileSettingsTabs;