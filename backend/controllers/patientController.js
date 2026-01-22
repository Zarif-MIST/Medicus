const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Prescription = require('../models/Prescription');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select('-password').populate('doctors').populate('prescriptions');
    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id)
      .select('-password')
      .populate('doctors')
      .populate({
        path: 'prescriptions',
        populate: {
          path: 'doctor medicines',
        },
      });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ patient });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update patient profile
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, dateOfBirth, gender, address, medicalHistory, allergies } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        phone,
        dateOfBirth,
        gender,
        address,
        medicalHistory,
        allergies,
        updatedAt: Date.now(),
      },
      { new: true }
    ).select('-password');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add doctor to patient
exports.addDoctor = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (!patient.doctors.includes(doctorId)) {
      patient.doctors.push(doctorId);
      await patient.save();
    }

    if (!doctor.patients.includes(patientId)) {
      doctor.patients.push(patientId);
      await doctor.save();
    }

    res.status(200).json({ message: 'Doctor added to patient successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient's doctors
exports.getPatientDoctors = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id).populate('doctors');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ doctors: patient.doctors });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient's prescriptions
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { id } = req.params;

    const prescriptions = await Prescription.find({ patient: id })
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

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search patients
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;

    const patients = await Patient.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ],
    }).select('-password');

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
