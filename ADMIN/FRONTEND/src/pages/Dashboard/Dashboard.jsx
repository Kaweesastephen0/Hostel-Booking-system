import React from "react";
import {
  Building,
  BedDouble,
  CalendarCheck,
  Wallet,
  Plus,
} from "lucide-react";
import Header from "../../components/header/Header";
import InfoCard from "../../components/cards/InfoCard";
import BookingChart from "../../components/charts/BookingChart";
import DataTable from "../../components/table/DataTable";
import "./Dashboard.css";

const bookingChartData = [
  { name: 'Jan', bookings: 65 },
  { name: 'Feb', bookings: 59 },
  { name: 'Mar', bookings: 80 },
  { name: 'Apr', bookings: 81 },
  { name: 'May', bookings: 56 },
  { name: 'Jun', bookings: 55 },
  { name: 'Jul', bookings: 40 },
];

const recentBookingsData = [
  { id: 'BK001', student: 'John Doe', hostel: 'Nana Hostel', date: '2024-05-20', status: 'Confirmed' },
  { id: 'BK002', student: 'Jane Smith', hostel: 'Akamwesi Hostel', date: '2024-05-19', status: 'Pending' },
  { id: 'BK003', student: 'Peter Jones', hostel: 'Olympia Hostel', date: '2024-05-19', status: 'Confirmed' },
  { id: 'BK004', student: 'Mary Williams', hostel: 'Kare Hostel', date: '2024-05-18', status: 'Cancelled' },
];

const recentBookingsColumns = [
  { Header: 'Booking ID', accessor: 'id' },
  { Header: 'Student', accessor: 'student' },
  { Header: 'Hostel', accessor: 'hostel' },
  { Header: 'Date', accessor: 'date' },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: (row) => (
      <span className={`status-badge status-${row.status.toLowerCase()}`}>
        {row.status}
      </span>
    ),
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const Dashboard = () => {
  // The user name here will come from an auth context
  const userName = "Raymond";

  return (
    <div className="dashboard-content-area">
      <Header
        title={`${getGreeting()}, ${userName}!`}
        subtitle="Here's what's happening with your hostels today."
      >
        <button className="btn btn-primary"><Plus size={16} /> Add New Hostel</button>
      </Header>
      <div className="dashboard-summary-cards">
        <InfoCard
          title="Total Hostels"
          value="15"
          icon={<Building size={24} />}
        />
        <InfoCard
          title="Available Rooms"
          value="250"
          icon={<BedDouble size={24} />}
        />
        <InfoCard
          title="Active Bookings"
          value="180"
          icon={<CalendarCheck size={24} />}
        />
        <InfoCard
          title="Total Revenue"
          value="UGX 54M"
          icon={<Wallet size={24} />}
        />
      </div>

      <div className="dashboard-analytics-section">
        <BookingChart data={bookingChartData} />
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <DataTable columns={recentBookingsColumns} data={recentBookingsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
