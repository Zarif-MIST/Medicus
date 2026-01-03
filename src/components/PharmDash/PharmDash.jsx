import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PharmDash.css';

export default function PharmDash() {
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

  const activities = [
    { title: 'Prescription Filled', subtitle: 'RX005 • 2 hours ago' },
    { title: 'Stock Updated', subtitle: 'Aspirin 100mg • 4 hours ago' },
    { title: 'Prescription Verified', subtitle: 'RX004 • 5 hours ago' },
  ];

  const summary = [
    { label: 'Verified', value: '18' },
    { label: 'Filled', value: '15' },
    { label: 'Pending', value: '6' },
  ];

  return (
    <section className="pharm-page">
      <div className="pharm-layout">
        <header className="pharm-header">
          <h1>Pharmacy Dashboard</h1>
          <p>Welcome back, Mr. Pharmacists</p>
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
          <button className="tab active" onClick={() => navigate('/pharmacy-dashboard')}>Overview</button>
          <button className="tab" onClick={() => navigate('/pharmacy-prescriptions')}>Prescriptions</button>
          <button className="tab" onClick={() => navigate('/pharmacy-inventory')}>Inventory</button>
        </div>

        <div className="pharm-grid">
          <div className="pharm-card quick-card">
            <h3>Quick Actions</h3>
            <div className="quick-row">
              <button className="scan-btn">
                <span className="icon-dot" />
                Scan Prescription
              </button>
              <div className="search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input type="text" placeholder="Search Patient ID" />
              </div>
            </div>
          </div>

          <div className="pharm-card alerts-card">
            <h3>Alerts</h3>
            <div className="alert-item alert-red">
              <span className="alert-icon">⚠️</span>
              <div>
                <div className="alert-title">5 medicines expiring soon</div>
                <div className="alert-sub">Check inventory</div>
              </div>
            </div>
            <div className="alert-item alert-yellow">
              <span className="alert-icon">🔔</span>
              <div>
                <div className="alert-title">8 items low in stock</div>
                <div className="alert-sub">Reorder required</div>
              </div>
            </div>
          </div>

          <div className="pharm-card summary-card">
            <h3>Today&apos;s Summary</h3>
            <ul>
              {summary.map((row) => (
                <li key={row.label}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="pharm-card activity-card">
            <h3>Recent Activity</h3>
            <ul>
              {activities.map((item) => (
                <li key={item.title}>
                  <span className="bullet" />
                  <div>
                    <div className="activity-title">{item.title}</div>
                    <div className="activity-sub">{item.subtitle}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
