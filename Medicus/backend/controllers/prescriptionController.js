const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Pharmacy = require('../models/Pharmacy');

// Create prescription
exports.createPrescription = async (req, res) => {
  try {
    const { doctorId, patientId, medicines, diagnosis, notes } = req.body;

    if (!doctorId || !patientId || !medicines || !diagnosis) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const prescriptionNumber = `RX-${Date.now()}`;

    const prescription = new Prescription({
      prescriptionNumber,
      doctor: doctorId,
      patient: patientId,
      medicines,
      diagnosis,
      notes,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });

    await prescription.save();

    // Add prescription to patient
    await Patient.findByIdAndUpdate(patientId, {
      $push: { prescriptions: prescription._id },
    });

    // Add prescription to doctor
    await Doctor.findByIdAndUpdate(doctorId, {
      $push: { prescriptions: prescription._id },
    });

    const populatedPrescription = await prescription.populate('doctor patient medicines.medicine');

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription: populatedPrescription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all prescriptions
exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('doctor')
      .populate('patient')
      .populate('pharmacy')
      .populate({
        path: 'medicines',
        populate: {
          path: 'medicine',
        },
      });

    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
      .populate('doctor')
      .populate('patient')
      .populate('pharmacy')
      .populate({
        path: 'medicines',
        populate: {
          path: 'medicine',
        },
      });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json({ prescription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update prescription status
exports.updatePrescriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pharmacyId } = req.body;

    if (!['Pending', 'Confirmed', 'Dispensed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status, updatedAt: Date.now() };

    if (status === 'Dispensed') {
      updateData.pharmacy = pharmacyId;
      updateData.dispensedDate = Date.now();
    }

    const prescription = await Prescription.findByIdAndUpdate(id, updateData, { new: true })
      .populate('doctor')
      .populate('patient')
      .populate('pharmacy')
      .populate({
        path: 'medicines',
        populate: {
          path: 'medicine',
        },
      });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json({ message: 'Prescription status updated', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get prescriptions by patient
exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('doctor')
      .populate('pharmacy')
      .populate({
        path: 'medicines',
        populate: {
          path: 'medicine',
        },
      });

    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get prescriptions by doctor
exports.getPrescriptionsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const prescriptions = await Prescription.find({ doctor: doctorId })
      .populate('patient')
      .populate('pharmacy')
      .populate({
        path: 'medicines',
        populate: {
          path: 'medicine',
        },
      });

    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get prescriptions by pharmacy
exports.getPrescriptionsByPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const prescriptions = await Prescription.find({ pharmacy: pharmacyId, status: 'Dispensed' })
      .populate('doctor')
      .populate('patient')
      .populate({
        path: 'medicines',
        populate: {
          path: 'medicine',
        },
      });

    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete prescription
exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findByIdAndDelete(id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
