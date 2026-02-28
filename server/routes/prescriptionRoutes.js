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

const durationToDays = (durationValue) => {
  if (!durationValue) return 0;
  const text = String(durationValue).trim().toLowerCase();
  const match = text.match(/(\d+)/);
  if (!match) return 0;

  const value = parseInt(match[1], 10);
  if (Number.isNaN(value) || value <= 0) return 0;

  if (text.includes('week')) return value * 7;
  if (text.includes('month')) return value * 30;
  return value;
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

    const normalizedMedicines = (medicines || []).map((medicine) => {
      const normalizedQuantity = Math.max(1, parseInt(medicine.quantity, 10) || 1);
      const normalizedDurationDays = durationToDays(medicine.duration);

      return {
        medicineName: medicine.medicineName,
        dosage: medicine.dosage,
        quantity: normalizedQuantity,
        frequency: medicine.frequency,
        duration: `${Math.max(1, normalizedDurationDays)} days`,
        instructions: medicine.instructions || '',
        dispensed: false,
      };
    });

    // Calculate expiry date (usually 6 months from issue)
    const issuedDate = new Date();
    const expiryDate = new Date(issuedDate);
    expiryDate.setMonth(expiryDate.getMonth() + 6);

    const prescriptionId = generatePrescriptionId();
    const prescription = new Prescription({
      prescriptionId,
      doctorId,
      patientId,
      medicines: normalizedMedicines,
      diagnosis,
      notes,
      issuedDate,
      expiryDate,
      status: 'Active',
      pharmacyDispensed: false,
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
    const isPharmacyContext = req.query?.forPharmacy === 'true';
    let prescriptions = [];

    const baseFilter = isPharmacyContext
      ? { status: 'Active', pharmacyDispensed: { $ne: true } }
      : { status: { $in: ['Active', 'Dispensed'] } };

    // Check if it's a valid MongoDB ObjectId format (24 hex characters)
    if (patientId.match(/^[0-9a-fA-F]{24}$/)) {
      // Try to find by MongoDB ID
      prescriptions = await Prescription.find({ ...baseFilter, patientId })
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
        prescriptions = await Prescription.find({ ...baseFilter, patientId: patient._id })
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
    const prescriptions = await Prescription.find({ status: 'Active', pharmacyDispensed: { $ne: true } })
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

// Pharmacy: mark prescription as dispensed for pharmacy view only (patient still sees as Active)
router.patch('/:prescriptionId/pharmacy-dispensed', async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findOneAndUpdate(
      { prescriptionId },
      { pharmacyDispensed: true, dispensedDate: new Date() },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({
      message: 'Prescription marked as dispensed for pharmacy',
      prescription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error marking prescription dispensed', error: error.message });
  }
});

// Pharmacy: mark a specific medicine in prescription as dispensed (global across pharmacies)
router.patch('/:prescriptionId/dispense-medicine', async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const { medicineIndex, pharmacyId } = req.body;

    if (medicineIndex === undefined || medicineIndex === null) {
      return res.status(400).json({ message: 'medicineIndex is required' });
    }

    const prescription = await Prescription.findOne({ prescriptionId });
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    const index = Number(medicineIndex);
    if (Number.isNaN(index) || index < 0 || index >= prescription.medicines.length) {
      return res.status(400).json({ message: 'Invalid medicineIndex' });
    }

    const medicine = prescription.medicines[index];
    if (medicine.dispensed) {
      return res.status(409).json({ message: `${medicine.medicineName} is already dispensed` });
    }

    medicine.dispensed = true;
    medicine.dispensedAt = new Date();
    if (pharmacyId) {
      medicine.dispensedBy = pharmacyId;
    }

    const allMedicinesDispensed = prescription.medicines.every((item) => item.dispensed);
    if (allMedicinesDispensed) {
      prescription.pharmacyDispensed = true;
      prescription.dispensedDate = new Date();
      prescription.status = 'Dispensed';
    }

    prescription.markModified('medicines');
    await prescription.save();

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate('doctorId', 'firstName lastName email doctorId')
      .populate('patientId', 'firstName lastName email patientId');

    res.json({
      message: `${medicine.medicineName} marked as dispensed`,
      prescription: populatedPrescription,
      allMedicinesDispensed,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error dispensing medicine', error: error.message });
  }
});

// Doctor: full prescription history (optionally filtered by patient ID)
router.get('/doctor/:doctorId/history', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { patientId } = req.query;

    const doctor = doctorId.match(/^[0-9a-fA-F]{24}$/)
      ? await Doctor.findById(doctorId)
      : await Doctor.findOne({ doctorId });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const filter = {};

    if (patientId) {
      let patient = null;
      if (patientId.match(/^[0-9a-fA-F]{24}$/)) {
        patient = await Patient.findById(patientId);
      }
      if (!patient) {
        patient = await Patient.findOne({ patientId });
      }
      if (!patient) {
        return res.json({ message: 'No prescriptions found', prescriptions: [] });
      }
      filter.patientId = patient._id;
    } else {
      filter.doctorId = doctor._id;
    }

    const prescriptions = await Prescription.find(filter)
      .populate('doctorId', 'firstName lastName email doctorId')
      .populate('patientId', 'firstName lastName email patientId')
      .sort({ issuedDate: -1 });

    return res.json({
      message: 'Doctor prescription history retrieved',
      prescriptions,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching doctor prescription history', error: error.message });
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
