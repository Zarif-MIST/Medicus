import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HomePage/HeroSection";
import RoleSection from "./components/HomePage/RoleSection";
import FeaturesSection from "./components/HomePage/FeaturesSection";
import WhatWeDoSection from "./components/HomePage/WhatWeDoSection";
import DoctorLoginPage from "./components/Doctorlog/Doctorlog";
import RegistrationPage from "./components/Doctorreg/Doctorreg";
import PatientRegistration from "./components/PatReg/PatRegistration";
import PharmacistRegistration from "./components/PharmReg/PharmacistRegistration";
import DoctorDashboardPage from "./components/DoctorDash/Doctordash";
import PatientDashboard from "./components/PatDash/PatDash";
import PharmacyDashboard from "./components/PharmDash/PharmDash";
import DoctorRecentPrescriptionsPage from "./components/DoctorDash/Recentpes";
import DiagnosisPage from "./components/Diagnosispage/Diagnosis";
import { AuthProvider } from "./context/AuthContext";

function HomePage() {
  return (
    <>
      <HeroSection />
      <RoleSection />
      <FeaturesSection />
      <WhatWeDoSection />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<DoctorLoginPage />} />
          <Route path="/doctorlogin" element={<DoctorLoginPage />} />
          <Route path="/doctorreg" element={<RegistrationPage />} />
          <Route path="/patientreg" element={<PatientRegistration />} />
          <Route path="/pharmacyreg" element={<PharmacistRegistration />} />
          <Route path="/doctordash/*" element={<DoctorDashboardPage />} />
          <Route path="/dashboard/*" element={<PatientDashboard />} />
          <Route path="/pharmacy/dashboard/*" element={<PharmacyDashboard />} />
          <Route path="/recentpes" element={<DoctorRecentPrescriptionsPage />} />
          <Route path="/diagnosis/:patientId" element={<DiagnosisPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
