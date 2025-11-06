import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import styles from './RoomDetails.module.css';
import { 
    MoveLeft, Share2, Heart, Plus, MapPin, Users, Clock, 
    Wifi, Car, BookOpen, Utensils, Lock, Dumbbell, Waves,
    Droplets, Shield, Tv, Wind, Coffee, WashingMachine,
    Thermometer, Battery, Zap
} from 'lucide-react';

const RoomDetails = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [otherRooms, setOtherRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagesLoaded, setImagesLoaded] = useState({});

    useEffect(() => {
        fetchRoomDetails();
    }, [roomId]);

    const fetchRoomDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch room details');
            }
            
            const result = await response.json();
            console.log('Room API Response:', result);
            
            if (result.success && result.data) {
                setRoom(result.data);
                
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
            const response = await fetch(`http://localhost:5000/api/rooms/hostel/${hostelId}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    const filteredRooms = result.data.filter(room => room._id !== roomId);
                    setOtherRooms(filteredRooms.slice(0, 3));
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
        
        if (amenityLower.includes('wifi') || amenityLower.includes('internet')) 
            return <Wifi size={20} />;
        if (amenityLower.includes('water') || amenityLower.includes('hot water')) 
            return <Droplets size={20} />;
        if (amenityLower.includes('security') || amenityLower.includes('cctv')) 
            return <Shield size={20} />;
        if (amenityLower.includes('electricity') || amenityLower.includes('power')) 
            return <Zap size={20} />;
        if (amenityLower.includes('transport') || amenityLower.includes('shuttle') || amenityLower.includes('bus')) 
            return <Car size={20} />;
        if (amenityLower.includes('library') || amenityLower.includes('study')) 
            return <BookOpen size={20} />;
        if (amenityLower.includes('restaurant') || amenityLower.includes('dining') || amenityLower.includes('cafeteria')) 
            return <Utensils size={20} />;
        if (amenityLower.includes('gym') || amenityLower.includes('fitness')) 
            return <Dumbbell size={20} />;
        if (amenityLower.includes('pool') || amenityLower.includes('swimming')) 
            return <Waves size={20} />;
        if (amenityLower.includes('tv') || amenityLower.includes('television')) 
            return <Tv size={20} />;
        if (amenityLower.includes('ac') || amenityLower.includes('air conditioning')) 
            return <Thermometer size={20} />;
        if (amenityLower.includes('fan') || amenityLower.includes('ventilation')) 
            return <Wind size={20} />;
        if (amenityLower.includes('laundry') || amenityLower.includes('washing')) 
            return <WashingMachine size={20} />;
        if (amenityLower.includes('kitchen') || amenityLower.includes('cooking')) 
            return <Coffee size={20} />;
        if (amenityLower.includes('generator') || amenityLower.includes('backup')) 
            return <Battery size={20} />;
        if (amenityLower.includes('lock') || amenityLower.includes('safe')) 
            return <Lock size={20} />;
            
        return <Wifi size={20} />;
    };

    const handleBackClick = () => {
        navigate(-1);
    };

   const handleOtherRoomClick = async (otherRoomId) => {
        try {
            setLoading(true);
            
            // Fetch the clicked room's details
            const response = await fetch(`http://localhost:5000/api/rooms/${otherRoomId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch room details');
            }
            
            const result = await response.json();
            
            if (result.success && result.data) {
                const newRoom = result.data;
                
                // Set the clicked room as the main room
                setRoom(newRoom);
                
                // Reset images loaded state
                setImagesLoaded({});
                
                // Update the URL without reload
                window.history.pushState({}, '', `/rooms/${otherRoomId}`);
                
                // Fetch other rooms for the new room
                if (newRoom.hostelId?._id) {
                    fetchOtherRooms(newRoom.hostelId._id);
                }
                
                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error fetching room details:', error);
            setError('Failed to load room details');
        } finally {
            setLoading(false);
        }
    };

    const handleImageLoad = (index) => {
        setImagesLoaded(prev => ({ ...prev, [index]: true }));
    };

    const getDisplayImages = () => {
        if (!room) return [];
        
        const images = [];
        
        // Check room images first
        if (room.roomImages && room.roomImages.length > 0) {
            const primaryImage = room.roomImages.find(img => img.isPrimary);
            const otherImages = room.roomImages.filter(img => !img.isPrimary);
            
            if (primaryImage) images.push(primaryImage.url);
            images.push(...otherImages.map(img => img.url));
        }
        
        // Fallback to hostel images
        if (images.length === 0 && room.hostelId?.images && room.hostelId.images.length > 0) {
            const primaryHostelImage = room.hostelId.images.find(img => img.isPrimary);
            const otherHostelImages = room.hostelId.images.filter(img => !img.isPrimary);
            
            if (primaryHostelImage) images.push(primaryHostelImage.url);
            images.push(...otherHostelImages.map(img => img.url));
        }
        
        return images;
    };

    const renderImageGrid = () => {
        const displayImages = getDisplayImages();
        
        if (displayImages.length === 0) {
            return (
                <div className={styles.singleImageContainer}>
                    <div className={styles.singleImage}>
                        <div className={styles.noImagePlaceholder}>
                            <div className={styles.noImageIcon}>📷</div>
                            <p>No images available</p>
                        </div>
                    </div>
                </div>
            );
        }

        if (displayImages.length === 1) {
            return (
                <div className={styles.singleImageContainer}>
                    <div className={styles.singleImage}>
                        {!imagesLoaded[0] && <div className={styles.imageLoader}></div>}
                        <img 
                            src={displayImages[0]} 
                            alt="Room" 
                            loading="lazy"
                            onLoad={() => handleImageLoad(0)}
                            style={{ opacity: imagesLoaded[0] ? 1 : 0 }}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.imageContainer}>
                <div className={styles.leftImageBox}>
                    {!imagesLoaded[0] && <div className={styles.imageLoader}></div>}
                    <img 
                        src={displayImages[0]} 
                        alt="Room main" 
                        loading="lazy"
                        onLoad={() => handleImageLoad(0)}
                        style={{ opacity: imagesLoaded[0] ? 1 : 0 }}
                    />
                </div>
                
                <div className={styles.rightImageBox}>
                    <div className={styles.rightTopImage}>
                        {[1, 2].map(i => (
                            <div key={i} className={styles.images}>
                                {displayImages[i] ? (
                                    <>
                                        {!imagesLoaded[i] && <div className={styles.imageLoader}></div>}
                                        <img 
                                            src={displayImages[i]} 
                                            alt={`Room view ${i}`}
                                            loading="lazy"
                                            onLoad={() => handleImageLoad(i)}
                                            style={{ opacity: imagesLoaded[i] ? 1 : 0 }}
                                        />
                                    </>
                                ) : (
                                    <div className={styles.emptyImageSlot}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.rightBottomImage}>
                        {[3, 4].map(i => (
                            <div key={i} className={i === 4 && displayImages.length > 5 ? styles.images1 : styles.images}>
                                {displayImages[i] ? (
                                    <>
                                        {!imagesLoaded[i] && <div className={styles.imageLoader}></div>}
                                        <img 
                                            src={displayImages[i]} 
                                            alt={`Room view ${i}`}
                                            loading="lazy"
                                            onLoad={() => handleImageLoad(i)}
                                            style={{ opacity: imagesLoaded[i] ? 1 : 0 }}
                                        />
                                        {i === 4 && displayImages.length > 5 && (
                                            <div className={styles.moreImage}>
                                                <Plus color="white" /> 
                                                <span>+{displayImages.length - 5} more</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className={styles.emptyImageSlot}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.topBar}>
                    <div className={styles.backBoxSkeleton}></div>
                    <div className={styles.iconsSkeleton}></div>
                </div>

                <div className={styles.imageContainer}>
                    <div className={styles.leftImageSkeleton}></div>
                    <div className={styles.rightImageBox}>
                        <div className={styles.rightTopImage}>
                            <div className={styles.imageSkeleton}></div>
                            <div className={styles.imageSkeleton}></div>
                        </div>
                        <div className={styles.rightBottomImage}>
                            <div className={styles.imageSkeleton}></div>
                            <div className={styles.imageSkeleton}></div>
                        </div>
                    </div>
                </div>

                <div className={styles.skeletonContent}>
                    <div className={styles.skeletonLine}></div>
                    <div className={styles.skeletonLine}></div>
                    <div className={styles.skeletonBox}></div>
                </div>
            </div>
        );
    }

    if (error || !room) {
        return <div className={styles.error}>{error || 'Room not found'}</div>;
    }

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
            {renderImageGrid()}

            <div className={styles.subHeadingBox}>
                <div>Room {room.roomNumber}</div>
                <div>
                    Ugx {room.roomPrice?.toLocaleString() || '0'}
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
                        Preferred Gender: {room.roomGender?.charAt(0).toUpperCase() + room.roomGender?.slice(1) || 'Mixed'}
                    </div>
                    <div className={styles.inner3}>
                        <span><Clock /></span>
                        <div className={styles.postedTime}>
                            Posted: {getTimeAgo(room.createdAt)}
                        </div>
                    </div>
                </div>
                <div>
                    <button className={styles.bookButton}>Book it</button>
                </div>
            </div>

            {/* Amenities Section */}
            <div className={styles.amenitiesSection}>
                <h3 className={styles.sectionTitle}>Amenities</h3>
                <div className={styles.AmenitiesBox}>
                    <div className={styles.amenitiesColumn}>
                        <ul>
                            {firstColumnAmenities.map((amenity, index) => (
                                <li key={index}>
                                    {getAmenityIcon(amenity)} 
                                    <span>{amenity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.amenitiesColumn}>
                        <ul>
                            {secondColumnAmenities.map((amenity, index) => (
                                <li key={index}>
                                    {getAmenityIcon(amenity)} 
                                    <span>{amenity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {amenities.length === 0 && (
                    <p className={styles.noAmenities}>No amenities listed for this hostel</p>
                )}
            </div>

            <div className={styles.descriptionBox}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <div className={styles.descriptionContent}>
                    {room.roomDescription ? (
                        <p>{room.roomDescription}</p>
                    ) : room.hostelId?.description ? (
                        <p>{room.hostelId.description}</p>
                    ) : (
                        <p className={styles.noDescription}>No description available</p>
                    )}
                </div>
            </div>

            {otherRooms.length > 0 && (
                <div className={styles.otherRoomsBox}>
                    <h3 className={styles.sectionTitle}>Other Rooms in {room.hostelId?.name || 'This Hostel'}</h3>
                    <div className={styles.otherRoomGrid}>
                        {otherRooms.map((otherRoom) => {
                            const otherRoomImages = otherRoom.roomImages || [];
                            const otherRoomMainImage = otherRoomImages.find(img => img.isPrimary) || otherRoomImages[0];
                            
                            return (
                                <div 
                                    key={otherRoom._id} 
                                    className={styles.otherRoom}
                                    onClick={() => handleOtherRoomClick(otherRoom._id)}
                                >
                                    <div className={styles.otherRoomImage}>
                                        {otherRoomMainImage ? (
                                            <img src={otherRoomMainImage.url} alt={`Room ${otherRoom.roomNumber}`} />
                                        ) : (
                                            <div className={styles.noRoomImage}>📷</div>
                                        )}
                                    </div>
                                    <div className={styles.otherRoomInfo}>
                                        <p className={styles.roomNumber}>Room {otherRoom.roomNumber}</p>
                                        <p className={styles.roomPrice}>Ugx {otherRoom.roomPrice?.toLocaleString() || '0'}/semester</p>
                                        <p className={styles.roomType}>{otherRoom.roomType}</p>
                                    </div>
                                    <div className={styles.roomOverlay}>
                                        <span>View Details</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetails;