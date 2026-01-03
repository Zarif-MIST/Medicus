import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Diagnosisstyle.css";
import PrescriptionConfirmModal from "../PrescriptionConfirmModal/PrescriptionConfirmModal";
import { useAuth } from "../../context/AuthContext";

export default function DiagnosisPage() {
  const navigate = useNavigate();
  const { patientId } = useParams(); // coming from /doctor/diagnosis/:patientId
  const { user } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user || user.role !== "Doctor") {
      navigate("/login/doctor");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect automatically
  }

  const patient = useMemo(() => {
    // later you can fetch patient info by patientId
    return {
      name: "Sinlam Ahmed",
      id: patientId || "N/A",
      age: 21,
      gender: "Male",
      bloodType: "A+",
      prescriptions: 5,
      allergies: "Penicillin, Sulfa drugs",
      conditions: "Hypertension, Type 2 Diabetes",
    };
  }, [patientId]);

  const [diagnosisText, setDiagnosisText] = useState("");

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

  const handleConfirmSend = () => {
    // later: API call
    console.log({
      patientId: patient.id,
      diagnosis: diagnosisText,
      medicines,
    });

    setShowConfirmModal(false);
    // Navigate to pharmacist page
    navigate("/doctor/pharmacy-dashboard", {
      state: {
        patientId: patient.id,
        diagnosis: diagnosisText,
        medicines,
      },
    });
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
      />
      <main className="diag-container">
        {/* Top dark banner */}
        <section className="diag-hero">
          <p className="diag-hero-sub">Welcome Back, Dr. {user.username}</p>
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
              <h2 className="patient-name">{patient.name}</h2>
              <p className="patient-meta">
                Patient ID: <span>{patient.id}</span>
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
              <p className="stat-value">{patient.prescriptions}</p>
            </div>
          </div>

          <div className="patient-extra">
            <div>
              <p className="extra-label">Allergies</p>
              <p className="extra-value">{patient.allergies}</p>
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
          onClick={() => navigate("/doctor/dashboard")}
        >
          Back to Dashboard
        </button>
      </main>
    </div>
  );
}