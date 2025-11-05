import React, { useState, useEffect } from 'react';
import styles from './hero.module.css';
import { FaHeart } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import SearchBar from '../searchbar/searchBar';
import { useHostels } from '../../../hooks/useHostels';

export default function Hero({ onSearch }) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  
  const { hostels: featuredHostels, loading, error } = useHostels('featured');

  // Get the latest 4 hostels for the carousel
  const carouselHostels = featuredHostels
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  useEffect(() => {
    if (carouselHostels.length > 0) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % carouselHostels.length);
          setIsTransitioning(false);
        }, 500);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [carouselHostels.length]);

  const handleThumbnailClick = (index) => {
    if (index !== activeIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handleHostelClick = (hostelId) => {
    navigate(`/rooms/${hostelId}`);
  };

  const handleImageLoad = (index) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  };

  // Skeleton Loader
  if (loading) {
    return (
      <div className={styles.heroContainer}>
        <div className={styles.skeletonBackground} />
        <div className={styles.blueOverlay} />
        
        <div className={styles.heroContent}>
          <div className={styles.contentLeft}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonSubtitle} />
          </div>

          <div className={styles.contentRight}>
            <div className={styles.trendingSection}>
              <div className={styles.trendingHeader}>
                <span className={styles.heartIcon}><FaHeart color='#e5e7eb'/></span>
                <div className={styles.skeletonTrendingText} />
              </div>

              <div className={styles.trendingImages}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={styles.skeletonTrendingImg} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.progressIndicators}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.progressDot} />
          ))}
        </div>

        <div className={styles.searchBarWrapper}>
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.heroContainer}>
        <div className={styles.errorBackground} />
        <div className={styles.blueOverlay} />
        <div className={styles.errorMessage}>{error}</div>
        <div className={styles.searchBarWrapper}>
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    );
  }

  if (carouselHostels.length === 0) {
    return (
      <div className={styles.heroContainer}>
        <div className={styles.errorBackground} />
        <div className={styles.blueOverlay} />
        <div className={styles.errorMessage}>No featured hostels available</div>
        <div className={styles.searchBarWrapper}>
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.heroContainer}>
      {/* Full Screen Background Images */}
      <div className={styles.backgroundContainer}>
        {carouselHostels.map((hostel, index) => (
          <div
            key={hostel._id}
            className={`${styles.backgroundImage} ${
              index === activeIndex && !isTransitioning ? styles.activeBackground : ''
            }`}
          >
            <img
              src={hostel.image}
              alt={hostel.name}
              className={styles.bgImage}
            />
          </div>
        ))}
      </div>

      {/* Blue Overlay */}
      <div className={styles.blueOverlay} />

      {/* Content */}
      <div className={styles.heroContent}>
        <div className={styles.contentLeft}>
          <h1 className={styles.heroTitle}>
            As You Build For The Future
          </h1>
          <p className={styles.heroSubtitle}>
            Your Accommodation Matters
          </p>
        </div>

        <div className={styles.contentRight}>
          {/* Trending Section */}
          <div className={styles.trendingSection}>
            <div className={styles.trendingHeader}>
              <span className={styles.heartIcon}><FaHeart color='red'/></span>
              <span className={styles.trendingText}>Trending Hostels</span>
            </div>

            <div className={styles.trendingImages}>
              {carouselHostels.map((hostel, index) => (
                <div
                  key={hostel._id}
                  onClick={() => {
                    handleThumbnailClick(index);
                    handleHostelClick(hostel._id);
                  }}
                  className={`${styles.trendingImg} ${
                    index === activeIndex ? styles.activeThumbnail : ''
                  }`}
                >
                  {/* Shiny Border Effect for Active Image */}
                  {index === activeIndex && (
                    <div className={styles.shinyBorder} />
                  )}
                  
                  <div className={styles.thumbnailInner}>
                    {!imagesLoaded[index] && (
                      <div className={styles.imageSkeleton} />
                    )}
                    <img
                      src={hostel.image}
                      alt={hostel.name}
                      loading="lazy"
                      onLoad={() => handleImageLoad(index)}
                      style={{
                        opacity: imagesLoaded[index] ? 1 : 0,
                        transition: 'opacity 0.3s ease-in'
                      }}
                    />
                    
                    <div className={index === activeIndex ? styles.activeOverlay : styles.thumbnailOverlay} />
                  </div>

                  {/* Active Indicator */}
                  {index === activeIndex && (
                    <div className={styles.activeIndicator} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className={styles.progressIndicators}>
        {carouselHostels.map((_, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`${styles.progressDot} ${
              index === activeIndex ? styles.activeDot : ''
            }`}
          />
        ))}
      </div>

      <div className={styles.searchBarWrapper}>
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
}