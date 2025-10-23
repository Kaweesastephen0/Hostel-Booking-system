import React, { useEffect } from 'react';
import styles from './featuredHostels.module.css';
import {Phone} from 'lucide-react'
import { useState } from 'react';

function FeaturedHostels() {
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
        console.log(result);
        
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
 

  const formatDate = () => {
    const date = new Date();
    return `${date.toLocaleString('default', { weekday: 'long' })} ${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
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

      <div className={styles.propertiesGrid}>
        {premiumHostels.map((hostel) => (
          <div key={hostel._id} className={styles.propertyCard}>
            <div className={styles.cardImage}>
              <img src={hostel.image} alt={hostel.address} />
              <div className={styles.overlay}></div>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.price}>
                UGX {hostel.roomPrice ? hostel.roomPrice.toLocaleString() : '0'}
                <span className={styles.perMonth}>/semester</span>
              </div>
              <div className={styles.address}>{hostel.address}</div>
              
              <div className={styles.propertyFeatures}>
                <div className={styles.feature}>
                  <span className={styles.featureLabel}>Beds</span>
                  <span className={styles.featureValue}>
                    {hostel.rooms ? `${hostel.rooms.length * 2} Beds` : '4 Beds'}
                  </span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureLabel}>Baths</span>
                  <span className={styles.featureValue}>
                    {hostel.rooms ? `${Math.ceil(hostel.rooms.length / 2)}+ Baths` : '2.5+ Baths'}
                  </span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureLabel}>Size</span>
                  <span className={styles.featureValue}>
                    {hostel.rooms ? `${hostel.rooms.length * 320} sq.ft` : '1280 sq.ft'}
                  </span>
                </div>
              </div>
              
              <div className={styles.buttons}>
                <button>
                  <Phone />
                </button>
                <button>
                  More Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedHostels;