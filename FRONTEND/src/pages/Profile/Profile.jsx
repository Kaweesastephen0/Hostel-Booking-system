import React, { useState, useEffect } from "react";
import { Loader2 } from 'lucide-react';
import ProfileInfoCard from "../../components/profile/ProfileInfoCard";
import ProfileSettingsCard from "../../components/profile/ProfileSettingsCard";
import userService from "../../services/userService";
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
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Profile update error:', err);
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
    } catch (err) {
      setError(err.message || 'Failed to change password');
      console.error('Password change error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      alert('Account deleted successfully.'); // Replace with toast notification
    } catch (err) {
      setError(err.message || 'Failed to delete account');
      console.error('Account deletion error:', err);
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
    } catch (err) {
      setError(err.message || 'Failed to update avatar');
      console.error('Avatar update error:', err);
    }
  };

  if (isLoading) {
    return <div className="profile-page-container">Loading profile...</div>;
  }

  return (
    <div className="profile-page-container">
      <div className="profile-grid">
        <div className="profile-grid__left">
          <ProfileInfoCard user={user} onFileChange={handleFileChange} isEditing={isEditing} onUserChange={handleUserChange} />
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
    </div>
  );
};

export default ProfilePage;
