import React from 'react';
import { BedDouble, Users, CheckCircle, Loader2 } from 'lucide-react';
import InfoCard from '../../components/cards/InfoCard';

const RoomInfoCard = ({ rooms, loading }) => {
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.isAvailable).length;
  const totalCapacity = rooms.reduce((acc, room) => acc + (room.maxOccupancy || 0), 0);

  return (
    <div className="dashboard-summary-cards">
      <InfoCard
        title="Total Rooms"
        value={loading ? <Loader2 className="animate-spin" size={24} /> : totalRooms}
        icon={<BedDouble size={24} />}
      />
      <InfoCard
        title="Available Rooms"
        value={loading ? <Loader2 className="animate-spin" size={24} /> : availableRooms}
        icon={<CheckCircle size={24} />}
        color="success"
      />
      <InfoCard
        title="Total Capacity"
        value={loading ? <Loader2 className="animate-spin" size={24} /> : totalCapacity}
        icon={<Users size={24} />}
      />
    </div>
  );
};

export default RoomInfoCard;
