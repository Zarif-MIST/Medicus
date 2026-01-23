const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/add', authMiddleware, inventoryController.addMedicine);
router.get('/pharmacy/:pharmacyId', authMiddleware, inventoryController.getMedicinesByPharmacy);
router.patch('/:id/quantity', authMiddleware, inventoryController.updateMedicineQuantity);
router.get('/search/:medicineName', authMiddleware, inventoryController.searchMedicines);

module.exports = router;
