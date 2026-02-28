const mongoose = require('mongoose');

const medicineOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
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
    medicines: [
      {
        prescriptionId: String,
        prescriptionMedicineIndex: Number,
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Medicine',
        },
        medicineName: String,
        strength: String,
        quantity: {
          type: Number,
          required: true,
        },
        price: Number,
        dosage: String,
        notes: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'ready', 'dispatched', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed', 'refunded'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['nagad', 'card', 'cash_on_delivery', 'sslcommerz'],
      required: true,
    },
    deliveryAddress: {
      street: String,
      city: String,
      postalCode: String,
      phone: String,
    },
    notes: String,
    estimatedDeliveryDate: Date,
    deliveredDate: Date,
  },
  { timestamps: true }
);

// Auto-generate orderId
medicineOrderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderId) {
    const count = await mongoose.model('MedicineOrder').countDocuments();
    this.orderId = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('MedicineOrder', medicineOrderSchema);
