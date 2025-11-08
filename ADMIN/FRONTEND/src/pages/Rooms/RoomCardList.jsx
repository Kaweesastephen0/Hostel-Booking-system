import React from 'react';
import { Box } from '@mui/material';
import RoomCard from './RoomCard';

const RoomCardList = ({ rooms, onEdit, onDelete }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px 0',
      }}
    >
      {rooms.map((room) => (
        <RoomCard key={room._id} room={room} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </Box>
  );
};

export default RoomCardList;
