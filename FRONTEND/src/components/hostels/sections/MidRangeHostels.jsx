
import React from 'react';
import { HostelSection } from '../shared/HostelSection';

function MidRangeHostels() {
  return (
    <HostelSection 
      title="Mid Range Hostels"
      endpoint="midrange"
      variant="midrange"
      showDate={false}
    />
  );
}

export default MidRangeHostels;