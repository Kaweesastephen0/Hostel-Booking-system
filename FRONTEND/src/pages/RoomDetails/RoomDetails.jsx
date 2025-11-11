import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./RoomDetails.module.css";
import Swal from "sweetalert2";
import {
  MoveLeft,
  Share2,
  Heart,
  Plus,
  MapPin,
  Users,
  Clock,
  Wifi,
  Car,
  BookOpen,
  Utensils,
  Lock,
  Dumbbell,
  Waves,
  Droplets,
  Shield,
  Tv,
  Wind,
  Coffee,
  WashingMachine,
  Thermometer,
  Zap,
} from "lucide-react";

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [room, setRoom] = useState(null);
  const [otherRooms, setOtherRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  // Handle book now button click
  const handleBookNow = () => {
    const user = JSON.parse(sessionStorage.getItem('userData'));
    
    if (!user) {
      // If no user in session, redirect to login
      navigate(`/login?redirect=booking&roomId=${roomId}`);
      return;
    }
    
    // If user is authenticated, navigate to booking page with room details
    if (room) {
      navigate('/booking', { 
        state: { 
          roomId: room._id,
          roomType: room.roomType,
          price: room.roomPrice,
          hostelName: room.hostelId?.name || 'Hostel',
          roomNumber: room.roomNumber
        }
      });
    } else {
      setError('Room details not loaded yet. Please try again.');
    }
  };

  // Check for redirect after login
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('userData'));
    const isAuth = !!(user && user.token);
    setIsAuthenticated(isAuth);
    
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    
    if (redirect === 'booking' && isAuth && room) {
      // Clean up the URL first
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Then navigate to booking
      navigate('/booking', { 
        state: { 
          roomId: room._id,
          roomType: room.roomType,
          price: room.roomPrice,
          hostelName: room.hostelId?.name || 'Hostel',
          roomNumber: room.roomNumber
        }
      });
    }
  }, [location, room]); // Add room as a dependency

  // Show error message if there's an error
  useEffect(() => {
    if (error) {
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }, [error]);


  // Fetch room when ID changes
  useEffect(() => {
    fetchRoomDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // -------------------- Fetch Functions --------------------
  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`);
      if (!res.ok) throw new Error("Failed to fetch room details");

      const result = await res.json();
      if (result.success && result.data) {
        setRoom(result.data);
        if (result.data.hostelId?._id) fetchOtherRooms(result.data.hostelId._id);
      } else setError("Room not found");
    } catch (err) {
      console.error("Error fetching room:", err);
      setError("Failed to load room details");
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherRooms = async (hostelId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/hostel/${hostelId}`);
      if (!res.ok) return;
      const result = await res.json();
      if (result.success && result.data) {
        const filtered = result.data.filter((r) => r._id !== roomId);
        setOtherRooms(filtered.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching other rooms:", err);
    }
  };

  // -------------------- Helpers --------------------
  const getAmenityIcon = (a) => {
    const amenity = a.toLowerCase();
    const icons = {
      wifi: <Wifi size={18} />,
      bus: <Car size={18} />,
      transport: <Car size={18} />,
      library: <BookOpen size={18} />,
      restaurant: <Utensils size={18} />,
      dining: <Utensils size={18} />,
      security: <Lock size={18} />,
      gym: <Dumbbell size={18} />,
      pool: <Waves size={18} />,
      swimming: <Waves size={18} />,
      water: <Droplets size={18} />,
      electricity: <Zap size={18} />,
      tv: <Tv size={18} />,
      ac: <Thermometer size={18} />,
      air: <Thermometer size={18} />,
      fan: <Wind size={18} />,
      washing: <WashingMachine size={18} />,
      kitchen: <Coffee size={18} />,
    };
    return icons[Object.keys(icons).find((key) => amenity.includes(key))] || <Shield size={18} />;
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `Room ${room.roomNumber} - ${room.hostelId?.name || 'Hostel'}`;
    const shareText = `Check out this room: Room ${room.roomNumber} at UGX ${room.roomPrice?.toLocaleString() || "0"}/semester`;

    try {
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        Swal.fire({
          title: 'Link Copied!',
          text: 'The room link has been copied to your clipboard',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // If share was cancelled or failed, try clipboard as fallback
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          Swal.fire({
            title: 'Link Copied!',
            text: 'The room link has been copied to your clipboard',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (clipboardError) {
          Swal.fire({
            title: 'Error',
            text: 'Could not share or copy the link',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    }
  };

  const handleOtherRoomClick = async (otherRoomId) => {
    navigate(`/rooms/${otherRoomId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDisplayImages = () => {
    if (!room) return [];
    const imgs = [];

    if (room.roomImages?.length) {
      const primary = room.roomImages.find((i) => i.isPrimary);
      const others = room.roomImages.filter((i) => !i.isPrimary);
      if (primary) imgs.push(primary.url);
      imgs.push(...others.map((i) => i.url));
    } else if (room.hostelId?.images?.length) {
      const primary = room.hostelId.images.find((i) => i.isPrimary);
      const others = room.hostelId.images.filter((i) => !i.isPrimary);
      if (primary) imgs.push(primary.url);
      imgs.push(...others.map((i) => i.url));
    }

    return imgs;
  };

  const renderImageGrid = () => {
    const images = getDisplayImages();

    if (!images.length) {
      return (
        <div className={styles.noImagePlaceholder}>
          <div>📷 No images available</div>
        </div>
      );
    }

    if (images.length === 1) {
      return (
        <div className={styles.singleImageContainer}>
          <img src={images[0]} alt="Room" onLoad={() => handleImageLoad(0)} />
        </div>
      );
    }

    // For 2 or more images
    const rightImages = images.slice(1, 4); // Get exactly 3 images for the right side
    const remainingCount = images.length - 4; // Calculate remaining images

    // Always show 3 slots on the right, fill empty ones with placeholders
    const rightSlots = Array(3).fill(null).map((_, i) => rightImages[i] || null);

    return (
      <>
        <div className={styles.imageContainer}>
          <div className={styles.leftImageBox}>
            <img src={images[0]} alt="Main Room" loading="lazy" />
          </div>
          <div className={styles.rightImageBox}>
            {rightSlots.map((src, i) => (
              <div key={i} className={styles.images}>
                {src ? (
                  <>
                    <img src={src} alt={`Room ${i + 2}`} loading="lazy" />
                    {i === 2 && remainingCount > 0 && (
                      <div className={styles.viewMoreOverlay} onClick={() => setShowAllImages(true)}>
                        <button className={styles.viewMoreButton}>
                          <Plus size={20} color="white" /> 
                          <span>View More ({remainingCount}+)</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.emptyImageSlot}>
                    <span>📷</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Image Gallery Modal */}
        {showAllImages && (
          <div className={styles.imageGalleryModal} onClick={() => setShowAllImages(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeModal} onClick={() => setShowAllImages(false)}>
                ✕
              </button>
              <h2 className={styles.modalTitle}>All Images ({images.length})</h2>
              <div className={styles.galleryGrid}>
                {images.map((src, i) => (
                  <div key={i} className={styles.galleryImage}>
                    <img src={src} alt={`Room ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const handleImageLoad = (index) =>
    setImagesLoaded((prev) => ({ ...prev, [index]: true }));

  // -------------------- Loading / Error UI --------------------
  if (loading)
    return <div className={styles.loader}>Loading room details...</div>;
  if (error || !room)
    return <div className={styles.error}>{error || "Room not found"}</div>;

  // -------------------- Render UI --------------------
  const amenities = room.hostelId?.amenities || [];
  const half = Math.ceil(amenities.length / 2);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.topBar}>
        <p className={styles.backBox} onClick={() => navigate(-1)}>
          <MoveLeft /> Back to listing
        </p>
        <div className={styles.icons}>
          <Share2 onClick={handleShare} className={styles.shareIcon} /> 
          <Heart />
        </div>
      </div>

      {/* Images */}
      {renderImageGrid()}

      {/* Room Info */}
      <div className={styles.subHeadingBox}>
        <div>Room {room.roomNumber}</div>
        <div>
          UGX {room.roomPrice?.toLocaleString() || "0"}
          <span>/semester</span>
        </div>
      </div>

      {/* Location */}
      <div className={styles.locationBox}>
        <div className={styles.threeLocations}>
          <div className={styles.inner3}>
            <MapPin /> {room.hostelId?.location || "Location not specified"}
          </div>
          <div className={styles.inner3}>
            <Users /> Preferred:{" "}
            {room.roomGender
              ? room.roomGender.charAt(0).toUpperCase() + room.roomGender.slice(1)
              : "Mixed"}
          </div>
          <div className={styles.inner3}>
            <Clock /> Posted: {new Date(room.createdAt).toLocaleDateString()}
          </div>
        </div>
        <button 
          className={styles.bookButton}
          onClick={handleBookNow}
        >
          Book Now
        </button>
      </div>

      {/* Amenities */}
      <div className={styles.amenitiesSection}>
        <h3 className={styles.sectionTitle}>Amenities</h3>
        {amenities.length ? (
          <div className={styles.AmenitiesBox}>
            <div className={styles.amenitiesColumn}>
              {amenities.slice(0, half).map((a, i) => (
                <li key={i}>{getAmenityIcon(a)} <span>{a}</span></li>
              ))}
            </div>
            <div className={styles.amenitiesColumn}>
              {amenities.slice(half).map((a, i) => (
                <li key={i}>{getAmenityIcon(a)} <span>{a}</span></li>
              ))}
            </div>
          </div>
        ) : (
          <p className={styles.noAmenities}>No amenities listed</p>
        )}
      </div>

      {/* Description */}
      <div className={styles.descriptionBox}>
        <h3 className={styles.sectionTitle}>Description</h3>
        <p>
          {room.roomDescription ||
            room.hostelId?.description ||
            "No description available"}
        </p>
      </div>

      {/* Other Rooms */}
      {otherRooms.length > 0 && (
        <div className={styles.otherRoomsBox}>
          <h3 className={styles.sectionTitle}>
            Other Rooms in {room.hostelId?.name || "This Hostel"}
          </h3>
          <div className={styles.otherRoomGrid}>
            {otherRooms.map((r) => {
              const img = r.roomImages?.find((i) => i.isPrimary) || r.roomImages?.[0];
              return (
                <div
                  key={r._id}
                  className={styles.otherRoom}
                  onClick={() => handleOtherRoomClick(r._id)}
                >
                  <div className={styles.otherRoomImage}>
                    {img ? (
                      <img src={img.url} alt={`Room ${r.roomNumber}`} />
                    ) : (
                      <div className={styles.noRoomImage}>📷</div>
                    )}
                  </div>
                  <div className={styles.otherRoomInfo}>
                    <p className={styles.roomNumber}>Room {r.roomNumber}</p>
                    <p className={styles.roomPrice}>
                      UGX {r.roomPrice?.toLocaleString() || "0"}/semester
                    </p>
                    <p className={styles.roomType}>{r.roomType}</p>
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