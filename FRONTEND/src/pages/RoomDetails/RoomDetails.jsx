import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./RoomDetails.module.css";
import {
  MoveLeft,
  Share2,
  Heart,
  Plus,
  MapPin,
  Users,
  Clock,
  Wifi,
  Bus,
  BookOpen,
  Utensils,
  Lock,
  Dumbbell,
  Waves,
} from "lucide-react";

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
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`);
      if (!response.ok) throw new Error("Failed to fetch room details");

      const result = await response.json();
      if (result.success && result.data) {
        setRoom(result.data);
        if (result.data.hostelId?._id) {
          fetchOtherRooms(result.data.hostelId._id);
        }
      } else setError("Room not found");
    } catch (error) {
      console.error("Error fetching room details:", error);
      setError("Failed to load room details");
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherRooms = async (hostelId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/rooms/hostel/${hostelId}?excludeRoomId=${roomId}`
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) setOtherRooms(result.data);
      }
    } catch (error) {
      console.error("Error fetching other rooms:", error);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return "Recently";
    const now = new Date();
    const posted = new Date(date);
    const diff = Math.abs(now - posted);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const getAmenityIcon = (a) => {
    const am = a.toLowerCase();
    if (am.includes("wifi")) return <Wifi size={18} />;
    if (am.includes("bus") || am.includes("pickup")) return <Bus size={18} />;
    if (am.includes("library")) return <BookOpen size={18} />;
    if (am.includes("restaurant") || am.includes("dining"))
      return <Utensils size={18} />;
    if (am.includes("security")) return <Lock size={18} />;
    if (am.includes("gym")) return <Dumbbell size={18} />;
    if (am.includes("pool") || am.includes("swimming")) return <Waves size={18} />;
    return <Wifi size={18} />;
  };

  const handleBackClick = () => navigate(-1);

  const handleImageLoad = (i) => setImagesLoaded((prev) => ({ ...prev, [i]: true }));

  const getDisplayImages = () => {
    if (!room) return [];
    const images = [];
    if (room.roomImage) images.push(room.roomImage);
    if (room.roomImages?.length) images.push(...room.roomImages);
    if (room.hostelId?.roomImages?.length)
      images.push(...room.hostelId.roomImages);

    const fallback =
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
    const main = images[0] || fallback;
    while (images.length < 5) images.push(main);
    return images.slice(0, 5);
  };

  if (loading)
    return <div className={styles.loader}>Loading room details...</div>;

  if (error || !room)
    return <div className={styles.error}>{error || "Room not found"}</div>;

  const displayImages = getDisplayImages();
  const amenities = room.hostelId?.amenities || [];
  const half = Math.ceil(amenities.length / 2);
  const first = amenities.slice(0, half);
  const second = amenities.slice(half);

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <p className={styles.backBox} onClick={handleBackClick}>
          <MoveLeft /> back to listing
        </p>
        <div className={styles.icons}>
          <Share2 />
          <Heart />
        </div>
      </div>

      {/* Image Section */}
      <div className={styles.imageContainer}>
        <div className={styles.leftImageBox}>
          <img
            src={displayImages[0]}
            alt="Main Room"
            onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800")}
            onLoad={() => handleImageLoad(0)}
            style={{ opacity: imagesLoaded[0] ? 1 : 0, transition: "opacity .5s" }}
          />
        </div>
        <div className={styles.rightImageBox}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.smallImage}>
              <img
                src={displayImages[i]}
                alt="Room View"
                loading="lazy"
                onError={(e) =>
                  (e.target.src =
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800")
                }
                onLoad={() => handleImageLoad(i)}
                style={{ opacity: imagesLoaded[i] ? 1 : 0, transition: "opacity .5s" }}
              />
              {i === 4 && (
                <div className={styles.moreOverlay}>
                  <Plus size={22} /> <span>More</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Room Info */}
      <div className={styles.subHeadingBox}>
        <div>Room {room.roomNumber}</div>
        <div>
          UGX {room.roomPrice.toLocaleString()} <span>/semester</span>
        </div>
      </div>

      {/* Location + Book */}
      <div className={styles.locationBox}>
        <div className={styles.threeLocations}>
          <div><MapPin /> {room.hostelId?.location || "Not specified"}</div>
          <div><Users /> Gender: {room.roomGender}</div>
          <div><Clock /> Posted: {getTimeAgo(room.createdAt)}</div>
        </div>
        <button
          className={styles.bookButton}
          onClick={() => alert("Booking feature coming soon!")}
        >
          Book it
        </button>
      </div>

      {/* Amenities + Map */}
      <div className={styles.AmenityLocation}>
        <div className={styles.AmenityLeftBox}>
          <h3>Amenities</h3>
          <div className={styles.AmenitiesBox}>
            {[first, second].map((col, i) => (
              <ul key={i}>
                {col.map((a, index) => (
                  <li key={index}>
                    {getAmenityIcon(a)} <span>{a}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className={styles.locationMapRightBox}>
          <h3>Location</h3>
          <iframe
            title="Hostel Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              room.hostelId?.location || "Makerere University"
            )}&output=embed`}
            width="100%"
            height="250"
            style={{ borderRadius: "12px", border: "none" }}
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Description */}
      <div className={styles.descriptionBox}>
        <h3>Description</h3>
        <p>{room.roomDescription || "No description provided."}</p>
        {room.hostelId?.description && <p>{room.hostelId.description}</p>}
      </div>

      {/* Other Rooms */}
      {otherRooms.length > 0 && (
        <div className={styles.otherRoomsBox}>
          <h3>Other Rooms in {room.hostelId?.name || "this hostel"}</h3>
          <div className={styles.otherRoomGrid}>
            {otherRooms.map((r) => (
              <div
                key={r._id}
                className={styles.otherRoom}
                onClick={() => navigate(`/room/${r._id}`)}
              >
                <img
                  src={r.roomImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"}
                  alt={`Room ${r.roomNumber}`}
                />
                <div className={styles.otherRoomInfo}>
                  <p>Room {r.roomNumber}</p>
                  <p>UGX {r.roomPrice.toLocaleString()}/semester</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
