require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PRIMARY_MONGO_URI = process.env.MONGODB_URI;
const FALLBACK_MONGO_URI = process.env.MONGODB_URI_FALLBACK || 'mongodb://127.0.0.1:27017/medicus';

const connectToMongo = async () => {
  try {
    await mongoose.connect(PRIMARY_MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully (Atlas)');
  } catch (primaryError) {
    console.error('Atlas connection failed, trying local fallback...');
    console.error('Atlas error:', primaryError.message);

    try {
      await mongoose.connect(FALLBACK_MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log(`MongoDB connected successfully (fallback): ${FALLBACK_MONGO_URI}`);
    } catch (fallbackError) {
      console.error('Fallback MongoDB connection failed:', fallbackError.message);
      console.error('Server will continue running, but database operations may fail until MongoDB is reachable.');
    }
  }
};

connectToMongo();

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free it and try again.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
