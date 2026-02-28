const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true,
  },
  genericName: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  strength: {
    type: String,
    required: true,
  },
  form: {
    type: String,
    enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Cream', 'Other'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: false,
  },
  sideEffects: {
    type: String,
    required: false,
  },
  contraindications: {
    type: String,
    required: false,
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true,
  },
  expiryDate: {
    type: Date,
    required: false,
  },
  batchNumber: {
    type: String,
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

module.exports = mongoose.model('Medicine', MedicineSchema);
