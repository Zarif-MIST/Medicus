import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recentpes.css";

export default function DoctorRecentPrescriptionsPage() {
  const [patientId, setPatientId] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search patient:", patientId);
  };

  return (
    <div className="dash-root">
      <main className="dash-main">
        
        {/* Top hero banner */}
        <section className="dash-hero">
          <div className="dash-hero-text">
            <p className="hero-sub">Welcome Back, Dr. Ahnaf</p>
            <h2 className="hero-title">
              Access patient data, create diagnoses, and manage prescriptions
            </h2>
          </div>
          <div className="dash-hero-icon-ghost">
            <div className="ghost-stetho-ring">
              <span className="ghost-stetho-tip" />
            </div>
          </div>
        </section>

        {/* Primary actions */}
        <section className="dash-actions">
          
          {/* ✅ GO BACK TO PATIENT SEARCH */}
          <button
            className="dash-action-card"
            type="button"
            onClick={() => navigate("/doctor/dashboard")}
          >
            <span className="action-icon">🔍</span>
            <span className="action-label">Patient Search</span>
          </button>

          <button className="dash-action-card">
            <span className="action-icon">🧾</span>
            <span className="action-label">Recent Prescriptions</span>
          </button>
        </section>

        {/* Patient Lookup */}
        <section className="lookup-section">
          <div className="lookup-header">
            <span className="lookup-big-icon">🔍</span>
            <div>
              <p className="lookup-label">Patient Lookup</p>
              <p className="lookup-caption">
                Enter Patient ID to access medical records
              </p>
            </div>
          </div>

          <form className="lookup-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="lookup-input"
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
            <button type="submit" className="lookup-button">
              <span className="lookup-btn-icon">🔍</span>
              <span>Search</span>
            </button>
          </form>
        </section>

        {/* Recent Prescriptions List */}
        <section className="recent-card">
          <h2 className="recent-title">Recent Prescriptions</h2>

          <div className="rx-list">
            <div className="rx-row">
              <div className="rx-left">
                <p className="rx-code">RX001 - kuddus</p>
                <p className="rx-drug">Amoxicillin 500mg</p>
                <p className="rx-drug">Mebendazole 100mg</p>
              </div>
              <div className="rx-right">
                <span className="rx-date">2024-12-20</span>
                <span className="rx-chip rx-chip-active">Active</span>
              </div>
            </div>

            <div className="rx-row">
              <div className="rx-left">
                <p className="rx-code">RX002 - Sinlam Smith</p>
                <p className="rx-drug">Ibuprofen 400mg</p>
              </div>
              <div className="rx-right">
                <span className="rx-date">2024-12-19</span>
                <span className="rx-chip rx-chip-complete">Completed</span>
              </div>
            </div>

            <div className="rx-row">
              <div className="rx-left">
                <p className="rx-code">RX003 - Shafi Ahmed</p>
                <p className="rx-drug">Napa 500mg</p>
              </div>
              <div className="rx-right">
                <span className="rx-date">2024-12-18</span>
                <span className="rx-chip rx-chip-active">Active</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
