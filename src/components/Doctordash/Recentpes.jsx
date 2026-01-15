import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentPrescriptions, getPatient } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Recentpes.css";

export default function DoctorRecentPrescriptionsPage() {
  const [patientId, setPatientId] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch recent prescriptions on component mount
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await getRecentPrescriptions(10);
      setPrescriptions(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError(err.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const id = patientId.trim();
    if (!id) return;
    navigate(`/diagnosis/${encodeURIComponent(id)}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dash-root">
      <main className="dash-main">
        
        {/* Top hero banner */}
        <section className="dash-hero">
          <div className="dash-hero-text">
            <p className="hero-sub">Welcome Back, Dr. {user?.username || 'Doctor'}</p>
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
            onClick={() => navigate("/doctordash")}
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

          {loading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              Loading prescriptions...
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#ff4444' }}>
              {error}
            </div>
          )}

          {!loading && !error && prescriptions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>📋 No prescriptions yet</p>
              <p style={{ fontSize: '14px' }}>Create your first prescription by searching for a patient</p>
            </div>
          )}

          {!loading && !error && prescriptions.length > 0 && (
            <div className="rx-list">
              {prescriptions.map((prescription) => (
                <div 
                  key={prescription._id} 
                  className="rx-row"
                  onClick={() => navigate(`/prescription/${prescription._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="rx-left">
                    <p className="rx-code">
                      {prescription.prescriptionCode} - {prescription.patient?.fullName || 'Unknown Patient'}
                    </p>
                    {prescription.medications?.map((med, idx) => (
                      <p key={idx} className="rx-drug">
                        {med.name} {med.dosage}
                      </p>
                    ))}
                    {prescription.diagnosis?.condition && (
                      <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                        Diagnosis: {prescription.diagnosis.condition}
                      </p>
                    )}
                  </div>
                  <div className="rx-right">
                    <span className="rx-date">
                      {formatDate(prescription.prescriptionDate)}
                    </span>
                    <span className={`rx-chip ${
                      prescription.status === 'Active' ? 'rx-chip-active' : 
                      prescription.status === 'Completed' ? 'rx-chip-complete' : 
                      'rx-chip-cancelled'
                    }`}>
                      {prescription.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
