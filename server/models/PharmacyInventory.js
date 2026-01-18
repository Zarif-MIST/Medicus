const mongoose = require('mongoose');

const pharmacyInventorySchema = new mongoose.Schema(
  {
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
    },
    genericName: String,
    strength: String, // e.g., "500mg"
    quantity: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: 'tablets', // tablets, ml, capsules, etc.
    },
    price: {
      type: Number,
      default: 0,
    },
    expiryDate: Date,
    batchNumber: String,
    manufacturer: String,
    reorderLevel: {
      type: Number,
      default: 10, // Alert when stock falls below this
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PharmacyInventory', pharmacyInventorySchema);
