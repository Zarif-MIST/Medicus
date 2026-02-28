import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import './MedicineOrder.css';

export default function MedicineOrder({ patientId, selectedPharmacy, onOrderComplete }) {
  // eslint-disable-next-line no-unused-vars
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescribedMedicines, setPrescribedMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);
  const [prescriptionError, setPrescriptionError] = useState('');
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(true);
  const [pharmacyPriceMap, setPharmacyPriceMap] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [selectedPharmacyLocal, setSelectedPharmacyLocal] = useState(selectedPharmacy || null);
  const [addingToFavorites, setAddingToFavorites] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('sslcommerz');
  const nearbyRadiusKm = 10;

  const getMedicineKey = (medicineName, strength) =>
    `${(medicineName || '').trim().toLowerCase()}::${(strength || '').trim().toLowerCase()}`;

  const getPharmacyMedicinePrice = (medicineName, strength) => {
    const exactKey = getMedicineKey(medicineName, strength);
    const nameOnlyKey = getMedicineKey(medicineName, '');

    if (pharmacyPriceMap[exactKey]) return pharmacyPriceMap[exactKey];
    if (pharmacyPriceMap[nameOnlyKey]) return pharmacyPriceMap[nameOnlyKey];
    return null;
  };

  useEffect(() => {
    if (selectedPharmacy) {
      setSelectedPharmacyLocal(selectedPharmacy);
    }
  }, [selectedPharmacy]);

  // Get user location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError('');
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to get your location. Showing all pharmacies.');
          setUserLocation(null);
        }
      );
    } else {
      setLocationError('Geolocation not supported. Showing all pharmacies.');
    }
  }, []);

  // Calculate distance between two coordinates in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const getPharmacyCoordinates = (pharmacy) => {
    if (!pharmacy) return null;

    if (
      typeof pharmacy.latitude === 'number' &&
      typeof pharmacy.longitude === 'number'
    ) {
      return { lat: pharmacy.latitude, lng: pharmacy.longitude };
    }

    if (
      pharmacy.latitude !== null &&
      pharmacy.latitude !== undefined &&
      pharmacy.longitude !== null &&
      pharmacy.longitude !== undefined
    ) {
      const lat = parseFloat(pharmacy.latitude);
      const lng = parseFloat(pharmacy.longitude);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        return { lat, lng };
      }
    }

    if (
      pharmacy.location &&
      Array.isArray(pharmacy.location.coordinates) &&
      pharmacy.location.coordinates.length >= 2
    ) {
      const [lng, lat] = pharmacy.location.coordinates;
      if (typeof lat === 'number' && typeof lng === 'number') {
        return { lat, lng };
      }
    }

    return null;
  };

  // Fetch and filter nearby pharmacies
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setLoadingPharmacies(true);
        const response = await apiService.getAllPharmacies();
        let pharmacies = response.pharmacies || [];
        
        // Filter by 2km radius if user location is available
        if (userLocation && pharmacies.length > 0) {
          pharmacies = pharmacies.filter(pharmacy => {
            const coordinates = getPharmacyCoordinates(pharmacy);
            if (!coordinates) return false;

            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              coordinates.lat,
              coordinates.lng
            );

            return distance <= nearbyRadiusKm;
          });
        }
        
        setNearbyPharmacies(pharmacies);
      } catch (err) {
        console.error('Error fetching pharmacies:', err);
        setNearbyPharmacies([]);
      } finally {
        setLoadingPharmacies(false);
      }
    };
    fetchPharmacies();
  }, [userLocation]);

  // Fetch patient prescriptions on mount
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!patientId) return;
      try {
        setLoadingPrescriptions(true);
        setPrescriptionError('');
        const response = await apiService.getPrescriptionsByPatient(patientId);
        const activePrescriptions = (response.prescriptions || []).filter(rx => rx.status === 'Active');
        setPrescriptions(activePrescriptions);

        // Extract all medicines from prescriptions with prescription-specific keys
        const extractedMedicines = [];
        activePrescriptions.forEach(prescription => {
          if (prescription.medicines && Array.isArray(prescription.medicines)) {
            prescription.medicines.forEach((med, idx) => {
              const normalizedQuantity = Math.max(1, parseInt(med.quantity, 10) || 1);
              extractedMedicines.push({
                itemKey: `${prescription.prescriptionId}_${idx}`,
                prescriptionId: prescription.prescriptionId,
                prescriptionMedicineIndex: idx,
                medicineName: med.medicineName,
                strength: med.strength,
                dosage: med.dosage,
                quantity: normalizedQuantity,
                frequency: med.frequency,
                duration: med.duration,
                instructions: med.instructions,
                prescriptions: [{
                prescriptionId: prescription.prescriptionId,
                doctorName: `Dr. ${prescription.doctorId?.firstName || 'Unknown'} ${prescription.doctorId?.lastName || ''}`,
              }],
              });
            });
          }
        });

        setPrescribedMedicines(extractedMedicines);
      } catch (err) {
        setPrescriptionError('Failed to load your prescriptions. You can only order medicines prescribed by doctors.');
        console.error('Error fetching prescriptions:', err);
        setPrescriptions([]);
        setPrescribedMedicines([]);
      } finally {
        setLoadingPrescriptions(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  useEffect(() => {
    const fetchSelectedPharmacyInventory = async () => {
      if (!selectedPharmacyLocal) {
        setPharmacyPriceMap({});
        return;
      }

      try {
        setLoadingPrices(true);
        const response = await apiService.getPharmacyInventory(selectedPharmacyLocal);
        const inventory = response.inventory || [];

        const priceMap = {};
        inventory.forEach((item) => {
          const exactKey = getMedicineKey(item.medicineName, item.strength);
          const nameOnlyKey = getMedicineKey(item.medicineName, '');
          const price = Number(item.price) || 0;

          priceMap[exactKey] = {
            price,
            quantity: Number(item.quantity) || 0,
          };

          if (!priceMap[nameOnlyKey]) {
            priceMap[nameOnlyKey] = {
              price,
              quantity: Number(item.quantity) || 0,
            };
          }
        });

        setPharmacyPriceMap(priceMap);
      } catch (error) {
        console.error('Failed to load pharmacy inventory pricing:', error);
        setPharmacyPriceMap({});
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchSelectedPharmacyInventory();
  }, [selectedPharmacyLocal]);

  useEffect(() => {
    if (!selectedPharmacyLocal) return;

    setSelectedMedicines((previousMedicines) => {
      if (!previousMedicines.length) return previousMedicines;

      return previousMedicines.map((medicine) => {
        const exactKey = getMedicineKey(medicine.medicineName, medicine.strength);
        const nameOnlyKey = getMedicineKey(medicine.medicineName, '');
        const pricing = pharmacyPriceMap[exactKey] || pharmacyPriceMap[nameOnlyKey];

        if (!pricing) return medicine;

        return {
          ...medicine,
          estimatedPrice: pricing.price,
        };
      });
    });
  }, [pharmacyPriceMap, selectedPharmacyLocal]);

  const totalAmount = selectedMedicines.reduce((sum, med) => sum + (med.estimatedPrice * med.quantity), 0);
  const hasUnavailableSelectedMedicines = selectedMedicines.some((medicine) =>
    !getPharmacyMedicinePrice(medicine.medicineName, medicine.strength)
  );

  const toggleMedicine = (medicine) => {
    if (!selectedPharmacyLocal) {
      alert('Please select a pharmacy first to load medicine prices.');
      return;
    }

    const pricing = getPharmacyMedicinePrice(medicine.medicineName, medicine.strength);
    if (!pricing) {
      alert(`${medicine.medicineName} is not currently available in selected pharmacy inventory.`);
      return;
    }

    const isSelected = selectedMedicines.some((m) => m.itemKey === medicine.itemKey);
    if (isSelected) {
      setSelectedMedicines(selectedMedicines.filter((m) => m.itemKey !== medicine.itemKey));
    } else {
      setSelectedMedicines([...selectedMedicines, {
        itemKey: medicine.itemKey,
        prescriptionId: medicine.prescriptionId,
        prescriptionMedicineIndex: medicine.prescriptionMedicineIndex,
        medicineName: medicine.medicineName,
        strength: medicine.strength,
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        duration: medicine.duration,
        instructions: medicine.instructions,
        prescriptions: medicine.prescriptions,
        quantity: Math.max(1, parseInt(medicine.quantity, 10) || 1),
        estimatedPrice: pricing.price,
        notes: '',
      }]);
    }
  };

  const removeMedicine = (itemKey) => {
    setSelectedMedicines(selectedMedicines.filter((m) => m.itemKey !== itemKey));
  };

  const handleAddToFavorites = async (pharmacyId) => {
    if (!patientId) return;
    try {
      setAddingToFavorites(prev => ({ ...prev, [pharmacyId]: true }));
      await apiService.addFavoritePharmacy(patientId, pharmacyId);
      setTimeout(() => {
        setAddingToFavorites(prev => ({ ...prev, [pharmacyId]: false }));
      }, 1500);
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setAddingToFavorites(prev => ({ ...prev, [pharmacyId]: false }));
    }
  };

  const handleSelectPharmacy = (pharmacyId) => {
    setSelectedPharmacyLocal(pharmacyId);
  };

  const handleSubmitOrder = async () => {
    if (!selectedPharmacyLocal) {
      alert('Please select a pharmacy first');
      return;
    }

    if (selectedMedicines.length === 0) {
      alert('Please select medicines from your prescriptions');
      return;
    }

    if (hasUnavailableSelectedMedicines) {
      alert('Some selected medicines are unavailable in this pharmacy. Please remove them or choose another pharmacy.');
      return;
    }

    if (!deliveryAddress.street || !deliveryAddress.phone) {
      alert('Please fill in delivery address and phone number');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        patientId,
        pharmacyId: selectedPharmacyLocal,
        medicines: selectedMedicines.map(med => ({
          medicineName: med.medicineName,
          strength: med.strength,
          dosage: med.dosage,
          quantity: med.quantity,
          frequency: med.frequency,
          duration: med.duration,
          prescriptionId: med.prescriptionId,
          prescriptionMedicineIndex: med.prescriptionMedicineIndex,
          instructions: med.instructions,
          prescribedBy: med.prescriptions.map(p => p.doctorName).join(', '),
          notes: med.notes,
        })),
        totalAmount,
        paymentMethod,
        deliveryAddress,
        notes,
      };

      const response = await apiService.createMedicineOrder(orderData);

      if (onOrderComplete) {
        onOrderComplete(response.order);
      }

      // Reset form
      setSelectedMedicines([]);
      setDeliveryAddress({ street: '', city: '', postalCode: '', phone: '' });
      setNotes('');

      alert('Order created successfully! Proceeding to payment...');
    } catch (err) {
      alert(`Error creating order: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPrescriptions) {
    return (
      <div className="medicine-order-section">
        <div className="order-header">
          <h3>💊 Order Prescribed Medicines</h3>
        </div>
        <div className="loading-state">Loading your prescriptions...</div>
      </div>
    );
  }

  return (
    <div className="medicine-order-section">
      <div className="order-header">
        <h3>💊 Order Your Prescribed Medicines</h3>
        {!selectedPharmacyLocal && <p className="pharmacy-notice">⚠️ Select a pharmacy first</p>}
        {selectedPharmacyLocal && (
          <p className="pharmacy-selected">✓ Pharmacy selected. Ready to order!</p>
        )}
      </div>

      {prescriptionError && (
        <div className="prescription-error">
          <span className="error-icon">⚠️</span>
          {prescriptionError}
        </div>
      )}

      {/* Pharmacy Selection Section */}
      <div className="pharmacy-selection-section">
        <h4>🏪 Select a Pharmacy</h4>
        {locationError && (
          <p className="location-notice error">📍 {locationError}</p>
        )}
        {!locationError && userLocation && (
          <p className="location-notice">📍 Showing pharmacies within {nearbyRadiusKm}km of your location</p>
        )}
        {loadingPharmacies ? (
          <div className="loading-state">Loading nearby pharmacies...</div>
        ) : nearbyPharmacies.length > 0 ? (
          <div className="pharmacy-grid">
            {nearbyPharmacies.map((pharmacy) => (
              <div
                key={pharmacy._id}
                className={`pharmacy-card ${selectedPharmacyLocal === pharmacy._id ? 'selected' : ''}`}
                onClick={() => handleSelectPharmacy(pharmacy._id)}
              >
                <div className="pharmacy-card-header">
                  <h5>{pharmacy.pharmacyName}</h5>
                  {pharmacy.rating && (
                    <div className="pharmacy-rating">⭐ {pharmacy.rating.toFixed(1)}</div>
                  )}
                </div>
                <div className="pharmacy-info">
                  <p className="pharmacy-address">📍 {pharmacy.address || 'Address not provided'}</p>
                  {pharmacy.phone && <p className="pharmacy-phone">📞 {pharmacy.phone}</p>}
                  <div className="pharmacy-hours">🕐 Open Now</div>
                </div>
                <button
                  className={`favorite-btn ${addingToFavorites[pharmacy._id] ? 'adding' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToFavorites(pharmacy._id);
                  }}
                  disabled={addingToFavorites[pharmacy._id]}
                >
                  {addingToFavorites[pharmacy._id] ? '❤️ Added!' : '🤍 Add to Favorites'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-pharmacies">
            <p>
              {userLocation 
                ? `No pharmacies found within ${nearbyRadiusKm}km. Try adjusting your location or check back later.` 
                : 'Unable to determine your location. Please enable location services to find nearby pharmacies.'}
            </p>
          </div>
        )}
      </div>

      <div className="order-container">
        {prescribedMedicines.length > 0 ? (
          <>
            {/* Prescribed Medicines List */}
            <div className="prescribed-medicines-section">
              <h4>🏥 Your Prescribed Medicines ({prescribedMedicines.length})</h4>
              <p className="section-hint">Select medicines you want to order from your active prescriptions</p>

              <div className="medicines-grid">
                {prescribedMedicines.map((medicine, idx) => {
                  const isSelected = selectedMedicines.some((m) => m.itemKey === medicine.itemKey);

                  return (
                    <div
                      key={idx}
                      className={`medicine-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleMedicine(medicine)}
                    >
                      <div className="medicine-card-header">
                        <div className="select-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleMedicine(medicine)}
                            onClick={e => e.stopPropagation()}
                          />
                        </div>
                        <div className="medicine-card-title">
                          <h5>{medicine.medicineName}</h5>
                          {medicine.strength && <span className="strength">{medicine.strength}</span>}
                        </div>
                      </div>

                      <div className="medicine-card-details">
                        <div className="detail">
                          <span className="label">Dosage:</span>
                          <span className="value">{medicine.dosage}</span>
                        </div>
                        <div className="detail">
                          <span className="label">Frequency:</span>
                          <span className="value">{medicine.frequency}</span>
                        </div>
                        <div className="detail">
                          <span className="label">Duration:</span>
                          <span className="value">{medicine.duration}</span>
                        </div>
                        <div className="detail">
                          <span className="label">Price:</span>
                          <span className="value">
                            {(() => {
                              const pricing = getPharmacyMedicinePrice(medicine.medicineName, medicine.strength);
                              return pricing ? `৳ ${Number(pricing.price).toFixed(2)}` : 'Not available';
                            })()}
                          </span>
                        </div>
                      </div>

                      {medicine.instructions && (
                        <div className="medicine-instructions-card">
                          <span className="icon">ℹ️</span>
                          {medicine.instructions}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Medicines Summary */}
            {selectedMedicines.length > 0 && (
              <>
                <div className="selected-medicines-section">
                  <h4>📋 Selected Medicines ({selectedMedicines.length})</h4>

                  <div className="selected-medicines-list">
                    {selectedMedicines.map((medicine, idx) => (
                      <div key={medicine.itemKey || idx} className="selected-medicine-row">
                        <div className="medicine-info">
                          <div className="medicine-name">{medicine.medicineName}</div>
                          {medicine.strength && <div className="medicine-strength">{medicine.strength}</div>}
                          <div className="medicine-prescribed">
                            Prescribed by: {medicine.prescriptions.map(p => p.doctorName).join(', ')}
                          </div>
                        </div>

                        <div className="quantity-control">
                          <span className="fixed-quantity-label">Qty (Prescribed):</span>
                          <input
                            type="number"
                            value={medicine.quantity}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="medicine-price">
                          ৳ {(medicine.estimatedPrice * medicine.quantity).toFixed(2)}
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => removeMedicine(medicine.itemKey)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="delivery-section">
                  <h4>📍 Delivery Address</h4>
                  <div className="address-form">
                    <input
                      type="text"
                      placeholder="Street address"
                      value={deliveryAddress.street}
                      onChange={e => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={deliveryAddress.city}
                      onChange={e => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Postal code"
                      value={deliveryAddress.postalCode}
                      onChange={e => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={deliveryAddress.phone}
                      onChange={e => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="notes-section">
                  <h4>📝 Special Instructions (Optional)</h4>
                  <textarea
                    placeholder="Any special instructions or notes for the pharmacy..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows="3"
                  />
                </div>

                {/* Payment Method */}
                <div className="payment-method-section">
                  <h4>💳 Payment Method</h4>
                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        value="sslcommerz"
                        checked={paymentMethod === 'sslcommerz'}
                        onChange={e => setPaymentMethod(e.target.value)}
                      />
                      <span className="option-label">SSLCommerz</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        value="nagad"
                        checked={paymentMethod === 'nagad'}
                        onChange={e => setPaymentMethod(e.target.value)}
                      />
                      <span className="option-label">Nagad</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={e => setPaymentMethod(e.target.value)}
                      />
                      <span className="option-label">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Order Summary and Submit */}
                <div className="order-summary">
                  {loadingPrices && (
                    <div className="summary-row">
                      <span>Updating pharmacy-specific prices...</span>
                      <span>⏳</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Subtotal ({selectedMedicines.length} medicines):</span>
                    <span>৳ {totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Fee:</span>
                    <span>৳ 50</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>৳ {(totalAmount + 50).toFixed(2)}</span>
                  </div>
                  <button
                    className="submit-btn"
                    onClick={handleSubmitOrder}
                    disabled={loading || loadingPrices || !selectedPharmacyLocal || hasUnavailableSelectedMedicines}
                  >
                    {loading ? 'Creating Order...' : 'Proceed to Payment'}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="no-prescriptions">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No Active Prescriptions</div>
            <div className="empty-message">
              You don't have any active prescriptions at the moment. To order medicines, please consult with a doctor and get a prescription.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
