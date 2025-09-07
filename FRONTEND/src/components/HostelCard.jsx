import React from 'react';
import './HostelCard.css';

const HostelCard = ({ hostel }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">☆</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  const getMinPrice = () => {
    if (!hostel.roomTypes || hostel.roomTypes.length === 0) return 'N/A';
    const prices = hostel.roomTypes.map(room => room.price);
    return formatPrice(Math.min(...prices));
  };

  return (
    <div className="hostel-card">
      <div className="hostel-image">
        {hostel.images && hostel.images.length > 0 ? (
          <img 
            src={hostel.images[0].url} 
            alt={hostel.images[0].alt || hostel.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        ) : (
          <div className="no-image">
            <span>No Image Available</span>
          </div>
        )}
        <div className="price-badge">
          From {getMinPrice()}
        </div>
      </div>

      <div className="hostel-content">
        <div className="hostel-header">
          <h3 className="hostel-name">{hostel.name}</h3>
          <div className="rating">
            <div className="stars">
              {renderStars(hostel.rating)}
            </div>
            <span className="rating-number">({hostel.rating.toFixed(1)})</span>
          </div>
        </div>

        <div className="location">
          <span className="location-icon">📍</span>
          <span>{hostel.location.city}, {hostel.location.state}</span>
        </div>

        <p className="description">
          {hostel.description.length > 150 
            ? `${hostel.description.substring(0, 150)}...` 
            : hostel.description
          }
        </p>

        <div className="amenities">
          {hostel.amenities && hostel.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="amenity-tag">
              {amenity}
            </span>
          ))}
          {hostel.amenities && hostel.amenities.length > 3 && (
            <span className="amenity-tag more">
              +{hostel.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="room-types">
          <h4>Available Rooms:</h4>
          <div className="room-list">
            {hostel.roomTypes && hostel.roomTypes.slice(0, 2).map((room, index) => (
              <div key={index} className="room-type">
                <span className="room-name">{room.type.charAt(0).toUpperCase() + room.type.slice(1)}</span>
                <span className="room-price">{formatPrice(room.price)}</span>
                <span className="room-capacity">({room.capacity} guests)</span>
              </div>
            ))}
            {hostel.roomTypes && hostel.roomTypes.length > 2 && (
              <div className="room-type more">
                +{hostel.roomTypes.length - 2} more room types
              </div>
            )}
          </div>
        </div>

        <div className="hostel-actions">
          <button className="btn-primary">View Details</button>
          <button className="btn-secondary">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;

