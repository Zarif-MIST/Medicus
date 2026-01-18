import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Diagnosisstyle.css";
import PrescriptionConfirmModal from "../PrescriptionConfirmModal/PrescriptionConfirmModal";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/apiService";

export default function DiagnosisPage() {
  const navigate = useNavigate();
  const { patientId } = useParams(); // coming from /doctor/diagnosis/:patientId
  const { user, initializing } = useAuth();

  // Define all hooks BEFORE any conditional logic
  const [patient, setPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [patientError, setPatientError] = useState("");
  const [diagnosisText, setDiagnosisText] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [showMedForm, setShowMedForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [medForm, setMedForm] = useState({
    name: "",
    dosage: "",
    quantity: "",
    frequency: "",
    duration: "",
  });

  // Fetch patient data
  React.useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      try {
        setLoadingPatient(true);
        const data = await apiService.getPatientById(patientId);
        setPatient(data.patient);
      } catch (error) {
        setPatientError(error.message);
      } finally {
        setLoadingPatient(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (initializing) return; // Wait for auth to initialize
    const role = localStorage.getItem("medicus_role");
    if (!user || role !== "doctor") {
      navigate("/login");
    }
  }, [user, navigate, initializing]);

  if (initializing || !user) {
    return null; // Show nothing while loading
  }

  if (loadingPatient) {
    return (
      <div className="Diagnosis-page">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Loading patient information...
        </div>
      </div>
    );
  }

  if (patientError || !patient) {
    return (
      <div className="Diagnosis-page">
        <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
          {patientError || "Patient not found"}
        </div>
      </div>
    );
  }

  const onMedFormChange = (e) => {
    const { name, value } = e.target;
    setMedForm((p) => ({ ...p, [name]: value }));
  };

  const addMedicine = () => {
    // basic validation
    if (!medForm.name.trim()) return;

    setMedicines((prev) => [
      ...prev,
      { id: crypto?.randomUUID?.() ?? Date.now().toString(), ...medForm },
    ]);

    setMedForm({
      name: "",
      dosage: "",
      quantity: "",
      frequency: "",
      duration: "",
    });
    setShowMedForm(false);
  };

  const closeForm = () => {
    setShowMedForm(false);
    setMedForm({
      name: "",
      dosage: "",
      quantity: "",
      frequency: "",
      duration: "",
    });
  };

  const removeMedicine = (id) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSend = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSend = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      // Create prescription in MongoDB
      const response = await apiService.createPrescription({
        doctorId: user.id, // MongoDB _id from auth
        patientId: patient.id, // MongoDB _id, not patientId field
        medicines: medicines.map(m => ({
          medicineName: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions || "",
        })),
        diagnosis: diagnosisText,
        notes: "",
      });

      if (response.prescription) {
        setShowConfirmModal(false);
        alert(`Prescription saved successfully!\nPrescription ID: ${response.prescription.prescriptionId}`);
        // Navigate to pharmacist page
        navigate("/doctor/pharmacy-dashboard", {
          state: {
            patientId: patient.patientId,
            diagnosis: diagnosisText,
            medicines,
            prescriptionId: response.prescription.prescriptionId,
          },
        });
      } else {
        setSubmitError(response.message || "Failed to save prescription");
      }
    } catch (error) {
      setSubmitError("Error saving prescription: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="Diagnosis-page">
      <PrescriptionConfirmModal
        isOpen={showConfirmModal}
        patient={patient}
        diagnosis={diagnosisText}
        medicines={medicines}
        onCancel={handleCancelModal}
        onConfirm={handleConfirmSend}
        submitting={submitting}
        error={submitError}
      />
      <main className="diag-container">
        {/* Top dark banner */}
        <section className="diag-hero">
          <p className="diag-hero-sub">
            Welcome Back, Dr. {user.firstName || user.email || ""}
          </p>
          <p className="diag-hero-main">
            Access patient data, create diagnoses, and manage prescriptions
          </p>
        </section>

        {/* Patient summary card */}
        <section className="patient-card">
          <div className="patient-header">
            <div className="patient-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div>
              <h2 className="patient-name">{patient.firstName} {patient.lastName}</h2>
              <p className="patient-meta">
                Patient ID: <span>{patient.patientId}</span>
              </p>
            </div>
          </div>

          <div className="patient-stats-row">
            <div className="stat-card">
              <p className="stat-label">Age</p>
              <p className="stat-value">
                {patient.dateOfBirth 
                  ? Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
                  : "N/A"}
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Gender</p>
              <p className="stat-value">{patient.gender || "N/A"}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Phone</p>
              <p className="stat-value">{patient.phoneNumber || "N/A"}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Email</p>
              <p className="stat-value" style={{ fontSize: "0.85rem" }}>{patient.email || "N/A"}</p>
            </div>
          </div>

          <div className="patient-extra">
            <div>
              <p className="extra-label">Address</p>
              <p className="extra-value">{patient.address || "Not provided"}</p>
            </div>
          </div>
        </section>

        {/* Diagnosis card */}
        <section className="panel-card">
          <h3 className="panel-title">Diagnosis</h3>
          <p className="panel-subtitle">Enter your medical Diagnosis</p>
          <textarea
            className="diag-textarea"
            placeholder="Type diagnosis here..."
            value={diagnosisText}
            onChange={(e) => setDiagnosisText(e.target.value)}
          />
        </section>

        {/* Prescription card */}
        <section className="panel-card">
          <h3 className="panel-title">Prescription</h3>
          <p className="panel-subtitle">Add medicines with quantities</p>

          {/* Added medicines list */}
          {medicines.length > 0 && (
            <div className="med-list">
              {medicines.map((m) => (
                <div key={m.id} className="med-item">
                  <div className="med-item-left">
                    <p className="med-name">{m.name} - {m.dosage}</p>
                    <p className="med-meta">
                      Quantity: {m.quantity} | Frequency: {m.frequency} | Duration: {m.duration}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="med-remove-btn"
                    onClick={() => removeMedicine(m.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Show/Hide form toggle */}
          {!showMedForm ? (
            <button 
              type="button" 
              className="add-med-btn" 
              onClick={() => setShowMedForm(true)}
            >
              + Add Medicine
            </button>
          ) : (
            <>
              {/* Input row - only visible when showMedForm is true */}
              <div className="med-form-row">
                <input
                  name="name"
                  value={medForm.name}
                  onChange={onMedFormChange}
                  placeholder="Medicine name"
                  className="med-input"
                />
                <input
                  name="dosage"
                  value={medForm.dosage}
                  onChange={onMedFormChange}
                  placeholder="Dosage"
                  className="med-input"
                />
                <input
                  name="quantity"
                  value={medForm.quantity}
                  onChange={onMedFormChange}
                  placeholder="Quantity"
                  className="med-input"
                />
                <input
                  name="frequency"
                  value={medForm.frequency}
                  onChange={onMedFormChange}
                  placeholder="Frequency"
                  className="med-input"
                />
                <input
                  name="duration"
                  value={medForm.duration}
                  onChange={onMedFormChange}
                  placeholder="Duration"
                  className="med-input"
                />
              </div>

              <div className="med-form-actions">
                <button 
                  type="button" 
                  className="add-med-btn add-med-submit" 
                  onClick={addMedicine}
                >
                  Add Medicine
                </button>
                <button 
                  type="button" 
                  className="close-form-btn"
                  onClick={closeForm}
                >
                  ✕
                </button>
              </div>
            </>
          )}
        </section>

        {/* Bottom buttons */}
        <button className="send-btn" onClick={handleSend}>
          Send Prescription to Pharmacists
        </button>

        {/* optional back */}
        <button
          type="button"
          className="med-remove-btn"
          style={{ marginTop: 12 }}
          onClick={() => navigate("/doctor-dashboard")}
        >
          Back to Dashboard
        </button>
      </main>
    </div>
  );
}