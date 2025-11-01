// utils/hostelUtils.js

export const getHostelType = (hostel) => {
  if (!hostel?.HostelGender) return null;
  
  const genderMap = {
    mixed: 'Mixed',
    female: 'Female',
    male: 'Male'
  };
  
  return genderMap[hostel.HostelGender.toLowerCase()] || null;
};

export const formatDate = () => {
  const date = new Date();
  return `${date.toLocaleString('default', { weekday: 'long' })} ${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
};

export const getHostelImage = (hostel) => {
  if (hostel?.image) return hostel.image;
  
  if (hostel?.images && Array.isArray(hostel.images) && hostel.images.length > 0) {
    const imageUrl = hostel.images[0];
    return imageUrl.startsWith('http') 
      ? imageUrl 
      : `http://localhost:5000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }
  
  return null;
};