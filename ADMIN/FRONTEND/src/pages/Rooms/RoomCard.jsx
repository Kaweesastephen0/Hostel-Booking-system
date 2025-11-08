import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import {
  Bed, Image, Tag, Edit, Trash2, Building, DollarSign,
  CalendarDays, Eye, Users, Bath, Wifi, Coffee, User
} from 'lucide-react';
import './RoomCard.css';

const RoomCard = ({ room, onEdit, onDelete }) => {
  // Helper function to get status based on availability
  const getRoomStatus = (room) => {
    return room.isAvailable === false ? 'occupied' : 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'error';
      default: return 'default';
    }
  };

  // Get primary room image or first image
  const getPrimaryImage = () => {
    return room.primaryRoomImage;
  };

  // Format room type for display
  const formatRoomType = (type) => {
    if (!type) return 'Standard';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format room gender for display
  const formatRoomGender = (gender) => {
    if (!gender) return 'Mixed';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  return (
    <Card className="room-card">
      <Box className="room-card-image-container">
        {getPrimaryImage() ? (
          <img
            src={getPrimaryImage()}
            alt={`Room ${room.roomNumber}`}
            className="room-card-image"
          />
        ) : (
          <Box className="room-card-no-image">
            <Image size={48} color="#ccc" />
            <Typography variant="caption" color="textSecondary">No Image</Typography>
          </Box>
        )}
        <Chip
          label={getRoomStatus(room).toUpperCase()}
          color={getStatusColor(getRoomStatus(room))}
          size="small"
          className={`room-card-status-chip status-${getRoomStatus(room)}`}
        />
        <Box className="room-card-overlay">
          <Typography variant="h6" className="room-card-price">
            UGX {(room.roomPrice || 0).toLocaleString()}
          </Typography>
          <Typography variant="caption" className="room-card-booking-price">
            Booking: UGX {(room.bookingPrice || 0).toLocaleString()}
          </Typography>
        </Box>
      </Box>
      
      <CardContent className="room-card-content">
        <Typography variant="h6" component="div" className="room-card-title">
          Room {room.roomNumber}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary" gutterBottom className="room-card-hostel">
          {room.hostelId?.name || 'Unnamed Hostel'}
        </Typography>

        <Typography variant="body2" color="text.secondary" className="room-card-description">
          {room.roomDescription || 'No description available.'}
        </Typography>

        <Box className="room-card-details">
          <Box className="detail-item">
            <Tag size={16} />
            <Typography variant="body2">{formatRoomType(room.roomType)} Room</Typography>
          </Box>
          
          <Box className="detail-item">
            <User size={16} />
            <Typography variant="body2">{formatRoomGender(room.roomGender)}</Typography>
          </Box>

          <Box className="detail-item">
            <Users size={16} />
            <Typography variant="body2">
              {room.maxOccupancy || 1} {room.maxOccupancy === 1 ? 'Person' : 'People'} max
            </Typography>
          </Box>

          {room.hostelId?.location && (
            <Box className="detail-item">
              <Building size={16} />
              <Typography variant="body2">{room.hostelId.location}</Typography>
            </Box>
          )}
        </Box>

        {/* Room features summary */}
        <Box className="room-card-features">
          <Chip
            icon={<Bed size={14} />}
            label={formatRoomType(room.roomType)}
            size="small"
            variant="outlined"
            className="feature-chip"
          />
          <Chip
            icon={<Users size={14} />}
            label={`${room.maxOccupancy || 1} max`}
            size="small"
            variant="outlined"
            className="feature-chip"
          />
          {room.roomGender && (
            <Chip
              icon={<User size={14} />}
              label={formatRoomGender(room.roomGender)}
              size="small"
              variant="outlined"
              className="feature-chip"
            />
          )}
        </Box>

        <Box className="room-card-actions">
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(room);
            }}
            aria-label="edit room"
            className="action-btn"
          >
            <Edit size={18} />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(room);
            }}
            aria-label="delete room"
            className="action-btn"
          >
            <Trash2 size={18} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomCard;