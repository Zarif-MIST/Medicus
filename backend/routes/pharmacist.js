const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/pharmacist/prescriptions
 * @desc    Get all prescriptions for a pharmacist
 * @access  Protected (Pharmacist only)
 */
router.get('/prescriptions', protect, async (req, res) => {
  try {
    const status = req.query.status || 'Active'; // Filter by status
    const limit = parseInt(req.query.limit) || 20;

    const prescriptions = await Prescription.find({ status })
      .populate('patient', 'fullName age gender bloodType allergies phone')
      .populate('doctor', 'fullName license')
      .sort({ prescriptionDate: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });

  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/pharmacist/prescriptions/:id
 * @desc    Get prescription details for pharmacist
 * @access  Protected (Pharmacist only)
 */
router.get('/prescriptions/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'fullName age gender bloodType allergies phone address')
      .populate('doctor', 'fullName license email phone');

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
 * @route   PUT /api/pharmacist/prescriptions/:id/status
 * @desc    Mark prescription as fulfilled
 * @access  Protected (Pharmacist only)
 */
router.put('/prescriptions/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Active', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    .populate('patient', 'fullName')
    .populate('doctor', 'fullName');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription status updated',
      data: prescription
    });

  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
