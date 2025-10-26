import React, { useEffect } from 'react';
import styles from './featuredHostels.module.css';
import { Phone } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

function FeaturedHostels() {
  const navigate = useNavigate(); 
  const [premiumHostels, setPremiumHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPremiumHostels = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/hostels/premiumHostel');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setPremiumHostels(result.data);
        } else {
          setPremiumHostels([]);
        }
      } catch (error) {
        console.log(`Error fetching Premium hostels ${error}`);
        setError(`Failed to load premium hostels, please try again later`);
      } finally {
        setLoading(false);
      }
    };
    fetchPremiumHostels();
  }, []);

  // const calculateTotalBeds = (hostel) => {
  //   if (!hostel.rooms || !Array.isArray(hostel.rooms)) return 0;
  //   return hostel.rooms.reduce((total, room) => total + (room.maxOccupancy || 1), 0);
  // };

  // const getAvailableRooms = (hostel) => {
  //   return hostel.rooms?.length || 0;
  // };

  const getHostelType = (hostel) => {
    return hostel.HostelGender === 'mixed' ? 'Mixed' : 
           hostel.HostelGender === 'female' ? 'Female' : 'Male';
  };

  const formatDate = () => {
    const date = new Date();
    return `${date.toLocaleString('default', { weekday: 'long' })} ${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  };

  const handleHostelClick = (hostelId) => {
    navigate(`/rooms/${hostelId}`);
  };

  if (loading) {
    return (
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Premium Student Hostels</h2>
          <div className={styles.headerInfo}>
            <span className={styles.language}>ENG</span>
            <span className={styles.date}>{formatDate()}</span>
          </div>
        </div>
        <div className={styles.loadingMessage}>Loading premium hostels...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Premium Student Hostels</h2>
          <div className={styles.headerInfo}>
            <span className={styles.language}>ENG</span>
            <span className={styles.date}>{formatDate()}</span>
          </div>
        </div>
        <div className={styles.errorMessage}>{error}</div>
      </section>
    );
  }

  return (
    <section className={styles.featuredSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Premium Student Hostels</h2>
        <div className={styles.headerInfo}>
          <span className={styles.language}>ENG</span>
          <span className={styles.date}>{formatDate()}</span>
        </div>
      </div>

      <div className={styles.horizontalScrollContainer}>
        <div className={styles.propertiesGridHorizontal}>
          {premiumHostels.map((hostel) => (
            <div 
              key={hostel._id} 
              className={styles.propertyCard}
              onClick={() => handleHostelClick(hostel._id)} 
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.cardImage}>
                <img src={hostel.image} alt={hostel.name} />
                <div className={styles.overlay}></div>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.price}>
                  UGX {hostel.roomPrice ? hostel.roomPrice.toLocaleString() : '0'}
                  <span className={styles.perMonth}>/semester</span>
                </div>
                <div className={styles.hostelName}>{hostel.name}</div>
                <div className={styles.address}>{getHostelType(hostel)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedHostels;


