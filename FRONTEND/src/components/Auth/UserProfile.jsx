import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, LogOut, Hash, CreditCard, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './UserProfile.module.css';

function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState('account'); // 'account', 'personal', 'security'
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editData, setEditData] = useState({
    firstName: '',
    surname: '',
    userType: '',
    studentNumber: '',
    nin: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: []
  });

  const validatePasswordStrength = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate new password strength
    if (name === 'newPassword') {
      setPasswordValidation(validatePasswordStrength(value));
    }

    setError('');
    setSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');

    if (!token || !storedUserData) {
      navigate('/auth');
      return;
    }

    try {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setEditData({
        firstName: parsedData.firstName,
        surname: parsedData.surname,
        userType: parsedData.userType,
        studentNumber: parsedData.studentNumber || '',
        nin: parsedData.nin || ''
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/auth');
    }
  }, [navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');

    try {
      const response = await fetch('http://localhost:5001/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: editData.firstName,
          surname: editData.surname,
          userType: editData.userType,
          studentNumber: editData.userType === 'student' ? editData.studentNumber : undefined,
          nin: editData.userType === 'non-student' ? editData.nin : undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        const storage = localStorage.getItem('userToken') ? localStorage : sessionStorage;
        storage.setItem('userData', JSON.stringify(data));
        setUserData(data);
        setEditMode(false);
        setSuccess('Profile updated successfully!');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    // Validate new password strength
    const validation = validatePasswordStrength(passwordData.newPassword);
    if (!validation.isValid) {
      setError(`Password must contain: ${validation.errors.join(', ')}`);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');

    try {
      const response = await fetch('http://localhost:5001/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordValidation({ isValid: false, errors: [] }); // Reset validation state
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('lastLoginTime');
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('lastLoginTime');
    navigate('/');
  };

  const handleBack = () => {
    if (currentView === 'account') {
      navigate(-1);
    } else {
      setCurrentView('account');
      setEditMode(false);
      setError('');
      setSuccess('');
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <div className={styles.topBar}>
          <button className={styles.closeBtn} onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
          <h1 className={styles.pageTitle}>MUK-Book</h1>
        </div>

        <div className={styles.profileContainer}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <User size={48} />
            </div>
            <h2 className={styles.userName}>Account</h2>
          </div>

          {currentView === 'account' && (
            <>
              <div className={styles.menuSection}>
                <button
                  className={styles.menuItem}
                  onClick={() => setCurrentView('personal')}
                >
                  <div className={styles.menuItemContent}>
                    <User className={styles.menuIcon} size={20} />
                    <span className={styles.menuText}>Personal Info</span>
                  </div>
                  <ChevronRight size={20} className={styles.chevron} />
                </button>

                <button
                  className={styles.menuItem}
                  onClick={() => setCurrentView('security')}
                >
                  <div className={styles.menuItemContent}>
                    <Lock className={styles.menuIcon} size={20} />
                    <span className={styles.menuText}>Security</span>
                  </div>
                  <ChevronRight size={20} className={styles.chevron} />
                </button>
              </div>

              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={20} />
                Logout
              </button>
            </>
          )}

          {currentView === 'personal' && (
            <div className={styles.detailView}>
              <h3 className={styles.viewTitle}>Personal Info</h3>

              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}

              {!editMode ? (
                <>
                  <div className={styles.infoSection}>
                    <div className={styles.infoItem}>
                      <User className={styles.infoIcon} size={20} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>First Name</div>
                        <div className={styles.infoValue}>{userData.firstName}</div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <User className={styles.infoIcon} size={20} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>Surname</div>
                        <div className={styles.infoValue}>{userData.surname}</div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <Mail className={styles.infoIcon} size={20} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>Email (Cannot Edit)</div>
                        <div className={styles.infoValue}>{userData.email}</div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <User className={styles.infoIcon} size={20} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>Gender (Cannot Edit)</div>
                        <div className={styles.infoValue}>{userData.gender}</div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <User className={styles.infoIcon} size={20} />
                      <div className={styles.infoContent}>
                        <div className={styles.infoLabel}>User Type</div>
                        <div className={styles.infoValue}>
                          {userData.userType === 'student' ? 'Student' : 'Non-Student'}
                        </div>
                      </div>
                    </div>

                    {userData.userType === 'student' && userData.studentNumber && (
                      <div className={styles.infoItem}>
                        <Hash className={styles.infoIcon} size={20} />
                        <div className={styles.infoContent}>
                          <div className={styles.infoLabel}>Student Number</div>
                          <div className={styles.infoValue}>{userData.studentNumber}</div>
                        </div>
                      </div>
                    )}

                    {userData.userType === 'non-student' && userData.nin && (
                      <div className={styles.infoItem}>
                        <CreditCard className={styles.infoIcon} size={20} />
                        <div className={styles.infoContent}>
                          <div className={styles.infoLabel}>National ID Number</div>
                          <div className={styles.infoValue}>{userData.nin}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button className={styles.editBtn} onClick={() => setEditMode(true)}>
                    Edit Profile
                  </button>
                </>
              ) : (
                <form onSubmit={handleUpdateProfile} className={styles.editForm}>
                  <div className={styles.fieldWrapper}>
                    <label className={styles.fieldLabel}>First Name</label>
                    <div className={styles.inputGroup}>
                      <User className={styles.inputIcon} size={20} />
                      <input
                        type="text"
                        name="firstName"
                        value={editData.firstName}
                        onChange={handleEditChange}
                        required
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldWrapper}>
                    <label className={styles.fieldLabel}>Surname</label>
                    <div className={styles.inputGroup}>
                      <User className={styles.inputIcon} size={20} />
                      <input
                        type="text"
                        name="surname"
                        value={editData.surname}
                        onChange={handleEditChange}
                        required
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldWrapper}>
                    <label className={styles.fieldLabel}>Email (Cannot Edit)</label>
                    <div className={styles.inputGroup}>
                      <Mail className={styles.inputIcon} size={20} />
                      <input
                        type="email"
                        value={userData.email}
                        disabled
                        className={styles.inputDisabled}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldWrapper}>
                    <label className={styles.fieldLabel}>Gender (Cannot Edit)</label>
                    <div className={styles.inputGroup}>
                      <User className={styles.inputIcon} size={20} />
                      <input
                        type="text"
                        value={userData.gender}
                        disabled
                        className={styles.inputDisabled}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldWrapper}>
                    <label className={styles.fieldLabel}>User Type</label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="userType"
                          value="student"
                          checked={editData.userType === 'student'}
                          onChange={handleEditChange}
                          className={styles.radio}
                        />
                        Student
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="userType"
                          value="non-student"
                          checked={editData.userType === 'non-student'}
                          onChange={handleEditChange}
                          className={styles.radio}
                        />
                        Non-Student
                      </label>
                    </div>
                  </div>

                  {editData.userType === 'student' && (
                    <div className={styles.fieldWrapper}>
                      <label className={styles.fieldLabel}>Student Number</label>
                      <div className={styles.inputGroup}>
                        <Hash className={styles.inputIcon} size={20} />
                        <input
                          type="text"
                          name="studentNumber"
                          value={editData.studentNumber}
                          onChange={handleEditChange}
                          required
                          className={styles.input}
                        />
                      </div>
                    </div>
                  )}

                  {editData.userType === 'non-student' && (
                    <div className={styles.fieldWrapper}>
                      <label className={styles.fieldLabel}>National ID Number</label>
                      <div className={styles.inputGroup}>
                        <CreditCard className={styles.inputIcon} size={20} />
                        <input
                          type="text"
                          name="nin"
                          value={editData.nin}
                          onChange={handleEditChange}
                          required
                          className={styles.input}
                        />
                      </div>
                    </div>
                  )}

                  <div className={styles.buttonGroup}>
                    <button type="submit" disabled={loading} className={styles.saveBtn}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setEditData({
                          firstName: userData.firstName,
                          surname: userData.surname,
                          userType: userData.userType,
                          studentNumber: userData.studentNumber || '',
                          nin: userData.nin || ''
                        });
                      }}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {currentView === 'security' && (
            <div className={styles.detailView}>
              <h3 className={styles.viewTitle}>Security</h3>

              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}

              <form onSubmit={handleChangePassword} className={styles.editForm}>
                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>Old Password</label>
                  <div className={styles.inputGroup}>
                    <Lock className={styles.inputIcon} size={20} />
                    <input
                      type={showPasswords.oldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      required
                      className={styles.input}
                      placeholder="Enter your current password"
                    />
                    {passwordData.oldPassword && (
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('oldPassword')}
                        className={styles.eyeIcon}
                      >
                        {showPasswords.oldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>New Password</label>
                  <div className={styles.inputGroup}>
                    <Lock className={styles.inputIcon} size={20} />
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className={styles.input}
                      placeholder="Enter your new password"
                    />
                    {passwordData.newPassword && (
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('newPassword')}
                        className={styles.eyeIcon}
                      >
                        {showPasswords.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    )}
                  </div>
                  {passwordData.newPassword && !passwordValidation.isValid && (
                    <div className={styles.passwordHint}>
                      Required: {passwordValidation.errors.join(', ')}
                    </div>
                  )}
                  {passwordData.newPassword && passwordValidation.isValid && (
                    <div className={styles.passwordStrong}>
                      ✓ Strong password
                    </div>
                  )}
                </div>

                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>Confirm New Password</label>
                  <div className={styles.inputGroup}>
                    <Lock className={styles.inputIcon} size={20} />
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className={styles.input}
                      placeholder="Re-enter your new password"
                    />
                    {passwordData.confirmPassword && (
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        className={styles.eyeIcon}
                      >
                        {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    )}
                  </div>
                  {passwordData.confirmPassword && (
                    <div className={passwordData.newPassword === passwordData.confirmPassword ? styles.passwordMatch : styles.passwordMismatch}>
                      {passwordData.newPassword === passwordData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading} className={styles.saveBtn}>
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;