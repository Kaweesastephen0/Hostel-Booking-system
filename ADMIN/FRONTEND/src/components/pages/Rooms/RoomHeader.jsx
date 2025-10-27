import React from 'react';
import { Users, Video } from 'lucide-react';
import './RoomHeader.css';

const RoomHeader = ({ roomName, participantCount }) => {
  return (
    <div className="room-header">
      <div className="room-header-info">
        <h2>{roomName}</h2>
        <span className="participant-count">
          <Users size={18} />
          {participantCount}
        </span>
      </div>
      <button className="record-button">
        <Video size={16} /> Record
      </button>
    </div>
  );
};

export default RoomHeader;