import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import HeroSection from "./components/HomePage/HeroSection";
import RoleSection from "./components/HomePage/RoleSection";
import FeaturesSection from "./components/HomePage/FeaturesSection";
import WhatWeDoSection from "./components/HomePage/WhatWeDoSection";
import RegisterSection from "./components/PatReg/PatRegistration";
import PharmacistRegistration from "./components/PharmReg/PharmacistRegistration";
import DoctorRegistration from "./components/DoctorReg/Doctorreg";
import DoctorDash from "./components/DoctorDash/Doctordash";
import PharmDash from "./components/PharmDash/PharmDash";
import PharmDashPres from "./components/PharmDash/PharmDashPres";
import PharmDashInventory from "./components/PharmDash/PharmDashInventory";
import PatientDashboard from "./components/PatDash/PatDash";
import PatientPrescriptionsDashboard from "./components/PatDash/PatDashPres";
import PatientMedicalRecordsDashboard from "./components/PatDash/PatDashMed";
import DoctorLog from "./components/Login/DoctorLog";
import DiagnosisPage from "./components/Diagnosis_Page/Diagnosis";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<><HeroSection /><RoleSection /><FeaturesSection /><WhatWeDoSection /></> } />
          <Route path="/login" element={<DoctorLog />} />
          <Route path="/register" element={<RegisterSection />} />
          <Route path="/doctor-register" element={<DoctorRegistration />} />
          <Route path="/pharmacist-register" element={<PharmacistRegistration />} />
          <Route path="/doctor-dashboard/*" element={<DoctorDash />} />
          <Route path="/doctor/diagnosis/:patientId" element={<DiagnosisPage />} />
          <Route path="/pharmacy-dashboard" element={<PharmDash />} />
          <Route path="/pharmacy-prescriptions" element={<PharmDashPres />} />
          <Route path="/pharmacy-inventory" element={<PharmDashInventory />} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/prescriptions" element={<PatientPrescriptionsDashboard />} />
          <Route path="/medical-records" element={<PatientMedicalRecordsDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
