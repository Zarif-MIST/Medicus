const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      unique: true,
    },
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: String,
    phoneNumber: String,
    specialization: String,
    licenseNumber: String,
    hospitalAffiliation: String,
  },
  { timestamps: true }
);

// Hash password before saving
doctorSchema.pre('save', async function (next) {
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
doctorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);
