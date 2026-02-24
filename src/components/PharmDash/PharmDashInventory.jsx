import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import './PharmDashInventory.css';

export default function PharmDashInventory() {
  const navigate = useNavigate();
  const { user, initializing } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    medicineName: '',
    strength: '',
    quantity: '',
    price: '',
    expiryDate: '',
    batchNumber: '',
    reorderLevel: '',
  });
  
  const [editData, setEditData] = useState({
    id: '',
    medicineName: '',
    strength: '',
    quantity: '',
    price: '',
    expiryDate: '',
    batchNumber: '',
    reorderLevel: '',
  });

  // Auth check and fetch inventory on mount
  useEffect(() => {
    if (!user || user.role !== 'pharmacy') {
      navigate('/');
      return;
    }

    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPharmacyInventory(user.id);
        setInventory(data.inventory || []);
        setError('');
      } catch (err) {
        setError('Failed to load inventory');
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };

    if (!initializing) {
      fetchInventory();
    }
  }, [user, navigate, initializing]);

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      const medicineData = {
        pharmacyId: user.id,
        medicineName: formData.medicineName.trim(),
        strength: formData.strength.trim(),
        quantity: parseInt(formData.quantity, 10),
        price: parseFloat(formData.price),
        expiryDate: new Date(formData.expiryDate),
        batchNumber: formData.batchNumber.trim(),
        reorderLevel: parseInt(formData.reorderLevel, 10),
      };

      const result = await apiService.addMedicineToInventory(medicineData);
      setInventory([...inventory, result.inventory || result]);
      setShowModal(false);
      setFormData({
        medicineName: '',
        strength: '',
        quantity: '',
        price: '',
        expiryDate: '',
        batchNumber: '',
        reorderLevel: '',
      });
      setSuccess('Medicine added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add medicine');
    }
  };

  const handleOpenUpdate = (item) => {
    setEditData({
      id: item._id,
      medicineName: item.medicineName,
      strength: item.strength,
      quantity: String(item.quantity),
      price: String(item.price),
      expiryDate: item.expiryDate.split('T')[0],
      batchNumber: item.batchNumber,
      reorderLevel: String(item.reorderLevel),
    });
    setShowUpdateModal(true);
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
<<<<<<< HEAD
      // Find current item to calculate the actual quantity change
      const currentItem = inventory.find((item) => item._id === editData.id);
      if (!currentItem) {
        throw new Error('Item not found');
      }

      const newQuantity = parseInt(editData.quantity, 10);
      const currentQuantity = parseInt(currentItem.quantity, 10);
      const quantityChange = newQuantity - currentQuantity;

      // Only update quantity if there's a change
      if (quantityChange !== 0) {
        const action = quantityChange > 0 ? 'restock' : 'dispense';
        await apiService.updateMedicineQuantity(editData.id, Math.abs(quantityChange), action);
      }
=======
      // Find current item to calculate the actual quantity change
      const currentItem = inventory.find((item) => item._id === editData.id);
      if (!currentItem) {
        throw new Error('Item not found');
      }
      
      const newQuantity = parseInt(editData.quantity, 10);
      const currentQuantity = parseInt(currentItem.quantity, 10);
      const quantityChange = newQuantity - currentQuantity;
      
      // Only update quantity if there's a change
      if (quantityChange !== 0) {
        const action = quantityChange > 0 ? 'restock' : 'dispense';
        await apiService.updateMedicineQuantity(editData.id, Math.abs(quantityChange), action);
      }
>>>>>>> 7624a861 (Update dashboards, prescription flow, map fixes, and API handling)
      
      setInventory((prev) => prev.map((item) => {
        if (item._id === editData.id) {
          return {
            ...item,
            medicineName: editData.medicineName.trim(),
            strength: editData.strength.trim(),
            quantity: newQuantity,
            price: parseFloat(editData.price),
            expiryDate: editData.expiryDate,
            batchNumber: editData.batchNumber.trim(),
            reorderLevel: parseInt(editData.reorderLevel, 10),
          };
        }
        return item;
      }));

      setShowUpdateModal(false);
      setSuccess('Medicine updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update medicine');
    }
  };

  const handleDelete = async () => {
    try {
      setError('');
      setInventory((prev) => prev.filter((item) => item._id !== editData.id));
      setShowUpdateModal(false);
      setSuccess('Medicine removed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete medicine');
    }
  };

  const getStockStatus = (quantity, reorderLevel, expiryDate) => {
    const daysToExpiry = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysToExpiry <= 60) return 'Expiring Soon';
    if (quantity < reorderLevel) return 'Low Stock';
    return 'In Stock';
  };

  const totalMedicines = inventory.length;
  const lowStockCount = inventory.filter((item) => item.quantity < item.reorderLevel).length;
  const expiringCount = inventory.filter((item) => {
    const daysToExpiry = (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return daysToExpiry <= 60;
  }).length;

  return (
    <section className="pharm-page">
      <div className="pharm-layout">
        <header className="pharm-header">
          <h1>Pharmacy Inventory</h1>
          <p>Manage medicine inventory and stock</p>
        </header>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="pharm-stats">
          {[
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
          ].map((card) => (
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
              <button className="add-stock-btn" onClick={() => setShowModal(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Add Medicine
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading inventory...</div>
            ) : inventory.length === 0 ? (
              <div className="empty-state">
                <p>No medicines in inventory. Add one to get started.</p>
              </div>
            ) : (
              <div className="inventory-list">
                {inventory.map((item) => {
                  const status = getStockStatus(item.quantity, item.reorderLevel, item.expiryDate);
                  return (
                    <div key={item._id} className="inventory-item">
                      <div className="inventory-item-header">
                        <div className="item-name-section">
                          <div className="item-name">{item.medicineName}</div>
                          <div className="item-strength">{item.strength}</div>
                        </div>
                        <span className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}>
                          {status}
                        </span>
                      </div>
                      <div className="inventory-item-details">
                        <div className="detail-col">
                          <div className="detail-label">Stock</div>
                          <div className="detail-value">{item.quantity} units</div>
                        </div>
                        <div className="detail-col">
                          <div className="detail-label">Reorder Level</div>
                          <div className="detail-value">{item.reorderLevel} units</div>
                        </div>
                        <div className="detail-col">
                          <div className="detail-label">Price</div>
                          <div className="detail-value">BDT{item.price.toFixed(2)}</div>
                        </div>
                        <div className="detail-col">
                          <div className="detail-label">Batch</div>
                          <div className="detail-value">{item.batchNumber}</div>
                        </div>
                        <div className="detail-col">
                          <div className="detail-label">Expiry</div>
                          <div className="detail-value">{new Date(item.expiryDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <button className="update-stock-btn" onClick={() => handleOpenUpdate(item)}>Update Stock</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Medicine</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form className="modal-form" onSubmit={handleAddStock}>
              <div className="form-group">
                <label>Medicine Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Amoxicillin"
                  value={formData.medicineName}
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Strength *</label>
                <input
                  type="text"
                  placeholder="e.g., 500mg"
                  value={formData.strength}
                  onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantity (units) *</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price per Unit (BDT) *</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Batch Number *</label>
                <input
                  type="text"
                  placeholder="e.g., BATCH123"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Expiry Date *</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Reorder Level (units) *</label>
                <input
                  type="number"
                  placeholder="Alert when stock falls below this"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Stock</h2>
              <button className="modal-close" onClick={() => setShowUpdateModal(false)}>×</button>
            </div>

            <form className="modal-form" onSubmit={handleUpdateStock}>
              <div className="form-group">
                <label>Medicine Name *</label>
                <input
                  type="text"
                  value={editData.medicineName}
                  onChange={(e) => setEditData({ ...editData, medicineName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Strength *</label>
                <input
                  type="text"
                  value={editData.strength}
                  onChange={(e) => setEditData({ ...editData, strength: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantity (units) *</label>
                <input
                  type="number"
                  value={editData.quantity}
                  onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price per Unit (BDT) *</label>
                <input
                  type="number"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Batch Number *</label>
                <input
                  type="text"
                  value={editData.batchNumber}
                  onChange={(e) => setEditData({ ...editData, batchNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Expiry Date *</label>
                <input
                  type="date"
                  value={editData.expiryDate}
                  onChange={(e) => setEditData({ ...editData, expiryDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Reorder Level (units) *</label>
                <input
                  type="number"
                  value={editData.reorderLevel}
                  onChange={(e) => setEditData({ ...editData, reorderLevel: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn-delete" onClick={handleDelete}>
                  Delete
                </button>
                <button type="submit" className="btn-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}