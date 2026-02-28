const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PatientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: false,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    default: '',
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  medicalHistory: {
    type: String,
    required: false,
  },
  allergies: [
    {
      type: String,
    },
  ],
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
  ],
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },
  ],
  medicalRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalRecord',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  patientId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

// Generate patientId before saving
PatientSchema.pre('save', async function (next) {
  if (!this.patientId) {
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = `PAT${String(count + 1).padStart(4, '0')}`;
  }
  this.updatedAt = new Date();
  next();
});

// Hash password before saving
PatientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamps on save
PatientSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Method to compare passwords
PatientSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('Patient', PatientSchema);
