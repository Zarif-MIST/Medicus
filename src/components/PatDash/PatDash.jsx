// src/components/PatientDashboard.jsx
import React from 'react';
import './PatDash.css';

export default function PatientDashboard() {
  return (
    <div className="dashboard">
      {/* Top Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon visits">15</div>
          <div className="summary-label">Medical Visits</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon heart">Good</div>
          <div className="summary-label">Health Status</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon prescriptions">3</div>
          <div className="summary-label">Active Prescriptions</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className="tab active">Overview</button>
        <button className="tab">Prescriptions</button>
        <button className="tab">Medical Records</button>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Active Prescriptions */}
        <div className="section-card large">
          <div className="section-header">
            <h3>Active Prescriptions</h3>
    
          </div>
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
            <button className="qr-button">View QR Code</button>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="section-card">
          <div className="section-header">
            <h3>Vital Signs</h3>
          </div>
          <div className="vital-list">
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