import React, { useState } from "react";
import Navbar from "../Navbar"; // adjust path if needed
import "./dashstyle.css";

export default function DoctorDashboardPage() {
  const [patientId, setPatientId] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search patient:", patientId);
  };

  return (
    <div className="dash-root">
      <Navbar />

      <main className="dash-main">
        {/* Hero banner */}
        <section className="dash-hero">
          <div className="dash-hero-icon">
            <div className="stetho-ring">
              <span className="stetho-tip" />
            </div>
          </div>
          <div className="dash-hero-text">
            <h1>Welcome Back, Dr. Ahnaf</h1>
            <p>
              Access patient data, create diagnoses, and manage prescriptions
            </p>
          </div>
        </section>

        {/* Primary action buttons */}
        <section className="dash-actions">
          <button className="dash-action-card">
            <span className="action-icon">🔍</span>
            <span className="action-label">Patient Search</span>
          </button>
          <button className="dash-action-card">
            <span className="action-icon">📄</span>
            <span className="action-label">Diagnosis &amp; Prescription</span>
          </button>
          <button className="dash-action-card">
            <span className="action-icon">🧾</span>
            <span className="action-label">Recent Prescriptions</span>
          </button>
        </section>

        {/* Patient lookup */}
        <section className="lookup-section">
          <div className="lookup-header">
            <div className="lookup-title-row">
              <span className="lookup-big-icon">🔍</span>
              <div>
                <h2>Patient Lookup</h2>
                <p>Enter Patient ID to access medical records</p>
              </div>
            </div>
          </div>

          <form className="lookup-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="lookup-input"
            />
            <button type="submit" className="lookup-button">
              <span className="lookup-btn-icon">🔍</span>
              <span>Search</span>
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
