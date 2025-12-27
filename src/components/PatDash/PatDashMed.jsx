// src/components/PatientMedicalRecordsDashboard.jsx
import React from 'react';
import './PatientMedicalRecordsDashboard.css';

export default function PatientMedicalRecordsDashboard() {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Patient Portal</h1>
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
        <button className="tab">Prescriptions</button>
        <button className="tab active">Medical Records</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Medical Records Card */}
        <div className="records-card">
          <div className="records-header">
            <h2 className="section-title">Medical Records</h2>
            <button className="download-all-btn">
              <span>↓</span> Download All
            </button>
          </div>

          {/* Record 1 */}
          <div className="record-item">
            <div className="record-title">Upper Respiratory Infection</div>
            <div className="record-subtitle">Consultation</div>
            <div className="record-doctor">Doctor: Dr. Anderson</div>
            <div className="record-date">2024-12-18</div>
            <button className="view-details-btn">View Details</button>
          </div>

          {/* Record 2 */}
          <div className="record-item">
            <div className="record-title">Annual Physical Exam</div>
            <div className="record-subtitle">Check-up</div>
            <div className="record-doctor">Doctor: Dr. Williams</div>
            <div className="record-date">2024-11-05</div>
            <button className="view-details-btn">View Details</button>
          </div>

          {/* Record 3 */}
          <div className="record-item">
            <div className="record-title">Allergic Reaction</div>
            <div className="record-subtitle">Consultation</div>
            <div className="record-doctor">Doctor: Dr. Brown</div>
            <div className="record-date">2024-09-12</div>
            <button className="view-details-btn">View Details</button>
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