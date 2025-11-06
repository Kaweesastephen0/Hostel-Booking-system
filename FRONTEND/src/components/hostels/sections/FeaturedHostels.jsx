import React from 'react';
import { HostelSection } from '../shared/HostelSection';

function FeaturedHostels() {
  return (
    <HostelSection 
      title="Premium Student Hostels"
      endpoint="premium"
      variant="premium"
      showDate={true}
    />
  );
}

export default FeaturedHostels;