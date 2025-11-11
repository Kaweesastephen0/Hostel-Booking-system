// components/SearchResultsList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Bookmark } from 'lucide-react';
import styles from './searchResult.module.css';

export default function SearchResultsList({ results, loading, searchParams, limit = null }) {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(new Set());
  const [bookmarks, setBookmarks] = useState(new Set());
  const [imageLoaded, setImageLoaded] = useState({});

  // Function to get hostel image
  const getHostelImage = (hostel) => {
    if (!hostel.images || hostel.images.length === 0) {
      return 'https://via.placeholder.com/400x250';
    }
    const primaryImage = hostel.images.find(img => img.isPrimary);
    return primaryImage?.url || hostel.images[0]?.url || 'https://via.placeholder.com/400x250';
  };

  // Limit results if specified (for homepage preview)
  const displayResults = limit ? results.slice(0, limit) : results;
  const hasMore = limit && results.length > limit;

  const toggleFavorite = (hostelId, event) => {
    event.stopPropagation();
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hostelId)) {
        newSet.delete(hostelId);
      } else {
        newSet.add(hostelId);
      }
      // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
      return newSet;
    });
  };

  const toggleBookmark = (hostelId, event) => {
    event.stopPropagation();
    setBookmarks(prev => {
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

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className={styles.hostelCard}>
      <div className={styles.imageSection}>
        <div className={styles.skeletonImage}></div>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.skeletonLine} style={{ width: '60%', height: '24px' }}></div>
        <div className={styles.skeletonLine} style={{ width: '40%', height: '16px', marginTop: '8px' }}></div>
        <div className={styles.skeletonLine} style={{ width: '100%', height: '50px', marginTop: '12px' }}></div>
        <div className={styles.skeletonLine} style={{ width: '30%', height: '20px', marginTop: 'auto' }}></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.resultsWrapper}>
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // REMOVED: The "return null" for empty results - let parent handle empty state
  // if (!results || results.length === 0) {
  //   return null;
  // }

  return (
    <div className={styles.container}>
      {/* Only show results wrapper if we have results */}
      {results && results.length > 0 ? (
        <div className={styles.resultsWrapper}>
          {displayResults.map((hostel) => (
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
                  src={getHostelImage(hostel)} 
                  alt={hostel.name}
                  className={styles.hostelImage}
                  loading="lazy"
                  onLoad={() => handleImageLoad(hostel._id)}
                  style={{
                    opacity: imageLoaded[hostel._id] ? 1 : 0
                  }}
                />
                
                {/* Discount Badge */}
                {hostel.featured && (
                  <div className={styles.discountBadge}>Best Deal</div>
                )}

                {/* Favorite Button */}
                <button 
                  className={`${styles.favoriteBtn} ${favorites.has(hostel._id) ? styles.active : ''}`}
                  onClick={(e) => toggleFavorite(hostel._id, e)}
                >
                  <Heart 
                    size={18} 
                    fill={favorites.has(hostel._id) ? '#ff385c' : 'none'}
                    stroke={favorites.has(hostel._id) ? '#ff385c' : '#fff'}
                  />
                </button>
              </div>

              {/* Content Section */}
              <div className={styles.contentSection}>
                {/* Header */}
                <div className={styles.header}>
                  <h3 className={styles.hostelName}>{hostel.name}</h3>
                  <button 
                    className={`${styles.bookmarkBtn} ${bookmarks.has(hostel._id) ? styles.active : ''}`}
                    onClick={(e) => toggleBookmark(hostel._id, e)}
                  >
                    <Bookmark 
                      size={18} 
                      fill={bookmarks.has(hostel._id) ? '#1e3a8a' : 'none'}
                    />
                  </button>
                </div>

                {/* Rating */}
                <div className={styles.ratingSection}>
                  <div className={styles.ratingBadge}>
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    <span className={styles.ratingValue}>
                      {hostel.rating?.average || '4.8'}
                    </span>
                    <span className={styles.ratingCount}>
                      ({hostel.rating?.count || hostel.matchingRoomsCount || '257'})
                    </span>
                  </div>
                  <span className={styles.ratingLabel}>Excellent Location</span>
                </div>

                {/* Amenities */}
                <div className={styles.amenitiesSection}>
                  {hostel.HostelGender && (
                    <span className={styles.amenity}>
                      {hostel.HostelGender === 'male' ? '🚹' : hostel.HostelGender === 'female' ? '🚺' : '👥'} 
                      {hostel.HostelGender.charAt(0).toUpperCase() + hostel.HostelGender.slice(1)}
                    </span>
                  )}
                  {hostel.amenities?.includes('wifi') && (
                    <span className={styles.amenity}>📶 Free Wifi</span>
                  )}
                  {hostel.amenities?.includes('parking') && (
                    <span className={styles.amenity}>🅿️ Parking</span>
                  )}
                  {hostel.amenities?.includes('security') && (
                    <span className={styles.amenity}>🔒 Security</span>
                  )}
                </div>

                {/* Location */}
                <div className={styles.locationInfo}>
                  <MapPin size={14} />
                  <span>{hostel.location} • {hostel.distance} from campus</span>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                  <div className={styles.priceSection}>
                    <div className={styles.dealBadge}>Deal</div>
                    <div className={styles.priceWrapper}>
                      <span className={styles.price}>
                        UGX {(hostel.priceRange?.min || 500000).toLocaleString()}
                      </span>
                      {hostel.priceRange?.max && hostel.priceRange.max !== hostel.priceRange.min && (
                        <span className={styles.priceRange}>
                          - {hostel.priceRange.max.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {hostel.featured && (
                      <span className={styles.discount}>28% less than usual</span>
                    )}
                  </div>
                  <button 
                    className={styles.bookBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHostelClick(hostel._id);
                    }}
                  >
                    View Room(s)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Return empty fragment instead of null
        <></>
      )}

      {/* View More Button (only on homepage) */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => navigate('/search-results', { 
              state: { results, searchParams } 
            })}
            style={{
              background: '#5843e3',
              color: 'white',
              border: 'none',
              padding: '14px 40px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(88, 67, 227, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#4532c7';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#5843e3';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            View All {results.length} Results
          </button>
        </div>
      )}
    </div>
  );
}
