import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const hostelService = {
  // Create a hostel
  createHostel: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/hostels`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating hostel:', error);
      throw error;
    }
  },

  // Create a room
  createRoom: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/rooms`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  // Get all hostels with optional filters
  getHostels: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`${API_BASE_URL}/hostels?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hostels:', error);
      throw error;
    }
  },

  // Get single hostel by ID
  getHostelById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hostels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hostel:', error);
      throw error;
    }
  },

  // Search hostels
  searchHostels: async (query, page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hostels/search/${encodeURIComponent(query)}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error searching hostels:', error);
      throw error;
    }
  },

  // Get list of cities
  getCities: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hostels/cities/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
};

export default hostelService;

