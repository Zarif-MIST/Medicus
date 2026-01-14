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
app.use('/api/doctor', require('./routes/doctor'));

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Medicus API is running',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register/doctor',
        login: 'POST /api/auth/login'
      },
      doctor: {
        profile: 'GET /api/doctor/profile (requires auth)',
        updateProfile: 'PUT /api/doctor/profile (requires auth)'
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
