import React from 'react';
import styles from './belowSection.module.css';

export default function DesignJourney() {
  return (
    <div className={styles.container}>
      {/* Our Design Journey Section */}
      <section className={styles.section}>
        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            <h2 className={styles.mainTitle}>OUR DESIGN<br />JOURNEY</h2>
            <p className={styles.description}>
              We believe in creating spaces that inspire and comfort. Our journey began with a simple idea: 
              to transform student accommodation into a home away from home. Every detail is carefully 
              considered to enhance your living experience.
            </p>
            <button className={styles.button}>
              Learn More →
            </button>
          </div>
          <div className={styles.imageContent}>
            <img 
              src="https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" 
              alt="Interior Design" 
              className={styles.mainImage}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3 className={styles.statNumber}>120+</h3>
            <p className={styles.statLabel}>Happy Students</p>
            <p className={styles.statDescription}>Students have found their perfect accommodation with us</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statNumber}>25+</h3>
            <p className={styles.statLabel}>Premium Rooms</p>
            <p className={styles.statDescription}>Carefully designed rooms across multiple locations</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statNumber}>12+</h3>
            <p className={styles.statLabel}>Years Experience</p>
            <p className={styles.statDescription}>Providing quality student accommodation</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statNumber}>98+</h3>
            <p className={styles.statLabel}>Satisfaction Rate</p>
            <p className={styles.statDescription}>Students rate us highly for comfort and service</p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className={styles.missionSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.textContentWhite}>
            <h2 className={styles.titleWhite}>OUR MISSION<br />AND VISION</h2>
            <p className={styles.descriptionWhite}>
              Our mission is to provide affordable, comfortable, and secure accommodation that enables 
              students to focus on their academic journey. We envision a community where every student 
              feels at home, supported, and inspired to achieve their dreams.
            </p>
            <button className={styles.buttonWhite}>
              Read More →
            </button>
          </div>
          <div className={styles.imageContent}>
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=600&fit=crop" 
              alt="Modern Living Space" 
              className={styles.mainImage}
            />
          </div>
        </div>
      </section>

      {/* Elegant Tranquility Section */}
      <section className={styles.elegantSection}>
        <div className={styles.elegantHeader}>
          <h2 className={styles.elegantTitle}>ELEGANT TRANQUILITY<br />& MODERN FAMILY ESTATE</h2>
          <p className={styles.elegantDescription}>
            Experience the perfect blend of contemporary design and homely comfort. Our spaces are 
            thoughtfully curated to create an environment that promotes both productivity and relaxation.
          </p>
        </div>
        <div className={styles.galleryGrid}>
          <div className={styles.galleryItem}>
            <img 
              src="https://images.unsplash.com/photo-1565363887715-8884629e09ee?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFwYXJ0bWVudCUyMGJ1aWxkaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" 
              alt="Teal Room" 
              className={styles.galleryImage}
            />
          </div>
          <div className={styles.galleryItem}>
            <img 
              src="https://images.unsplash.com/photo-1620545785640-54af6b5875ca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM0fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600" 
              alt="Modern Interior" 
              className={styles.galleryImage}
            />
          </div>
          <div className={styles.galleryItem}>
            <img 
              src="https://images.unsplash.com/photo-1560870535-d0347d4681e9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM4fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600" 
              alt="Cozy Living Room" 
              className={styles.galleryImage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}