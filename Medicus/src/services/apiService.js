// In production set REACT_APP_API_URL to your deployed backend (e.g. https://your-backend.vercel.app/api)
// In local development keep it empty to use CRA proxy via /api.
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const parseApiJson = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const bodyText = await response.text();

  if (!bodyText) {
    return {};
  }

  if (!contentType.includes('application/json')) {
    throw new Error('API is unreachable or misconfigured. Please ensure backend is running and proxy is correct.');
  }

  try {
    return JSON.parse(bodyText);
  } catch (error) {
    throw new Error('Received invalid response from API. Please try again.');
  }
};

export const apiService = {
  // Doctor APIs
  doctorRegister: async (doctorData) => {
    const response = await fetch(`${API_BASE_URL}/doctors/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData),
    });
    return response.json();
  },

  doctorLogin: async (identifier, password) => {
    const response = await fetch(`${API_BASE_URL}/doctors/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return response.json();
  },

  doctorAdminLogin: async () => {
    const response = await fetch(`${API_BASE_URL}/doctors/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' }),
    });
    return response.json();
  },

  // Patient APIs
  patientRegister: async (patientData) => {
    const response = await fetch(`${API_BASE_URL}/patients/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    return response.json();
  },

  patientLogin: async (identifier, password) => {
    const response = await fetch(`${API_BASE_URL}/patients/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return response.json();
  },

  patientAdminLogin: async () => {
    const response = await fetch(`${API_BASE_URL}/patients/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' }),
    });
    return response.json();
  },

  // Pharmacy APIs
  pharmacyRegister: async (pharmacyData) => {
    const response = await fetch(`${API_BASE_URL}/pharmacies/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pharmacyData),
    });
    return response.json();
  },

  pharmacyLogin: async (identifier, password) => {
    const response = await fetch(`${API_BASE_URL}/pharmacies/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return response.json();
  },

  pharmacyAdminLogin: async () => {
    const response = await fetch(`${API_BASE_URL}/pharmacies/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' }),
    });
    return response.json();
  },

  // Patient lookup (for doctors)
  getPatientById: async (patientId) => {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await parseApiJson(response);
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch patient');
    }
    return data;
  },

  // Prescription APIs
  createPrescription: async (prescriptionData) => {
    const response = await fetch(`${API_BASE_URL}/prescriptions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prescriptionData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create prescription');
    }
    return data;
  },

  getPrescriptionsByPatient: async (patientId, options = {}) => {
    const params = new URLSearchParams();
    if (options.forPharmacy) {
      params.set('forPharmacy', 'true');
    }
    const query = params.toString() ? `?${params.toString()}` : '';

    const response = await fetch(`${API_BASE_URL}/prescriptions/patient/${patientId}${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await parseApiJson(response);
    if (response.status === 404) {
      return { message: data.message || 'No prescriptions found for this patient', prescriptions: [] };
    }
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch prescriptions');
    }
    return data;
  },

  getPrescriptionById: async (prescriptionId) => {
    const response = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  getDoctorPrescriptionHistory: async (doctorId, patientId = '') => {
    const params = new URLSearchParams();
    if (patientId) {
      params.set('patientId', patientId);
    }
    const query = params.toString() ? `?${params.toString()}` : '';

    const response = await fetch(`${API_BASE_URL}/prescriptions/doctor/${doctorId}/history${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await parseApiJson(response);
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch doctor prescription history');
    }
    return data;
  },

  updatePrescriptionStatus: async (prescriptionId, status) => {
    const response = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update prescription status');
    }
    return data;
  },

  markPrescriptionDispensedByPharmacy: async (prescriptionId) => {
    const response = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}/pharmacy-dispensed`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark prescription as dispensed');
    }
    return data;
  },

  dispensePrescriptionMedicine: async (prescriptionId, medicineIndex, pharmacyId) => {
    const response = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}/dispense-medicine`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicineIndex, pharmacyId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark medicine as dispensed');
    }
    return data;
  },

  // Inventory APIs
  updateMedicineQuantity: async (medicineId, quantity, action) => {
    const response = await fetch(`${API_BASE_URL}/inventory/${medicineId}/quantity`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity, action }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update medicine quantity');
    }
    return data;
  },

  addMedicineToInventory: async (medicineData) => {
    const token = localStorage.getItem('medicus_token');
    const response = await fetch(`${API_BASE_URL}/inventory/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(medicineData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add medicine to inventory');
    }
    return data;
  },

  getPharmacyInventory: async (pharmacyId) => {
    const response = await fetch(`${API_BASE_URL}/inventory/pharmacy/${pharmacyId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  searchMedicine: async (medicineName) => {
    const response = await fetch(`${API_BASE_URL}/inventory/search/${medicineName}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  // Get all pharmacies (for pharmacy locator)
  getAllPharmacies: async () => {
    const response = await fetch(`${API_BASE_URL}/pharmacies`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch pharmacies');
    }
    return data;
  },

  // Favorite Pharmacy APIs
  addFavoritePharmacy: async (patientId, pharmacyId) => {
    const response = await fetch(`${API_BASE_URL}/favorites/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, pharmacyId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add favorite pharmacy');
    }
    return data;
  },

  removeFavoritePharmacy: async (favoriteId) => {
    const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove favorite pharmacy');
    }
    return data;
  },

  getFavoritePharmacies: async (patientId) => {
    const response = await fetch(`${API_BASE_URL}/favorites/patient/${patientId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch favorite pharmacies');
    }
    return data;
  },

  checkFavoritePharmacy: async (patientId, pharmacyId) => {
    const response = await fetch(`${API_BASE_URL}/favorites/check/${patientId}/${pharmacyId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check favorite');
    }
    return data;
  },

  ratePharmacy: async (favoriteId, rating) => {
    const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to rate pharmacy');
    }
    return data;
  },

  // Medicine Order APIs
  createMedicineOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }
    return data;
  },

  getPatientOrders: async (patientId) => {
    const response = await fetch(`${API_BASE_URL}/orders/patient/${patientId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }
    return data;
  },

  getPharmacyOrders: async (pharmacyId) => {
    const response = await fetch(`${API_BASE_URL}/orders/pharmacy/${pharmacyId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }
    return data;
  },

  getOrderById: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order');
    }
    return data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update order status');
    }
    return data;
  },

  cancelOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel order');
    }
    return data;
  },

  // Payment APIs
  initiatePayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to initiate payment');
    }
    return data;
  },

  getPaymentById: async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch payment');
    }
    return data;
  },

  getPaymentsByOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/payments/order/${orderId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch payments');
    }
    return data;
  },

  getPaymentsByPatient: async (patientId) => {
    const response = await fetch(`${API_BASE_URL}/payments/patient/${patientId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch payments');
    }
    return data;
  },

  refundPayment: async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to refund payment');
    }
    return data;
  },
};

