const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Pharmacist Schema - Stores pharmacist information
 */
const pharmacistSchema = new mongoose.Schema({
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
  
  pharmacyLicense: {
    type: String,
    required: [true, 'Please provide pharmacy license number'],
    unique: true
  },
  
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false // Don't return password in queries
  },
  
  pharmacy: {
    name: String,
    address: String,
    phone: String
  },
  
  role: {
    type: String,
    default: 'Pharmacist'
  }
}, {
  timestamps: true
});

// Hash password before saving
pharmacistSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
pharmacistSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Pharmacist', pharmacistSchema);
