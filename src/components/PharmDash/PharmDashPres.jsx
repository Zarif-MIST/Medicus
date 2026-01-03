import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PharmDashPres.css';
import { prescriptionsData } from './prescriptionsData';

export default function PharmDashPres() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRx, setSelectedRx] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pharmacyInventory');
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) setInventory(parsed);
    } catch (err) {
      // ignore parse errors
    }
  }, []);

  const totalMedicines = inventory.length;
  const lowStockCount = inventory.filter((item) => item.status === 'Low Stock').length;
  const expiringCount = inventory.filter((item) => item.status === 'Expiring Soon').length;

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
      value: String(totalMedicines),
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
      value: String(lowStockCount),
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
      value: String(expiringCount),
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

  const [prescriptions, setPrescriptions] = useState(prescriptionsData);

  const handleOpenPrescription = (rx) => {
    setSelectedRx({ ...rx });
    setShowModal(true);
  };

  // View-only modal; editing disabled per request

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filteredPrescriptions = normalizedQuery
    ? prescriptions.filter((rx) => rx.patientId.toLowerCase().includes(normalizedQuery))
    : prescriptions;

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
                  <input
                    type="text"
                    placeholder="Search by Patient ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <button className="scan-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="5" height="5" rx="1" />
                    <rect x="10" y="3" width="5" height="5" rx="1" />
                    <rect x="3" y="10" width="5" height="5" rx="1" />
                    <path d="M10 10h3v3h-3z" />
                    <path d="M13 13h2v2h-2z" />
                    <path d="M15 15h3v3h-3z" />
                    <path d="M12 16h3" />
                    <path d="M16 12h2" />
                    <path d="M12 12h1" />
                  </svg>
                  Scan
                </button>
              </div>
            </div>

            <div className="prescriptions-list">
              {filteredPrescriptions.map((rx) => (
                <div key={rx.id} className="prescription-item">
                  <div className="pres-info">
                    <div className="pres-id">{rx.id}</div>
                    <div className="pres-patient">Patient: {rx.patientName}</div>
                    <div className="pres-doctor">Doctor: {rx.doctor}</div>
                    <div className="pres-medication">{rx.medications.split('\n')[0]}</div>
                  </div>
                  <div className="pres-actions">
                    <button className={`pres-status-btn ${rx.status.toLowerCase()}`}>
                      {rx.status}
                    </button>
                    <button className="view-btn" onClick={() => handleOpenPrescription(rx)}>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedRx && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedRx.patientName}</h2>
                <p className="muted">Patient ID: {selectedRx.patientId}</p>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

              <div className="modal-body">
              <div className="summary-grid">
                <div className="pill-card">Age<span>{selectedRx.age}</span></div>
                <div className="pill-card">Gender<span>{selectedRx.gender}</span></div>
                <div className="pill-card">Blood Type<span>{selectedRx.bloodType}</span></div>
                <div className="pill-card">Prescriptions<span>{selectedRx.prescriptionsCount}</span></div>
              </div>

              <div className="field-grid">
                <div className="field">
                  <label>Patient Name</label>
                    <input value={selectedRx.patientName} readOnly />
                </div>
                <div className="field">
                  <label>Patient ID</label>
                    <input value={selectedRx.patientId} readOnly />
                </div>
                <div className="field">
                  <label>Doctor</label>
                    <input value={selectedRx.doctor} readOnly />
                </div>
                <div className="field">
                  <label>Status</label>
                    <input value={selectedRx.status} readOnly />
                </div>
              </div>

              <div className="field-grid">
                <div className="field">
                  <label>Allergies</label>
                    <input value={selectedRx.allergies} readOnly />
                </div>
                <div className="field">
                  <label>Current Conditions</label>
                    <input value={selectedRx.conditions} readOnly />
                </div>
              </div>

              <div className="field">
                <label>Diagnosis</label>
                  <textarea rows="3" value={selectedRx.diagnosis} readOnly />
              </div>

              <div className="field">
                <label>Prescription</label>
                  <textarea rows="4" value={selectedRx.medications} readOnly />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn-submit">Dispense</button>
              </div>
              </div>
          </div>
        </div>
      )}
    </section>
  );
}
