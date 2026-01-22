const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Pharmacy = require('../models/Pharmacy');

const generateToken = (user, role) => {
  return jwt.sign(
    { id: user._id, email: user.email, role },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '7d' }
  );
};

// Doctor Registration
exports.doctorRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, specialization, licenseNumber, hospitalAffiliation } = req.body;

    if (!firstName || !email || !password || !specialization || !licenseNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const doctor = new Doctor({
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
    const token = generateToken(doctor, 'doctor');
    res.status(201).json({
      message: 'Doctor registered successfully',
      token,
      doctor: {
        doctorId: doctor.doctorId,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialization: doctor.specialization,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Doctor Login
exports.doctorLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide identifier and password' });
    }

    const doctor = await Doctor.findOne({
      $or: [{ email: identifier }, { doctorId: identifier }],
    });
    if (!doctor || !(await doctor.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(doctor, 'doctor');
    res.status(200).json({
      message: 'Login successful',
      token,
      doctor: {
        doctorId: doctor.doctorId,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Patient Registration
exports.patientRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, dateOfBirth, gender, address } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const patient = new Patient({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
    });

    await patient.save();
    const token = generateToken(patient, 'patient');
    res.status(201).json({
      message: 'Patient registered successfully',
      token,
      patient: {
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Patient Login
exports.patientLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide identifier and password' });
    }

    const patient = await Patient.findOne({
      $or: [{ email: identifier }, { patientId: identifier }],
    });
    if (!patient || !(await patient.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(patient, 'patient');
    res.status(200).json({
      message: 'Login successful',
      token,
      patient: {
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Pharmacy Registration
exports.pharmacyRegister = async (req, res) => {
  try {
    const { pharmacyName, managerName, email, password, phoneNumber, licenseNumber, address } = req.body;

    if (!pharmacyName || !managerName || !email || !password || !licenseNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingPharmacy = await Pharmacy.findOne({ email });
    if (existingPharmacy) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const pharmacy = new Pharmacy({
      pharmacyName,
      managerName,
      email,
      password,
      phoneNumber,
      licenseNumber,
      address,
    });

    await pharmacy.save();
    const token = generateToken(pharmacy, 'pharmacy');
    res.status(201).json({
      message: 'Pharmacy registered successfully',
      token,
      pharmacy: {
        pharmacyId: pharmacy.pharmacyId,
        pharmacyName: pharmacy.pharmacyName,
        email: pharmacy.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Pharmacy Login
exports.pharmacyLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide identifier and password' });
    }

    const pharmacy = await Pharmacy.findOne({
      $or: [{ email: identifier }, { pharmacyId: identifier }],
    });
    if (!pharmacy || !(await pharmacy.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(pharmacy, 'pharmacy');
    res.status(200).json({
      message: 'Login successful',
      token,
      pharmacy: {
        pharmacyId: pharmacy.pharmacyId,
        pharmacyName: pharmacy.pharmacyName,
        email: pharmacy.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Admin Login (simplified for demo)
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@medicus.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === adminEmail && password === adminPassword) {
      const token = generateToken('admin', 'admin');
      res.status(200).json({
        message: 'Admin login successful',
        token,
        user: { email, role: 'admin' },
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Doctor admin login (for demo/testing)
exports.doctorAdminLogin = async (req, res) => {
  const token = generateToken('doctor_admin', 'doctor_admin');
  res.status(200).json({
    message: 'Admin login successful',
    token,
    user: { role: 'doctor_admin' },
  });
};

// Patient admin login (for demo/testing)
exports.patientAdminLogin = async (req, res) => {
  const token = generateToken('patient_admin', 'patient_admin');
  res.status(200).json({
    message: 'Admin login successful',
    token,
    user: { role: 'patient_admin' },
  });
};

// Pharmacy admin login (for demo/testing)
exports.pharmacyAdminLogin = async (req, res) => {
  const token = generateToken('pharmacy_admin', 'pharmacy_admin');
  res.status(200).json({
    message: 'Admin login successful',
    token,
    user: { role: 'pharmacy_admin' },
  });
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    let user;
    if (role === 'doctor') {
      user = await Doctor.findById(id).select('-password');
    } else if (role === 'patient') {
      user = await Patient.findById(id).select('-password');
    } else if (role === 'pharmacy') {
      user = await Pharmacy.findById(id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
