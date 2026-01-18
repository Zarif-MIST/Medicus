// src/components/PatientPrescriptionsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatDash.css';

export default function PatientPrescriptionsDashboard() {
  const [patientName, setPatientName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the patient's name from localStorage
    const name = localStorage.getItem('patientName');
    if (name) {
      setPatientName(name);
    }
  }, []);

  return (
    <div className="dashboard">
      {/* Welcome Back Card */}
      {patientName && (
        <div className="welcome-card">
          <div className="welcome-content">
            <h2 className="welcome-title">Welcome back, {patientName}!</h2>
            <p className="welcome-message">Your health is our priority. Check your latest medical information below.</p>
          </div>
        </div>
      )}

      {/* Top Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon visits">15</div>
          <div className="summary-label">Medical Visits</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon prescriptions">3</div>
          <div className="summary-label">Active Prescriptions</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className="tab" onClick={() => navigate('/dashboard')}>Overview</button>
        <button className="tab active" onClick={() => navigate('/prescriptions')}>Prescriptions</button>
        <button className="tab" onClick={() => navigate('/medical-records')}>Medical Records</button>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* All Prescriptions */}
        <div className="section-card large">
          <div className="section-header">
            <h3>All Prescriptions</h3>
          </div>

          {/* Active Prescription */}
          <div className="prescription-item">
            <div className="prescription-name">Amoxicillin 500mg</div>
            <div className="prescription-doctor">Prescribed by Dr. Anis</div>
            <div className="prescription-details">
              <div>
                <strong>Dosage</strong><br />
                3 times daily
              </div>
              <div>
                <strong>Duration</strong><br />
                7 days
              </div>
            </div>
            <div className="prescription-instructions">
              Instructions: Take with food
            </div>
          </div>

          {/* Completed Prescription */}
          <div className="prescription-item">
            <div className="prescription-name">Ibuprofen 400mg</div>
            <div className="prescription-doctor">Prescribed by Dr. Basit</div>
            <div className="prescription-details">
              <div>
                <strong>Dosage</strong><br />
                As needed
              </div>
              <div>
                <strong>Duration</strong><br />
                14 days
              </div>
            </div>
            <div className="prescription-instructions">
              Instructions: Take after meals
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div className="section-card">
          <div className="section-header">
            <h3>Health Tips</h3>
          </div>
          <ul className="tips-list">
            <li>Take your medications as prescribed</li>
            <li>Drink at least 8 glasses of water daily</li>
            <li>Exercise for 30 minutes daily</li>
            <li>Get 7-8 hours of sleep</li>
          </ul>
        </div>
      </div>
    </div>
  );
}