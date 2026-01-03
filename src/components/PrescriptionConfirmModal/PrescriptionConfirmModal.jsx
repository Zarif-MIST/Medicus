import React from "react";
import "./PrescriptionConfirmModal.css";

export default function PrescriptionConfirmModal({
  isOpen,
  patient,
  diagnosis,
  medicines,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Patient info section */}
        <div className="modal-patient-card">
          <div className="modal-patient-header">
            <div className="modal-patient-avatar">
              <span className="modal-avatar-icon">👤</span>
            </div>
            <div>
              <h2 className="modal-patient-name">{patient.name}</h2>
              <p className="modal-patient-meta">
                Patient ID: <span>{patient.id}</span>
              </p>
            </div>
          </div>

          <div className="modal-patient-stats">
            <div className="modal-stat-card">
              <p className="modal-stat-label">Age</p>
              <p className="modal-stat-value">{patient.age}</p>
            </div>
            <div className="modal-stat-card">
              <p className="modal-stat-label">Gender</p>
              <p className="modal-stat-value">{patient.gender}</p>
            </div>
            <div className="modal-stat-card">
              <p className="modal-stat-label">Blood Type</p>
              <p className="modal-stat-value">{patient.bloodType}</p>
            </div>
            <div className="modal-stat-card">
              <p className="modal-stat-label">Prescriptions</p>
              <p className="modal-stat-value">{patient.prescriptions}</p>
            </div>
          </div>

          <div className="modal-patient-extra">
            <div>
              <p className="modal-extra-label">Allergies</p>
              <p className="modal-extra-value">{patient.allergies}</p>
            </div>
            <div>
              <p className="modal-extra-label">Current Conditions</p>
              <p className="modal-extra-value">{patient.conditions}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis section */}
        <div className="modal-section">
          <h3 className="modal-section-title">Diagnosis</h3>
          <div className="modal-diagnosis-content">
            {diagnosis.split("\n").map((line, idx) => (
              <p key={idx} className="modal-diagnosis-line">
                {line || "\u00A0"}
              </p>
            ))}
          </div>
        </div>

        {/* Prescription section */}
        <div className="modal-section">
          <h3 className="modal-section-title">Prescription</h3>
          <div className="modal-medicines-list">
            {medicines.length > 0 ? (
              medicines.map((medicine) => (
                <div key={medicine.id} className="modal-medicine-item">
                  <p className="modal-medicine-name">{medicine.name}</p>
                  <p className="modal-medicine-details">
                    Quantity: {medicine.quantity} | Frequency: {medicine.frequency} | Duration: {medicine.duration}
                  </p>
                </div>
              ))
            ) : (
              <p className="modal-no-medicines">No medicines added</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="modal-actions">
          <button className="modal-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-confirm-btn" onClick={onCancel}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
