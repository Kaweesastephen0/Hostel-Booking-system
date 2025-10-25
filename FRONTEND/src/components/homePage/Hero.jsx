import React from 'react';
import styles from './hero.module.css';
import {MapPin} from 'lucide-react'
import { FaHeart } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";



export default function Hero() {
  return (
    <div className={styles.heroContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroGrid}>
          {/* Left Content */}
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              As You build for the future
            </h1>
            <p className={styles.heroSubtitle}>
              Your Accommodation Matters
            </p>

            {/* Trending Place Section */}
            <div className={styles.trendingSection}>
              <div className={styles.trendingHeader}>
                <span className={styles.heartIcon}><FaHeart color='red'/></span>
                <span className={styles.trendingText}>Trending Hostels</span>
              </div>
              <div className={styles.trendingImages}>
                <div className={styles.trendingImg}>
                  <img 
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=300&fit=crop" 
                    alt="Building 1" 
                  />
                </div>
                <div className={styles.trendingImg}>
                  <img 
                    src="https://a0.muscache.com/im/pictures/miso/Hosting-697651137050290792/original/c0149d11-0401-4808-8040-93b8803ad4c7.jpeg?im_w=960" 
                    alt="Building 2" 
                  />
                </div>
                <div className={styles.trendingImg}>
                  <img 
                    src="https://a0.muscache.com/im/pictures/miso/Hosting-986706997785474467/original/76eec72c-87d9-4956-9a23-798d29e8e24f.jpeg?im_w=720" 
                    alt="Building 3" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Building Image with Stats */}
          <div className={styles.heroRight}>
            {/* Main Building Image Container */}
            <div className={styles.buildingContainer}>
              {/* Rating Badge */}
              <div className={styles.ratingBadge}>
                <span className={styles.starIcon}><FaStar color='yellow' size={25}/></span>
                <span className={styles.ratingText}>4.9 / 5.0</span>
                <div className={styles.avatars}>
                  <div className={`${styles.avatar} ${styles.avatar1}`}></div>
                  <div className={`${styles.avatar} ${styles.avatar2}`}></div>
                  <div className={`${styles.avatar} ${styles.avatar3}`}></div>
                  <div className={`${styles.avatar} ${styles.avatar4}`}></div>
                </div>
              </div>
              

              {/* Building Image */}
              <img 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=1000&fit=crop" 
                alt="Modern Building" 
                className={styles.buildingImage}
              />

              {/* Bottom Badge */}
              <div className={styles.dreamHomeBadge}>
                <div className={styles.badgeIcon}><MapPin /></div>
                <div className={styles.badgeText}>
                  <p>Get directions</p>
                  <p>to any Hostel</p>
                </div>
              </div>
            </div>

            {/* Stats on the Right */}
            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>30+</div>
                <div className={styles.statLabel}>Amenities<br />deal</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>Affordable<br />yet comfortable</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>100+</div>
                <div className={styles.statLabel}>Real time <br />rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}