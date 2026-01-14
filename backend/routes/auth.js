const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

/**
 * Generate JWT Token
 * This creates a token that proves the user is authenticated
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token valid for 30 days
  });
};

/**
 * @route   POST /api/auth/register/doctor
 * @desc    Register a new doctor
 * @access  Public
 */
router.post('/register/doctor', async (req, res) => {
  try {
    const { fullName, email, phone, dob, license, password } = req.body;

    // 1. Check if all fields are provided
    if (!fullName || !email || !phone || !dob || !license || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // 2. Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ 
      $or: [{ email }, { license }] 
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email or license already exists'
      });
    }

    // 3. Create new doctor
    const doctor = await Doctor.create({
      fullName,
      email,
      phone,
      dob,
      license,
      password // Will be hashed automatically by pre-save middleware
    });

    // 4. Generate token
    const token = generateToken(doctor._id);

    // 5. Send response
    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      data: {
        id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        phone: doctor.phone,
        license: doctor.license,
        role: doctor.role
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
 * @route   POST /api/auth/login
 * @desc    Login doctor (or other users)
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // 2. Find user by email (username is email in our case)
    // Include password field (normally hidden)
    let user;
    
    if (role === 'Doctor') {
      user = await Doctor.findOne({ email: username }).select('+password');
    }
    // TODO: Add other role checks (Patient, Pharmacy) here

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 3. Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
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
