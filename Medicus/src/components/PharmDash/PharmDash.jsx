import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PharmDash.css';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';

export default function PharmDash() {
  const navigate = useNavigate();
  const { user, initializing } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [dispatchingOrderId, setDispatchingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDispenseError, setOrderDispenseError] = useState('');
  const [dispensingMedicineKey, setDispensingMedicineKey] = useState('');
  const [dispensedOrderMedicines, setDispensedOrderMedicines] = useState({});
  const [error, setError] = useState('');

  // Load inventory from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setLoadingOrders(true);

        const [inventoryData, ordersData] = await Promise.all([
          apiService.getPharmacyInventory(user.id),
          apiService.getPharmacyOrders(user.id),
        ]);

        setInventory(inventoryData.inventory || []);
        setOrders(ordersData.orders || []);
        setError('');
      } catch (err) {
        setError('Failed to load dashboard data');
        setInventory([]);
        setOrders([]);
      } finally {
        setLoading(false);
        setLoadingOrders(false);
      }
    };

    if (!initializing && user?.id) {
      fetchDashboardData();
    } else if (!initializing) {
      setLoading(false);
      setLoadingOrders(false);
    }
  }, [user, initializing]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (initializing) return;
    const role = localStorage.getItem("medicus_role");
    if (!user || !role?.includes("pharmacy")) {
      navigate("/login");
    }
  }, [user, navigate, initializing]);

  if (initializing || !user) {
    return null;
  }

  const totalMedicines = inventory.length;
  const totalUnits = inventory.reduce((sum, item) => {
    const qty = Number(item.quantity);
    return sum + (Number.isNaN(qty) ? 0 : qty);
  }, 0);
  const lowStockCount = inventory.filter((item) => {
    const reorderLevel = Number(item.reorderLevel) || 0;
    const quantity = Number(item.quantity) || 0;
    return reorderLevel > 0 && quantity < reorderLevel;
  }).length;

  const expiringCount = inventory.filter((item) => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    if (Number.isNaN(expiry.getTime())) return false;
    const daysToExpiry = (expiry - new Date()) / (1000 * 60 * 60 * 24);
    return daysToExpiry <= 60;
  }).length;

  const stats = [
    {
      label: 'Medicines',
      value: String(totalMedicines),
      status: 'Items',
      tone: 'dark',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M9 3v18M3 9h18" />
        </svg>
      ),
    },
    {
      label: 'Total Units',
      value: String(totalUnits),
      status: 'In store',
      tone: 'accent',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M3 9h18M9 21V9" />
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

  const dispatchableOrders = orders.filter((order) => ['pending', 'confirmed', 'processing', 'ready'].includes(order.status));

  const getMedicineDispenseKey = (orderId, medicine, index) => {
    return `${orderId}_${medicine.medicineName || 'medicine'}_${medicine.strength || 'nostrength'}_${index}`;
  };

  const isMedicineDispensed = (orderId, medicine, index) => {
    const key = getMedicineDispenseKey(orderId, medicine, index);
    return !!dispensedOrderMedicines[key];
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setOrderDispenseError('');
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setOrderDispenseError('');
    setDispensingMedicineKey('');
  };

  const findInventoryItemForMedicine = (medicine) => {
    if (!medicine?.medicineName) return null;
    return inventory.find((item) => {
      const sameName = item.medicineName?.toLowerCase() === medicine.medicineName?.toLowerCase();
      if (!sameName) return false;

      if (!medicine.strength || !item.strength) return true;
      return item.strength.toLowerCase() === medicine.strength.toLowerCase();
    });
  };

  const normalizeText = (value) => String(value || '').trim().toLowerCase();

  const resolvePrescriptionReferenceForOrderMedicine = async (order, medicine) => {
    if (medicine?.prescriptionId !== undefined && medicine?.prescriptionMedicineIndex !== undefined && medicine?.prescriptionMedicineIndex !== null) {
      return {
        prescriptionId: medicine.prescriptionId,
        medicineIndex: Number(medicine.prescriptionMedicineIndex),
      };
    }

    const patientId = order?.patientId?._id || order?.patientId?.id || order?.patientId;
    if (!patientId) return null;

    const response = await apiService.getPrescriptionsByPatient(patientId, { forPharmacy: true });
    const prescriptions = response?.prescriptions || [];

    const targetName = normalizeText(medicine?.medicineName);
    const targetStrength = normalizeText(medicine?.strength);

    for (const prescription of prescriptions) {
      const matchedIndex = (prescription?.medicines || []).findIndex((prescribedMedicine) => {
        if (prescribedMedicine?.dispensed) return false;

        const sameName = normalizeText(prescribedMedicine?.medicineName) === targetName;
        if (!sameName) return false;

        const prescribedStrength = normalizeText(prescribedMedicine?.strength);
        if (!targetStrength || !prescribedStrength) return true;
        return prescribedStrength === targetStrength;
      });

      if (matchedIndex >= 0) {
        return {
          prescriptionId: prescription.prescriptionId,
          medicineIndex: matchedIndex,
        };
      }
    }

    return null;
  };

  const handleDispenseOrderMedicine = async (order, medicine, index) => {
    if (!order?._id) return;

    const dispenseKey = getMedicineDispenseKey(order._id, medicine, index);
    const quantityNeeded = Number(medicine.quantity) || 0;

    if (quantityNeeded <= 0) {
      setOrderDispenseError('Invalid ordered quantity for this medicine.');
      return;
    }

    const inventoryItem = findInventoryItemForMedicine(medicine);
    if (!inventoryItem) {
      setOrderDispenseError(`${medicine.medicineName} is not in inventory.`);
      return;
    }

    if ((Number(inventoryItem.quantity) || 0) < quantityNeeded) {
      setOrderDispenseError(
        `Insufficient stock for ${medicine.medicineName}. Available: ${inventoryItem.quantity}, Required: ${quantityNeeded}`
      );
      return;
    }

    try {
      setOrderDispenseError('');
      setDispensingMedicineKey(dispenseKey);

      const prescriptionReference = await resolvePrescriptionReferenceForOrderMedicine(order, medicine);
      if (!prescriptionReference?.prescriptionId || Number.isNaN(prescriptionReference?.medicineIndex)) {
        setOrderDispenseError(
          `${medicine.medicineName} cannot be linked to an active undispensed prescription medicine.`
        );
        return;
      }

      await apiService.updateMedicineQuantity(inventoryItem._id, quantityNeeded, 'dispense');

      try {
        await apiService.dispensePrescriptionMedicine(
          prescriptionReference.prescriptionId,
          prescriptionReference.medicineIndex,
          user?.id
        );
      } catch (prescriptionDispenseError) {
        await apiService.updateMedicineQuantity(inventoryItem._id, quantityNeeded, 'restock');

        if ((prescriptionDispenseError.message || '').toLowerCase().includes('already dispensed')) {
          setDispensedOrderMedicines((prev) => ({ ...prev, [dispenseKey]: true }));
          setOrderDispenseError(`${medicine.medicineName} is already dispensed in prescription.`);
          return;
        }

        throw prescriptionDispenseError;
      }

      setInventory((prev) => prev.map((item) => (
        item._id === inventoryItem._id
          ? { ...item, quantity: (Number(item.quantity) || 0) - quantityNeeded }
          : item
      )));

      const updatedDispensed = { ...dispensedOrderMedicines, [dispenseKey]: true };
      setDispensedOrderMedicines(updatedDispensed);

      const allDispensed = (order.medicines || []).every((orderMedicine, medicineIndex) => {
        const key = getMedicineDispenseKey(order._id, orderMedicine, medicineIndex);
        return !!updatedDispensed[key];
      });

      if (allDispensed) {
        setDispatchingOrderId(order._id);
        await apiService.updateOrderStatus(order._id, 'dispatched');

        setOrders((previousOrders) =>
          previousOrders.map((item) =>
            item._id === order._id
              ? { ...item, status: 'dispatched' }
              : item
          )
        );

        closeOrderModal();
        alert(`Order ${order.orderId || order._id} has been fully dispensed and dispatched.`);
      }
    } catch (err) {
      setOrderDispenseError(err.message || 'Failed to dispense medicine');
    } finally {
      setDispensingMedicineKey('');
      setDispatchingOrderId(null);
    }
  };

  return (
    <section className="pharm-page">
      <div className="pharm-layout">
        <header className="pharm-header">
          <h1>Pharmacy Dashboard</h1>
          <p>Welcome back, {user?.managerName || user?.pharmacyName || 'Pharmacist'}</p>
        </header>

        <div className="pharm-stats">
          {error && <div className="pharm-error">{error}</div>}
          {loading && <div className="pharm-loading">Loading inventory...</div>}
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
        

          <div className="pharm-card alerts-card">
            <h3>Alerts</h3>
            <div className="alert-item alert-red">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <div>
                <div className="alert-title">{expiringCount} medicines expiring soon</div>
                <div className="alert-sub">Check inventory</div>
              </div>
            </div>
            <div className="alert-item alert-yellow">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <div className="alert-title">{lowStockCount} items low in stock</div>
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

          <div className="pharm-card activity-card">
            <h3>Medicines Ordered</h3>
            {loadingOrders ? (
              <div className="activity-sub">Loading orders...</div>
            ) : dispatchableOrders.length === 0 ? (
              <div className="activity-sub">No orders ready for dispatch.</div>
            ) : (
              <ul>
                {dispatchableOrders.slice(0, 6).map((order) => (
                  <li key={order._id} style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div className="activity-title">{order.orderId || order._id}</div>
                      <div className="activity-sub">
                        {order.patientId?.firstName || 'Patient'} {order.patientId?.lastName || ''} • {order.status}
                      </div>
                    </div>
                    <button
                      className="scan-btn"
                      style={{ padding: '8px 12px', boxShadow: 'none' }}
                      onClick={() => openOrderModal(order)}
                    >
                      View & Dispense
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderModal}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{selectedOrder.orderId || selectedOrder._id}</h3>
                <p className="activity-sub">
                  {selectedOrder.patientId?.firstName || 'Patient'} {selectedOrder.patientId?.lastName || ''} • {selectedOrder.status}
                </p>
              </div>
              <button className="modal-close-btn" onClick={closeOrderModal}>✕</button>
            </div>

            {orderDispenseError && <div className="pharm-error">{orderDispenseError}</div>}

            <div className="order-medicines-list">
              {(selectedOrder.medicines || []).map((medicine, index) => {
                const isDispensed = isMedicineDispensed(selectedOrder._id, medicine, index);
                const medicineKey = getMedicineDispenseKey(selectedOrder._id, medicine, index);
                const inventoryItem = findInventoryItemForMedicine(medicine);
                const availableQty = Number(inventoryItem?.quantity) || 0;
                const requiredQty = Number(medicine.quantity) || 0;

                return (
                  <div key={medicineKey} className={`order-medicine-item ${isDispensed ? 'dispensed' : ''}`}>
                    <div>
                      <div className="activity-title">{medicine.medicineName}</div>
                      <div className="activity-sub">
                        {medicine.strength || 'N/A'} • Required: {requiredQty} • Available: {availableQty}
                      </div>
                    </div>
                    <button
                      className="scan-btn"
                      style={{ padding: '8px 12px', boxShadow: 'none' }}
                      onClick={() => handleDispenseOrderMedicine(selectedOrder, medicine, index)}
                      disabled={
                        isDispensed ||
                        dispatchingOrderId === selectedOrder._id ||
                        dispensingMedicineKey === medicineKey
                      }
                    >
                      {isDispensed
                        ? 'Dispensed'
                        : dispensingMedicineKey === medicineKey
                          ? 'Dispensing...'
                          : 'Dispense'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}