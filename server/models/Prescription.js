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
        quantity: {
          type: Number,
          default: 1,
        },
        frequency: String,
        duration: String,
        instructions: String,
        dispensed: {
          type: Boolean,
          default: false,
        },
        dispensedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pharmacy',
        },
        dispensedAt: Date,
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
    pharmacyDispensed: {
      type: Boolean,
      default: false,
    },
    dispensedDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
