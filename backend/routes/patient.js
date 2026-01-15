const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/patient/:id
 * @desc    Get patient details by ID
 * @access  Protected (Doctor only)
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });

  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/patient
 * @desc    Create new patient
 * @access  Protected (Doctor only)
 */
router.post('/', protect, async (req, res) => {
  try {
    const patientData = {
      ...req.body,
      registeredBy: req.user._id // The logged-in doctor
    };

    const patient = await Patient.create(patientData);

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });

  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/patient/:id/history
 * @desc    Get patient's prescription history
 * @access  Protected (Doctor only)
 */
router.get('/:id/history', protect, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ 
      patient: req.params.id 
    })
    .populate('doctor', 'fullName license')
    .sort({ prescriptionDate: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });

  } catch (error) {
    console.error('Error fetching prescription history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
