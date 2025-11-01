// components/hostels/shared/HostelCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHostelType, getHostelImage } from '../../../utils/hostelUtils';
import styles from './HostelCard.module.css';

export const HostelCard = ({ hostel, variant = 'standard', onClick }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick(hostel._id);
    } else {
      navigate(`/rooms/${hostel._id}`);
    }
  };

  const cardClass = `${styles.propertyCard} ${styles[variant]}`;
  const hostelImage = getHostelImage(hostel);
  const genderType = getHostelType(hostel);

  return (
    <div className={cardClass} onClick={handleClick}>
      <div className={styles.cardImage}>
        {/* Skeleton loader - shows while image loads */}
        {!imageLoaded && !imageError && hostelImage && (
          <div className={styles.skeleton}></div>
        )}
        
        {hostelImage && !imageError ? (
          <img 
            src={hostelImage} 
            alt={hostel.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{ 
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in'
            }}
          />
        ) : (
          <div className={styles.noImagePlaceholder}>
            <svg className={styles.noImageIcon} viewBox="0 0 24 24" fill="none">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor" opacity="0.3"/>
            </svg>
            <p className={styles.noImageText}>No Image</p>
          </div>
        )}
        <div className={styles.overlay}></div>
        
        {variant === 'premium' && (
          <div className={styles.premiumBadge}>Premium</div>
        )}
        
        {variant === 'midrange' && genderType && (
          <div className={styles.genderBadge}>{genderType}</div>
        )}
      </div>
      
      {variant === 'midrange' ? (
        <h3 className={styles.hostelName}>{hostel.name}</h3>
      ) : (
        <div className={styles.cardContent}>
          <div className={styles.hostelName}>{hostel.name}</div>
          {genderType && <div className={styles.address}>{genderType}</div>}
        </div>
      )}
    </div>
  );
};