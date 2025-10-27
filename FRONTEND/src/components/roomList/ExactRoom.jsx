import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ExactRoom.module.css';
import { 
    MoveLeft, Share2, Heart, Plus, MapPin, Users, Clock, 
    Wifi, Bus, BookOpen, Utensils, Lock, Dumbbell, Waves 
} from 'lucide-react';

const ExactRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [otherRooms, setOtherRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRoomDetails();
    }, [roomId]);

    const fetchRoomDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch room details');
            }
            
            const result = await response.json();
            
            if (result.success && result.data) {
                setRoom(result.data);
                
                // Fetch other rooms from the same hostel
                if (result.data.hostelId?._id) {
                    fetchOtherRooms(result.data.hostelId._id);
                }
            } else {
                setError('Room not found');
            }
        } catch (error) {
            console.error('Error fetching room details:', error);
            setError('Failed to load room details');
        } finally {
            setLoading(false);
        }
    };

    const fetchOtherRooms = async (hostelId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/rooms/hostel/${hostelId}?excludeRoomId=${roomId}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setOtherRooms(result.data);
                }
            }
        } catch (error) {
            console.error('Error fetching other rooms:', error);
        }
    };

    const getTimeAgo = (date) => {
        if (!date) return 'Recently';
        const now = new Date();
        const posted = new Date(date);
        const diffTime = Math.abs(now - posted);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const getAmenityIcon = (amenity) => {
        const amenityLower = amenity.toLowerCase();
        if (amenityLower.includes('wifi')) return <Wifi size={20} />;
        if (amenityLower.includes('bus') || amenityLower.includes('pickup')) return <Bus size={20} />;
        if (amenityLower.includes('library')) return <BookOpen size={20} />;
        if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return <Utensils size={20} />;
        if (amenityLower.includes('security')) return <Lock size={20} />;
        if (amenityLower.includes('gym')) return <Dumbbell size={20} />;
        if (amenityLower.includes('pool') || amenityLower.includes('swimming')) return <Waves size={20} />;
        return <Wifi size={20} />;
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className={styles.loading}>Loading room details...</div>;
    }

    if (error || !room) {
        return <div className={styles.error}>{error || 'Room not found'}</div>;
    }

    // Get images for display
    const getDisplayImages = () => {
        const images = [];
        
        // Add main room image
        if (room.roomImage) {
            images.push(room.roomImage);
        }
        
        // Add additional room images
        if (room.roomImages && room.roomImages.length > 0) {
            images.push(...room.roomImages);
        }
        
        // Add hostel images if available
        if (room.hostelId?.roomImages && room.hostelId.roomImages.length > 0) {
            images.push(...room.hostelId.roomImages);
        }
        
        // Return at least 5 images (use first image as fallback)
        const mainImage = images[0];
        while (images.length < 5) {
            images.push(mainImage);
        }
        
        return images.slice(0, 5);
    };

    const displayImages = getDisplayImages();

    // Split amenities into two columns
    const amenities = room.hostelId?.amenities || [];
    const halfLength = Math.ceil(amenities.length / 2);
    const firstColumnAmenities = amenities.slice(0, halfLength);
    const secondColumnAmenities = amenities.slice(halfLength);

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <div>
                    <p className={styles.backBox} onClick={handleBackClick}>
                        <span><MoveLeft /></span>back to listing
                    </p>
                </div>
                <div className={styles.Icons}>
                    <Share2 className={styles.shareIcon} />
                    <Heart />
                </div>
            </div>

            {/* Image container */}
            <div className={styles.imageContainer}>
                <div className={styles.leftImageBox}>
                    <img src={displayImages[0]} alt="Room main image" />
                </div>
                <div className={styles.rightImageBox}>
                    <div className={styles.rightTopImage}>
                        <div className={styles.images}>
                            <img src={displayImages[1]} alt="sub image" />
                        </div>
                        <div className={styles.images}>
                            <img src={displayImages[2]} alt="sub image" />
                        </div>
                    </div>
                    <div className={styles.rightBottomImage}>
                        <div className={styles.images}>
                            <img src={displayImages[3]} alt="sub image" />
                        </div>
                        <div className={styles.images1}>
                            <img src={displayImages[4]} alt="sub image" />
                            <div className={styles.moreImage}>
                                <Plus color="white" /> <span>more</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.subHeadingBox}>
                <div>Room {room.roomNumber}</div>
                <div>
                    Ugx {room.roomPrice.toLocaleString()}
                    <span>/semester</span>
                </div>
            </div>

            <div className={styles.locationBox}>
                <div className={styles.threeLocations}>
                    <div className={styles.inner3}>
                        <span><MapPin /></span>
                        {room.hostelId?.location || 'Location not specified'}
                    </div>
                    <div className={styles.inner3}>
                        <span><Users /></span>
                        Preferred Gender: {room.roomGender.charAt(0).toUpperCase() + room.roomGender.slice(1)}
                    </div>
                    <div className={styles.inner3}>
                        <span><Clock /></span>
                        <div className={styles.postedTime}>
                            Posted: {getTimeAgo(room.createdAt)}
                        </div>
                    </div>
                </div>
                <div>
                    <button>Book it</button>
                </div>
            </div>

            <div className={styles.AmenityLocation}>
                <div className={styles.AmenityLeftBox}>
                    <h3 className={styles.Title}>Amenities</h3>
                    <div className={styles.AmenitiesBox}>
                        <div className={styles.first3}>
                            <ul>
                                {firstColumnAmenities.map((amenity, index) => (
                                    <li key={index}>
                                        {getAmenityIcon(amenity)} <span>{amenity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <ul>
                                {secondColumnAmenities.map((amenity, index) => (
                                    <li key={index}>
                                        {getAmenityIcon(amenity)} <span>{amenity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.locationMapRightBox}>
                    <h3 className={styles.Title}>Location</h3>
                    <div className={styles.mapSpace}>
                        <img src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83" alt="placeholder map" />
                    </div>
                </div>
            </div>

            <div className={styles.descriptionBox}>
                <h3>Description</h3>
                <div>
                    <p>{room.roomDescription}</p>
                    {room.hostelId?.description && <p>{room.hostelId.description}</p>}
                </div>
            </div>

            {otherRooms.length > 0 && (
                <div className={styles.otherRoomsBox}>
                    <h3>Other Rooms in {room.hostelId?.name || 'This Hostel'}</h3>
                    <div className={styles.otherRoomGrid}>
                        {otherRooms.map((otherRoom) => (
                            <div key={otherRoom._id} className={styles.otherRoom}>
                                <div className={styles.otherRoomImage}>
                                    <img src={otherRoom.roomImage} alt={`Room ${otherRoom.roomNumber}`} />
                                </div>
                                <div className={styles.otherRoomInfo}>
                                    <p>Room-{otherRoom.roomNumber}</p>
                                    <p>Ugx {otherRoom.roomPrice.toLocaleString()}/semester</p>
                                </div>
                                <div className={styles.OtherRoomsAmenities}>
                                    <ul>
                                        {amenities.slice(0, 3).map((amenity, index) => (
                                            <li key={index}>{getAmenityIcon(amenity)}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExactRoom;