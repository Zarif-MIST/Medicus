const express = require('express');
const router = express.Router();
const MedicineOrder = require('../models/MedicineOrder');
const Patient = require('../models/Patient');
const Pharmacy = require('../models/Pharmacy');
const Prescription = require('../models/Prescription');
const PharmacyInventory = require('../models/PharmacyInventory');

// Create a new medicine order
router.post('/create', async (req, res) => {
  try {
    const { patientId, pharmacyId, medicines, paymentMethod, deliveryAddress, notes } = req.body;

    if (!patientId || !pharmacyId || !Array.isArray(medicines) || medicines.length === 0 || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Verify pharmacy exists
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const prescriptions = await Prescription.find({ patientId, status: 'Active' });

    const findPrescriptionReference = (orderedMedicine) => {
      const orderedName = (orderedMedicine.medicineName || '').trim().toLowerCase();
      const orderedStrength = (orderedMedicine.strength || '').trim().toLowerCase();
      const targetPrescriptionId = orderedMedicine.prescriptionId;
      const targetMedicineIndex = Number(orderedMedicine.prescriptionMedicineIndex);

      const candidatePrescriptions = targetPrescriptionId
        ? prescriptions.filter((prescription) => prescription.prescriptionId === targetPrescriptionId)
        : prescriptions;

      for (const prescription of candidatePrescriptions) {
        const medicinesInPrescription = Array.isArray(prescription.medicines) ? prescription.medicines : [];

        const candidateIndexes = Number.isInteger(targetMedicineIndex)
          ? [targetMedicineIndex]
          : medicinesInPrescription.map((_, index) => index);

        for (const index of candidateIndexes) {
          const prescribedMedicine = medicinesInPrescription[index];
          if (!prescribedMedicine) continue;

          const prescribedName = (prescribedMedicine.medicineName || '').trim().toLowerCase();
          const prescribedStrength = (prescribedMedicine.strength || '').trim().toLowerCase();

          if (orderedName !== prescribedName) continue;
          if (orderedStrength && prescribedStrength && orderedStrength !== prescribedStrength) continue;

          return {
            prescription,
            prescriptionMedicineIndex: index,
            prescribedMedicine,
          };
        }
      }

      return null;
    };

    const pharmacyInventory = await PharmacyInventory.find({ pharmacyId });

    const findInventoryItem = (orderedMedicine) => {
      const orderedName = (orderedMedicine.medicineName || '').trim().toLowerCase();
      const orderedStrength = (orderedMedicine.strength || '').trim().toLowerCase();

      let matchedItem = pharmacyInventory.find((item) => {
        const inventoryName = (item.medicineName || '').trim().toLowerCase();
        const inventoryStrength = (item.strength || '').trim().toLowerCase();
        return inventoryName === orderedName && inventoryStrength === orderedStrength;
      });

      if (!matchedItem) {
        matchedItem = pharmacyInventory.find((item) => {
          const inventoryName = (item.medicineName || '').trim().toLowerCase();
          return inventoryName === orderedName;
        });
      }

      return matchedItem;
    };

    let computedTotalAmount = 0;
    const pricedMedicines = medicines.map((orderedMedicine) => {
      const prescriptionReference = findPrescriptionReference(orderedMedicine);
      if (!prescriptionReference) {
        throw new Error(`Medicine is not from an active prescription: ${orderedMedicine.medicineName}`);
      }

      const inventoryItem = findInventoryItem(orderedMedicine);

      if (!inventoryItem) {
        throw new Error(`Medicine not available in selected pharmacy: ${orderedMedicine.medicineName}`);
      }

      const unitPrice = Number(inventoryItem.price) || 0;
      const quantity = Number(orderedMedicine.quantity) || 0;
      const prescribedQuantity = Math.max(1, parseInt(prescriptionReference.prescribedMedicine.quantity, 10) || 1);

      if (quantity <= 0) {
        throw new Error(`Invalid quantity for medicine: ${orderedMedicine.medicineName}`);
      }

      if (quantity !== prescribedQuantity) {
        throw new Error(`Quantity must match prescription for ${orderedMedicine.medicineName}. Prescribed: ${prescribedQuantity}`);
      }

      const lineTotal = unitPrice * quantity;
      computedTotalAmount += lineTotal;

      return {
        ...orderedMedicine,
        prescriptionId: prescriptionReference.prescription.prescriptionId,
        prescriptionMedicineIndex: prescriptionReference.prescriptionMedicineIndex,
        price: unitPrice,
      };
    });

    const order = new MedicineOrder({
      patientId,
      pharmacyId,
      medicines: pricedMedicines,
      totalAmount: Number(computedTotalAmount.toFixed(2)),
      paymentMethod,
      deliveryAddress: deliveryAddress || {
        street: patient.address,
        city: '',
        postalCode: '',
        phone: patient.phoneNumber,
      },
      notes,
    });

    await order.save();
    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    if (
      error.message?.includes('Medicine not available in selected pharmacy') ||
      error.message?.includes('Invalid quantity for medicine') ||
      error.message?.includes('Medicine is not from an active prescription') ||
      error.message?.includes('Quantity must match prescription')
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get orders by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const orders = await MedicineOrder.find({ patientId: req.params.patientId })
      .populate('pharmacyId', 'pharmacyName address phoneNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
      count: orders.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get orders by pharmacy
router.get('/pharmacy/:pharmacyId', async (req, res) => {
  try {
    const orders = await MedicineOrder.find({ pharmacyId: req.params.pharmacyId })
      .populate('patientId', 'firstName lastName email phoneNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
      count: orders.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await MedicineOrder.findById(req.params.orderId)
      .populate('pharmacyId', 'pharmacyName address phoneNumber')
      .populate('patientId', 'firstName lastName email phoneNumber');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'ready', 'dispatched', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await MedicineOrder.findByIdAndUpdate(
      req.params.orderId,
      {
        status,
        ...(status === 'delivered' && { deliveredDate: new Date() }),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

// Cancel order
router.patch('/:orderId/cancel', async (req, res) => {
  try {
    const order = await MedicineOrder.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel order in ${order.status} status` });
    }

    order.status = 'cancelled';
    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }
    await order.save();

    res.status(200).json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
});

module.exports = router;
