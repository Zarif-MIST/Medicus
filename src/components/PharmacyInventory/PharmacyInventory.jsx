import React from "react";
import "./PharmacyInventory.css";

// Import icons (reusing from Dashboard)
import prescriptionIcon from "../../assets/prescription-icon.svg";
import medicineIcon from "../../assets/medicine-icon.svg";
import alertTriangleIcon from "../../assets/alert-triangle-icon.svg";
import clockWarningIcon from "../../assets/clock-warning-icon.svg";
import plusIcon from "../../assets/plus-icon.svg";
import alertRedIcon from "../../assets/alert-red-icon.svg";
import alertYellowIcon from "../../assets/alert-yellow-icon.svg";

function PharmacyInventory({ onViewChange = () => {} }) {
  const medicines = [
    {
      id: "M001",
      name: "Amoxicillin 500mg",
      stock: 450,
      minStock: 100,
      expiry: "2025-06-15",
      status: "In Stock",
      statusClass: "status-in-stock"
    },
    {
      id: "M002",
      name: "Ibuprofen 400mg",
      stock: 85,
      minStock: 100,
      expiry: "2025-03-20",
      status: "Low Stock",
      statusClass: "status-low-stock"
    },
    {
      id: "M003",
      name: "Lisinopril 10mg",
      stock: 320,
      minStock: 150,
      expiry: "2024-12-30",
      status: "Expiring Soon",
      statusClass: "status-expiring-soon"
    }
  ];

  return (
    <div className="pharmacy-inventory">
      <div className="inventory-container">
        {/* Header */}
        <div className="inventory-header">
          <h1 className="inventory-title">Pharmacy Dashboard</h1>
          <p className="inventory-subtitle">Welcome back, X Pharmacy</p>
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
          <button className="tab-button" onClick={() => onViewChange('prescriptions')}>Prescriptions</button>
          <button className="tab-button tab-button-active">Inventory</button>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Column - Medicine Inventory */}
          <div className="left-column">
            <div className="card inventory-list-card">
              <div className="inventory-list-header">
                <h3 className="card-title">Medicine Inventory</h3>
                <button className="add-stock-button">
                  <img src={plusIcon} alt="Add" />
                  <span>Add Stock</span>
                </button>
              </div>

              <div className="medicine-list">
                {medicines.map((medicine) => (
                  <div key={medicine.id} className="medicine-item">
                    <div className="medicine-header">
                      <div className="medicine-info">
                        <h4 className="medicine-name">{medicine.name}</h4>
                        <p className="medicine-id">ID: {medicine.id}</p>
                      </div>
                      <span className={`medicine-status ${medicine.statusClass}`}>
                        {medicine.status}
                      </span>
                    </div>

                    <div className="medicine-details">
                      <div className="medicine-detail-group">
                        <span className="detail-label">Stock</span>
                        <span className="detail-value">{medicine.stock} units</span>
                      </div>
                      <div className="medicine-detail-group">
                        <span className="detail-label">Min Stock</span>
                        <span className="detail-value">{medicine.minStock} units</span>
                      </div>
                      <div className="medicine-detail-group">
                        <span className="detail-label">Expiry</span>
                        <span className="detail-value">{medicine.expiry}</span>
                      </div>
                    </div>

                    <button className="update-stock-button">Update Stock</button>
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

export default PharmacyInventory;