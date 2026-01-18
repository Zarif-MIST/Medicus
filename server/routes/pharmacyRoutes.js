const express = require('express');
const jwt = require('jsonwebtoken');
const Pharmacy = require('../models/Pharmacy');

const router = express.Router();

// Generate Pharmacy ID
const generatePharmacyId = () => {
  return 'PHARM' + Math.floor(1000 + Math.random() * 9000);
};

// Register Pharmacy
router.post('/register', async (req, res) => {
  try {
    const { pharmacyName, managerName, email, password, phoneNumber, licenseNumber, address } = req.body;

    if (!pharmacyName || !managerName || !email || !password) {
      return res.status(400).json({ message: 'Please provide required fields' });
    }

    // Check if email exists
    const existingPharmacy = await Pharmacy.findOne({ email });
    if (existingPharmacy) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create pharmacy with auto-generated ID
    const pharmacyId = generatePharmacyId();
    const pharmacy = new Pharmacy({
      pharmacyId,
      pharmacyName,
      managerName,
      email,
      password,
      phoneNumber,
      licenseNumber,
      address,
    });

    await pharmacy.save();

    // Generate token
    const token = jwt.sign(
      { id: pharmacy._id, pharmacyId: pharmacy.pharmacyId, role: 'pharmacy' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      pharmacy: {
        id: pharmacy._id,
        pharmacyId: pharmacy.pharmacyId,
        pharmacyName: pharmacy.pharmacyName,
        email: pharmacy.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering', error: error.message });
  }
});

// Login Pharmacy
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/ID and password required' });
    }

    // Find by email or pharmacyId
    const pharmacy = await Pharmacy.findOne({
      $or: [{ email: identifier }, { pharmacyId: identifier }],
    });

    if (!pharmacy) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValid = await pharmacy.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: pharmacy._id, pharmacyId: pharmacy.pharmacyId, role: 'pharmacy' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      pharmacy: {
        id: pharmacy._id,
        pharmacyId: pharmacy.pharmacyId,
        pharmacyName: pharmacy.pharmacyName,
        email: pharmacy.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Admin login
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
      const token = jwt.sign(
        { id: 'admin', role: 'pharmacy_admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Admin login successful',
        token,
        user: { id: 'admin', role: 'pharmacy_admin' },
      });
    }

    res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

module.exports = router;
