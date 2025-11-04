import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, MapPin, ChevronRight, X, Users, Bed, DoorOpen 
} from 'lucide-react';
import styles from  './RoomList.module.css';

export default function RoomsList() {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hostelInfo, setHostelInfo] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`http://localhost:5000/api/rooms/hostel/${hostelId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setRooms(result.data);
          
          if (result.data.length > 0 && result.data[0].hostelId) {
            setHostelInfo(result.data[0].hostelId);
          }
        } else {
          setRooms([]);
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* Sidebar Skeleton */}
          <aside className={styles.sidebar}>
            <div className={styles.filterHeaderSkeleton}></div>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.filterSectionSkeleton}></div>
            ))}
          </aside>

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
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            Filters
            <X size={16} style={{cursor: 'pointer', opacity: 0.5}} />
          </div>

          {/* Room Type Filter */}
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Room Type</div>
            {[
              { label: 'Single', count: rooms.filter(r => r.roomType === 'single').length },
              { label: 'Double', count: rooms.filter(r => r.roomType === 'double').length },
              { label: 'Shared', count: rooms.filter(r => r.roomType === 'shared').length }
            ].map(item => (
              <label key={item.label} className={styles.checkbox}>
                <input type="checkbox" className={styles.checkboxInput} />
                <span className={styles.checkboxLabel}>{item.label}</span>
                <span className={styles.count}>{item.count}</span>
              </label>
            ))}
          </div>

          {/* Gender Filter */}
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Gender</div>
            {[
              { label: 'Male', count: rooms.filter(r => r.roomGender === 'male').length },
              { label: 'Female', count: rooms.filter(r => r.roomGender === 'female').length },
              { label: 'Mixed', count: rooms.filter(r => r.roomGender === 'mixed').length }
            ].map(item => (
              <label key={item.label} className={styles.checkbox}>
                <input type="checkbox" className={styles.checkboxInput} />
                <span className={styles.checkboxLabel}>{item.label}</span>
                <span className={styles.count}>{item.count}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Results */}
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <div className={styles.sortBy}>
              Sort by:
              <select className={styles.select}>
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
            <div className={styles.resultsCount}>
              {rooms.length} {rooms.length === 1 ? 'Room' : 'Rooms'} Found
            </div>
          </div>

          {rooms.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateTitle}>No Rooms Available</div>
              <div className={styles.emptyStateText}>
                There are currently no rooms available for this hostel.
              </div>
            </div>
          ) : (
            rooms.map(room => (
              <div
               key={room._id} 
               className={`${styles.roomCard} ${hoveredCard === room._id ? styles.hovered : ''}`} 
               onMouseEnter={() => setHoveredCard(room._id)} 
               onMouseLeave={() => setHoveredCard(null)} >
                <div className={styles.roomCardInner}>
                  {/* Image Section */}
                  <div className={styles.imageSection}>
                    {!imagesLoaded[room._id] && (
                      <div className={styles.imageSkeleton}></div>
                    )}
                    <img 
                      src={room.roomImage || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'} 
                      alt={room.roomNumber || 'Room'} 
                      className={styles.roomImage}
                      loading="lazy"
                      onLoad={() => handleImageLoad(room._id)}
                      style={{
                        opacity: imagesLoaded[room._id] ? 1 : 0,
                        transform: hoveredCard === room._id ? 'scale(1.05)' : 'scale(1)'
                      }}
                    />
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
                            {room.roomNumber || 'Room N/A'}
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
                          {room.roomNumber}
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
                          Book Room <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}