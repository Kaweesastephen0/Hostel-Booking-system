import React from 'react';
import FeaturedHostels from '../components/hostels/sections/FeaturedHostels';
import AffordableHostels from '../components/hostels/sections/AffordableHostels';
import MidRangeHostels from '../components/hostels/sections/MidRangeHostels';
import Hero from '../components/layout/hero/Hero';
import Gallery from '../components/hostels/sections/Gallery/gallery';

function HomePage() {
  return (
    <div className="home-page">
        <Hero/>
      <FeaturedHostels />
      <MidRangeHostels />
      <AffordableHostels />
        <Gallery/>
    </div>
  );
}

export default HomePage;