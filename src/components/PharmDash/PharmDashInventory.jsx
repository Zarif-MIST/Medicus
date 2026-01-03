import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PharmDashInventory.css';

export default function PharmDashInventory() {
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

  const inventory = [
    {
      id: 'M001',
      name: 'Amoxicillin 500mg',
      stock: 450,
      minStock: 100,
      expiry: '2025-06-15',
      status: 'In Stock',
    },
    {
      id: 'M002',
      name: 'Ibuprofen 400mg',
      stock: 85,
      minStock: 100,
      expiry: '2025-03-20',
      status: 'Low Stock',
    },
    {
      id: 'M003',
      name: 'Lisinopril 10mg',
      stock: 320,
      minStock: 150,
      expiry: '2024-12-30',
      status: 'Expiring Soon',
    },
  ];

  return (
    <section className="pharm-page">
      <div className="pharm-layout">
        <header className="pharm-header">
          <h1>Pharmacy Inventory</h1>
          <p>Manage medicine inventory</p>
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
          <button className="tab" onClick={() => navigate('/pharmacy-prescriptions')}>Prescriptions</button>
          <button className="tab active" onClick={() => navigate('/pharmacy-inventory')}>Inventory</button>
        </div>

        <div className="pharm-grid">
          <div className="pharm-card inventory-card">
            <div className="inventory-header">
              <h3>Medicine Inventory</h3>
              <button className="add-stock-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Add Stock
              </button>
            </div>

            <div className="inventory-list">
              {inventory.map((item) => (
                <div key={item.id} className="inventory-item">
                  <div className="inventory-item-header">
                    <div className="item-name-section">
                      <div className="item-name">{item.name}</div>
                      <div className="item-id">ID: {item.id}</div>
                    </div>
                    <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="inventory-item-details">
                    <div className="detail-col">
                      <div className="detail-label">Stock</div>
                      <div className="detail-value">{item.stock} units</div>
                    </div>
                    <div className="detail-col">
                      <div className="detail-label">Min Stock</div>
                      <div className="detail-value">{item.minStock} units</div>
                    </div>
                    <div className="detail-col">
                      <div className="detail-label">Expiry</div>
                      <div className="detail-value">{item.expiry}</div>
                    </div>
                  </div>
                  <button className="update-stock-btn">Update Stock</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
