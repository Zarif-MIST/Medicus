const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');

// Add medicine to inventory
exports.addMedicine = async (req, res) => {
  try {
    const { medicineName, genericName, category, manufacturer, strength, form, price, quantity, description, sideEffects, contraindications, pharmacyId, expiryDate, batchNumber } = req.body;

    if (!medicineName || !category || !manufacturer || !strength || !form || !price || !pharmacyId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const medicine = new Medicine({
      medicineName,
      genericName,
      category,
      manufacturer,
      strength,
      form,
      price,
      quantity,
      description,
      sideEffects,
      contraindications,
      pharmacy: pharmacyId,
      expiryDate,
      batchNumber,
    });

    await medicine.save();

    // Add medicine to pharmacy
    await Pharmacy.findByIdAndUpdate(pharmacyId, {
      $push: { medicines: medicine._id },
    });

    res.status(201).json({
      message: 'Medicine added to inventory successfully',
      medicine,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all medicines
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().populate('pharmacy');
    res.status(200).json({ medicines });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findById(id).populate('pharmacy');

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json({ medicine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get medicines by pharmacy
exports.getMedicinesByPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const medicines = await Medicine.find({ pharmacy: pharmacyId }).populate('pharmacy');

    res.status(200).json({ medicines });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update medicine details
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { medicineName, genericName, category, manufacturer, strength, form, price, quantity, description, sideEffects, contraindications, expiryDate, batchNumber } = req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      id,
      {
        medicineName,
        genericName,
        category,
        manufacturer,
        strength,
        form,
        price,
        quantity,
        description,
        sideEffects,
        contraindications,
        expiryDate,
        batchNumber,
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate('pharmacy');

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json({ message: 'Medicine updated successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update medicine quantity
exports.updateMedicineQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { quantity, updatedAt: Date.now() },
      { new: true }
    ).populate('pharmacy');

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json({ message: 'Medicine quantity updated', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reduce medicine quantity
exports.reduceMedicineQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (medicine.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity in stock' });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      { quantity: medicine.quantity - quantity, updatedAt: Date.now() },
      { new: true }
    ).populate('pharmacy');

    res.status(200).json({ message: 'Medicine quantity reduced', medicine: updatedMedicine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search medicines
exports.searchMedicines = async (req, res) => {
  try {
    const { query } = req.query;
    const search = query || req.params.medicineName;

    if (!search) {
      return res.status(400).json({ message: 'Missing search query' });
    }

    const medicines = await Medicine.find({
      $or: [
        { medicineName: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
      ],
    }).populate('pharmacy');

    res.status(200).json({ medicines });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get low stock medicines
exports.getLowStockMedicines = async (req, res) => {
  try {
    const { pharmacyId, threshold = 10 } = req.query;

    let query = { quantity: { $lt: threshold } };
    if (pharmacyId) {
      query.pharmacy = pharmacyId;
    }

    const medicines = await Medicine.find(query).populate('pharmacy');

    res.status(200).json({ medicines });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findByIdAndDelete(id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Remove from pharmacy
    await Pharmacy.findByIdAndUpdate(medicine.pharmacy, {
      $pull: { medicines: id },
    });

    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
