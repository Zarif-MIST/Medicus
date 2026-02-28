// src/components/PatientPrescriptionsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatDash.css';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';

export default function PatientPrescriptionsDashboard() {
  const navigate = useNavigate();
  const { user, initializing } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not authenticated as patient
  useEffect(() => {
    if (initializing) return;
    const role = localStorage.getItem("medicus_role");
    if (!user || role !== "patient") {
      navigate("/login");
    }
  }, [user, navigate, initializing]);

  // Fetch patient prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const response = await apiService.getPrescriptionsByPatient(user.id);
        setPrescriptions(response.prescriptions || []);
        setError('');
      } catch (err) {
        setError('Failed to load prescriptions');
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    if (!initializing && user?.id) {
      fetchPrescriptions();
    }
  }, [user, initializing]);

  if (initializing || !user) {
    return null;
  }

  const patientName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const activePrescriptionCount = prescriptions.filter(rx => rx.status === 'Active').length;

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
          <div className="summary-icon visits">{prescriptions.length}</div>
          <div className="summary-label">Total Prescriptions</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon prescriptions">{activePrescriptionCount}</div>
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
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>Loading prescriptions...</div>
          ) : error ? (
            <div style={{ padding: '20px', color: '#991b1b' }}>{error}</div>
          ) : prescriptions.length > 0 ? (
            prescriptions.map((rx) => (
              <div key={rx._id}>
                {rx.medicines && rx.medicines.map((med, idx) => (
                  <div key={idx} className="prescription-item">
                    <div className="prescription-name">{med.medicineName} ({med.dosage})</div>
                    <div className="prescription-doctor">
                      Prescribed by Dr. {rx.doctorId?.firstName || 'Unknown'} {rx.doctorId?.lastName || ''} • {rx.status}
                    </div>
                    <div className="prescription-details">
                      <div>
                        <strong>Dosage</strong><br />
                        {med.dosage}
                      </div>
                      <div>
                        <strong>Frequency</strong><br />
                        {med.frequency}
                      </div>
                      <div>
                        <strong>Duration</strong><br />
                        {med.duration}
                      </div>
                    </div>
                    {med.instructions && (
                      <div className="prescription-instructions">
                        Instructions: {med.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', color: '#666' }}>No prescriptions found</div>
          )}
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