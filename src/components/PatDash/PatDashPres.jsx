// src/components/PatientPrescriptionsDashboard.jsx
import React from 'react';
import './PatientPrescriptionsDashboard.css';

export default function PatientPrescriptionsDashboard() {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <p className="welcome-text">Welcome, Zarif</p>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="icon prescriptions">3</div>
          <div className="label">Active Prescriptions</div>
        </div>
        <div className="summary-card">
          <div className="icon visits">15</div>
          <div className="label">Medical Visits</div>
        </div>
        <div className="summary-card">
          <div className="icon status">Good</div>
          <div className="label">Health Status</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className="tab">Overview</button>
        <button className="tab active">Prescriptions</button>
        <button className="tab">Medical Records</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* All Prescriptions Card */}
        <div className="prescriptions-card">
          <h2 className="section-title">All Prescriptions</h2>

          {/* Active Prescription */}
          <div className="prescription-item active">
            <div className="prescription-header">
              <span className="rx-code">RX001</span>
              <span className="status-badge active">Active</span>
            </div>
            <h3 className="med-name">Amoxicillin 500mg</h3>
            <p className="prescribed-by">Prescribed by Dr. Anis on 2024-12-18</p>

            <div className="details-grid">
              <div>
                <strong>Dosage</strong><br />
                3 times daily
              </div>
              <div>
                <strong>Duration</strong><br />
                7 days
              </div>
            </div>

            <p className="instructions">Instructions: Take with food</p>

            <div className="action-buttons">
              <button className="download-btn">
                <span>↓</span> Download
              </button>
              <button className="qr-btn">View QR Code</button>
            </div>
          </div>

          {/* Completed Prescription */}
          <div className="prescription-item completed">
            <div className="prescription-header">
              <span className="rx-code">RX002</span>
              <span className="status-badge completed">Completed</span>
            </div>
            <h3 className="med-name">Ibuprofen 400mg</h3>
            <p className="prescribed-by">Prescribed by Dr. Basit on 2024-12-15</p>

            <div className="details-grid">
              <div>
                <strong>Dosage</strong><br />
                As needed
              </div>
              <div>
                <strong>Duration</strong><br />
                14 days
              </div>
            </div>

            <p className="instructions">Instructions: Take after meals</p>

            <div className="action-buttons">
              <button className="download-btn">
                <span>↓</span> Download
              </button>
              <button className="qr-btn">View QR Code</button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Vital Signs */}
          <div className="vital-card">
            <h2 className="section-title">Vital Signs</h2>
            <div className="vital-item">
              <span>Blood Pressure</span>
              <strong>120/80</strong>
            </div>
            <div className="vital-item">
              <span>Heart Rate</span>
              <strong>72 bpm</strong>
            </div>
            <div className="vital-item">
              <span>Temperature</span>
              <strong>98.6°F</strong>
            </div>
            <div className="vital-item">
              <span>Weight</span>
              <strong>165 lbs</strong>
            </div>
          </div>

          {/* Health Tips */}
          <div className="tips-card">
            <h2 className="section-title">Health Tips</h2>
            <ul>
              <li>Take your medications as prescribed</li>
              <li>Drink at least 8 glasses of water daily</li>
              <li>Exercise for 30 minutes daily</li>
              <li>Get 7-8 hours of sleep</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}