import api from './axios';

const toArray = (value) => (Array.isArray(value) ? value : []);

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

const mapId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value._id) return value._id.toString();
    if (value.id) return value.id.toString();
  }
  return null;
};

const buildMonthBuckets = (months = 12) => {
  const now = new Date();
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      name: date.toLocaleString('default', { month: 'short' }),
      bookings: 0
    };
  });
};

const getTotals = async () => {
  try {
    const user = getCurrentUser();
    const requests = [
      api.get('/hostels'),
      api.get('/rooms'),
      api.get('/bookings', { params: { limit: 1, page: 1 } })
    ];
    if (user?.role === 'admin') {
      requests.push(api.get('/users', { params: { limit: 1, page: 1 } }));
    }
    const [hostelsRes, roomsRes, bookingsRes, usersRes] = await Promise.all(requests);
    
    // Backend already filters data based on user role
    // Admins receive all data, managers receive only their data
    let hostels = toArray(hostelsRes?.data?.data);
    let rooms = toArray(roomsRes?.data?.data);
    
    const bookingsPayload = bookingsRes?.data?.data;
    const totalBookings = typeof bookingsPayload?.total === 'number'
      ? bookingsPayload.total
      : toArray(bookingsPayload?.bookings).length;
    const usersPayload = usersRes?.data?.data;
    const totalUsers = typeof usersPayload?.total === 'number'
      ? usersPayload.total
      : toArray(usersPayload?.users).length;
    return {
      totalHostels: hostels.length,
      totalRooms: rooms.length,
      totalBookings,
      totalUsers
    };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch dashboard totals';
    throw new Error(message);
  }
};

const mapBookingRecord = (booking) => {
  const identifier = booking?._id || booking?.id || '';
  return {
    id: identifier,
    reference: booking?.reference || (identifier ? `BK-${identifier.toString().slice(-6)}` : 'N/A'),
    guestName: booking?.guestName || 'Unknown Guest',
    hostelName: booking?.hostelName || booking?.roomNumber || 'N/A',
    createdAt: booking?.createdAt || booking?.checkIn || new Date().toISOString(),
    status: booking?.status || 'pending'
  };
};

const getRecentBookings = async (limit = 5) => {
  try {
    const response = await api.get('/bookings', {
      params: { limit, page: 1, sort: 'createdAt', order: 'desc' }
    });
    const bookings = toArray(response?.data?.data?.bookings);
    return bookings.map(mapBookingRecord);
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch recent bookings';
    throw new Error(message);
  }
};

const getMonthlyBookings = async () => {
  try {
    const user = getCurrentUser();
    if (user?.role === 'admin') {
      const response = await api.get('/bookings/stats/monthly');
      const stats = toArray(response?.data?.data);
      const buckets = buildMonthBuckets(12);
      const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));
      stats.forEach((stat) => {
        const month = stat?._id?.month;
        const year = stat?._id?.year;
        if (!month || !year) {
          return;
        }
        const key = `${year}-${month - 1}`;
        const bucket = bucketMap.get(key);
        if (bucket) {
          bucket.bookings = stat.count || 0;
        }
      });
      return buckets.map(({ name, bookings }) => ({ name, bookings }));
    }
    const response = await api.get('/bookings', {
      params: { limit: 500, page: 1, sort: 'createdAt', order: 'desc' }
    });
    const bookings = toArray(response?.data?.data?.bookings);
    const buckets = buildMonthBuckets(12);
    const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));
    bookings.forEach((booking) => {
      const dateSource = booking?.createdAt || booking?.checkIn;
      if (!dateSource) {
        return;
      }
      const parsed = new Date(dateSource);
      if (Number.isNaN(parsed.getTime())) {
        return;
      }
      const key = `${parsed.getFullYear()}-${parsed.getMonth()}`;
      const bucket = bucketMap.get(key);
      if (bucket) {
        bucket.bookings += 1;
      }
    });
    return buckets.map(({ name, bookings }) => ({ name, bookings }));
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch monthly booking statistics';
    throw new Error(message);
  }
};

export default {
  getTotals,
  getRecentBookings,
  getMonthlyBookings
};
