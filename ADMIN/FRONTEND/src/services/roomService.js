import axios from './axios';

const API_URL = '/rooms';

const handleResponse = (response) => {
  const payload = response?.data;

  if (!payload) {
    throw new Error('No response received from server');
  }

  if (payload.success === false) {
    throw new Error(payload.message || 'Request failed');
  }

  if (payload.data !== undefined) {
    return payload.data;
  }

  return payload;
};

const handleError = (error) => {
  const message = error.response?.data?.message || error.message || 'Request failed';
  console.error('Room service error:', message);
  throw new Error(message);
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);

export const getAllRooms = async () => {
  try {
    const response = await axios.get(API_URL);
    return ensureArray(handleResponse(response));
  } catch (error) {
    handleError(error);
  }
};

export const getRoomsByHostelId = async (hostelId) => {
  try {
    const response = await axios.get(`${API_URL}/hostel/${hostelId}`);
    return ensureArray(handleResponse(response));
  } catch (error) {
    handleError(error);
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const resolveConfig = (roomData) =>
  roomData instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : { headers: { 'Content-Type': 'application/json' } };

export const createRoom = async (roomData) => {
  try {
    const response = await axios.post(API_URL, roomData, resolveConfig(roomData));
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, roomData, resolveConfig(roomData));
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const deleteRoom = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const searchRooms = async (filters = {}) => {
  try {
    const response = await axios.get(API_URL, { params: filters });
    return ensureArray(handleResponse(response));
  } catch (error) {
    handleError(error);
  }
};
