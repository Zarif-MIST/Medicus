import React, { useState } from "react";
import "./PharmacyPrescriptions.css";

// Import icons (reusing from Dashboard)
import prescriptionIcon from "../../assets/prescription-icon.svg";
import medicineIcon from "../../assets/medicine-icon.svg";
import alertTriangleIcon from "../../assets/alert-triangle-icon.svg";
import clockWarningIcon from "../../assets/clock-warning-icon.svg";
import scanQrIcon from "../../assets/scan-qr-icon.svg";
import alertRedIcon from "../../assets/alert-red-icon.svg";
import alertYellowIcon from "../../assets/alert-yellow-icon.svg";

function PharmacyPrescriptions({ onViewChange = () => {} }) {
  const [searchQuery, setSearchQuery] = useState("");

  const prescriptions = [
    {
      id: "RX001",
      patient: "x",
      doctor: "Dr. ahnaf",
      medication: "Amoxicillin 500mg - 30 tablets",
      status: "Processed"
    },
    {
      id: "RX002",
      patient: "y",
      doctor: "Dr. ahnaf",
      medication: "Ibuprofen 400mg - 20 tablets",
      status: "Processed"
    },
    {
      id: "RX003",
      patient: "n",
      doctor: "Dr. ahnaf",
      medication: "Lisinopril 10mg - 60 tablets",
      status: "Processed"
    }
  ];

  return (
    <div className="pharmacy-prescriptions">
      <div className="prescriptions-container">
        {/* Header */}
        <div className="prescriptions-header">
          <h1 className="prescriptions-title">Pharmacy Dashboard</h1>
          <p className="prescriptions-subtitle">Welcome back, x Pharmacy</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon stat-icon-red">
                <img src={prescriptionIcon} alt="Prescriptions" />
              </div>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-value">24</div>
            <div className="stat-description">Prescriptions</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon stat-icon-dark">
                <img src={medicineIcon} alt="Medicines" />
              </div>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-value">342</div>
            <div className="stat-description">Medicines</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon stat-icon-yellow">
                <img src={alertTriangleIcon} alt="Low Stock" />
              </div>
              <span className="stat-label">Alert</span>
            </div>
            <div className="stat-value">8</div>
            <div className="stat-description">Low Stock</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon stat-icon-pink">
                <img src={clockWarningIcon} alt="Expiring Soon" />
              </div>
              <span className="stat-label">Warning</span>
            </div>
            <div className="stat-value">5</div>
            <div className="stat-description">Expiring Soon</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button className="tab-button" onClick={() => onViewChange('dashboard')}>Overview</button>
          <button className="tab-button tab-button-active">Prescriptions</button>
          <button className="tab-button" onClick={() => onViewChange('inventory')}>Inventory</button>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Column - Prescriptions List */}
          <div className="left-column">
            <div className="card prescriptions-list-card">
              <div className="prescriptions-list-header">
                <h3 className="card-title">All Prescriptions</h3>
                <div className="search-controls">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search prescriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="scan-button">
                    <img src={scanQrIcon} alt="Scan" />
                    <span>Scan</span>
                  </button>
                </div>
              </div>

              <div className="prescriptions-list">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="prescription-item">
                    <div className="prescription-details">
                      <h4 className="prescription-id">{prescription.id}</h4>
                      <p className="prescription-info">Patient: {prescription.patient}</p>
                      <p className="prescription-info">Doctor: {prescription.doctor}</p>
                      <p className="prescription-medication">{prescription.medication}</p>
                    </div>
                    <span className="prescription-status">{prescription.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Alerts & Summary */}
          <div className="right-column">
            {/* Alerts */}
            <div className="card alerts-card">
              <h3 className="card-title">Alerts</h3>
              <div className="alerts-list">
                <div className="alert-item alert-item-red">
                  <div className="alert-icon">
                    <img src={alertRedIcon} alt="Alert" />
                  </div>
                  <div className="alert-content">
                    <div className="alert-title">5 medicines expiring soon</div>
                    <div className="alert-subtitle">Check inventory</div>
                  </div>
                </div>

                <div className="alert-item alert-item-yellow">
                  <div className="alert-icon">
                    <img src={alertYellowIcon} alt="Alert" />
                  </div>
                  <div className="alert-content">
                    <div className="alert-title">8 items low in stock</div>
                    <div className="alert-subtitle">Reorder required</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Summary */}
            <div className="card summary-card">
              <h3 className="card-title">Today's Summary</h3>
              <div className="summary-list">
                <div className="summary-item">
                  <span className="summary-label">Verified</span>
                  <span className="summary-value">18</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Filled</span>
                  <span className="summary-value">15</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Pending</span>
                  <span className="summary-value">6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PharmacyPrescriptions;