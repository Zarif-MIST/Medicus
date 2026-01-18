const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    prescriptionId: String,
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
    medicines: [
      {
        medicineName: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String,
      },
    ],
    diagnosis: String,
    notes: String,
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: Date,
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Dispensed'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
