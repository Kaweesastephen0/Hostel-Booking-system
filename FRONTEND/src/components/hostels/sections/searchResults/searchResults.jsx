// components/hostels/sections/searchResults/searchResults.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, X } from 'lucide-react';
import styles from './SearchResult.module.css';

export default function SearchResults({ results, loading, error, onClose }) {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(new Set());
  const [imageLoaded, setImageLoaded] = useState({});

  const toggleFavorite = (hostelId, event) => {
    event.stopPropagation();
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hostelId)) {
        newSet.delete(hostelId);
      } else {
        newSet.add(hostelId);
      }
      return newSet;
    });
  };

  const handleHostelClick = (hostelId) => {
    navigate(`/rooms/${hostelId}`);
  };

  const handleImageLoad = (hostelId) => {
    setImageLoaded(prev => ({ ...prev, [hostelId]: true }));
  };

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className={styles.hostelCard}>
      <div className={styles.imageSection}>
        <div className={styles.skeletonImage}></div>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.skeletonLine} style={{ width: '60%', height: '24px' }}></div>
        <div className={styles.skeletonLine} style={{ width: '40%', height: '16px', marginTop: '8px' }}></div>
        <div className={styles.skeletonLine} style={{ width: '100%', height: '60px', marginTop: '12px' }}></div>
        <div className={styles.skeletonLine} style={{ width: '80%', height: '16px', marginTop: '12px' }}></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Searching for hostels...</h2>
        </div>
        <div className={styles.resultsWrapper}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          {onClose && (
            <button className={styles.closeBtn} 
            onClick={onClose}>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }


  return (
    <div className={styles.container}>
      {/* Header with close button */}
      <div className={styles.header}>
        <div>
          <h2>Search Results</h2>
          <p className={styles.resultsCount}>
            {results.length} {results.length === 1 ? 'hostel' : 'hostels'} found
          </p>
        </div>
        {onClose && (
          <button className={styles.closeButton}
          onClick={() => window.location.reload()}
           aria-label="Close search results">
            <X size={24} />
          </button>
        )}
      </div>

      <div className={styles.resultsWrapper}>
        {results.map((hostel) => (
          <div 
            key={hostel._id} 
            className={styles.hostelCard}
            onClick={() => handleHostelClick(hostel._id)}
          >
            {/* Image Section */}
            <div className={styles.imageSection}>
              {!imageLoaded[hostel._id] && (
                <div className={styles.imageSkeleton}></div>
              )}
              <img 
                src={hostel.image} 
                alt={hostel.name}
                className={styles.hostelImage}
                loading="lazy"
                onLoad={() => handleImageLoad(hostel._id)}
                style={{
                  opacity: imageLoaded[hostel._id] ? 1 : 0,
                  transition: 'opacity 0.3s ease-in'
                }}
              />
              
              {/* Favorite Button */}
              <button 
                className={`${styles.favoriteBtn} ${favorites.has(hostel._id) ? styles.active : ''}`}
                onClick={(e) => toggleFavorite(hostel._id, e)}
                aria-label="Add to favorites"
              >
                <Heart 
                  size={20} 
                  fill={favorites.has(hostel._id) ? '#ff5a5f' : 'none'}
                />
              </button>

              {/* Rating Badge */}
              <div className={styles.ratingBadge}>
                <Star size={16} fill="#ffd700" stroke="#ffd700" />
                <span>{hostel.rating?.average || '9.4'}</span>
              </div>

              {/* Featured Badge */}
              {hostel.featured && (
                <div className={styles.featuredBadge}>Featured</div>
              )}
            </div>

            {/* Content Section */}
            <div className={styles.contentSection}>
              {/* Header */}
              <div className={styles.hostelHeader}>
                <h3 className={styles.hostelName}>{hostel.name}</h3>
                <div className={styles.reviewCount}>
                  {hostel.rating?.count || hostel.matchingRoomsCount || '528'} Reviews
                </div>
              </div>

              {/* Badges */}
              <div className={styles.badgeContainer}>
                {hostel.HostelGender && (
                  <span className={styles.badge}>
                    {hostel.HostelGender.toUpperCase()} HOSTEL
                  </span>
                )}
                {hostel.matchingRoomsCount && (
                  <span className={styles.badge}>
                    {hostel.matchingRoomsCount} ROOMS AVAILABLE
                  </span>
                )}
              </div>

              {/* Description */}
              <p className={styles.description}>
                {hostel.description || 'Quality student accommodation near campus with modern facilities and great amenities.'}
              </p>

              {/* Location */}
              <div className={styles.locationInfo}>
                <MapPin size={16} />
                <span>{hostel.location}</span>
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <div className={styles.priceSection}>
                  <button className={styles.compareBtn}>
                    VIEW AVAILABLE ROOMS
                  </button>
                  <div className={styles.priceInfo}>
                    <span className={styles.fromText}>from</span>
                    <span className={styles.price}>
                      UGX {(hostel.priceRange?.min || hostel.availableRooms?.[0]?.roomPrice || 500000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}