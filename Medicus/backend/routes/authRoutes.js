const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Doctor routes
router.post('/doctors/register', authController.doctorRegister);
router.post('/doctors/login', authController.doctorLogin);
router.post('/doctors/admin-login', authController.doctorAdminLogin);

// Patient routes
router.post('/patients/register', authController.patientRegister);
router.post('/patients/login', authController.patientLogin);
router.post('/patients/admin-login', authController.patientAdminLogin);

// Pharmacy routes
router.post('/pharmacies/register', authController.pharmacyRegister);
router.post('/pharmacies/login', authController.pharmacyLogin);
router.post('/pharmacies/admin-login', authController.pharmacyAdminLogin);

module.exports = router;
