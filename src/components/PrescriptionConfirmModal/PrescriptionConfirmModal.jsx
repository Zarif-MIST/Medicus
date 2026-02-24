import React from "react";
import "./PrescriptionConfirmModal.css";

export default function PrescriptionConfirmModal({
  isOpen,
  patient,
  diagnosis,
  medicines,
  onCancel,
  onConfirm,
  submitting = false,
  error = "",
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Prescription</h2>
        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}
          <div className="confirm-section">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
            <p><strong>ID:</strong> {patient.patientId}</p>
            <p><strong>Email:</strong> {patient.email}</p>
          </div>

          <div className="confirm-section">
            <h3>Diagnosis</h3>
            <p>{diagnosis || "No diagnosis entered"}</p>
          </div>

          <div className="confirm-section">
            <h3>Prescribed Medicines ({medicines.length})</h3>
            <p className="prescription-note">
              📅 Prescription starts from today ({new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })})
            </p>
            {medicines.length > 0 ? (
              <ul>
                {medicines.map((med) => (
                  <li key={med.id}>
                    <strong>{med.name}</strong> - {med.dosage}
                    <br />
                    <span className="med-details-line">
                      Qty: {med.quantity} | Frequency: {med.frequency} | Duration: {med.duration}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No medicines added</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={onConfirm} disabled={submitting}>
            {submitting ? "Saving..." : "Confirm & Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
