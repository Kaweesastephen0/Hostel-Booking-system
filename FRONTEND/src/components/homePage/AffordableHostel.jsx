import React, { useEffect } from 'react';
import styles from './AffordableHostel.module.css';
import { useState } from 'react';

function AffordableHostels() {
  const [affordableHostels, setAffordableHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAffordableHostels = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/hostels/affordable');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setAffordableHostels(result.data);
        } else {
          setAffordableHostels([]);
        }
      } catch (error) {
        console.log(`Error fetching affordable hostels ${error}`);
        setError(`Failed to load affordable hostels, please try again later`);
      } finally {
        setLoading(false);
      }
    };
    fetchAffordableHostels();
  }, []);

  const getHostelType = (hostel) => {
    return hostel.HostelGender === 'mixed' ? 'Mixed' : 
           hostel.HostelGender === 'female' ? 'Female' : 'Male';
  };

  if (loading) {
    return (
      <section className={styles.affordableSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Affordable Student Hostels</h2>
         
        </div>
        <div className={styles.loadingMessage}>Loading affordable hostels...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.affordableSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Affordable Student Hostels</h2>
         
        </div>
        <div className={styles.errorMessage}>{error}</div>
      </section>
    );
  }

  return (
    <section className={styles.affordableSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Affordable Student Hostels</h2>
      </div>

      <div className={styles.horizontalScrollContainer}>
        <div className={styles.propertiesGridHorizontal}>
          {affordableHostels.map((hostel) => (
            <div key={hostel._id} className={styles.propertyCard}>
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

export default AffordableHostels;