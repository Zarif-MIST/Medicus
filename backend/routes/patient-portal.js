const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const PatientAuth = require('../models/PatientAuth');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/patient-portal/my-prescriptions
 * @desc    Get all prescriptions for logged-in patient
 * @access  Protected (Patient only)
 */
router.get('/my-prescriptions', protect, async (req, res) => {
  try {
    // Get patient auth record
    const patientAuth = await PatientAuth.findById(req.user.id);

    if (!patientAuth) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Find prescriptions where patient email matches
    const prescriptions = await Prescription.find()
      .populate({
        path: 'patient',
        match: { email: patientAuth.email },
        select: 'fullName age gender bloodType allergies'
      })
      .populate('doctor', 'fullName license')
      .sort({ prescriptionDate: -1 });

    // Filter to only include prescriptions where patient matched
    const patientPrescriptions = prescriptions.filter(p => p.patient !== null);

    res.status(200).json({
      success: true,
      count: patientPrescriptions.length,
      data: patientPrescriptions
    });

  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/patient-portal/prescriptions/:id
 * @desc    Get prescription details for patient
 * @access  Protected (Patient only)
 */
router.get('/prescriptions/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'fullName age gender bloodType allergies')
      .populate('doctor', 'fullName license');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });

  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/patient-portal/profile
 * @desc    Get patient's own profile
 * @access  Protected (Patient only)
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const patientAuth = await PatientAuth.findById(req.user.id);

    if (!patientAuth) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patientAuth
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
