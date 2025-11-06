import React from 'react';
import { MapPin, BedDouble, Star, Milestone, Users } from 'lucide-react';
import './HostelCard.css';

const HostelCard = ({ hostel, onSelect }) => {
  const { name, location, image, availability, rating, rooms, distance, HostelGender } = hostel;
  const roomCount = rooms?.length || 0;
  const status = availability ? 'Available' : 'Full';

  return (
    <div className="hostel-card" onClick={() => onSelect(hostel)}>
      <div className="hostel-card-image-container">
        <img src={image || 'https://via.placeholder.com/400x250'} alt={name} className="hostel-card-image" />
        <span className={`hostel-card-status status-${status.toLowerCase()}`}>{status}</span>
        {rating.average > 0 && (
          <div className="hostel-card-rating">
            <Star size={14} fill="var(--color-warning, #f59e0b)" stroke="var(--color-warning, #f59e0b)" />
            <span>{rating.average.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="hostel-card-content">
        <h3 className="hostel-card-name">{name}</h3>
        <div className="hostel-card-info">
          <div className="info-item">
            <MapPin size={14} />
            <span>{location || 'N/A'}</span>
          </div>
          <div className="info-item">
            <BedDouble size={14} />
            <span>{roomCount} Rooms</span>
          </div>
          <div className="info-item">
            <Milestone size={14} />
            <span>{distance || 'N/A'}</span>
          </div>
          <div className="info-item">
            <Users size={14} />
            <span className="gender-tag">{HostelGender || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;