const API_URL = 'http://localhost:5000/api/hostels';

const handleResponse = async (response) => {
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Something went wrong');
  }
  return json.data;
};

export const getAllHostels = async () => {
  const response = await fetch(API_URL);
  return handleResponse(response);
};

export const getHostelById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
};

export const createHostel = async (hostelData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hostelData),
  });
  return handleResponse(response);
};

export const updateHostel = async (id, hostelData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hostelData),
  });
  return handleResponse(response);
};

export const deleteHostel = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};