const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      unique: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicineOrder',
      required: true,
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
    paymentMethod: {
      type: String,
      enum: ['nagad', 'card', 'cash_on_delivery', 'sslcommerz'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    status: {
      type: String,
      enum: ['initiated', 'pending', 'completed', 'failed', 'refunded'],
      default: 'initiated',
    },
    // bKash specific fields
    bkashData: {
      merchantInvoiceNumber: String,
      callbackURL: String,
      checkoutURL: String,
      bkashTransactionID: String,
      paymentExecutionTime: String,
      payerReference: String,
      agreementID: String,
    },
    // Payment details
    payerPhone: String,
    notes: String,
    failureReason: String,
  },
  { timestamps: true }
);

// Auto-generate paymentId
paymentSchema.pre('save', async function (next) {
  if (this.isNew && !this.paymentId) {
    const count = await mongoose.model('Payment').countDocuments();
    this.paymentId = `PAY-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
