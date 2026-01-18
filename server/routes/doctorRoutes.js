const express = require('express');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Generate Doctor ID
const generateDoctorId = () => {
  return 'DR' + Math.floor(1000 + Math.random() * 9000);
};

// Register Doctor
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, specialization, licenseNumber, hospitalAffiliation } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please provide required fields' });
    }

    // Check if email exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create doctor with auto-generated ID
    const doctorId = generateDoctorId();
    const doctor = new Doctor({
      doctorId,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      specialization,
      licenseNumber,
      hospitalAffiliation,
    });

    await doctor.save();

    // Generate token
    const token = jwt.sign(
      { id: doctor._id, doctorId: doctor.doctorId, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      doctor: {
        id: doctor._id,
        doctorId: doctor.doctorId,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering', error: error.message });
  }
});

// Login Doctor
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/ID and password required' });
    }

    // Find by email or doctorId
    const doctor = await Doctor.findOne({
      $or: [{ email: identifier }, { doctorId: identifier }],
    });

    if (!doctor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValid = await doctor.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: doctor._id, doctorId: doctor.doctorId, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      doctor: {
        id: doctor._id,
        doctorId: doctor.doctorId,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Admin login (username: admin, password: admin)
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
      const token = jwt.sign(
        { id: 'admin', role: 'doctor_admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Admin login successful',
        token,
        user: { id: 'admin', role: 'doctor_admin' },
      });
    }

    res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

module.exports = router;
