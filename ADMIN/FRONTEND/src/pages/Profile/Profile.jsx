import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Lock } from 'lucide-react';
import ProfileInfoCard from "../../components/profile/ProfileInfoCard";
import ProfileSettingsCard from './ProfileSettingsCard';
import userService from "../../services/userService";
import { Snackbar, Alert, Box, TextField, Button, Paper, Typography, Divider } from '@mui/material';
import "./Profile.css";

const ProfilePage = () => {
  const [user, setUser] = useState({
    id: '',
    fullName: '',
    email: '',
    role: '',
    isActive: true,
    lastLogin: null,
    createdAt: null
  });

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const passwordMismatch = useMemo(
    () =>
      Boolean(password.newPassword) &&
      Boolean(password.confirmNewPassword) &&
      password.newPassword !== password.confirmNewPassword,
    [password.newPassword, password.confirmNewPassword]
  );

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const { data } = await userService.getCurrentUser();
        setUser(data);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        console.error('Profile load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prevPassword => ({ ...prevPassword, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    try {
      await userService.updateProfile({
        id: user.id,
        fullName: user.fullName,
        email: user.email
      });
      setIsEditing(false);
      showSnackbar('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Profile update error:', err);
      showSnackbar(err.message || 'Failed to update profile', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmNewPassword) {
      setError("New passwords don't match!");
      return;
    }

    try {
      await userService.changePassword(password.currentPassword, password.newPassword);
      setPassword({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      showSnackbar('Password changed successfully.');
    } catch (err) {
      setError(err.message || 'Failed to change password');
      console.error('Password change error:', err);
      showSnackbar(err.message || 'Failed to change password', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      showSnackbar('Account deleted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to delete account');
      console.error('Account deletion error:', err);
      showSnackbar(err.message || 'Failed to delete account', 'error');
    }
  };

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('avatar', file);

      await userService.updateAvatar(formData);
      // Reload user data to get updated avatar
      const { data } = await userService.getCurrentUser();
      setUser(data);
      showSnackbar('Avatar updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update avatar');
      console.error('Avatar update error:', err);
      showSnackbar(err.message || 'Failed to update avatar', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return <div className="profile-page-container">Loading profile...</div>;
  }

  return (
    <div className="profile-page-container">
      <div className="profile-grid">
        <div className="profile-grid__left">
          <ProfileInfoCard user={user} onFileChange={handleFileChange} isEditing={isEditing} onUserChange={handleUserChange} onUpdateProfile={handleUpdateProfile} />
        </div>
        <div className="profile-grid__right">
          <ProfileSettingsCard
            user={user}
            password={password}
            isEditing={isEditing}
            onPasswordChange={handlePasswordChange}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
            onDeleteAccount={handleDeleteAccount}
            setIsEditing={setIsEditing}
          />
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProfilePage;

