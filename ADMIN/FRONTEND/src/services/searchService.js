import instance from './axios';

const searchService = {
  globalSearch: async (query) => {
    try {
      const response = await instance.get('/search/global', {
        params: { query }
      });
      return response.data?.data || {};
    } catch (error) {
      console.error('Global search error:', error);
      throw error.response?.data || error.message;
    }
  },

  searchByType: async (type, query, page = 1, limit = 20) => {
    try {
      const response = await instance.get(`/search/${type}`, {
        params: { query, page, limit }
      });
      return response.data?.data || [];
    } catch (error) {
      console.error(`Search by type (${type}) error:`, error);
      throw error.response?.data || error.message;
    }
  },

  searchUsers: async (query) => {
    return searchService.searchByType('users', query);
  },

  searchFrontUsers: async (query) => {
    return searchService.searchByType('frontusers', query);
  },

  searchHostels: async (query) => {
    return searchService.searchByType('hostels', query);
  },

  searchRooms: async (query) => {
    return searchService.searchByType('rooms', query);
  },

  searchBookings: async (query) => {
    return searchService.searchByType('bookings', query);
  },

  searchPayments: async (query) => {
    return searchService.searchByType('payments', query);
  }
};

export default searchService;
