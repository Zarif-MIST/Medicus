const mongoose = require('mongoose');

/**
 * Prescription Schema - Stores prescription details
 */
const prescriptionSchema = new mongoose.Schema({
  // Reference to patient
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient reference is required']
  },
  
  // Reference to doctor who prescribed
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor reference is required']
  },
  
  // Prescription code (e.g., RX001)
  prescriptionCode: {
    type: String,
    unique: true,
    required: true
  },
  
  // Diagnosis information
  diagnosis: {
    condition: String,
    symptoms: [String],
    notes: String
  },
  
  // Medications
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    instructions: String
  }],
  
  // Lab tests if any
  labTests: [{
    testName: String,
    reason: String
  }],
  
  // Follow-up
  followUpDate: Date,
  followUpNotes: String,
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active'
  },
  
  // Prescription date
  prescriptionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate prescription code automatically
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionCode) {
    // Get the count of existing prescriptions
    const count = await mongoose.model('Prescription').countDocuments();
    this.prescriptionCode = `RX${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
