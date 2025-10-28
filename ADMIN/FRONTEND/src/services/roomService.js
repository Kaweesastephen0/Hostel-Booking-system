const API_BASE_URL = 'http://localhost:5000/api';

/**
 * A helper function to handle API responses.
 * @param {Response} response - The response from the fetch call.
 * @returns {Promise<any>} - The JSON data from the response.
 * @throws {Error} - Throws an error if the response is not ok.
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data.data;
};

/**
 * Fetches all rooms from the backend.
 * @returns {Promise<Array>} - A promise that resolves to an array of rooms.
 */
export const getAllRooms = async () => {
  const response = await fetch(`${API_BASE_URL}/rooms`);
  return handleResponse(response);
};

/**
 * Creates a new room.
 * @param {object} roomData - The data for the new room.
 * @returns {Promise<object>} - A promise that resolves to the newly created room.
 */
export const createRoom = async (roomData) => {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roomData),
  });
  return handleResponse(response);
};

/**
 * Updates an existing room.
 * @param {string} id - The ID of the room to update.
* @param {object} roomData - The new data for the room.
 * @returns {Promise<object>} - A promise that resolves to the updated room.
 */
export const updateRoom = async (id, roomData) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roomData),
  });
  return handleResponse(response);
};

/**
 * Deletes a room.
 * @param {string} id - The ID of the room to delete.
 */
export const deleteRoom = async (id) => {
  await fetch(`${API_BASE_URL}/rooms/${id}`, { method: 'DELETE' });
};