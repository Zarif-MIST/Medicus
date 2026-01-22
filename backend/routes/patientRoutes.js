const express = require('express');
const patientController = require('../controllers/patientController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Temporarily allow unauthenticated access to match frontend service
router.get('/:id', patientController.getPatientById);
router.get('/', authMiddleware, patientController.getAllPatients);
router.put('/:id', authMiddleware, patientController.updatePatient);

module.exports = router;
