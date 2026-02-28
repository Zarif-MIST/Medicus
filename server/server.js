require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middleware
const normalizeOrigin = (value = '') => value.trim().replace(/\/$/, '');

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    const normalizedRequestOrigin = normalizeOrigin(origin || '');
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(normalizedRequestOrigin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());

const PRIMARY_MONGO_URI = process.env.MONGODB_URI;
const FALLBACK_MONGO_URI = process.env.MONGODB_URI_FALLBACK || 'mongodb://127.0.0.1:27017/medicus';
const isVercel = process.env.VERCEL === '1';
let mongoConnectionPromise = null;
let lastMongoError = null;

const connectToMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (mongoConnectionPromise) {
    return mongoConnectionPromise;
  }

  mongoConnectionPromise = (async () => {
  try {
    if (!PRIMARY_MONGO_URI && !FALLBACK_MONGO_URI) {
      throw new Error('No MongoDB URI configured. Set MONGODB_URI in environment variables.');
    }

    await mongoose.connect(PRIMARY_MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    lastMongoError = null;
    console.log('MongoDB connected successfully (Atlas)');
  } catch (primaryError) {
    lastMongoError = primaryError.message;
    console.error('Atlas connection failed.');
    console.error('Atlas error:', primaryError.message);

    if (isVercel) {
      console.error('Skipping localhost fallback on Vercel environment.');
      return;
    }

    console.error('Trying local fallback...');
    try {
      await mongoose.connect(FALLBACK_MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      lastMongoError = null;
      console.log(`MongoDB connected successfully (fallback): ${FALLBACK_MONGO_URI}`);
    } catch (fallbackError) {
      lastMongoError = fallbackError.message;
      console.error('Fallback MongoDB connection failed:', fallbackError.message);
      console.error('Server will continue running, but database operations may fail until MongoDB is reachable.');
    }
  }
  })();

  return mongoConnectionPromise;
};

connectToMongo();

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    message: 'Server running',
    database: isConnected ? 'connected' : 'disconnected',
    mongoError: isConnected ? null : lastMongoError,
  });
});

const PORT = process.env.PORT || 5000;
if (!isVercel) {
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
}

module.exports = app;
