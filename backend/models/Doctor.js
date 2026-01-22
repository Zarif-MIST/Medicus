const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DoctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
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
  specialization: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  hospital: {
    type: String,
    required: false,
  },
  consultationFee: {
    type: Number,
    default: 0,
  },
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Offline'],
    default: 'Available',
  },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
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
  doctorId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

// Generate doctorId before saving
DoctorSchema.pre('save', async function (next) {
  if (!this.doctorId) {
    const count = await mongoose.model('Doctor').countDocuments();
    this.doctorId = `DOC${String(count + 1).padStart(4, '0')}`;
  }
  this.updatedAt = new Date();
  next();
});

// Hash password before saving
DoctorSchema.pre('save', async function (next) {
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
DoctorSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('Doctor', DoctorSchema);
