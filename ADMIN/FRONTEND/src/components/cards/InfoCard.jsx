import React from 'react';
import './InfoCard.css';

/**
 * This is reusable card component to display a key statistic.
 * @param {object} props 
 * @param {string} props.title 
 * @param {string|number} props.value 
 * @param {React.ReactNode} [props.icon] 
 */
const InfoCard = ({ title, value, icon }) => {
  return (
    <div className="info-card">
      {icon && <div className="info-card-icon">{icon}</div>}
      <div className="info-card-content">
        <p className="info-card-title">{title}</p>
        <h3 className="info-card-value">{value}</h3>
      </div>
    </div>
  );
};

export default InfoCard;