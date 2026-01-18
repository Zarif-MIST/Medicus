const express = require('express');
const PharmacyInventory = require('../models/PharmacyInventory');
const Pharmacy = require('../models/Pharmacy');

const router = express.Router();

// Add medicine to pharmacy inventory
router.post('/add', async (req, res) => {
  try {
    const { pharmacyId, medicineName, genericName, strength, quantity, unit, price, expiryDate, batchNumber, manufacturer, reorderLevel } = req.body;

    if (!pharmacyId || !medicineName || !quantity) {
      return res.status(400).json({ message: 'Pharmacy ID, medicine name, and quantity are required' });
    }

    // Verify pharmacy exists
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    // Check if medicine already exists in inventory
    const existingMedicine = await PharmacyInventory.findOne({
      pharmacyId,
      medicineName: { $regex: medicineName, $options: 'i' },
    });

    if (existingMedicine) {
      // Update quantity instead of creating duplicate
      existingMedicine.quantity += quantity;
      await existingMedicine.save();

      return res.json({
        message: 'Medicine quantity updated',
        inventory: existingMedicine,
      });
    }

    // Create new inventory entry
    const inventory = new PharmacyInventory({
      pharmacyId,
      medicineName,
      genericName,
      strength,
      quantity,
      unit,
      price,
      expiryDate,
      batchNumber,
      manufacturer,
      reorderLevel,
    });

    await inventory.save();

    res.status(201).json({
      message: 'Medicine added to inventory',
      inventory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding medicine', error: error.message });
  }
});

// Get pharmacy inventory by pharmacy ID
router.get('/pharmacy/:pharmacyId', async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    // Verify pharmacy exists
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const inventory = await PharmacyInventory.find({ pharmacyId })
      .populate('pharmacyId', 'pharmacyName email managerName');

    res.json({
      message: 'Pharmacy inventory retrieved',
      count: inventory.length,
      inventory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
});

// Get single medicine details
router.get('/:medicineId', async (req, res) => {
  try {
    const { medicineId } = req.params;

    const medicine = await PharmacyInventory.findById(medicineId)
      .populate('pharmacyId', 'pharmacyName email managerName');

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({
      message: 'Medicine retrieved',
      medicine,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicine', error: error.message });
  }
});

// Update medicine quantity (dispense or restock)
router.patch('/:medicineId/quantity', async (req, res) => {
  try {
    const { medicineId } = req.params;
    const { quantity, action } = req.body; // action: 'dispense' or 'restock'

    if (!quantity || !action) {
      return res.status(400).json({ message: 'Quantity and action are required' });
    }

    const medicine = await PharmacyInventory.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (action === 'dispense') {
      if (medicine.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      medicine.quantity -= quantity;
    } else if (action === 'restock') {
      medicine.quantity += quantity;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await medicine.save();

    res.json({
      message: `Medicine ${action}ed successfully`,
      medicine,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating quantity', error: error.message });
  }
});

// Get low stock medicines (for pharmacy alert)
router.get('/pharmacy/:pharmacyId/low-stock', async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const lowStockMedicines = await PharmacyInventory.find({
      pharmacyId,
      $expr: { $lte: ['$quantity', '$reorderLevel'] },
    });

    res.json({
      message: 'Low stock medicines retrieved',
      count: lowStockMedicines.length,
      medicines: lowStockMedicines,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching low stock medicines', error: error.message });
  }
});

// Search medicine by name
router.get('/search/:medicineName', async (req, res) => {
  try {
    const { medicineName } = req.params;

    const medicines = await PharmacyInventory.find({
      medicineName: { $regex: medicineName, $options: 'i' },
    })
      .populate('pharmacyId', 'pharmacyName email managerName');

    res.json({
      message: 'Search results',
      count: medicines.length,
      medicines,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching medicines', error: error.message });
  }
});

module.exports = router;
