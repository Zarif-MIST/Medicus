const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Doctor Schema - Defines the structure of doctor documents
 * Think of this as a blueprint for what data we store for each doctor
 */
const doctorSchema = new mongoose.Schema({
  // Basic Information
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true, // No two doctors can have same email
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  
  dob: {
    type: String,
    required: [true, 'Please provide date of birth']
  },
  
  license: {
    type: String,
    required: [true, 'Please provide medical license number'],
    unique: true
  },
  
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default in queries
  },
  
  role: {
    type: String,
    default: 'Doctor'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Middleware: Hash password before saving
 * This runs automatically before saving a doctor to database
 */
doctorSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash the password with 10 rounds of salt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Method: Compare entered password with hashed password
 * Used during login to verify if password is correct
 */
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the model
const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
