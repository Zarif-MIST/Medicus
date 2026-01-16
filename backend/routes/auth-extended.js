const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Pharmacist = require('../models/Pharmacist');
const PatientAuth = require('../models/PatientAuth');

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * @route   POST /api/auth/register/pharmacist
 * @desc    Register a new pharmacist
 * @access  Public
 */
router.post('/register/pharmacist', async (req, res) => {
  try {
    const { fullName, email, phone, pharmacyLicense, password, pharmacy } = req.body;

    // Validation
    if (!fullName || !email || !phone || !pharmacyLicense || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if pharmacist already exists
    const existingPharmacist = await Pharmacist.findOne({ 
      $or: [{ email }, { pharmacyLicense }] 
    });

    if (existingPharmacist) {
      return res.status(400).json({
        success: false,
        message: 'Pharmacist with this email or license already exists'
      });
    }

    // Create new pharmacist
    const pharmacist = await Pharmacist.create({
      fullName,
      email,
      phone,
      pharmacyLicense,
      password,
      pharmacy
    });

    // Generate token
    const token = generateToken(pharmacist._id);

    res.status(201).json({
      success: true,
      message: 'Pharmacist registered successfully',
      data: {
        id: pharmacist._id,
        fullName: pharmacist.fullName,
        email: pharmacist.email,
        pharmacyLicense: pharmacist.pharmacyLicense,
        role: pharmacist.role
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/register/patient
 * @desc    Register a new patient (for patient login)
 * @access  Public
 */
router.post('/register/patient', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Validation
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if patient auth already exists
    const existingPatient = await PatientAuth.findOne({ email });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient with this email already exists'
      });
    }

    // Create new patient auth
    const patientAuth = await PatientAuth.create({
      fullName,
      email,
      phone,
      password
    });

    // Generate token
    const token = generateToken(patientAuth._id);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        id: patientAuth._id,
        fullName: patientAuth.fullName,
        email: patientAuth.email,
        role: patientAuth.role
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login-pharmacist
 * @desc    Login pharmacist
 * @access  Public
 */
router.post('/login-pharmacist', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find pharmacist and include password
    const pharmacist = await Pharmacist.findOne({ email }).select('+password');

    if (!pharmacist) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordCorrect = await pharmacist.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(pharmacist._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: pharmacist._id,
        fullName: pharmacist.fullName,
        email: pharmacist.email,
        role: pharmacist.role
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login-patient
 * @desc    Login patient
 * @access  Public
 */
router.post('/login-patient', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find patient and include password
    const patientAuth = await PatientAuth.findOne({ email }).select('+password');

    if (!patientAuth) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordCorrect = await patientAuth.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(patientAuth._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: patientAuth._id,
        fullName: patientAuth.fullName,
        email: patientAuth.email,
        role: patientAuth.role
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

module.exports = router;
