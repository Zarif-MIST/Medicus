import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PharmDashPres.css';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

export default function PharmDashPres() {
  const navigate = useNavigate();
  const { user, initializing } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientSearchId, setPatientSearchId] = useState('');
  const [searchError, setSearchError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRx, setSelectedRx] = useState(null);
  const [dispensingMedicine, setDispensingMedicine] = useState(null);
  const [dispensingQuantity, setDispensingQuantity] = useState('');
  const [dispensingError, setDispensingError] = useState('');
  const [dispensingLoading, setDispensingLoading] = useState(false);
  const [inventory, setInventory] = useState([]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (initializing) return;
    const role = localStorage.getItem("medicus_role");
    if (!user || !role?.includes("pharmacy")) {
      navigate("/login");
    } else {
      // Fetch pharmacy inventory on mount
      fetchInventory();
    }
  }, [user, navigate, initializing]);

  const fetchInventory = async () => {
    try {
      const data = await apiService.getPharmacyInventory(user.id);
      setInventory(data.inventory || []);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  if (initializing || !user) {
    return null;
  }

  const handleSearchPatient = async () => {
    if (!patientSearchId.trim()) {
      setSearchError('Please enter a patient ID');
      return;
    }

    try {
      setSearchError('');
      setPrescriptions([]);
      const response = await apiService.getPrescriptionsByPatient(patientSearchId);
      
      if (response.prescriptions && response.prescriptions.length > 0) {
        setPrescriptions(response.prescriptions);
      } else {
        setSearchError('No prescriptions found for this patient');
      }
    } catch (error) {
      setSearchError(error.message || 'Error searching patient');
    }
  };

  const handleDispenseMedicine = async () => {
    if (!dispensingQuantity || parseInt(dispensingQuantity) <= 0) {
      setDispensingError('Please enter a valid quantity');
      return;
    }

    const quantityNeeded = parseInt(dispensingQuantity, 10);

    // Check if medicine exists in inventory
    const medicineInStock = inventory.find(
      (item) => item.medicineName.toLowerCase() === dispensingMedicine.medicineName.toLowerCase()
    );

    if (!medicineInStock) {
      setDispensingError(`${dispensingMedicine.medicineName} is not in stock`);
      return;
    }

    if (medicineInStock.quantity < quantityNeeded) {
      setDispensingError(
        `Insufficient stock. Available: ${medicineInStock.quantity} units, Required: ${quantityNeeded} units`
      );
      return;
    }

    setDispensingLoading(true);
    setDispensingError('');
    try {
      // Update medicine quantity in inventory
      await apiService.updateMedicineQuantity(medicineInStock._id, quantityNeeded, 'dispense');
      
      // Update local inventory
      setInventory((prev) =>
        prev.map((item) =>
          item._id === medicineInStock._id
            ? { ...item, quantity: item.quantity - quantityNeeded }
            : item
        )
      );

      alert(`Dispensed ${quantityNeeded} units of ${dispensingMedicine.medicineName}`);
      setDispensingMedicine(null);
      setDispensingQuantity('');
    } catch (error) {
      setDispensingError(error.message || 'Failed to dispense medicine');
    } finally {
      setDispensingLoading(false);
    }
  };

  const handleOpenPrescription = (rx) => {
    setSelectedRx(rx);
    setShowModal(true);
  };

  return (
    <section className="pharm-page">
      <div className="pharm-layout">
        <header className="pharm-header">
          <h1>Prescriptions</h1>
          <p>Manage and process patient prescriptions</p>
        </header>

        <div className="pharm-tabs">
          <button className="tab" onClick={() => navigate('/pharmacy-dashboard')}>Overview</button>
          <button className="tab active" onClick={() => navigate('/pharmacy-prescriptions')}>Prescriptions</button>
          <button className="tab" onClick={() => navigate('/pharmacy-inventory')}>Inventory</button>
        </div>

        <div className="pharm-grid">
          <div className="pharm-card pres-card">
            <div className="pres-header">
              <h3>Search Prescriptions by Patient</h3>
              <div className="pres-controls">
                <div className="search-control">
                  <input
                    type="text"
                    placeholder="Enter Patient ID (e.g., 5240)..."
                    value={patientSearchId}
                    onChange={(e) => setPatientSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchPatient()}
                  />
                  <button onClick={handleSearchPatient} className="search-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="7" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Search
                  </button>
                </div>
              </div>
              {searchError && <div className="error-message">{searchError}</div>}
            </div>

            <div className="prescriptions-list">
              {prescriptions.length > 0 ? (
                prescriptions.map((rx) => (
                  <div key={rx._id} className="prescription-item">
                    <div className="pres-info">
                      <div className="pres-id">{rx.prescriptionId}</div>
                      <div className="pres-patient">
                        Patient: {rx.patientId?.firstName} {rx.patientId?.lastName}
                      </div>
                      <div className="pres-doctor">
                        Doctor: {rx.doctorId?.firstName} {rx.doctorId?.lastName}
                      </div>
                      <div className="pres-medication">
                        Medicines: {rx.medicines?.length || 0} item(s)
                      </div>
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
                ))
              ) : (
                patientSearchId && !searchError && <div className="no-data">Search for a patient to view prescriptions</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedRx && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedRx.patientId?.firstName} {selectedRx.patientId?.lastName}</h2>
                <p className="muted">Patient ID: {selectedRx.patientId?.patientId}</p>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="summary-grid">
                <div className="pill-card">Doctor<span>{selectedRx.doctorId?.firstName} {selectedRx.doctorId?.lastName}</span></div>
                <div className="pill-card">Prescription ID<span>{selectedRx.prescriptionId}</span></div>
                <div className="pill-card">Status<span>{selectedRx.status}</span></div>
                <div className="pill-card">Medicines<span>{selectedRx.medicines?.length || 0}</span></div>
              </div>

              <div className="field">
                <label>Diagnosis</label>
                <textarea rows="3" value={selectedRx.diagnosis || 'N/A'} readOnly />
              </div>

              <div className="field">
                <label>Prescribed Medicines</label>
                <div className="medicines-list">
                  {selectedRx.medicines && selectedRx.medicines.length > 0 ? (
                    selectedRx.medicines.map((med, idx) => (
                      <div key={idx} className="medicine-card">
                        <div className="med-name">{med.medicineName}</div>
                        <div className="med-details">
                          <span>Dosage: {med.dosage}</span>
                          <span>Frequency: {med.frequency}</span>
                          <span>Duration: {med.duration}</span>
                        </div>
                        <button 
                          className="dispense-btn"
                          onClick={() => setDispensingMedicine(med)}
                        >
                          Dispense
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No medicines in this prescription</p>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {dispensingMedicine && (
        <div className="modal-overlay" onClick={() => setDispensingMedicine(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Dispense Medicine</h2>
              <button className="modal-close" onClick={() => setDispensingMedicine(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="field">
                <label>Medicine Name</label>
                <input value={dispensingMedicine.medicineName} readOnly />
              </div>

              <div className="field">
                <label>Dosage</label>
                <input value={dispensingMedicine.dosage} readOnly />
              </div>

              <div className="field">
                <label>Quantity to Dispense</label>
                <input
                  type="number"
                  min="1"
                  value={dispensingQuantity}
                  onChange={(e) => setDispensingQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>

              {dispensingError && <div className="error-message">{dispensingError}</div>}

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setDispensingMedicine(null)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-submit" 
                  onClick={handleDispenseMedicine}
                  disabled={dispensingLoading}
                >
                  {dispensingLoading ? 'Dispensing...' : 'Confirm Dispense'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}