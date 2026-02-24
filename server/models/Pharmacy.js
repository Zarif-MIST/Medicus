const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const pharmacySchema = new mongoose.Schema(
  {
    pharmacyId: {
      type: String,
      unique: true,
    },
    pharmacyName: String,
    managerName: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: String,
    phoneNumber: String,
    licenseNumber: String,
    address: String,
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
pharmacySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
pharmacySchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Pharmacy', pharmacySchema);
