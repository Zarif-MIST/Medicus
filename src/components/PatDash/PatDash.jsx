// src/components/PatientDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatDash.css';

export default function PatientDashboard() {
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
        <button className="tab active" onClick={() => navigate('/dashboard')}>Overview</button>
        <button className="tab" onClick={() => navigate('/prescriptions')}>Prescriptions</button>
        <button className="tab" onClick={() => navigate('/medical-records')}>Medical Records</button>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Active Prescriptions */}
        <div className="section-card large">
          <div className="section-header">
            <h3>Active Prescriptions</h3>
    
          </div>
          <div className="prescription-item">
            <div className="prescription-name">Amoxicillin 500mg <br /></div>
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
        </div>

        {/* Recent Medical History */}
        <div className="section-card large">
          <div className="section-header">
            <h3>Recent Medical History</h3>
          </div>
          <div className="history-list">
            <div className="history-item">
              <div>
                <strong>Upper Respiratory Infection</strong><br />
                Dr. Anis • Consultation
              </div>
              <div className="date">2024-12-18</div>
            </div>
            <div className="history-item">
              <div>
                <strong>Annual Physical Exam</strong><br />
                Dr. Nahid • Check-up
              </div>
              <div className="date">2024-11-05</div>
            </div>
            <div className="history-item">
              <div>
                <strong>Allergic Reaction</strong><br />
                Dr. Basit • Consultation
              </div>
              <div className="date">2024-09-12</div>
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