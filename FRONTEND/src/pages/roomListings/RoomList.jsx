import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, MapPin, ChevronRight, Users, Bed, DoorOpen 
} from 'lucide-react';
import styles from  './RoomList.module.css';

export default function RoomsList() {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hostelInfo, setHostelInfo] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/hostel/${hostelId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Rooms API Response:', result);
        
        if (result.success && Array.isArray(result.data)) {
          // Filter out any invalid room data
          const validRooms = result.data.filter(room => room && room._id);
          setRooms(validRooms);
          setFilteredRooms(validRooms);
          
          if (validRooms.length > 0 && validRooms[0].hostelId) {
            setHostelInfo(validRooms[0].hostelId);
          }
        } else {
          setRooms([]);
          setFilteredRooms([]);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (hostelId) {
      fetchRooms();
    } else {
      setError('No hostel ID provided');
      setLoading(false);
    }
  }, [hostelId]);

  // Handle sorting
  useEffect(() => {
    let sortedRooms = [...rooms];
    
    switch(sortBy) {
      case 'price-low':
        sortedRooms.sort((a, b) => (a.roomPrice || 0) - (b.roomPrice || 0));
        break;
      case 'price-high':
        sortedRooms.sort((a, b) => (b.roomPrice || 0) - (a.roomPrice || 0));
        break;
      case 'room-number':
        sortedRooms.sort((a, b) => {
          const numA = parseInt(a.roomNumber) || 0;
          const numB = parseInt(b.roomNumber) || 0;
          return numA - numB;
        });
        break;
      case 'recommended':
      default:
        // Keep original order or sort by availability/date
        break;
    }
    
    setFilteredRooms(sortedRooms);
  }, [sortBy, rooms]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleImageLoad = (roomId) => {
    setImagesLoaded(prev => ({ ...prev, [roomId]: true }));
  };

  const getRoomImage = (room) => {
    // Try to get room images first
    if (room.roomImages && room.roomImages.length > 0) {
      const primaryImage = room.roomImages.find(img => img.isPrimary);
      if (primaryImage && primaryImage.url) return primaryImage.url;
      if (room.roomImages[0] && room.roomImages[0].url) return room.roomImages[0].url;
    }
    
    // Try single roomImage field
    if (room.roomImage) return room.roomImage;
    
    // NO FALLBACK to hostel images - only show room's own images
    
    return null;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* Results Skeleton */}
          <div className={styles.results}>
            <div className={styles.resultsHeaderSkeleton}></div>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.roomCardSkeleton}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* Results */}
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <div className={styles.sortBy}>
              Sort by:
              <select 
                className={styles.select}
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="room-number">Room Number</option>
              </select>
            </div>
            <div className={styles.resultsCount}>
              {filteredRooms.length} {filteredRooms.length === 1 ? 'Room' : 'Rooms'} Found
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateTitle}>No Rooms Available</div>
              <div className={styles.emptyStateText}>
                There are currently no rooms available for this hostel.
              </div>
            </div>
          ) : (
            filteredRooms.map(room => {
              const roomImage = getRoomImage(room);
              
              return (
                <div
                  key={room._id} 
                  className={`${styles.roomCard} ${hoveredCard === room._id ? styles.hovered : ''}`} 
                  onMouseEnter={() => setHoveredCard(room._id)} 
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={styles.roomCardInner}>
                    {/* Image Section */}
                    <div className={styles.imageSection}>
                      {roomImage ? (
                        <>
                          {!imagesLoaded[room._id] && (
                            <div className={styles.imageSkeleton}></div>
                          )}
                          <img 
                            src={roomImage} 
                            alt={room.roomNumber || 'Room'} 
                            className={styles.roomImage}
                            loading="lazy"
                            onLoad={() => handleImageLoad(room._id)}
                            style={{
                              opacity: imagesLoaded[room._id] ? 1 : 0,
                              transform: hoveredCard === room._id ? 'scale(1.05)' : 'scale(1)'
                            }}
                          />
                        </>
                      ) : (
                        <div className={styles.noImagePlaceholder}>
                          <div className={styles.noImageIcon}>📷</div>
                          <p>No image available</p>
                        </div>
                      )}
                      <button 
                        className={styles.heartButton}
                        onClick={(e) => toggleFavorite(room._id, e)}
                      >
                        <Heart 
                          size={16} 
                          fill={favorites.has(room._id) ? '#ef4444' : 'none'}
                          color={favorites.has(room._id) ? '#ef4444' : '#6b7280'}
                        />
                      </button>
                    </div>
                    
                    {/* Content Section */}
                    <div className={styles.contentSection}>
                      <div>
                        <div className={styles.roomHeader}>
                          <div className={styles.roomInfo}>
                            <h3 className={styles.roomName}>
                              Room {room.roomNumber || 'N/A'}
                            </h3>
                            <div className={styles.hostelName}>
                              <MapPin size={14} />
                              {room.hostelId?.name || hostelInfo?.name || 'Hostel'}
                            </div>
                            {room.roomDescription && (
                              <div className={styles.roomDescription}>
                                {room.roomDescription}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className={styles.features}>
                          <div className={styles.featureTag}>
                            <Users size={12} />
                            {room.maxOccupancy} {room.maxOccupancy === 1 ? 'Person' : 'People'}
                          </div>
                          <div className={styles.featureTag}>
                            <Bed size={12} />
                            {room.roomType ? room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1) : 'Standard'}
                          </div>
                        </div>
                        
                        <div className={styles.badges}>
                          <span className={styles.availabilityBadge}>Available</span>
                          <span className={styles.badge}>
                            {room.roomGender ? room.roomGender.charAt(0).toUpperCase() + room.roomGender.slice(1) : 'Mixed'}
                          </span>
                        </div>
                      </div>

                      <div className={styles.roomFooter}>
                        <div className={styles.roomDetails}>
                          <div className={styles.detailItem}>
                            <DoorOpen size={16} />
                            Room {room.roomNumber}
                          </div>
                        </div>
                        
                        <div className={styles.priceSection}>
                          <div className={styles.price}>
                            UGX {room.roomPrice ? room.roomPrice.toLocaleString() : '0'}
                          </div>
                          <div className={styles.priceLabel}>/semester</div>
                          {room.bookingPrice && room.bookingPrice > 0 && (
                            <div className={styles.bookingFee}>
                              + UGX {room.bookingPrice.toLocaleString()} booking fee
                            </div>
                          )}
                          <button 
                            className={styles.viewButton}
                            onClick={() => navigate(`/room/${room._id}`)}
                          >
                            View Details <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}