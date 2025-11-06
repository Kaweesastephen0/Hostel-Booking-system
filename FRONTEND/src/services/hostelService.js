import axios from './axios';

const API_URL = '/hostels'; // Base URL is handled by axios instance

const handleResponse = (response) => response.data.data;

export const getAllHostels = async () => {
  const response = await axios.get(API_URL);
  return handleResponse(response);
};

export const getHostelById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return handleResponse(response);
};

export const createHostel = async (hostelData) => {
  const response = await axios.post(API_URL, hostelData);
  return handleResponse(response);
};

export const updateHostel = async (id, hostelData) => {
  const response = await axios.put(`${API_URL}/${id}`, hostelData);
  return handleResponse(response);
};

export const deleteHostel = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};