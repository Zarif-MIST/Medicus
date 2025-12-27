import React from 'react';
import HeroSection from '../components/HomePage/HeroSection';
import RoleSection from '../components/HomePage/RoleSection';
import FeaturesSection from '../components/HomePage/FeaturesSection';
import WhatWeDoSection from '../components/HomePage/WhatWeDoSection';
import Pharmacy from '../components/PharmacyReg/pharmacyreg';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <RoleSection />
      <FeaturesSection />
      <WhatWeDoSection />
      <Pharmacy />
    </div>
  );
}
