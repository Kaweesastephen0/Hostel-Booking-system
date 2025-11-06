import axios from './axios';

const API_URL = '/rooms'; // Base URL is handled by axios instance

const handleResponse = (response) => {
  const data = response.data;
  
  // Handle your backend response structure
  if (data.success && Array.isArray(data.data)) {
    return data.data; // Return the rooms array
  } else {
    console.warn('Unexpected API response structure:', data);
    return [];
  }
};

/**
 * Fetches all rooms from the backend.
 * @returns {Promise<Array>} - A promise that resolves to an array of rooms.
 */
export const getAllRooms = async () => {
  const response = await axios.get(API_URL);
  return handleResponse(response);
};

/**
 * Creates a new room.
 * @param {object} roomData - The data for the new room.
 * @returns {Promise<object>} - A promise that resolves to the newly created room.
 */
export const createRoom = async (roomData) => {
  const response = await axios.post(API_URL, roomData);
  return handleResponse(response);
};

/**
 * Updates an existing room.
 * @param {string} id - The ID of the room to update.
 * @param {object} roomData - The new data for the room.
 * @param {object} roomData - The new data for the room.
 * @returns {Promise<object>} - A promise that resolves to the updated room.
 */
export const updateRoom = async (id, roomData) => {
  const response = await axios.put(`${API_URL}/${id}`, roomData);
  return handleResponse(response);
};

/**
 * Dele
 * @param {string} id - The ID of the room to delete.
 */
export const deleteRoom = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};