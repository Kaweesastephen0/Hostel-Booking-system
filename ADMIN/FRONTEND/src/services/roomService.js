import axios from './axios';

const API_URL = '/rooms';

const handleResponse = (response) => {
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Request failed');
  }
};

const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error || 'Server error occurred';
    throw new Error(message);
  } else if (error.request) {
    // Request made but no response received
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Something else happened
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

/**
 * Fetches all rooms from the backend.
 * @returns {Promise<Array>} - A promise that resolves to an array of rooms.
 */
export const getAllRooms = async () => {
  try {
    const response = await axios.get(API_URL);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Fetches rooms by hostel ID
 * @param {string} hostelId - The ID of the hostel
 * @returns {Promise<Array>} - A promise that resolves to an array of rooms
 */
export const getRoomsByHostelId = async (hostelId) => {
  try {
    const response = await axios.get(`${API_URL}/hostel/${hostelId}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Fetches a single room by ID
 * @param {string} id - The ID of the room
 * @returns {Promise<object>} - A promise that resolves to the room object
 */
export const getRoomById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Creates a new room.
 * @param {object|FormData} roomData - The data for the new room.
 * @returns {Promise<object>} - A promise that resolves to the newly created room.
 */
export const createRoom = async (roomData) => {
  try {
    let config = {};
    
    // Check if roomData is FormData (for file upload) or regular object
    if (roomData instanceof FormData) {
      config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    } else {
      config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    const response = await axios.post(API_URL, roomData, config);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Updates an existing room.
 * @param {string} id - The ID of the room to update.
 * @param {object|FormData} roomData - The new data for the room.
 * @returns {Promise<object>} - A promise that resolves to the updated room.
 */
export const updateRoom = async (id, roomData) => {
  try {
    let config = {};
    
    // Check if roomData is FormData (for file upload) or regular object
    if (roomData instanceof FormData) {
      config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    } else {
      config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    const response = await axios.put(`${API_URL}/${id}`, roomData, config);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Deletes a room.
 * @param {string} id - The ID of the room to delete.
 * @returns {Promise<object>} - A promise that resolves to the deletion response.
 */
export const deleteRoom = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Search rooms with filters
 * @param {object} filters - The filters to apply
 * @returns {Promise<Array>} - A promise that resolves to filtered rooms
 */
export const searchRooms = async (filters = {}) => {
  try {
    const response = await axios.get(API_URL, { params: filters });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};