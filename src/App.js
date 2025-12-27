import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import PharmacyDashboard from "./components/PharmacyDashboard/PharmacyDashboard";
import PharmacyPrescriptions from "./components/PharmacyPrescriptions/PharmacyPrescriptions";
import PharmacyInventory from "./components/PharmacyInventory/PharmacyInventory";
import Pharmacy from "./components/PharmacyReg/pharmacyreg";

function PharmacyLoginRoute() {
  const navigate = useNavigate();
  return (
    <Pharmacy onViewChange={(v) => {
      if (v === 'prescriptions') navigate('/pharmacy/prescriptions');
      else if (v === 'inventory') navigate('/pharmacy/inventory');
      else navigate('/pharmacy');
    }} />
  );
}
function PharmacyDashboardRoute() {
  const navigate = useNavigate();
  return (
    <PharmacyDashboard onViewChange={(v) => {
      if (v === 'prescriptions') navigate('/pharmacy/prescriptions');
      else if (v === 'inventory') navigate('/pharmacy/inventory');
      else navigate('/pharmacy');
    }} />
  );
}

function PharmacyPrescriptionsRoute() {
  const navigate = useNavigate();
  return (
    <PharmacyPrescriptions onViewChange={(v) => {
      if (v === 'dashboard') navigate('/pharmacydash');
      else if (v === 'inventory') navigate('/pharmacy/inventory');
    }} />
  );
}

function PharmacyInventoryRoute() {
  const navigate = useNavigate();
  return (
    <PharmacyInventory onViewChange={(v) => {
      if (v === 'dashboard') navigate('/pharmacydash');
      else if (v === 'prescriptions') navigate('/pharmacy/prescriptions');
    }} />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Home />} />
        <Route path="/doctors" element={<div style={{padding:40}}>Doctors page (placeholder)</div>} />
        <Route path="/patients" element={<div style={{padding:40}}>Patients page (placeholder)</div>} />
        <Route path="/contact" element={<div style={{padding:40}}>Contact page (placeholder)</div>} />

        <Route path="/pharmacy" element={<PharmacyLoginRoute />} />
        <Route path="/pharmacydash" element={<PharmacyDashboardRoute />} />
        <Route path="/pharmacy/prescriptions" element={<PharmacyPrescriptionsRoute />} />
        <Route path="/pharmacy/inventory" element={<PharmacyInventoryRoute />} />

      </Routes>
    </BrowserRouter>
  );
}
