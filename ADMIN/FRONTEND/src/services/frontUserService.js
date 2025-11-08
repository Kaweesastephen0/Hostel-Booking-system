import axios from './axios';

const API_URL = '/frontusers';

const handleResponse = (res) => res.data.data;

export const getAllFrontUsers = async () => {
  const response = await axios.get(API_URL);
  return handleResponse(response);
};

export const getFrontUser = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return handleResponse(response);
};

export const updateFrontUser = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return handleResponse(response);
};

export const deleteFrontUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
