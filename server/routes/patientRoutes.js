const express = require('express');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

const router = express.Router();

// Generate Patient ID (4 digits)
const generatePatientId = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Register Patient
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, dateOfBirth, gender, address } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please provide required fields' });
    }

    // Check if email exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create patient with auto-generated ID
    const patientId = generatePatientId();
    const patient = new Patient({
      patientId,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
    });

    await patient.save();

    // Generate token
    const token = jwt.sign(
      { id: patient._id, patientId: patient.patientId, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      patient: {
        id: patient._id,
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering', error: error.message });
  }
});

// Login Patient
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/ID and password required' });
    }

    // Find by email or patientId
    const patient = await Patient.findOne({
      $or: [{ email: identifier }, { patientId: identifier }],
    });

    if (!patient) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValid = await patient.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: patient._id, patientId: patient.patientId, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      patient: {
        id: patient._id,
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
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
        { id: 'admin', role: 'patient_admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Admin login successful',
        token,
        user: { id: 'admin', role: 'patient_admin' },
      });
    }

    res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

// Get patient by ID (for doctor lookup)
router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    let patient;

    // Check if it's a valid MongoDB ObjectId format (24 hex characters)
    if (patientId.match(/^[0-9a-fA-F]{24}$/)) {
      // Try to find by MongoDB ID
      patient = await Patient.findById(patientId);
    }

    // If not found by MongoDB ID, try finding by patientId field
    if (!patient) {
      patient = await Patient.findOne({ patientId });
    }

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      message: 'Patient retrieved',
      patient: {
        id: patient._id,
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        address: patient.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
});

module.exports = router;
