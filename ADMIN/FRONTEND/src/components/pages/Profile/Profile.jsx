import React, { useState, useEffect } from "react";
import ProfileInfoCard from "./ProfileInfoCard";
import ProfileSettingsCard from "./ProfileSettingsCard";

import "./ProfileLayout.css";
import "./Profile.css";

const ProfilePage = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    address: '',
    nationalId: '',
    role: '',
    dateJoined: null,
    lastLogin: null,
    status: '',
    avatar: ''
  });

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching user data
  useEffect(() => {
    setIsLoading(true);
    // TODO: Replace with actual API call to fetch user data
    setTimeout(() => {
      setUser({
        fullName: 'Mulindwa Raymond',
        email: 'mulindwa.raymond@example.com',
        phone: '+256 772 123456',
        gender: 'Male',
        dob: '1990-05-15',
        address: 'Kampala, Central, Uganda',
        nationalId: 'CM900123456XXX',
        role: 'Super Admin',
        dateJoined: new Date('2023-01-15T10:00:00Z').toISOString(),
        lastLogin: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: 'Active',
        avatar: 'https://i.pravatar.cc/150?u=mulindwa'
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prevPassword => ({ ...prevPassword, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real app, you'd upload this file and update the user state with the new URL
        setUser(prevUser => ({ ...prevUser, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // TODO: Implement API call to PUT /api/users/:id
    console.log('Updating profile with:', user);
    setIsEditing(false);
    alert('Profile updated successfully!'); // Replace with toast notification
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmNewPassword) {
      alert("New passwords don't match!"); // Replace with toast notification
      return;
    }
    // TODO: Implement API call to PATCH /api/users/:id/password
    console.log('Changing password...');
    alert('Password changed successfully!'); // Replace with toast notification
    setPassword({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const handleDeleteAccount = () => {
    // TODO: Implement API call to DELETE /api/users/:id
    console.log('Deleting account...');
    alert('Account deleted successfully.'); // Replace with toast notification
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
