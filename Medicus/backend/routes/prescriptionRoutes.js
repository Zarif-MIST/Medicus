const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/create', authMiddleware, prescriptionController.createPrescription);
router.get('/patient/:patientId', authMiddleware, prescriptionController.getPrescriptionsByPatient);
router.get('/:id', authMiddleware, prescriptionController.getPrescriptionById);
router.patch('/:id/status', authMiddleware, prescriptionController.updatePrescriptionStatus);

module.exports = router;
