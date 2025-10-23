import React from "react";
import { Building, BedDouble, CalendarCheck, Wallet } from "lucide-react";
import "./Dashboard.css";
const SummaryCard = ({ icon, title, value, color }) => (
  <div className="summary-card" style={{ '--card-color': color }}>
    <div className="summary-card-icon">{icon}</div>
    <div className="summary-card-info">
      <div className="summary-card-title">{title}</div>
      <div className="summary-card-value">{value}</div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="dashboard-content-area">

      <div className="dashboard-summary-cards">
        <SummaryCard icon={<Building size={24} />} title="Total Hostels" value="15" color="#2563eb" />
        <SummaryCard icon={<BedDouble size={24} />} title="Total Rooms" value="250" color="#db2777" />
        <SummaryCard icon={<CalendarCheck size={24} />} title="Active Bookings" value="180" color="#16a34a" />
        <SummaryCard icon={<Wallet size={24} />} title="Total Revenue" value="UGX 54,000,000" color="#f97316" />
      </div>

      <div className="dashboard-analytics-section">
        <div className="chart-container">
          <h3>Booking Trends</h3>
          <div className="placeholder-content">THESE WILL BE DEVEOPLED BY RAYMOND</div>
        </div>
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="placeholder-content">THESE WILL BE DEVEOPLED BY RAYMOND</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
