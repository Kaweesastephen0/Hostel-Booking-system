import React, { useState } from 'react';
import styles from './hero.module.css';
import { MapPin } from 'lucide-react';
import { FaHeart, FaStar } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import SearchBar from '../searchbar/searchBar';
import { useHostels } from '../../../hooks/useHostels';

export default function Hero() {
  const navigate = useNavigate();
  const [imagesLoaded, setImagesLoaded] = useState({});
  
  // Use the shared hook - get latest 3 featured hostels
  const { hostels: featuredHostels, loading, error } = useHostels('featured');

  const handleHostelClick = (hostelId) => {
    navigate(`/rooms/${hostelId}`);
  };

  const handleImageLoad = (index) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  };

  // Get only the latest 3 hostels
  const latestThreeHostels = featuredHostels
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Show skeleton while loading
  if (loading) {
    return (
      <div className={styles.heroContainer}>
        <div className={styles.heroSection}>
          <div className={styles.heroGrid}>
            {/* Left Content Skeleton */}
            <div className={styles.heroLeft}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonSubtitle}></div>
              
              <div className={styles.trendingSection}>
                <div className={styles.trendingHeader}>
                  <span className={styles.heartIcon}><FaHeart color='#e5e7eb'/></span>
                  <span className={styles.trendingText}>Trending Hostels</span>
                </div>
                <div className={styles.trendingImages}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.skeletonTrendingImg}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content Skeleton */}
            <div className={styles.heroRight}>
              <div className={styles.buildingContainer}>
                <div className={styles.skeletonBuildingImage}></div>
              </div>
              
              <div className={styles.statsContainer}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={styles.skeletonStatCard}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.searchBarWrapper}>
          <SearchBar />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.heroContainer}>
        <div className={styles.errorMessage}>{error}</div>
        <div className={styles.searchBarWrapper}>
          <SearchBar />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.heroContainer}>
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
                {latestThreeHostels.map((hostel, index) => (
                  <div 
                    key={hostel._id || index} 
                    className={styles.trendingImg} 
                    onClick={() => handleHostelClick(hostel._id)}
                  >
                    {!imagesLoaded[index] && (
                      <div className={styles.imageSkeleton}></div>
                    )}
                    <img 
                      src={hostel.image} 
                      alt="Trending Hostel"
                      loading="lazy"
                      onLoad={() => handleImageLoad(index)}
                      style={{
                        opacity: imagesLoaded[index] ? 1 : 0,
                        transition: 'opacity 0.3s ease-in'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className={styles.heroRight}>
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
                loading="lazy"
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

            {/* Stats */}
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
      <div className={styles.searchBarWrapper}>
        <SearchBar />
      </div>
    </div>
  )}