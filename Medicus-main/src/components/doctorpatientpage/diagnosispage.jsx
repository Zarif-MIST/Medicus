import React from "react";
import Navbar from "../Navbar"; // adjust path if needed
import "./diagnosisstyle.css";

export default function DiagnosisPage() {
  return (
    <div className="diagnosis-page">
      <Navbar />

      <main className="diag-container">
        {/* Top dark banner */}
        <section className="diag-hero">
          <p className="diag-hero-sub">Welcome Back, Dr. Ahnaf</p>
          <p className="diag-hero-main">
            Access patient data, create diagnoses, and manage prescriptions
          </p>
        </section>

        {/* Patient summary card */}
        <section className="patient-card">
          <div className="patient-header">
            <div className="patient-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div>
              <h2 className="patient-name">Sinlam Ahmed</h2>
              <p className="patient-meta">
                Patient ID: <span>rwear</span>
              </p>
            </div>
          </div>

          <div className="patient-stats-row">
            <div className="stat-card">
              <p className="stat-label">Age</p>
              <p className="stat-value">21</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Gender</p>
              <p className="stat-value">Male</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Blood Type</p>
              <p className="stat-value">A+</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Prescriptions</p>
              <p className="stat-value">5</p>
            </div>
          </div>

          <div className="patient-extra">
            <div>
              <p className="extra-label">Allergies</p>
              <p className="extra-value">Penicillin, Sulfa drugs</p>
            </div>
            <div>
              <p className="extra-label">Current Conditions</p>
              <p className="extra-value">
                Hypertension, Type 2 Diabetes
              </p>
            </div>
          </div>
        </section>

        {/* Diagnosis card */}
        <section className="panel-card">
          <h3 className="panel-title">Diagnosis</h3>
          <p className="panel-subtitle">Enter your medical Diagnosis</p>
          <textarea
            className="diag-textarea"
            placeholder="Type diagnosis here..."
          />
        </section>

        {/* Prescription card */}
        <section className="panel-card">
          <h3 className="panel-title">Prescription</h3>
          <p className="panel-subtitle">Add medicines with quantities</p>
          <button className="add-med-btn">+ Add Medicine</button>
        </section>

        {/* Bottom send button */}
        <button className="send-btn">
          Send Prescription to Pharmacists
        </button>
      </main>
    </div>
  );
}
