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
};

export default dashboardService;
