import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recentpes.css";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/apiService";

export default function DoctorRecentPrescriptionsPage() {
  const [patientId, setPatientId] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchHistory = useCallback(async (searchPatientId = "") => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");
      const response = await apiService.getDoctorPrescriptionHistory(user.id, searchPatientId.trim());
      setPrescriptions(response.prescriptions || []);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load prescriptions");
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHistory(patientId);
  };

  const getStatusChipClass = (status) => {
    if (status === "Active") return "rx-chip rx-chip-active";
    return "rx-chip rx-chip-complete";
  };

  const handleViewPrescription = async (prescription) => {
    try {
      setViewLoading(true);
      setViewError("");
      const response = await apiService.getPrescriptionById(prescription.prescriptionId);
      setSelectedPrescription(response.prescription || prescription);
    } catch (viewFetchError) {
      setViewError(viewFetchError.message || "Failed to load prescription details");
      setSelectedPrescription(prescription);
    } finally {
      setViewLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedPrescription(null);
    setViewError("");
  };

  return (
    <div className="dash-root">
      <main className="dash-main">
        
        {/* Top hero banner */}
        <section className="dash-hero">
          <svg width="103" height="103" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 9.08824C0 4.07077 4.07077 0 9.08824 0H18.1765C21.5278 0 24.2353 2.70754 24.2353 6.05882C24.2353 9.41011 21.5278 12.1176 18.1765 12.1176H12.1176V36.3529C12.1176 46.3879 20.2592 54.5294 30.2941 54.5294C40.329 54.5294 48.4706 46.3879 48.4706 36.3529V12.1176H42.4118C39.0605 12.1176 36.3529 9.41011 36.3529 6.05882C36.3529 2.70754 39.0605 0 42.4118 0H51.5C56.5175 0 60.5882 4.07077 60.5882 9.08824V36.3529C60.5882 51.0077 50.1746 63.239 36.3529 66.0412V69.6765C36.3529 81.3965 45.8388 90.8824 57.5588 90.8824C69.2789 90.8824 78.7647 81.3965 78.7647 69.6765V53.4881C71.7024 50.9888 66.6471 44.2673 66.6471 36.3529C66.6471 26.318 74.7886 18.1765 84.8235 18.1765C94.8585 18.1765 103 26.318 103 36.3529C103 44.2673 97.9447 51.0077 90.8824 53.4881V69.6765C90.8824 88.0801 75.9625 103 57.5588 103C39.1551 103 24.2353 88.0801 24.2353 69.6765V66.0412C10.4136 63.239 0 51.0077 0 36.3529V9.08824ZM84.8235 42.4118C88.1748 42.4118 90.8824 39.7042 90.8824 36.3529C90.8824 33.0017 88.1748 30.2941 84.8235 30.2941C81.4722 30.2941 78.7647 33.0017 78.7647 36.3529C78.7647 39.7042 81.4722 42.4118 84.8235 42.4118Z" fill="#FFF8F0"/>
</svg>

          <div className="dash-hero-text">
            <h1>Welcome Back, Dr. {user?.firstName || user?.email || user?.username || 'Doctor'}</h1>
            <p>Access patient data, create diagnoses, and manage prescriptions</p>
          </div>
        </section>

        {/* Primary actions */}
        <section className="dash-actions">
          
          {/* ✅ GO BACK TO PATIENT SEARCH */}
          <button
            className="dash-action-card"
            type="button"
            onClick={() => navigate("/doctor-dashboard")}
          >
            <span className="action-icon">🔍</span>
            <span className="action-label">Patient Search</span>
          </button>

          <button className="dash-action-card">
            <span className="action-icon">🧾</span>
            <span className="action-label">Recent Prescriptions</span>
          </button>
        </section>

        {/* Patient Lookup */}
        <section className="lookup-section">
          <div className="lookup-header">
            <span className="lookup-big-icon">🔍</span>
            <div>
              <p className="lookup-label">Patient Lookup</p>
              <p className="lookup-caption">
                Enter Patient ID to access medical records
              </p>
            </div>
          </div>

          <form className="lookup-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="lookup-input"
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
            <button type="submit" className="lookup-button">
              <span className="lookup-btn-icon">🔍</span>
              <span>Search</span>
            </button>
          </form>
          <div style={{ marginTop: "10px" }}>
            <button type="button" className="lookup-button" onClick={() => { setPatientId(""); fetchHistory(); }}>
              <span>Show All History</span>
            </button>
          </div>
        </section>

        {/* Recent Prescriptions List */}
        <section className="recent-card">
          <h2 className="recent-title">Recent Prescriptions</h2>
          {loading && <p className="rx-drug">Loading prescriptions...</p>}
          {error && <p className="rx-drug" style={{ color: "#b91c1c" }}>{error}</p>}

          <div className="rx-list">
            {!loading && !error && prescriptions.length === 0 && (
              <div className="rx-row">
                <div className="rx-left">
                  <p className="rx-code">No prescription history found</p>
                </div>
              </div>
            )}

            {prescriptions.map((prescription) => (
              <div className="rx-row" key={prescription._id}>
                <div className="rx-left">
                  <p className="rx-code">
                    {prescription.prescriptionId} - {prescription.patientId?.firstName || "Unknown"} {prescription.patientId?.lastName || "Patient"}
                  </p>
                  {(prescription.medicines || []).map((medicine, index) => (
                    <p className="rx-drug" key={`${prescription._id}_${index}`}>
                      {medicine.medicineName} {medicine.dosage ? `(${medicine.dosage})` : ""}
                    </p>
                  ))}
                </div>
                <div className="rx-right">
                  <span className="rx-date">
                    {new Date(prescription.issuedDate).toLocaleDateString("en-CA")}
                  </span>
                  <span className={getStatusChipClass(prescription.status)}>{prescription.status}</span>
                  <button
                    type="button"
                    className="rx-view-btn"
                    onClick={() => handleViewPrescription(prescription)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedPrescription && (
          <div className="rx-modal-overlay" onClick={closeModal}>
            <div className="rx-modal" onClick={(e) => e.stopPropagation()}>
              <div className="rx-modal-header">
                <h3>Prescription Details</h3>
                <button type="button" className="rx-modal-close" onClick={closeModal}>✕</button>
              </div>

              {viewLoading ? (
                <p className="rx-drug">Loading details...</p>
              ) : (
                <>
                  {viewError && <p className="rx-drug" style={{ color: "#b91c1c" }}>{viewError}</p>}

                  <div className="rx-modal-meta">
                    <p><strong>Prescription ID:</strong> {selectedPrescription.prescriptionId}</p>
                    <p><strong>Patient:</strong> {selectedPrescription.patientId?.firstName || "Unknown"} {selectedPrescription.patientId?.lastName || "Patient"} ({selectedPrescription.patientId?.patientId || "N/A"})</p>
                    <p><strong>Doctor:</strong> Dr. {selectedPrescription.doctorId?.firstName || "Unknown"} {selectedPrescription.doctorId?.lastName || ""}</p>
                    <p><strong>Issued Date:</strong> {new Date(selectedPrescription.issuedDate).toLocaleDateString("en-CA")}</p>
                    <p><strong>Status:</strong> {selectedPrescription.status}</p>
                  </div>

                  <div className="rx-modal-section">
                    <h4>Diagnosis</h4>
                    <p>{selectedPrescription.diagnosis || "N/A"}</p>
                  </div>

                  <div className="rx-modal-section">
                    <h4>Medicines</h4>
                    {(selectedPrescription.medicines || []).length === 0 ? (
                      <p>No medicines listed.</p>
                    ) : (
                      <div className="rx-modal-meds">
                        {(selectedPrescription.medicines || []).map((medicine, index) => (
                          <div key={`${selectedPrescription._id}_${index}`} className="rx-modal-med-row">
                            <p><strong>{medicine.medicineName || "Medicine"}</strong> {medicine.dosage ? `(${medicine.dosage})` : ""}</p>
                            <p>Quantity: {medicine.quantity || 1}</p>
                            <p>Frequency: {medicine.frequency || "N/A"}</p>
                            <p>Duration: {medicine.duration || "N/A"}</p>
                            {medicine.instructions && <p>Instructions: {medicine.instructions}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}