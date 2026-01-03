import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import HeroSection from "./components/HomePage/HeroSection";
import RoleSection from "./components/HomePage/RoleSection";
import FeaturesSection from "./components/HomePage/FeaturesSection";
import RegisterSection from "./components/PatReg/PatRegistration";
import PharmacistRegistration from "./components/PharmReg/PharmacistRegistration";
import PharmDash from "./components/PharmDash/PharmDash";
import PharmDashPres from "./components/PharmDash/PharmDashPres";
import PharmDashInventory from "./components/PharmDash/PharmDashInventory";
import PatientDashboard from "./components/PatDash/PatDash";
import PatientPrescriptionsDashboard from "./components/PatDash/PatDashPres";
import PatientMedicalRecordsDashboard from "./components/PatDash/PatDashMed";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<><HeroSection /><RoleSection /><FeaturesSection /></>} />
        <Route path="/register" element={<RegisterSection />} />
        <Route path="/pharmacist-register" element={<PharmacistRegistration />} />
        <Route path="/pharmacy-dashboard" element={<PharmDash />} />
        <Route path="/pharmacy-prescriptions" element={<PharmDashPres />} />
        <Route path="/pharmacy-inventory" element={<PharmDashInventory />} />
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/prescriptions" element={<PatientPrescriptionsDashboard />} />
        <Route path="/medical-records" element={<PatientMedicalRecordsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
