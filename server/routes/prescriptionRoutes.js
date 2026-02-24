const express = require('express');
const jwt = require('jsonwebtoken');
const Prescription = require('../models/Prescription');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const router = express.Router();

// Generate Prescription ID
const generatePrescriptionId = () => {
  return 'PRES' + Date.now().toString().slice(-8);
};

// Doctor: Create a new prescription
router.post('/create', async (req, res) => {
  try {
    const { doctorId, patientId, medicines, diagnosis, notes } = req.body;

    if (!doctorId || !patientId) {
      return res.status(400).json({ message: 'Doctor ID and Patient ID are required' });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Calculate expiry date (usually 6 months from issue)
    const issuedDate = new Date();
    const expiryDate = new Date(issuedDate);
    expiryDate.setMonth(expiryDate.getMonth() + 6);

    const prescriptionId = generatePrescriptionId();
    const prescription = new Prescription({
      prescriptionId,
      doctorId,
      patientId,
      medicines: medicines || [],
      diagnosis,
      notes,
      issuedDate,
      expiryDate,
      status: 'Active',
    });

    await prescription.save();

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription: {
        id: prescription._id,
        prescriptionId: prescription.prescriptionId,
        doctorId: prescription.doctorId,
        patientId: prescription.patientId,
        medicines: prescription.medicines,
        diagnosis: prescription.diagnosis,
        status: prescription.status,
        issuedDate: prescription.issuedDate,
        expiryDate: prescription.expiryDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating prescription', error: error.message });
  }
});

// Get prescription by patient ID (for pharmacy/doctor to view)
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    let prescriptions = [];

    // Check if it's a valid MongoDB ObjectId format (24 hex characters)
    if (patientId.match(/^[0-9a-fA-F]{24}$/)) {
      // Try to find by MongoDB ID - only Active prescriptions for pharmacy
      prescriptions = await Prescription.find({ patientId, status: 'Active' })
        .populate('doctorId', 'firstName lastName email doctorId')
        .populate('patientId', 'firstName lastName email patientId')
        .sort({ issuedDate: -1 });
    }

    // If not found by MongoDB ID, try finding by patient's patientId field
    if (prescriptions.length === 0) {
      // First find the patient by patientId field
      const Patient = require('../models/Patient');
      const patient = await Patient.findOne({ patientId });
      
      if (patient) {
        prescriptions = await Prescription.find({ patientId: patient._id, status: 'Active' })
          .populate('doctorId', 'firstName lastName email doctorId')
          .populate('patientId', 'firstName lastName email patientId')
          .sort({ issuedDate: -1 });
      }
    }

    if (!prescriptions.length) {
      return res.json({
        message: 'No prescriptions found for this patient',
        prescriptions: [],
      });
    }

    res.json({
      message: 'Prescriptions retrieved',
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
});

// Get prescription by prescription ID
router.get('/:prescriptionId', async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findOne({ prescriptionId })
      .populate('doctorId', 'firstName lastName email doctorId specialization')
      .populate('patientId', 'firstName lastName email patientId');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({
      message: 'Prescription retrieved',
      prescription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescription', error: error.message });
  }
});

// Pharmacy: View all active prescriptions for dispensing
router.get('/view/active-prescriptions', async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ status: 'Active' })
      .populate('doctorId', 'firstName lastName email doctorId specialization')
      .populate('patientId', 'firstName lastName email patientId')
      .sort({ issuedDate: -1 });

    res.json({
      message: 'Active prescriptions retrieved',
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
});

// Pharmacy: Update prescription status (e.g., mark as dispensed)
router.patch('/:prescriptionId/status', async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const { status } = req.body;

    if (!['Active', 'Expired', 'Dispensed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const prescription = await Prescription.findOneAndUpdate(
      { prescriptionId },
      { status },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({
      message: 'Prescription status updated',
      prescription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating prescription', error: error.message });
  }
});

// Get all prescriptions (for admin/dashboard view)
router.get('/view/all-prescriptions', async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('doctorId', 'firstName lastName email doctorId')
      .populate('patientId', 'firstName lastName email patientId')
      .sort({ issuedDate: -1 });

    res.json({
      message: 'All prescriptions retrieved',
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
});

module.exports = router;
