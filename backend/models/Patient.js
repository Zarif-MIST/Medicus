const mongoose = require('mongoose');

/**
 * Patient Schema - Stores patient information and medical history
 */
const patientSchema = new mongoose.Schema({
  // Basic Information
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  
  dob: {
    type: Date,
    required: [true, 'Please provide date of birth']
  },
  
  age: {
    type: Number,
    required: true
  },
  
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Please specify gender']
  },
  
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Please provide blood type']
  },
  
  // Medical Information
  allergies: {
    type: [String],
    default: []
  },
  
  chronicConditions: {
    type: [String],
    default: []
  },
  
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  
  // Medical History
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String
  }],
  
  // Metadata
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Virtual field to calculate prescription count
patientSchema.virtual('prescriptionCount', {
  ref: 'Prescription',
  localField: '_id',
  foreignField: 'patient',
  count: true
});

module.exports = mongoose.model('Patient', patientSchema);
