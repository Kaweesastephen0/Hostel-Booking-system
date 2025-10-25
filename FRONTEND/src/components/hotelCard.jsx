import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from 'lucide-react';
import styles from './hostelCard.module.css';

const HotelCard = ({ hostel, index }) => {
     
    // Safe data access with fallbacks
    const getImage = () => {
        return hostel.image || (hostel.images && hostel.images[0]) || 'https://images.pexels.com/photos/1838639/pexels-photo-1838639.jpeg';
    };

    const truncateName = (name, maxLength = 15) => {
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength - 3) + '...';
    };

    const getName = () => {
        return truncateName(hostel.name || 'Urbanza Suites');
    };

    const getLocation = () => {
        return hostel.location || hostel.address || 'Main Road 123 Street, 23 Colony';
    };

    const getRating = () => {
        return hostel.rating?.average || '4.5';
    };

    const getPrice = () => {
        // Try multiple possible price locations
        if (hostel.roomPrice) {
            return hostel.roomPrice.toLocaleString();
        }
        
        // If rooms array exists and has items, get minimum price
        if (hostel.rooms && Array.isArray(hostel.rooms) && hostel.rooms.length > 0) {
            const prices = hostel.rooms.map(room => room.roomPrice).filter(price => price);
            if (prices.length > 0) {
                return Math.min(...prices).toLocaleString();
            }
        }
        
        // Fallback
        return 'N/A';
    };

    const scrollTo = (x, y) => {
        window.scrollTo(x, y);
    };

    return (
        <Link
            to={`/hostel/${hostel._id}`}
            onClick={() => scrollTo(0, 0)}
            className={styles.hotelCard}
        >
           
            <div className={styles.imageWrapper}>
                <img
                    src={getImage()}
                    alt={`${getName()} hostel`}
                    className={styles.cardImage}
                />
                
                
                 <div className={styles.cardContent}>
                
                <div className={styles.headerRow}>
                    <h3 className={styles.hotelName}>
                        {getName()}
                    </h3>
                    <div className={styles.rating}>
                        <svg className={styles.starIcon} viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                        <span className={styles.ratingValue}>{getRating()}</span>
                    </div>
                </div>

                
                <div className={styles.locationRow}>
                    <MapPin className={styles.locationIcon} />
                    <span className={styles.locationText}>{getLocation()}</span>
                </div>

                
                <div className={styles.footerRow}>
                    <div className={styles.priceSection}>
                        <span className={styles.price}>Ugx.{getPrice()}</span>
                        <span className={styles.priceLabel}>/semester</span>
                    </div>
                    
                </div>
            </div>
            </div>

            
           
        </Link>
    );
};

export default HotelCard;