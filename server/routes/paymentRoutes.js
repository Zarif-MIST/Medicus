const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const MedicineOrder = require('../models/MedicineOrder');
const FavoritePharmacy = require('../models/FavoritePharmacy');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const parseAmount = (amount) => {
  const numeric = Number(amount);
  return Number.isFinite(numeric) ? numeric : 0;
};

// Initialize bKash payment
router.post('/initiate', async (req, res) => {
  try {
    const { orderId, patientId, pharmacyId, amount, paymentMethod, payerPhone } = req.body;

    if (!orderId || !patientId || !pharmacyId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (paymentMethod === 'bkash') {
      return res.status(400).json({ message: 'bKash payment is no longer supported' });
    }

    // Verify order exists
    const order = await MedicineOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create payment record
    const payment = new Payment({
      orderId,
      patientId,
      pharmacyId,
      amount,
      paymentMethod,
      payerPhone,
      status: 'initiated',
    });

    if (paymentMethod === 'sslcommerz') {
      const storeId = process.env.SSLCOMMERZ_STORE_ID;
      const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
      const isLive = process.env.SSLCOMMERZ_LIVE === 'true';
      const gatewayUrl = isLive
        ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
        : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

      const tranId = `SSL-${Date.now()}-${String(order._id).slice(-6)}`;
      payment.transactionId = tranId;

      if (storeId && storePassword) {
        const payload = new URLSearchParams({
          store_id: storeId,
          store_passwd: storePassword,
          total_amount: parseAmount(amount).toFixed(2),
          currency: 'BDT',
          tran_id: tranId,
          success_url: `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`}/api/payments/ssl/success?paymentId=${payment._id}`,
          fail_url: `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`}/api/payments/ssl/fail?paymentId=${payment._id}`,
          cancel_url: `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`}/api/payments/ssl/cancel?paymentId=${payment._id}`,
          ipn_url: `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`}/api/payments/ssl/ipn?paymentId=${payment._id}`,
          shipping_method: 'NO',
          product_name: 'Medicine Order',
          product_category: 'Healthcare',
          product_profile: 'general',
          cus_name: `Patient-${patientId}`,
          cus_email: `patient-${patientId}@medicus.local`,
          cus_add1: order?.deliveryAddress?.street || 'Dhaka',
          cus_city: order?.deliveryAddress?.city || 'Dhaka',
          cus_postcode: order?.deliveryAddress?.postalCode || '1200',
          cus_country: 'Bangladesh',
          cus_phone: payerPhone || order?.deliveryAddress?.phone || '01700000000',
          value_a: String(payment._id),
          value_b: String(order._id),
        });

        const sslResponse = await fetch(gatewayUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: payload,
        });

        const sslData = await sslResponse.json();

        if (!sslData?.status || String(sslData.status).toUpperCase() !== 'SUCCESS') {
          return res.status(400).json({
            message: 'Failed to initialize SSLCommerz payment',
            error: sslData?.failedreason || 'Gateway initialization failed',
          });
        }

        payment.status = 'pending';
        payment.notes = `SSLCommerz session: ${sslData.sessionkey || 'N/A'}`;
        payment.bkashData = {
          merchantInvoiceNumber: tranId,
          callbackURL: `${FRONTEND_URL}/patient-dashboard`,
          checkoutURL: sslData.GatewayPageURL,
        };
      } else {
        payment.notes = 'SSLCommerz credentials missing: fallback checkout URL generated.';
        payment.bkashData = {
          merchantInvoiceNumber: tranId,
          callbackURL: `${FRONTEND_URL}/patient-dashboard`,
          checkoutURL: `${FRONTEND_URL}/patient-dashboard?payment=pending&gateway=sslcommerz&paymentId=${payment._id}`,
        };
      }
    }

    await payment.save();

    // Keep order payment status in valid enum values until callback confirms completion
    order.paymentStatus = 'unpaid';
    await order.save();

    // Update last ordered in favorite pharmacy
    if (order.pharmacyId) {
      await FavoritePharmacy.updateMany(
        { pharmacyId: order.pharmacyId, patientId },
        { lastOrdered: new Date() }
      );
    }

    res.status(201).json({
      message: paymentMethod === 'sslcommerz' && !process.env.SSLCOMMERZ_STORE_ID
        ? 'SSLCommerz credentials missing, fallback checkout link generated'
        : 'Payment initiated',
      payment,
      checkoutURL: payment.bkashData?.checkoutURL,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating payment', error: error.message });
  }
});

const finalizeSslPayment = async (paymentId, status, req, res) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const normalizedStatus = String(status || '').toLowerCase();

    if (normalizedStatus === 'success' || normalizedStatus === 'valid') {
      payment.status = 'completed';
      payment.failureReason = undefined;
      payment.notes = `SSLCommerz validated at ${new Date().toISOString()}`;

      const order = await MedicineOrder.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'paid';
        if (order.status === 'pending') {
          order.status = 'confirmed';
        }
        await order.save();
      }

      await payment.save();
      return res.redirect(`${FRONTEND_URL}/patient-dashboard?payment=success&gateway=sslcommerz&paymentId=${payment._id}`);
    }

    if (normalizedStatus === 'failed') {
      payment.status = 'failed';
      payment.failureReason = req.body?.failedreason || req.query?.failedreason || 'SSLCommerz payment failed';
      await payment.save();
      return res.redirect(`${FRONTEND_URL}/patient-dashboard?payment=failed&gateway=sslcommerz&paymentId=${payment._id}`);
    }

    payment.status = 'failed';
    payment.failureReason = 'SSLCommerz payment cancelled';
    await payment.save();
    return res.redirect(`${FRONTEND_URL}/patient-dashboard?payment=cancelled&gateway=sslcommerz&paymentId=${payment._id}`);
  } catch (error) {
    return res.status(500).json({ message: 'Error finalizing SSLCommerz payment', error: error.message });
  }
};

router.all('/ssl/success', async (req, res) => {
  const paymentId = req.query?.paymentId || req.body?.value_a;
  return finalizeSslPayment(paymentId, 'success', req, res);
});

router.all('/ssl/fail', async (req, res) => {
  const paymentId = req.query?.paymentId || req.body?.value_a;
  return finalizeSslPayment(paymentId, 'failed', req, res);
});

router.all('/ssl/cancel', async (req, res) => {
  const paymentId = req.query?.paymentId || req.body?.value_a;
  return finalizeSslPayment(paymentId, 'cancelled', req, res);
});

router.post('/ssl/ipn', async (req, res) => {
  try {
    const paymentId = req.query?.paymentId || req.body?.value_a;
    if (!paymentId) {
      return res.status(400).json({ message: 'Missing paymentId' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const status = (req.body?.status || '').toUpperCase();
    if (status === 'VALID') {
      payment.status = 'completed';
      payment.failureReason = undefined;
      await payment.save();

      const order = await MedicineOrder.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'paid';
        if (order.status === 'pending') {
          order.status = 'confirmed';
        }
        await order.save();
      }
    }

    return res.status(200).json({ message: 'IPN received' });
  } catch (error) {
    return res.status(500).json({ message: 'Error handling IPN', error: error.message });
  }
});

// Handle bKash payment callback
router.post('/callback', async (req, res) => {
  try {
    const { paymentId, transactionId, status } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (status === 'success') {
      payment.status = 'completed';
      payment.transactionId = transactionId;
      payment.bkashData.bkashTransactionID = transactionId;

      // Update order payment status
      const order = await MedicineOrder.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();
      }
    } else if (status === 'failed') {
      payment.status = 'failed';
      payment.failureReason = req.body.reason || 'Payment failed';
    }

    await payment.save();

    // Redirect to frontend with result
    const redirectURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-result?paymentId=${paymentId}&status=${status}`;
    res.redirect(redirectURL);
  } catch (error) {
    res.status(500).json({ message: 'Error processing callback', error: error.message });
  }
});

// Get payment details
router.get('/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('orderId')
      .populate('patientId', 'firstName lastName email phoneNumber')
      .populate('pharmacyId', 'pharmacyName address phoneNumber');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
});

// Get payments by order
router.get('/order/:orderId', async (req, res) => {
  try {
    const payments = await Payment.find({ orderId: req.params.orderId })
      .sort({ createdAt: -1 });

    res.status(200).json({ payments, count: payments.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
});

// Get payments by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const payments = await Payment.find({ patientId: req.params.patientId })
      .populate('orderId')
      .sort({ createdAt: -1 });

    res.status(200).json({ payments, count: payments.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
});

// Refund payment (for cancelled orders)
router.post('/:paymentId/refund', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed payments can be refunded' });
    }

    payment.status = 'refunded';
    await payment.save();

    // Update order
    const order = await MedicineOrder.findById(payment.orderId);
    if (order) {
      order.paymentStatus = 'refunded';
      await order.save();
    }

    res.status(200).json({ message: 'Payment refunded', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error refunding payment', error: error.message });
  }
});

module.exports = router;
