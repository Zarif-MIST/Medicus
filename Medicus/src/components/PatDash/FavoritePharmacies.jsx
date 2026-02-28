import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import './FavoritePharmacies.css';

export default function FavoritePharmacies({ patientId, onSelectPharmacy }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingModal, setRatingModal] = useState(null);
  const [rating, setRating] = useState(0);

  const fetchFavorites = useCallback(async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const response = await apiService.getFavoritePharmacies(patientId);
      setFavorites(response.favorites || []);
      setError('');
    } catch (err) {
      setError('Failed to load favorite pharmacies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await apiService.removeFavoritePharmacy(favoriteId);
      setFavorites(favorites.filter(f => f._id !== favoriteId));
    } catch (err) {
      alert('Failed to remove favorite');
      console.error(err);
    }
  };

  const handleRatePharmacy = async (favoriteId) => {
    try {
      if (rating < 0 || rating > 5) {
        alert('Rating must be between 0 and 5');
        return;
      }
      await apiService.ratePharmacy(favoriteId, rating);
      const updatedFavorites = favorites.map(f =>
        f._id === favoriteId ? { ...f, rating } : f
      );
      setFavorites(updatedFavorites);
      setRatingModal(null);
      setRating(0);
    } catch (err) {
      alert('Failed to rate pharmacy');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="favorites-loading">Loading favorite pharmacies...</div>;
  }

  return (
    <div className="favorites-section">
      <div className="favorites-header">
        <h3>🏥 My Favorite Pharmacies</h3>
        {favorites.length > 0 && <span className="favorites-count">{favorites.length}</span>}
      </div>

      {error && <div className="favorites-error">{error}</div>}

      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <div key={favorite._id} className="favorite-pharmacy-card">
              <div className="pharmacy-info-section">
                <h4 className="pharmacy-name">{favorite.pharmacyName}</h4>
                <div className="pharmacy-details">
                  <div className="detail-row">
                    <span className="icon">📍</span>
                    <span className="text">{favorite.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="icon">📞</span>
                    <span className="text">{favorite.phoneNumber}</span>
                  </div>
                  {favorite.lastOrdered && (
                    <div className="detail-row">
                      <span className="icon">📦</span>
                      <span className="text">
                        Last ordered: {new Date(favorite.lastOrdered).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pharmacy-rating">
                <div className="stars">
                  {'★'.repeat(Math.round(favorite.rating))}
                  {'☆'.repeat(5 - Math.round(favorite.rating))}
                </div>
                <span className="rating-text">{favorite.rating?.toFixed(1) || 'Not rated'}</span>
              </div>

              <div className="pharmacy-actions">
                <button
                  className="action-btn order-btn"
                  onClick={() => onSelectPharmacy(favorite.pharmacyId)}
                >
                  Order Medicines
                </button>
                <button
                  className="action-btn rate-btn"
                  onClick={() => setRatingModal(favorite._id)}
                >
                  Rate
                </button>
                <button
                  className="action-btn remove-btn"
                  onClick={() => handleRemoveFavorite(favorite._id)}
                >
                  Remove
                </button>
              </div>

              {ratingModal === favorite._id && (
                <div className="rating-modal-overlay" onClick={() => setRatingModal(null)}>
                  <div className="rating-modal" onClick={e => e.stopPropagation()}>
                    <h4>Rate {favorite.pharmacyName}</h4>
                    <div className="rating-input">
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.5"
                        value={rating}
                        onChange={e => setRating(parseFloat(e.target.value))}
                        placeholder="Enter rating (0-5)"
                      />
                    </div>
                    <div className="rating-buttons">
                      <button
                        className="btn-submit"
                        onClick={() => handleRatePharmacy(favorite._id)}
                      >
                        Submit
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setRatingModal(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🏥</div>
          <div className="empty-text">No favorite pharmacies yet.</div>
          <div className="empty-subtext">Add your favorite pharmacies to order medicines quickly!</div>
        </div>
      )}
    </div>
  );
}
