// Import dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/auth-extended')); // Pharmacist & Patient auth
app.use('/api/doctor', require('./routes/doctor'));
app.use('/api/patient', require('./routes/patient'));
app.use('/api/prescription', require('./routes/prescription'));
app.use('/api/pharmacist', require('./routes/pharmacist'));
app.use('/api/patient-portal', require('./routes/patient-portal'));

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Medicus API is running',
    version: '1.0.0',
    endpoints: {
      auth: {
        doctor: {
          register: 'POST /api/auth/register/doctor',
          login: 'POST /api/auth/login'
        },
        pharmacist: {
          register: 'POST /api/auth/register/pharmacist',
          login: 'POST /api/auth/login-pharmacist'
        },
        patient: {
          register: 'POST /api/auth/register/patient',
          login: 'POST /api/auth/login-patient'
        }
      },
      doctor: {
        profile: 'GET /api/doctor/profile (requires auth)',
        updateProfile: 'PUT /api/doctor/profile (requires auth)',
        recentPrescriptions: 'GET /api/prescription/recent (requires auth)'
      },
      patient: {
        getPatient: 'GET /api/patient/:id (requires auth)',
        createPatient: 'POST /api/patient (requires auth)',
        getHistory: 'GET /api/patient/:id/history (requires auth)'
      },
      prescription: {
        create: 'POST /api/prescription (requires auth)',
        recent: 'GET /api/prescription/recent (requires auth)',
        getOne: 'GET /api/prescription/:id (requires auth)',
        updateStatus: 'PUT /api/prescription/:id/status (requires auth)'
      },
      pharmacist: {
        getPrescriptions: 'GET /api/pharmacist/prescriptions (requires auth)',
        getPrescriptionDetail: 'GET /api/pharmacist/prescriptions/:id (requires auth)',
        updateStatus: 'PUT /api/pharmacist/prescriptions/:id/status (requires auth)'
      },
      patientPortal: {
        myPrescriptions: 'GET /api/patient-portal/my-prescriptions (requires auth)',
        getPrescriptionDetail: 'GET /api/patient-portal/prescriptions/:id (requires auth)',
        getProfile: 'GET /api/patient-portal/profile (requires auth)'
      }
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`📝 API Documentation at http://localhost:${PORT}`);
});
