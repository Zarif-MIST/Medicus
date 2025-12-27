import React from "react";
import "./PharmacyDashboard.css";

// Import icons
import prescriptionIcon from "../../assets/prescription-icon.svg";
import medicineIcon from "../../assets/medicine-icon.svg";
import alertTriangleIcon from "../../assets/alert-triangle-icon.svg";
import clockWarningIcon from "../../assets/clock-warning-icon.svg";
import scanIcon from "../../assets/scan-icon.svg";
import searchIcon from "../../assets/search-icon.svg";
import checkIcon from "../../assets/check-icon.svg";
import alertRedIcon from "../../assets/alert-red-icon.svg";
import alertYellowIcon from "../../assets/alert-yellow-icon.svg";

function PharmacyDashboard({ onViewChange = () => {} }) {
  return (
    <div className="pharmacy-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Pharmacy Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, Mr. Pharmacists</p>
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
          <button className="tab-button tab-button-active">Overview</button>
          <button className="tab-button" onClick={() => onViewChange('prescriptions')}>Prescriptions</button>
          <button className="tab-button" onClick={() => onViewChange('inventory')}>Inventory</button>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Quick Actions */}
            <div className="card quick-actions-card">
              <h3 className="card-title">Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-button action-button-primary">
                  <img src={scanIcon} alt="Scan" />
                  <span>Scan Prescription</span>
                </button>
                <button className="action-button action-button-secondary">
                  <img src={searchIcon} alt="Search" />
                  <span>Search Patient ID</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card recent-activity-card">
              <h3 className="card-title">Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">
                    <img src={checkIcon} alt="Check" />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Prescription Filled</div>
                    <div className="activity-meta">RX005 • 2 hours ago</div>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    <img src={checkIcon} alt="Check" />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Stock Updated</div>
                    <div className="activity-meta">Aspirin 100mg • 4 hours ago</div>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    <img src={checkIcon} alt="Check" />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Prescription Verified</div>
                    <div className="activity-meta">RX004 • 5 hours ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
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

export default PharmacyDashboard;