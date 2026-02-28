const mongoose = require('mongoose');

const favoritePharmacySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
      required: true,
    },
    pharmacyName: String,
    address: String,
    phoneNumber: String,
    // Rating and feedback
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    lastOrdered: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Ensure a patient can only favorite a pharmacy once
favoritePharmacySchema.index({ patientId: 1, pharmacyId: 1 }, { unique: true });

module.exports = mongoose.model('FavoritePharmacy', favoritePharmacySchema);
