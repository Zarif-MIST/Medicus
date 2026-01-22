const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  prescriptionNumber: {
    type: String,
    unique: true,
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  medicines: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      frequency: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
      instructions: {
        type: String,
        required: false,
      },
    },
  ],
  diagnosis: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Dispensed', 'Cancelled'],
    default: 'Pending',
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: false,
  },
  dispensedDate: {
    type: Date,
    required: false,
  },
  expiryDate: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
