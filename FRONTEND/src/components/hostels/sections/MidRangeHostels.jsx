// ============================================
// FILE: components/hostels/sections/MidRangeHostels.jsx
// ============================================
import React from 'react';
import { HostelSection } from '../shared/HostelSection';

function MidRangeHostels() {
  return (
    <HostelSection 
      title="Mid Range Hostels"
      endpoint="midrangeHostels"
      variant="midrange"
      showDate={false}
    />
  );
}

export default MidRangeHostels;