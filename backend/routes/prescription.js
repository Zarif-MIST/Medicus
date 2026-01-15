const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/prescription
 * @desc    Create a new prescription
 * @access  Protected (Doctor only)
 */
router.post('/', protect, async (req, res) => {
  try {
    const prescriptionData = {
      ...req.body,
      doctor: req.user._id // The logged-in doctor
    };

    const prescription = await Prescription.create(prescriptionData);

    // Populate the references
    await prescription.populate('patient', 'fullName age gender bloodType');
    await prescription.populate('doctor', 'fullName license');

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription
    });

  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/prescription/recent
 * @desc    Get recent prescriptions for the logged-in doctor
 * @access  Protected (Doctor only)
 */
router.get('/recent', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const prescriptions = await Prescription.find({ 
      doctor: req.user._id 
    })
    .populate('patient', 'fullName age gender')
    .sort({ prescriptionDate: -1 })
    .limit(limit);

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });

  } catch (error) {
    console.error('Error fetching recent prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/prescription/:id
 * @desc    Get prescription details by ID
 * @access  Protected
 */
router.get('/:id', protect, async (req, res) => {
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
 * @route   PUT /api/prescription/:id/status
 * @desc    Update prescription status
 * @access  Protected (Doctor only)
 */
router.put('/:id/status', protect, async (req, res) => {
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
