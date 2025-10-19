import React from 'react';
import styles from './featuredHostels.module.css';
import {Phone} from 'lucide-react'

function FeaturedHostels() {
  const featuredHostels = [
    {
      id: 1,
      price: "147,000",
      address: "1162 Virginia Park St, Detroit, MI 48202",
      beds: "4 Beds",
      baths: "2.5+ Baths",
      size: "1280 sq.ft",
      image: "https://images.pexels.com/photos/20237982/pexels-photo-20237982.jpeg"
    },
    {
      id: 2,
      price: "390,000",
      address: "3623 Clairmount St, Detroit, MI 48206",
      beds: "4 Beds",
      baths: "2.5+ Baths",
      size: "1280 sq.ft",
      image: "https://images.pexels.com/photos/18153132/pexels-photo-18153132.jpeg"
    },
    {
      id: 3,
      price: "237,000",
      address: "1638 La Salle Ave E, Detroit, MI 48221",
      beds: "4 Beds",
      baths: "2.5+ Baths",
      size: "1280 sq.ft",
      image: "https://images.pexels.com/photos/34056727/pexels-photo-34056727.jpeg"
    },
    {
      id: 4,
      price: "237,000",
      address: "1638 La Salle Ave E, Detroit, MI 48221",
      beds: "4 Beds",
      baths: "2.5+ Baths",
      size: "1280 sq.ft",
      image: "https://images.pexels.com/photos/1838639/pexels-photo-1838639.jpeg"
    },
    {
      id: 5,
      price: "237,000",
      address: "1638 La Salle Ave E, Detroit, MI 48221",
      beds: "4 Beds",
      baths: "2.5+ Baths",
      size: "1280 sq.ft",
      image: "https://images.pexels.com/photos/1838639/pexels-photo-1838639.jpeg"
    },
    {
      id: 6,
      price: "237,000",
      address: "1638 La Salle Ave E, Detroit, MI 48221",
      beds: "4 Beds",
      baths: "2.5+ Baths",
      size: "1280 sq.ft",
      image: "https://images.pexels.com/photos/16973548/pexels-photo-16973548.jpeg"
    },
    {
      id: 7,
      price: "237,000",
      address: "1638 La Salle Ave E, Detroit, MI 48221",
      beds: "4 Beds",
      baths: "2.5+ Baths",
      size: "1280 sq.ft",
      image: "https://images.pexels.com/photos/23893997/pexels-photo-23893997.jpeg"
    },
    {
      id: 8,
      price: "237,000",
      address: "1638 La Salle Ave E, Detroit, MI 48221",
      beds: "4 Beds",
      baths: "2.5+ Baths",
      size: "1280 sq.ft",
      image: "https://images.pexels.com/photos/23669334/pexels-photo-23669334.jpeg"
    }
  ];

  const formatDate = () => {
  const date = new Date();
  return `${date.toLocaleString('default', { weekday: 'long' })} ${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
};



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
        {featuredHostels.map((hostel) => (
          <div key={hostel.id} className={styles.propertyCard}>
            <div className={styles.cardImage}>
              <img src={hostel.image} alt={hostel.address} />
              <div className={styles.overlay}></div>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.price}>${hostel.price}<span className={styles.perMonth}>/month</span></div>
              <div className={styles.address}>{hostel.address}</div>
              
              <div className={styles.propertyFeatures}>
                <div className={styles.feature}>
                  <span className={styles.featureLabel}>Beds</span>
                  <span className={styles.featureValue}>{hostel.beds}</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureLabel}>Baths</span>
                  <span className={styles.featureValue}>{hostel.baths}</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureLabel}>Size</span>
                  <span className={styles.featureValue}>{hostel.size}</span>
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