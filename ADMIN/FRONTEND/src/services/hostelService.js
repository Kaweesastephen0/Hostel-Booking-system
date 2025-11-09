import axios from './axios';

const API_URL = '/hostels'; // Base URL is handled by axios instance

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
  console.error('Hostel service error:', message);
  throw new Error(message);
};

export const getAllHostels = async () => {
  try {
    const response = await axios.get(API_URL);
    const data = handleResponse(response);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleError(error);
  }
};

export const getHostelById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const createHostel = async (hostelData) => {
  try {
    const response = await axios.post(API_URL, hostelData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const updateHostel = async (id, hostelData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, hostelData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const deleteHostel = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};