import React, { useState, useEffect, useMemo } from "react";
import {
  Building,
  BedDouble,
  CalendarCheck,
  Users,
  Loader2,
} from "lucide-react";
import { Button } from "@mui/material";
import Header from "../../components/header/Header";
import InfoCard from "../../components/cards/InfoCard";
import BookingChart from "../../components/charts/BookingChart";
import DataTable from "../../components/table/DataTable";
import dashboardService from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";



const recentBookingsColumns = [
  { Header: 'Booking ID', accessor: 'reference' },
  { Header: 'Student', accessor: 'guestName' },
  { Header: 'Hostel', accessor: 'hostelName' },
  {
    Header: 'Date',
    accessor: 'createdAt',
    Cell: ({ value }) => new Date(value).toLocaleDateString()
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ value }) => {
      const status = value || 'pending';
      return (
        <span className={`status-badge status-${status.toLowerCase()}`}>
          {status}
        </span>
      );
    },
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const userRole = currentUser?.role || 'manager';

  const [totals, setTotals] = useState({
    totalHostels: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalUsers: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardTotals, bookings] = await Promise.all([
        dashboardService.getTotals(),
        dashboardService.getRecentBookings()
      ]);
      setTotals(dashboardTotals);
      setRecentBookings(bookings);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      setRecentBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Error loading dashboard: {error}</p>
        <button onClick={fetchDashboardData} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="dashboard-content-area">
      <Header
        title="Dashboard"
        subtitle="Here's what's happening with your hostels today."
        showGreeting={true}
      >
        {userRole === 'manager' && (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Building size={16} />}
              onClick={() => navigate('/hostels/new')}
            >
              Add Hostel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<BedDouble size={16} />}
              onClick={() => navigate('/rooms/new')}
            >
              Add Room
            </Button>
          </>
        )}
      </Header>

      <div className="dashboard-summary-cards">
        <InfoCard
          title="Total Hostels"
          value={loading ? <Loader2 className="animate-spin" size={24} /> : totals.totalHostels}
          icon={<Building size={24} />}
        />
        <InfoCard
          title="Available Rooms"
          value={loading ? <Loader2 className="animate-spin" size={24} /> : totals.totalRooms}
          icon={<BedDouble size={24} />}
        />
        <InfoCard
          title="Active Bookings"
          value={loading ? <Loader2 className="animate-spin" size={24} /> : totals.totalBookings}
          icon={<CalendarCheck size={24} />}
        />
        {currentUser.role === 'admin' ? (
          <InfoCard
            title="Total Users"
            value={loading ? <Loader2 className="animate-spin" size={24} /> : totals.totalUsers}
            icon={<Users size={24} />}
          />
        ) : (" ")}
      </div>

      <div className="dashboard-analytics-section">
        <BookingChart />
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          {loading ? (
            <div className="loading-spinner">
              <Loader2 className="animate-spin" size={24} />
              <span>Loading recent bookings...</span>
            </div>
          ) : (
            <DataTable
              columns={recentBookingsColumns}
              data={recentBookings}
              emptyMessage="No recent bookings found"
            />
          )}
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
