import React, { useState, useEffect } from "react";
import {
  Building,
  BedDouble,
  CalendarCheck,
  Users,
  Loader2,
} from "lucide-react";
import Header from "../../components/header/Header";
import InfoCard from "../../components/cards/InfoCard";
import BookingChart from "../../components/charts/BookingChart";
import DataTable from "../../components/table/DataTable";
import dashboardService from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import HostelForm from "../../components/hostels/HostelForm";
import RoomForm from "../Rooms/RoomForm";
import Modal from "../../components/modal/Modal";

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

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isHostelModalOpen, setIsHostelModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [totals, setTotals] = useState({
    totalHostels: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalUsers: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingChartData, setBookingChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAction = (action) => {
    switch (action) {
      case 'add-hostel':
        navigate('/hostels/new');
        break;
      case 'add-room':
        navigate('/rooms/new');
        break;
      case 'add-user':
        navigate('/users/new');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'create-report':
        navigate('/reports/new');
        break;
      case 'view-reports':
        navigate('/reports');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
       
        const dashboardTotals = await dashboardService.getTotals();
        setTotals(dashboardTotals);

        
        const response = await fetch('http://localhost:5000/api/bookings?limit=5&sort=-createdAt');
        const data = await response.json();
        if (data.success && Array.isArray(data.data?.bookings)) {
          
          const mappedBookings = data.data.bookings.map(booking => ({
            reference: booking.reference || `BK-${booking._id?.slice(-6)}` || 'N/A',
            guestName: booking.guestName || 'Unknown Guest',
            hostelName: booking.hostelName || 'N/A',
            createdAt: booking.createdAt || new Date().toISOString(),
            status: booking.status || 'pending'
          }));
          setRecentBookings(mappedBookings);
        } else {
          setRecentBookings([]);
        }

        // Calculating of the  booking chart data (last 7 months)
        const months = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          return d.toLocaleString('default', { month: 'short' });
        }).reverse();
        
        //Implementation of real booking statistics endpoint
        setBookingChartData(months.map(name => ({
          name,
          bookings: Math.floor(Math.random() * 100)
        })));

      } catch(err) {
        console.error('Dashboard data error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // The user name will come from an auth context
  const userName = "Raymond";

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Error loading dashboard: {error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
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
        <button 
          className="btn btn-primary" 
          onClick={() => setIsHostelModalOpen(true)}
        >
          <Building size={16} /> Add Hostel
        </button>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsRoomModalOpen(true)}
        >
          <BedDouble size={16} /> Add Room
        </button>
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
        <InfoCard
          title="Total Users"
          value={loading ? <Loader2 className="animate-spin" size={24} /> : totals.totalUsers}
          icon={<Users size={24} />}
        />
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

      <Modal
        isOpen={isHostelModalOpen}
        onClose={() => setIsHostelModalOpen(false)}
        title="Add New Hostel"
      >
        <HostelForm
          onSubmit={async (data) => {
            try {
              await dashboardService.createHostel(data);
              setIsHostelModalOpen(false);
              fetchDashboardData(); // Refresh data
            } catch (error) {
              console.error('Failed to create hostel:', error);
            }
          }}
          onCancel={() => setIsHostelModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        title="Add New Room"
      >
        <RoomForm
          onSubmit={async (data) => {
            try {
              await dashboardService.createRoom(data);
              setIsRoomModalOpen(false);
              fetchDashboardData(); // Refresh data
            } catch (error) {
              console.error('Failed to create room:', error);
            }
          }}
          onCancel={() => setIsRoomModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
