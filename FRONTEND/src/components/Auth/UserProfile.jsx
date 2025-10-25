import { useState } from 'react';
import { ArrowLeft, User, Mail, Calendar, Clock, LogOut } from 'lucide-react';
import styles from './UserProfile.module.css';

function UserProfile({ isOpen, onClose, userData, onLogout }) {
  if (!isOpen || !userData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLastLoginTime = () => {
    const loginTime = localStorage.getItem('lastLoginTime') || sessionStorage.getItem('lastLoginTime');
    return loginTime ? formatDate(loginTime) : 'Just now';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <ArrowLeft size={24} />
        </button>

        <div className={styles.profileContainer}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <User size={48} />
            </div>
            <h2 className={styles.userName}>
              {userData.firstName} {userData.surname}
            </h2>
            <span className={styles.userType}>
              {userData.userType === 'student' ? 'Student' : 'Non-Student'}
            </span>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <Mail className={styles.infoIcon} size={20} />
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Email</div>
                <div className={styles.infoValue}>{userData.email}</div>
              </div>
            </div>

            <div className={styles.infoItem}>
              <User className={styles.infoIcon} size={20} />
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Gender</div>
                <div className={styles.infoValue}>{userData.gender}</div>
              </div>
            </div>

            {userData.userType === 'student' && userData.studentNumber && (
              <div className={styles.infoItem}>
                <User className={styles.infoIcon} size={20} />
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>Student Number</div>
                  <div className={styles.infoValue}>{userData.studentNumber}</div>
                </div>
              </div>
            )}

            <div className={styles.infoItem}>
              <Calendar className={styles.infoIcon} size={20} />
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Account Created</div>
                <div className={styles.infoValue}>
                  {userData.createdAt ? formatDate(userData.createdAt) : 'N/A'}
                </div>
              </div>
            </div>

            <div className={styles.infoItem}>
              <Clock className={styles.infoIcon} size={20} />
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Last Login</div>
                <div className={styles.infoValue}>{getLastLoginTime()}</div>
              </div>
            </div>
          </div>

          <button className={styles.logoutBtn} onClick={onLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;