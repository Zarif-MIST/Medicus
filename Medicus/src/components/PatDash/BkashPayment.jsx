import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import './BkashPayment.css';

export default function BkashPayment({ order, patientId, onPaymentComplete }) {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleInitiatePayment = async () => {
    if (!payerPhone) {
      alert('Please enter your phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const paymentData = {
        orderId: order._id,
        patientId,
        pharmacyId: order.pharmacyId,
        amount: order.totalAmount + 50, // Including delivery fee
        paymentMethod: order.paymentMethod,
        payerPhone,
      };

      const response = await apiService.initiatePayment(paymentData);
      setPayment(response.payment);

      if (order.paymentMethod === 'sslcommerz' && response.checkoutURL) {
        window.location.href = response.checkoutURL;
        return;
      }

      setShowPaymentModal(true);

      // In production, redirect to bKash checkout URL
      // window.location.href = response.checkoutURL;
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    // This simulates a successful payment for demo purposes
    try {
      setLoading(true);
      
      // Update payment status to completed
      const updatedPayment = {
        ...payment,
        status: 'completed',
        bkashData: {
          ...payment.bkashData,
          bkashTransactionID: `BKX${Date.now()}`,
          paymentExecutionTime: new Date().toISOString(),
        },
      };

      // In production, this would be done via bKash callback
      // For now, we'll simulate the payment completion
      alert('Payment completed successfully! Order confirmed.');
      
      if (onPaymentComplete) {
        onPaymentComplete(updatedPayment);
      }

      setShowPaymentModal(false);
      setPayment(null);
      setPayerPhone('');
    } catch (err) {
      setError('Payment simulation failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bkash-payment-section">
      <div className="payment-header">
        <h3>💳 Complete Payment</h3>
        <p className="payment-subtitle">Secure payment via {order.paymentMethod?.toUpperCase() || 'mobile gateway'}</p>
      </div>

      {error && <div className="payment-error">{error}</div>}

      <div className="payment-card">
        {/* Order Summary */}
        <div className="payment-summary">
          <div className="summary-title">Order Summary</div>
          <div className="summary-item">
            <span>Order ID:</span>
            <span className="order-id">{order.orderId}</span>
          </div>
          <div className="summary-item">
            <span>Items:</span>
            <span>{order.medicines?.length || 0} medicine(s)</span>
          </div>
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>৳ {order.totalAmount?.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Delivery Fee:</span>
            <span>৳ 50</span>
          </div>
          <div className="summary-item total">
            <span>Total Amount:</span>
            <span className="total-amount">৳ {((order.totalAmount || 0) + 50).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Info */}
        <div className="payment-method-info">
          <div className="method-icon">📱</div>
          <div className="method-details">
            <div className="method-name">{order.paymentMethod?.toUpperCase()}</div>
            <div className="method-desc">Fast and secure mobile payment</div>
          </div>
        </div>

        {/* Phone Input */}
        {!payment && (
          <div className="phone-input-section">
            <label htmlFor="payer-phone">Enter your {order.paymentMethod} mobile number:</label>
            <input
              id="payer-phone"
              type="tel"
              placeholder="01XXXXXXXXX"
              value={payerPhone}
              onChange={e => setPayerPhone(e.target.value)}
              disabled={loading}
            />
            <button
              className="pay-btn"
              onClick={handleInitiatePayment}
              disabled={loading || !payerPhone}
            >
              {loading ? 'Initiating...' : order.paymentMethod === 'sslcommerz' ? 'Pay with SSLCommerz' : 'Proceed to Payment'}
            </button>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && payment && (
          <div className="payment-modal-overlay">
            <div className="payment-modal">
              <div className="modal-header">
                <h4>Complete Your Payment</h4>
                <button className="close-btn" onClick={() => setShowPaymentModal(false)}>✕</button>
              </div>

              <div className="modal-content">
                <div className="payment-info">
                  <div className="info-row">
                    <span>Payment ID:</span>
                    <span className="code">{payment.paymentId}</span>
                  </div>
                  <div className="info-row">
                    <span>Amount:</span>
                    <span className="amount">৳ {payment.amount?.toFixed(2)}</span>
                  </div>
                  <div className="info-row">
                    <span>Phone:</span>
                    <span>{payerPhone}</span>
                  </div>
                </div>

                <div className="payment-instructions">
                  <h5>📋 Payment Instructions:</h5>
                  <ol>
                    <li>You will receive a prompt on your {order.paymentMethod} account</li>
                    <li>Enter your {order.paymentMethod} PIN to confirm</li>
                    <li>Payment will be processed immediately</li>
                    <li>You'll receive a confirmation message</li>
                  </ol>
                </div>

                <div className="modal-actions">
                  <button
                    className="confirm-btn"
                    onClick={handleSimulatePayment}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Confirm Payment'}
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setShowPaymentModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Completed */}
        {payment?.status === 'completed' && (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <div className="success-title">Payment Successful!</div>
            <div className="success-message">
              Your payment has been processed successfully. Your order will be prepared shortly.
            </div>
            <div className="success-details">
              <div>Transaction ID: <span className="code">{payment.transactionId}</span></div>
              <div>Order ID: <span className="code">{order.orderId}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Security Note */}
      <div className="security-note">
        <span className="security-icon">🔒</span>
        <span>Your payment information is secure and encrypted. We use industry-standard SSL technology.</span>
      </div>
    </div>
  );
}
