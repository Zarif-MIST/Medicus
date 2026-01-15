import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatient, getPatientHistory, createPrescription } from "../../services/api";
import "./Diagnosisstyle.css";
import PrescriptionConfirmModal from "../PrescriptionConfirmModal/PrescriptionConfirmModal";
import { useAuth } from "../../context/AuthContext";

export default function DiagnosisPage() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { user } = useAuth();

  const [patient, setPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [diagnosisText, setDiagnosisText] = useState("");

  // Fetch patient data on mount
  useEffect(() => {
    if (patientId) {
      fetchPatientData();
      fetchPatientHistory();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const response = await getPatient(patientId);
      setPatient(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching patient:", err);
      setError(err.message || "Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientHistory = async () => {
    try {
      const response = await getPatientHistory(patientId);
      setPatientHistory(response.data || []);
    } catch (err) {
      console.error("Error fetching patient history:", err);
    }
  };

  // dynamic medicines list
  const [medicines, setMedicines] = useState([]);
  const [showMedForm, setShowMedForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [medForm, setMedForm] = useState({
    name: "",
    dosage: "",
    quantity: "",
    frequency: "",
    duration: "",
  });

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
    try {
      // Prepare prescription data for API
      const prescriptionData = {
        patient: patientId,
        diagnosis: {
          condition: diagnosisText,
          symptoms: [],
          notes: diagnosisText
        },
        medications: medicines.map(med => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: `Take ${med.frequency} for ${med.duration}`
        })),
        status: 'Active'
      };

      // Save to database
      await createPrescription(prescriptionData);

      setShowConfirmModal(false);
      
      // Show success message and navigate
      alert('Prescription created successfully!');
      navigate("/recentpes");

    } catch (err) {
      console.error("Error creating prescription:", err);
      alert(err.message || "Failed to create prescription");
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="Diagnosis-page">
        <main className="diag-container" style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Loading patient data...</p>
        </main>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="Diagnosis-page">
        <main className="diag-container" style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ fontSize: '18px', color: '#ff4444', marginBottom: '20px' }}>
            {error || 'Patient not found'}
          </p>
          <button 
            onClick={() => navigate('/doctordash')}
            style={{
              padding: '10px 20px',
              background: '#2c3e50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="Diagnosis-page">
      <PrescriptionConfirmModal
        isOpen={showConfirmModal}
        patient={{
          name: patient.fullName,
          id: patient._id,
          age: patient.age,
          gender: patient.gender,
          bloodType: patient.bloodType,
          prescriptions: patientHistory.length,
          allergies: patient.allergies?.join(', ') || 'None',
          conditions: patient.chronicConditions?.join(', ') || 'None'
        }}
        diagnosis={diagnosisText}
        medicines={medicines}
        onCancel={handleCancelModal}
        onConfirm={handleConfirmSend}
      />
      <main className="diag-container">
        {/* Top dark banner */}
        <section className="diag-hero">
          <p className="diag-hero-sub">Welcome Back, Dr. {user?.username || 'Doctor'}</p>
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
              <h2 className="patient-name">{patient.fullName}</h2>
              <p className="patient-meta">
                Patient ID: <span>{patient._id}</span>
              </p>
            </div>
          </div>

          <div className="patient-stats-row">
            <div className="stat-card">
              <p className="stat-label">Age</p>
              <p className="stat-value">{patient.age}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Gender</p>
              <p className="stat-value">{patient.gender}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Blood Type</p>
              <p className="stat-value">{patient.bloodType}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Prescriptions</p>
              <p className="stat-value">{patientHistory.length}</p>
            </div>
          </div>

          <div className="patient-extra">
            <div>
              <p className="extra-label">Allergies</p>
              <p className="extra-value">{patient.allergies?.join(', ') || 'None'}</p>
            </div>
            <div>
              <p className="extra-label">Chronic Conditions</p>
              <p className="extra-value">{patient.chronicConditions?.join(', ') || 'None'}</p>
            </div>
          </div>
        </section>

        {/* Patient History Section */}
        {patientHistory.length > 0 && (
          <section className="patient-card" style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>
              📋 Prescription History
            </h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {patientHistory.map((prescription, idx) => (
                <div 
                  key={prescription._id}
                  style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    marginBottom: '10px'
                  }}
                >
                  <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {prescription.prescriptionCode} - {new Date(prescription.prescriptionDate).toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {prescription.diagnosis?.condition || 'No diagnosis'}
                  </p>
                  <p style={{ fontSize: '13px', color: '#999' }}>
                    {prescription.medications?.length || 0} medication(s) - Status: {prescription.status}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
            </div>
            <div>
              <p className="extra-label">Current Conditions</p>
              <p className="extra-value">{patient.conditions}</p>
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
          onClick={() => navigate("/doctordash")}
        >
          Back to Dashboard
        </button>
      </main>
    </div>
  );
}