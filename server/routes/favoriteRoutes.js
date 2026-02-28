const express = require('express');
const router = express.Router();
const FavoritePharmacy = require('../models/FavoritePharmacy');
const Patient = require('../models/Patient');
const Pharmacy = require('../models/Pharmacy');

// Add pharmacy to favorites
router.post('/add', async (req, res) => {
  try {
    const { patientId, pharmacyId } = req.body;

    if (!patientId || !pharmacyId) {
      return res.status(400).json({ message: 'Patient ID and Pharmacy ID are required' });
    }

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if pharmacy exists
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    // Check if already favorited
    const existing = await FavoritePharmacy.findOne({ patientId, pharmacyId });
    if (existing) {
      return res.status(400).json({ message: 'Pharmacy already in favorites' });
    }

    // Create favorite
    const favorite = new FavoritePharmacy({
      patientId,
      pharmacyId,
      pharmacyName: pharmacy.pharmacyName,
      address: pharmacy.address,
      phoneNumber: pharmacy.phoneNumber,
    });

    await favorite.save();
    res.status(201).json({ message: 'Pharmacy added to favorites', favorite });
  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite pharmacy', error: error.message });
  }
});

// Remove pharmacy from favorites
router.delete('/:favoriteId', async (req, res) => {
  try {
    const favorite = await FavoritePharmacy.findByIdAndDelete(req.params.favoriteId);
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.status(200).json({ message: 'Pharmacy removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite pharmacy', error: error.message });
  }
});

// Get patient's favorite pharmacies
router.get('/patient/:patientId', async (req, res) => {
  try {
    const favorites = await FavoritePharmacy.find({ patientId: req.params.patientId })
      .populate('pharmacyId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      favorites,
      count: favorites.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorite pharmacies', error: error.message });
  }
});

// Rate a favorite pharmacy
router.patch('/:favoriteId/rate', async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    const favorite = await FavoritePharmacy.findByIdAndUpdate(
      req.params.favoriteId,
      { rating },
      { new: true }
    );

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Rating updated', favorite });
  } catch (error) {
    res.status(500).json({ message: 'Error rating pharmacy', error: error.message });
  }
});

// Check if pharmacy is in favorites
router.get('/check/:patientId/:pharmacyId', async (req, res) => {
  try {
    const favorite = await FavoritePharmacy.findOne({
      patientId: req.params.patientId,
      pharmacyId: req.params.pharmacyId,
    });

    res.status(200).json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: 'Error checking favorite', error: error.message });
  }
});

module.exports = router;
