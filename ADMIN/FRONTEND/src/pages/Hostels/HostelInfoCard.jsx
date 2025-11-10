import React from 'react';
import { Building, BedDouble, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import InfoCard from '../../components/cards/InfoCard';

const HostelInfoCard = ({ hostels, rooms, loading }) => {
  const totalHostels = hostels.length;
  const totalRooms = rooms.length;
  const operationalHostels = hostels.filter(h => (h.status || 'operational') === 'operational').length;

  return (
    <div className="dashboard-summary-cards">
      <InfoCard
        title="Total Hostels"
        value={loading ? <Loader2 className="animate-spin" size={24} /> : totalHostels}
        icon={<Building size={24} />}
      />
      <InfoCard
        title="Total Rooms"
        value={loading ? <Loader2 className="animate-spin" size={24} /> : totalRooms}
        icon={<BedDouble size={24} />}
      />
      <InfoCard
        title="Operational Hostels"
        value={loading ? <Loader2 className="animate-spin" size={24} /> : operationalHostels}
        icon={<CheckCircle size={24} />}
        color="success"
      />
    </div>
  );
};

export default HostelInfoCard;
