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

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server running' });
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
