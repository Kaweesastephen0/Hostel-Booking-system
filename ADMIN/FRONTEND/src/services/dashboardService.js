import axios from 'axios';

// Base API URL for admin backend (fallback to localhost:5000)
const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api';

const dashboardService = {
  // Fetch counts for hostels, rooms, bookings and users
  getTotals: async () => {
    try {
      const hostelsReq = axios.get(`${API_BASE_URL}/hostels`);
      const roomsReq = axios.get(`${API_BASE_URL}/rooms`);
      const bookingsReq = axios.get(`${API_BASE_URL}/bookings?limit=1&page=1`);
      const usersReq = axios.get(`${API_BASE_URL}/users?limit=1&page=1`);

      const [hostelsRes, roomsRes, bookingsRes, usersRes] = await Promise.all([
        hostelsReq,
        roomsReq,
        bookingsReq,
        usersReq,
      ]);

      const totalHostels = Array.isArray(hostelsRes.data?.data)
        ? hostelsRes.data.data.length
        : 0;

      const totalRooms = typeof roomsRes.data?.count === 'number'
        ? roomsRes.data.count
        : Array.isArray(roomsRes.data?.data)
          ? roomsRes.data.data.length
          : 0;

      const totalBookings = typeof bookingsRes.data?.data?.total === 'number'
        ? bookingsRes.data.data.total
        : Array.isArray(bookingsRes.data?.data?.bookings)
          ? bookingsRes.data.data.bookings.length
          : 0;

      const totalUsers = typeof usersRes.data?.data?.total === 'number'
        ? usersRes.data.data.total
        : Array.isArray(usersRes.data?.data?.users)
          ? usersRes.data.data.users.length
          : 0;

      return { totalHostels, totalRooms, totalBookings, totalUsers };
    } catch (err) {
      // Normalize error
      const message = err.response?.data?.message || err.message || 'Failed to fetch dashboard totals';
      throw new Error(message);
    }
  },

  // Fetch monthly booking statistics
  getMonthlyBookings: async () => {
    try {
      // First ensure we have the auth token in headers
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(`${API_BASE_URL}/bookings/stats/monthly`);
      
      // Transform the data for the chart
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      // Create last 12 months of data
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const monthIndex = (currentMonth - 11 + i + 12) % 12;
        return {
          name: monthNames[monthIndex],
          bookings: 0,
          year: monthIndex > currentMonth ? currentYear - 1 : currentYear
        };
      });

      // Fill in actual booking counts
      if (response.data?.data) {
        response.data.data.forEach(stat => {
          const monthIndex = monthlyData.findIndex(m => 
            m.name === monthNames[stat._id.month - 1] && 
            m.year === stat._id.year
          );
          if (monthIndex !== -1) {
            monthlyData[monthIndex].bookings = stat.count;
          }
        });
      }

      return monthlyData;
    } catch (err) {
      console.error('Booking stats error:', err.response || err);
      const message = err.response?.data?.message || err.message || 'Failed to fetch monthly booking statistics';
      throw new Error(message);
    }
  },
};

export default dashboardService;
