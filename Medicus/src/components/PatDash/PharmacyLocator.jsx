import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../../services/apiService';
import './PharmacyLocator.css';

// Global flag to prevent multiple script loads
let googleMapsScriptLoading = false;

export default function PharmacyLocator({ onSelectPharmacy }) {
  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapError, setMapError] = useState(false);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);
  
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  const loadingTimeoutRef = useRef(null);
  const mapRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const clearLoadingTimeout = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    window.gm_authFailure = () => {
      if (!isMountedRef.current) return;
      setMapError(true);
      setError('Google Maps authentication failed. Check API key restrictions or billing.');
      setLoading(false);
      clearLoadingTimeout();
    };

    return () => {
      if (window.gm_authFailure) {
        delete window.gm_authFailure;
      }
    };
  }, [clearLoadingTimeout]);

  const startLoadingTimeout = useCallback(() => {
    clearLoadingTimeout();
    loadingTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setLoading(false);
        setMapError(true);
        setError('Map loading is taking too long. Please check your API key, billing, or network.');
      }
    }, 15000);
  }, [clearLoadingTimeout]);

  // Initialize Google Map
  const initMap = useCallback((lat, lng) => {
    const mapDiv = document.getElementById('pharmacy-map');
    if (!mapDiv || !window.google) return;

    try {
      const mapInstance = new window.google.maps.Map(mapDiv, {
        center: { lat, lng },
        zoom: 13,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add user location marker
      new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#991b1b',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        title: 'Your Location'
      });

      setMap(mapInstance);
      mapRef.current = mapInstance;
      setMapError(false);
    } catch (err) {
      console.error('Error initializing map:', err);
      setMapError(true);
      setError('Failed to initialize map. Please check your API key configuration.');
    }
  }, []);

  // Load Google Maps script
  const loadGoogleMapsScript = useCallback((apiKey, onLoad, onError) => {
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      onError('API key not configured');
      return;
    }

    // If already loaded, call onLoad immediately
    if (window.google && window.google.maps) {
      onLoad();
      return;
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector(
      'script[data-google-maps="true"], script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existingScript) {
      if (window.google && window.google.maps) {
        onLoad();
        return;
      }

      if (!existingScript.dataset.listenerAttached) {
        existingScript.addEventListener('load', () => {
          existingScript.dataset.loaded = 'true';
          onLoad();
        });
        existingScript.addEventListener('error', () => {
          existingScript.dataset.error = 'true';
          onError('Failed to load Google Maps');
        });
        existingScript.dataset.listenerAttached = 'true';
      }

      const timeoutId = setTimeout(() => {
        if (!window.google || !window.google.maps) {
          onError('Google Maps load timed out');
        }
      }, 12000);

      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          onLoad();
        }
      }, 100);

      return;
    }

    // If already loading, wait for it
    if (googleMapsScriptLoading) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          onLoad();
        }
      }, 100);
      return;
    }

    // Mark as loading
    googleMapsScriptLoading = true;

    try {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMaps = 'true';

      const timeoutId = setTimeout(() => {
        if (!window.google || !window.google.maps) {
          googleMapsScriptLoading = false;
          onError('Google Maps load timed out');
        }
      }, 12000);

      script.onload = () => {
        clearTimeout(timeoutId);
        googleMapsScriptLoading = false;
        script.dataset.loaded = 'true';
        onLoad();
      };

      script.onerror = () => {
        clearTimeout(timeoutId);
        googleMapsScriptLoading = false;
        script.dataset.error = 'true';
        onError('Failed to load Google Maps');
      };

      document.head.appendChild(script);
    } catch (err) {
      googleMapsScriptLoading = false;
      onError(err.message);
    }
  }, []);

  const requestUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      if (isMountedRef.current) {
        setError('Geolocation is not supported by your browser.');
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMountedRef.current) return;
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setError('');

        if (mapRef.current && window.google) {
          mapRef.current.panTo({ lat: location.lat, lng: location.lng });
          new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: mapRef.current,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#991b1b',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            },
            title: 'Your Location'
          });
        }
      },
      (error) => {
        if (!isMountedRef.current) return;
        if (error.code === 1) {
          setError('Location permission blocked. Click "Use my location" and allow access.');
        } else {
          setError('Unable to get your location. Using default location.');
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // Get user's current location
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      if (isMountedRef.current) {
        setMapError(true);
        setError('Google Maps API key not configured. Click "Setup Instructions" below to get started.');
        setLoading(false);
        setUserLocation({ lat: 23.8103, lng: 90.4125 });
      }
      return;
    }

    const defaultLocation = { lat: 23.8103, lng: 90.4125 };
    if (isMountedRef.current) {
      setUserLocation(defaultLocation);
      setLoading(true);
      startLoadingTimeout();
    }

    loadGoogleMapsScript(
      apiKey,
      () => {
        if (isMountedRef.current) {
          initMap(defaultLocation.lat, defaultLocation.lng);
          setLoading(false);
          clearLoadingTimeout();
        }
      },
      () => {
        if (isMountedRef.current) {
          setMapError(true);
          setError('Failed to load Google Maps. Please verify your API key configuration.');
          setLoading(false);
          clearLoadingTimeout();
        }
      }
    );

    requestUserLocation();
  }, [clearLoadingTimeout, initMap, loadGoogleMapsScript, requestUserLocation, startLoadingTimeout]);

  // Fetch pharmacies from database
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await apiService.getAllPharmacies();
        setPharmacies(response.pharmacies || []);
      } catch (err) {
        console.error('Failed to load pharmacies:', err);
      }
    };
    fetchPharmacies();
  }, []);

  // Add pharmacy markers to map
  useEffect(() => {
    if (!map || !pharmacies.length || !window.google) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers = pharmacies
      .filter(pharmacy => pharmacy.latitude && pharmacy.longitude) // Only show pharmacies with location
      .map((pharmacy, index) => {
        const lat = pharmacy.latitude;
        const lng = pharmacy.longitude;

        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#10b981" stroke="white" stroke-width="2"/>
                <text x="16" y="21" text-anchor="middle" fill="white" font-size="16" font-weight="bold">+</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32)
          },
          title: pharmacy.pharmacyName
        });

        marker.addListener('click', () => {
          setSelectedPharmacy({ ...pharmacy, lat, lng });
          map.panTo({ lat, lng });
        });

        return marker;
      });

    setMarkers(newMarkers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, pharmacies]);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const handlePharmacyClick = (pharmacy, lat, lng) => {
    setSelectedPharmacy({ ...pharmacy, lat, lng });
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(15);
    }
  };

  const handleOrderFromPharmacy = (pharmacy) => {
    if (onSelectPharmacy) {
      onSelectPharmacy(pharmacy._id);
    }
  };

  return (
    <div className="pharmacy-locator">
      <div className="section-header">
        <div className="section-header-text">
          <h3> Pharmacy Locator</h3>
          <p className="section-subtitle">Find pharmacies near you</p>
        </div>
      </div>

      {error && (
        <div className="location-error">
          ⚠️ {error}
          {mapError && (
            <button 
              className="setup-btn"
              onClick={() => setShowSetupInstructions(!showSetupInstructions)}
            >
              {showSetupInstructions ? 'Hide' : 'Show'} Setup Instructions
            </button>
          )}
        </div>
      )}

      {showSetupInstructions && mapError && (
        <div className="setup-instructions">
          <h4>📝 Quick Setup Guide</h4>
          <ol>
            <li>
              <strong>Get a FREE Google Maps API Key:</strong>
              <ul>
                <li>Visit: <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                <li>Create a new project (or select existing)</li>
                <li>Enable "Maps JavaScript API" and "Places API"</li>
                <li>Create credentials → API Key</li>
              </ul>
            </li>
            <li>
              <strong>Add API key to your project:</strong>
              <ul>
                <li>Open the file: <code>Medicus/.env</code></li>
                <li>Replace <code>YOUR_GOOGLE_MAPS_API_KEY</code> with your actual key</li>
                <li>Save the file</li>
              </ul>
            </li>
            <li>
              <strong>Restart the development server:</strong>
              <ul>
                <li>Stop the current server (Ctrl+C)</li>
                <li>Run: <code>npm start</code></li>
              </ul>
            </li>
          </ol>
          <p className="note">
            💡 <strong>Note:</strong> Google Maps provides $200 free credit per month (about 28,000 map loads).
            Perfect for development and small apps!
          </p>
          <p className="note">
            📚 <strong>Detailed Guide:</strong> See <code>PHARMACY_LOCATOR_SETUP.md</code> for complete instructions.
          </p>
        </div>
      )}

      <div className="locator-container">
        {/* Map Section */}
        <div className="map-section">
          <div id="pharmacy-map" className="pharmacy-map">
            {loading && (
              <div className="map-loading">
                <div className="spinner"></div>
                <p>Loading map...</p>
              </div>
            )}
            {mapError && !loading && (
              <div className="map-placeholder">
                <div className="placeholder-content">
                  <div className="placeholder-icon"></div>
                  <h4>Map Unavailable</h4>
                  <p>Google Maps API key required</p>
                  <button 
                    className="setup-btn-large"
                    onClick={() => setShowSetupInstructions(!showSetupInstructions)}
                  >
                    View Setup Instructions
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pharmacy List Section */}
        <div className="pharmacy-list-section">
          <h4>Nearby Pharmacies ({pharmacies.length})</h4>
          
          <div className="pharmacy-list">
            {pharmacies.length > 0 ? (
              pharmacies.map((pharmacy, index) => {
                // Use real pharmacy coordinates or skip if not available
                if (!pharmacy.latitude || !pharmacy.longitude) {
                  return null;
                }
                
                const lat = pharmacy.latitude;
                const lng = pharmacy.longitude;
                const distance = userLocation ? 
                  calculateDistance(userLocation.lat, userLocation.lng, lat, lng) : 
                  'N/A';

                return (
                  <div 
                    key={pharmacy._id} 
                    className={`pharmacy-card ${selectedPharmacy?._id === pharmacy._id ? 'selected' : ''}`}
                    onClick={() => handlePharmacyClick(pharmacy, lat, lng)}
                  >
                    <div className="pharmacy-header">
                      <div className="pharmacy-icon"></div>
                      <div>
                        <h5>{pharmacy.pharmacyName}</h5>
                        <p className="pharmacy-manager">Manager: {pharmacy.managerName}</p>
                      </div>
                    </div>
                    
                    <div className="pharmacy-info">
                      <div className="info-row">
                        <span className="info-icon">📞</span>
                        <span>{pharmacy.phoneNumber}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">📧</span>
                        <span>{pharmacy.email}</span>
                      </div>
                      {pharmacy.address && (
                        <div className="info-row">
                          <span className="info-icon">📍</span>
                          <span>{pharmacy.address}</span>
                        </div>
                      )}
                      <div className="info-row">
                        <span className="info-icon">🗺️</span>
                        <span className="distance">{distance} km away</span>
                      </div>
                    </div>
                    
                    <div className="pharmacy-actions">
                      <button className="btn-directions" onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                      }}>
                        Get Directions
                      </button>
                      <button className="btn-contact" onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${pharmacy.phoneNumber}`;
                      }}>
                        Call
                      </button>
                      {onSelectPharmacy && (
                        <button className="btn-order" onClick={(e) => {
                          e.stopPropagation();
                          handleOrderFromPharmacy(pharmacy);
                        }}>
                          Order Medicines
                        </button>
                      )}
                    </div>
                  </div>
                );
              }).filter(Boolean) // Remove null entries
            ) : (
              <div className="no-pharmacies">
                <p>No pharmacies with registered locations found.</p>
                <small>Pharmacies must capture their location during registration.</small>
              </div>
            )}
            {pharmacies.length > 0 && pharmacies.every(p => !p.latitude || !p.longitude) && (
              <div className="no-pharmacies">
                <p>No pharmacies with registered locations yet.</p>
                <small>Existing pharmacies need to update their profiles with location information.</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
