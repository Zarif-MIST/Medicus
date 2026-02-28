const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PharmacySchema = new mongoose.Schema({
  pharmacyName: {
    type: String,
    required: true,
  },
  managerName: {
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
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: false,
    default: '',
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  medicines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
    },
  ],
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
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
  pharmacyId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

// Generate pharmacyId before saving
PharmacySchema.pre('save', async function (next) {
  if (!this.pharmacyId) {
    const count = await mongoose.model('Pharmacy').countDocuments();
    this.pharmacyId = `PHARM${String(count + 1).padStart(4, '0')}`;
  }
  this.updatedAt = new Date();
  next();
});

// Hash password before saving
PharmacySchema.pre('save', async function (next) {
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

// Method to compare passwords
PharmacySchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('Pharmacy', PharmacySchema);
