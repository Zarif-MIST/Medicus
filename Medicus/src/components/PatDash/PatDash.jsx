// src/components/PatientDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatDash.css';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import PharmacyLocator from './PharmacyLocator';
import FavoritePharmacies from './FavoritePharmacies';
import MedicineOrder from './MedicineOrder';
import BkashPayment from './BkashPayment';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, initializing } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // added for tab management
  const [selectedPharmacy, setSelectedPharmacy] = useState(null); // added for pharmacy selection
  const [currentOrder, setCurrentOrder] = useState(null); // added for order tracking

  // Redirect if not authenticated as patient
  useEffect(() => {
    if (initializing) return;
    const role = localStorage.getItem("medicus_role");
    if (!user || role !== "patient") {
      navigate("/login");
    }
  }, [user, navigate, initializing]);

  // Fetch patient prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const response = await apiService.getPrescriptionsByPatient(user.id);
        setPrescriptions(response.prescriptions || []);
        setError('');
      } catch (err) {
        setError('Failed to load prescriptions');
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    if (!initializing && user?.id) {
      fetchPrescriptions();
    }
  }, [user, initializing]);

  if (initializing || !user) {
    return null;
  }

  // Helper function to extract days from duration string
  const extractDays = (duration) => {
    if (!duration) return 0;
    const text = String(duration).toLowerCase();
    const match = text.match(/(\d+)/);
    if (!match) return 0;
    const value = parseInt(match[1], 10);
    if (Number.isNaN(value)) return 0;
    if (text.includes('week')) return value * 7;
    if (text.includes('month')) return value * 30;
    return value;
  };

  // Helper function to check if prescription is currently ongoing
  const isOngoing = (rx) => {
    const issuedDate = new Date(rx.issuedDate);
    const today = new Date();
    const daysSinceIssued = Math.floor((today - issuedDate) / (1000 * 60 * 60 * 24));
    
    // Find the maximum duration among all medicines
    const maxDuration = Math.max(...rx.medicines.map(med => extractDays(med.duration)));
    
    return daysSinceIssued >= 0 && daysSinceIssued <= maxDuration;
  };

  // Helper function to calculate days left for a medicine
  const getDaysLeft = (issuedDate, duration) => {
    const issued = new Date(issuedDate);
    const today = new Date();
    const daysSinceIssued = Math.floor((today - issued) / (1000 * 60 * 60 * 24));
    const totalDays = extractDays(duration);
    return Math.max(0, totalDays - daysSinceIssued);
  };

  // Helper function to calculate progress percentage
  const getProgress = (issuedDate, duration) => {
    const issued = new Date(issuedDate);
    const today = new Date();
    const daysSinceIssued = Math.floor((today - issued) / (1000 * 60 * 60 * 24));
    const totalDays = extractDays(duration);
    if (totalDays === 0) return 0;
    return Math.min(100, Math.max(0, (daysSinceIssued / totalDays) * 100));
  };

  const patientName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const treatmentStatuses = new Set(['Active', 'Dispensed']);
  const treatmentPrescriptions = prescriptions.filter((rx) => treatmentStatuses.has(rx.status));
  const ongoingPrescriptions = treatmentPrescriptions.filter(isOngoing);
  const recentPrescriptionHistory = [...prescriptions]
    .sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate))
    .slice(0, 2);

  // Handle order completion
  const handleOrderComplete = (order) => {
    setCurrentOrder(order);
    setActiveTab('payment');
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    alert('Payment successful! Your order has been confirmed.');
    setActiveTab('overview');
    // Reset for next order
    setCurrentOrder(null);
    setSelectedPharmacy(null);
  };

  // Handle pharmacy selection from pharmacy locator or favorites
  const handleSelectPharmacy = (pharmacyId) => {
    setSelectedPharmacy(pharmacyId);
    setActiveTab('order');
  };

  return (
    <div className="dashboard">
      {/* Welcome Back Card */}
      {patientName && (
        <div className="welcome-card">
          <div className="welcome-content">
            <h2 className="welcome-title">Welcome back, {patientName}!</h2>
            <p className="welcome-message">Your health is our priority. Check your latest medical information below.</p>
          </div>
        </div>
      )}

      {/* Top Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon visits">{prescriptions.length}</div>
          <div className="summary-label">Total Prescriptions</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon prescriptions">{ongoingPrescriptions.length}</div>
          <div className="summary-label">Ongoing Treatments</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorite Pharmacies
        </button>
        <button
          className={`tab ${activeTab === 'order' ? 'active' : ''}`}
          onClick={() => setActiveTab('order')}
        >
          Order Medicines
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Pharmacy Locator Section */}
          <PharmacyLocator onSelectPharmacy={handleSelectPharmacy} />

          {/* Main Content Grid */}
          <div className="main-grid">
            {/* Ongoing Prescriptions */}
            <div className="section-card large">
              <div className="section-header">
                <h3>Ongoing Prescriptions & Today's Medications</h3>
                {ongoingPrescriptions.length > 0 && (
                  <span className="prescription-count">{ongoingPrescriptions.length}</span>
                )}
              </div>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Loading prescriptions...</div>
              ) : error ? (
                <div style={{ padding: '20px', color: '#991b1b' }}>{error}</div>
              ) : ongoingPrescriptions.length > 0 ? (
                <div className="prescriptions-list">
                  {ongoingPrescriptions.map((rx) => {
                    const issuedDate = new Date(rx.issuedDate);
                    const daysSinceIssued = Math.floor((new Date() - issuedDate) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={rx._id} className="prescription-card">
                        <div className="prescription-header">
                          <div className="prescription-meta">
                            <div className="prescription-id-row">
                              <span className="prescription-id">{rx.prescriptionId}</span>
                              <span className="treatment-day">Day {daysSinceIssued + 1}</span>
                            </div>
                            <div className="prescription-doctor">
                              Dr. {rx.doctorId?.firstName || 'Unknown'} {rx.doctorId?.lastName || ''}
                              {rx.doctorId?.specialization && ` • ${rx.doctorId.specialization}`}
                            </div>
                          </div>
                          <div className="prescription-date">
                            Started {new Date(rx.issuedDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                        </div>
                        
                        {rx.diagnosis && (
                          <div className="prescription-diagnosis">
                            <strong>Diagnosis:</strong> {rx.diagnosis}
                          </div>
                        )}
                        
                        <div className="medicines-list">
                          {rx.medicines && rx.medicines.map((med, idx) => {
                            const daysLeft = getDaysLeft(rx.issuedDate, med.duration);
                            const progress = getProgress(rx.issuedDate, med.duration);
                            const isCompleted = daysLeft === 0;
                            
                            return (
                              <div key={idx} className={`medicine-item ${isCompleted ? 'completed' : ''}`}>
                                <div className="medicine-header">
                                  <div className="medicine-name-group">
                                    <div className="medicine-name">{med.medicineName}</div>
                                    <div className="medicine-dosage">{med.dosage}</div>
                                  </div>
                                  <div className="medicine-status">
                                    {isCompleted ? (
                                      <span className="status-badge completed">✓ Completed</span>
                                    ) : (
                                      <span className="status-badge ongoing">{daysLeft} days left</span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="medicine-progress">
                                  <div className="progress-bar">
                                    <div 
                                      className="progress-fill" 
                                      style={{ width: `${progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                <div className="medicine-details">
                                  <div className="detail-item">
                                    <span className="detail-icon"></span>
                                    <span><strong>Take:</strong> {med.frequency}</span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-icon"></span>
                                    <span><strong>Duration:</strong> {med.duration}</span>
                                  </div>
                                </div>
                                
                                {med.instructions && (
                                  <div className="medicine-instructions">
                                    <span className="instruction-icon">ℹ️</span>
                                    {med.instructions}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <div className="empty-title">No ongoing prescriptions</div>
                  <div className="empty-message">You don't have any active treatments at the moment</div>
                </div>
              )}
            </div>

            {/* Recent Medical History */}
            <div className="section-card large">
              <div className="section-header">
                <h3>Recent Medical History</h3>
              </div>
              <div className="history-list">
                {loading ? (
                  <div className="history-item">
                    <div>Loading medical history...</div>
                  </div>
                ) : recentPrescriptionHistory.length > 0 ? (
                  recentPrescriptionHistory.map((rx) => (
                    <div className="history-item" key={rx._id}>
                      <div>
                        <strong>{rx.diagnosis || 'No diagnosis provided'}</strong><br />
                        Dr. {rx.doctorId?.firstName || 'Unknown'} {rx.doctorId?.lastName || ''}
                      </div>
                      <div className="date">
                        {new Date(rx.issuedDate).toLocaleDateString('en-CA')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="history-item">
                    <div>No recent prescription history found.</div>
                  </div>
                )}
              </div>
            </div>

            {/* Health Tips */}
            <div className="section-card">
              <div className="section-header">
                <h3>Health Tips</h3>
              </div>
              <ul className="tips-list">
                <li>Take your medications as prescribed</li>
                <li>Drink at least 8 glasses of water daily</li>
                <li>Exercise for 30 minutes daily</li>
                <li>Get 7-8 hours of sleep</li>
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && user?.id && (
        <FavoritePharmacies
          patientId={user.id}
          onSelectPharmacy={handleSelectPharmacy}
        />
      )}

      {/* Order Medicines Tab */}
      {activeTab === 'order' && user?.id && (
        <MedicineOrder
          patientId={user.id}
          selectedPharmacy={selectedPharmacy}
          onOrderComplete={handleOrderComplete}
        />
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && currentOrder && user?.id && (
        <BkashPayment
          order={currentOrder}
          patientId={user.id}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}