import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PharmDashPres.css';

export default function PharmDashPres() {
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Prescriptions',
      value: '24',
      status: 'Pending',
      tone: 'accent',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      ),
    },
    {
      label: 'Medicines',
      value: '342',
      status: 'Total',
      tone: 'dark',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M9 3v18M3 9h18" />
        </svg>
      ),
    },
    {
      label: 'Low Stock',
      value: '8',
      status: 'Alert',
      tone: 'warning',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      label: 'Expiring Soon',
      value: '5',
      status: 'Warning',
      tone: 'alert',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
    },
  ];

  const prescriptions = [
    {
      id: 'RX001',
      patient: 'Patient: x',
      doctor: 'Doctor: Dr. alfred',
      medication: 'Amoxicillin 500mg - 30 tablets',
      status: 'Processed',
    },
    {
      id: 'RX002',
      patient: 'Patient: y',
      doctor: 'Doctor: Dr. alfred',
      medication: 'Ibuprofen 400mg - 20 tablets',
      status: 'Processed',
    },
    {
      id: 'RX003',
      patient: 'Patient: n',
      doctor: 'Doctor: Dr. alfred',
      medication: 'Lisinopril 10mg - 60 tablets',
      status: 'Processed',
    },
    {
      id: 'RX004',
      patient: 'Patient: m',
      doctor: 'Doctor: Dr. smith',
      medication: 'Metformin 500mg - 90 tablets',
      status: 'Pending',
    },
    {
      id: 'RX005',
      patient: 'Patient: z',
      doctor: 'Doctor: Dr. jones',
      medication: 'Atorvastatin 20mg - 30 tablets',
      status: 'Processed',
    },
  ];

  return (
    <section className="pharm-page">
      <div className="pharm-layout">
        <header className="pharm-header">
          <h1>Prescriptions</h1>
          <p>Manage and process patient prescriptions</p>
        </header>

        <div className="pharm-stats">
          {stats.map((card) => (
            <div key={card.label} className={`pharm-card stat-card ${card.tone}`}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-meta">
                <div className="stat-value">{card.value}</div>
                <div className="stat-label">{card.label}</div>
              </div>
              <div className="stat-status">{card.status}</div>
            </div>
          ))}
        </div>

        <div className="pharm-tabs">
          <button className="tab" onClick={() => navigate('/pharmacy-dashboard')}>Overview</button>
          <button className="tab active" onClick={() => navigate('/pharmacy-prescriptions')}>Prescriptions</button>
          <button className="tab" onClick={() => navigate('/pharmacy-inventory')}>Inventory</button>
        </div>

        <div className="pharm-grid">
          <div className="pharm-card pres-card">
            <div className="pres-header">
              <h3>All Prescriptions</h3>
              <div className="pres-controls">
                <div className="search-control">
                  <input type="text" placeholder="Search prescriptions..." />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <button className="scan-btn">
                  <span className="icon-dot" />
                  Scan
                </button>
              </div>
            </div>

            <div className="prescriptions-list">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="prescription-item">
                  <div className="pres-info">
                    <div className="pres-id">{rx.id}</div>
                    <div className="pres-patient">{rx.patient}</div>
                    <div className="pres-doctor">{rx.doctor}</div>
                    <div className="pres-medication">{rx.medication}</div>
                  </div>
                  <button className={`pres-status-btn ${rx.status.toLowerCase()}`}>
                    {rx.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
