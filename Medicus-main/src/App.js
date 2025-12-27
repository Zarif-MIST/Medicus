import Navbar from "./components/Navbar";
import HeroSection from "./components/HomePage/HeroSection";
import RoleSection from "./components/HomePage/RoleSection";
import FeaturesSection from "./components/HomePage/FeaturesSection";
import WhatWeDoSection from "./components/HomePage/WhatWeDoSection";
import RegistrationPage from "./components/doctoregistration/regpage";
import React from "react";
import DoctorLoginPage from "./components/doctorlogin/loginpage";
import DoctorDashboardPage from "./components/doctordash/dashpage.jsx";
import DiagnosisPage from "./components/doctorpatientpage/diagnosispage.jsx";
import DoctorRecentPrescriptionsPage from "./components/doctordash/recentpes.jsx";
function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <RoleSection />
      <FeaturesSection />
      <WhatWeDoSection />  
      <RegistrationPage />
      <DoctorLoginPage />
      <DoctorDashboardPage />
      <DiagnosisPage />
      <DoctorRecentPrescriptionsPage />
      <main>
        <h1>Welcome to Medicus</h1>
          <h1 className="text-3xl font-bold underline text-blue-600">
      Hello world!
    </h1>
      </main>
    </>
  );
}

export default App;
