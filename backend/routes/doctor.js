const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Doctor = require('../models/Doctor');

/**
 * @route   GET /api/doctor/profile
 * @desc    Get doctor profile
 * @access  Private (requires authentication)
 */
router.get('/profile', protect, async (req, res) => {
  try {
    // req.user is set by protect middleware
    const doctor = await Doctor.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/doctor/profile
 * @desc    Update doctor profile
 * @access  Private
 */
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      { fullName, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

module.exports = router;
