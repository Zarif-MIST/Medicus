const configuredApiUrl = (process.env.REACT_APP_API_URL || '').trim();
const API_BASE_URL = configuredApiUrl
  ? configuredApiUrl
      .replace(/^https?:\/\/https?:\/\//i, 'https://')
      .replace(/\/+$/, '')
  : '/api';

const parseApiJson = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const bodyText = await response.text();

  if (!bodyText) {
    return {};
  }

  if (!contentType.includes('application/json')) {
    throw new Error('API is unreachable or misconfigured. Please ensure backend is deployed and REACT_APP_API_URL is correct.');
  }

  try {
    return JSON.parse(bodyText);
  } catch (error) {
    throw new Error('Received invalid response from API. Please try again.');
  }
};

const callApi = async (path, options = {}) => {
  const { method = 'GET', body, headers = {}, token } = options;

  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error('Unable to reach API server. Check REACT_APP_API_URL and backend CORS_ORIGIN settings.');
  }

  const data = await parseApiJson(response);
  return { response, data };
};

export const apiService = {
  doctorRegister: async (doctorData) => {
    const { data } = await callApi('/doctors/register', { method: 'POST', body: doctorData });
    return data;
  },

  doctorLogin: async (identifier, password) => {
    const { data } = await callApi('/doctors/login', { method: 'POST', body: { identifier, password } });
    return data;
  },

  doctorAdminLogin: async () => {
    const { data } = await callApi('/doctors/admin-login', { method: 'POST', body: { username: 'admin', password: 'admin' } });
    return data;
  },

  patientRegister: async (patientData) => {
    const { data } = await callApi('/patients/register', { method: 'POST', body: patientData });
    return data;
  },

  patientLogin: async (identifier, password) => {
    const { data } = await callApi('/patients/login', { method: 'POST', body: { identifier, password } });
    return data;
  },

  patientAdminLogin: async () => {
    const { data } = await callApi('/patients/admin-login', { method: 'POST', body: { username: 'admin', password: 'admin' } });
    return data;
  },

  pharmacyRegister: async (pharmacyData) => {
    const { data } = await callApi('/pharmacies/register', { method: 'POST', body: pharmacyData });
    return data;
  },

  pharmacyLogin: async (identifier, password) => {
    const { data } = await callApi('/pharmacies/login', { method: 'POST', body: { identifier, password } });
    return data;
  },

  pharmacyAdminLogin: async () => {
    const { data } = await callApi('/pharmacies/admin-login', { method: 'POST', body: { username: 'admin', password: 'admin' } });
    return data;
  },

  getPatientById: async (patientId) => {
    const { response, data } = await callApi(`/patients/${patientId}`);
    if (!response.ok) throw new Error(data.message || 'Failed to fetch patient');
    return data;
  },

  createPrescription: async (prescriptionData) => {
    const { response, data } = await callApi('/prescriptions/create', { method: 'POST', body: prescriptionData });
    if (!response.ok) throw new Error(data.message || 'Failed to create prescription');
    return data;
  },

  getPrescriptionsByPatient: async (patientId, options = {}) => {
    const params = new URLSearchParams();
    if (options.forPharmacy) params.set('forPharmacy', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';

    const { response, data } = await callApi(`/prescriptions/patient/${patientId}${query}`);
    if (response.status === 404) {
      return { message: data.message || 'No prescriptions found for this patient', prescriptions: [] };
    }
    if (!response.ok) throw new Error(data.message || 'Failed to fetch prescriptions');
    return data;
  },

  getPrescriptionById: async (prescriptionId) => {
    const { response, data } = await callApi(`/prescriptions/${prescriptionId}`);
    if (!response.ok) throw new Error(data.message || 'Failed to fetch prescription');
    return data;
  },

  getDoctorPrescriptionHistory: async (doctorId, patientId = '') => {
    const params = new URLSearchParams();
    if (patientId) params.set('patientId', patientId);
    const query = params.toString() ? `?${params.toString()}` : '';

    const { response, data } = await callApi(`/prescriptions/doctor/${doctorId}/history${query}`);
    if (!response.ok) throw new Error(data.message || 'Failed to fetch doctor prescription history');
    return data;
  },

  updatePrescriptionStatus: async (prescriptionId, status) => {
    const { response, data } = await callApi(`/prescriptions/${prescriptionId}/status`, { method: 'PATCH', body: { status } });
    if (!response.ok) throw new Error(data.message || 'Failed to update prescription status');
    return data;
  },

  markPrescriptionDispensedByPharmacy: async (prescriptionId) => {
    const { response, data } = await callApi(`/prescriptions/${prescriptionId}/pharmacy-dispensed`, { method: 'PATCH' });
    if (!response.ok) throw new Error(data.message || 'Failed to mark prescription as dispensed');
    return data;
  },

  dispensePrescriptionMedicine: async (prescriptionId, medicineIndex, pharmacyId) => {
    const { response, data } = await callApi(`/prescriptions/${prescriptionId}/dispense-medicine`, {
      method: 'PATCH',
      body: { medicineIndex, pharmacyId },
    });
    if (!response.ok) throw new Error(data.message || 'Failed to mark medicine as dispensed');
    return data;
  },

  updateMedicineQuantity: async (medicineId, quantity, action) => {
    const { response, data } = await callApi(`/inventory/${medicineId}/quantity`, {
      method: 'PATCH',
      body: { quantity, action },
    });
    if (!response.ok) throw new Error(data.message || 'Failed to update medicine quantity');
    return data;
  },

  addMedicineToInventory: async (medicineData) => {
    const token = localStorage.getItem('medicus_token');
    const { response, data } = await callApi('/inventory/add', {
      method: 'POST',
      body: medicineData,
      token,
    });
    if (!response.ok) throw new Error(data.message || 'Failed to add medicine to inventory');
    return data;
  },

  getPharmacyInventory: async (pharmacyId) => {
    const { response, data } = await callApi(`/inventory/pharmacy/${pharmacyId}`);
    if (!response.ok) throw new Error(data.message || 'Failed to fetch pharmacy inventory');
    return data;
  },

  searchMedicine: async (medicineName) => {
    const { response, data } = await callApi(`/inventory/search/${medicineName}`);
    if (!response.ok) throw new Error(data.message || 'Failed to search medicine');
    return data;
  },

  getAllPharmacies: async () => {
    const { response, data } = await callApi('/pharmacies');
    if (!response.ok) throw new Error(data.message || 'Failed to fetch pharmacies');
    return data;
  },

  addFavoritePharmacy: async (patientId, pharmacyId) => {
    const { response, data } = await callApi('/favorites/add', { method: 'POST', body: { patientId, pharmacyId } });
    if (!response.ok) throw new Error(data.message || 'Failed to add favorite pharmacy');
    return data;
  },

  removeFavoritePharmacy: async (favoriteId) => {
    const { response, data } = await callApi(`/favorites/${favoriteId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(data.message || 'Failed to remove favorite pharmacy');
    return data;
  },

  getFavoritePharmacies: async (patientId) => {
    const { response, data } = await callApi(`/favorites/patient/${patientId}`);
    if (!response.ok) throw new Error(data.message || 'Failed to fetch favorite pharmacies');
    return data;
  },

  checkFavoritePharmacy: async (patientId, pharmacyId) => {
    const { response, data } = await callApi(`/favorites/check/${patientId}/${pharmacyId}`);
    if (!response.ok) throw new Error(data.message || 'Failed to check favorite');
    return data;
  },

  ratePharmacy: async (favoriteId, rating) => {
    const { response, data } = await callApi(`/favorites/${favoriteId}/rate`, { method: 'PATCH', body: { rating } });
    if (!response.ok) throw new Error(data.message || 'Failed to rate pharmacy');
    return data;
  },

  createMedicineOrder: async (orderData) => {
    const { response, data } = await callApi('/orders/create', { method: 'POST', body: orderData });
    if (!response.ok) throw new Error(data.message || 'Failed to create order');
    return data;
  },

  getPatientOrders: async (patientId) => {
    const { response, data } = await callApi(`/orders/patient/${patientId}`);
    if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
    return data;
  },

  getPharmacyOrders: async (pharmacyId) => {
    const { response, data } = await callApi(`/orders/pharmacy/${pharmacyId}`);
    if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
    return data;
  },

  getOrderById: async (orderId) => {
    const { response, data } = await callApi(`/orders/${orderId}`);
    if (!response.ok) throw new Error(data.message || 'Failed to fetch order');
    return data;
  },

  updateOrderStatus: async (orderId, status) => {
    const { response, data } = await callApi(`/orders/${orderId}/status`, { method: 'PATCH', body: { status } });
    if (!response.ok) throw new Error(data.message || 'Failed to update order status');
    return data;
  },

  cancelOrder: async (orderId) => {
    const { response, data } = await callApi(`/orders/${orderId}/cancel`, { method: 'PATCH' });
    if (!response.ok) throw new Error(data.message || 'Failed to cancel order');
    return data;
  },

  initiatePayment: async (paymentData) => {
    const { response, data } = await callApi('/payments/initiate', { method: 'POST', body: paymentData });
    if (!response.ok) throw new Error(data.message || 'Failed to initiate payment');
    return data;
  },

  getPaymentById: async (paymentId) => {
    const { response, data } = await callApi(`/payments/${paymentId}`);
    if (!response.ok) throw new Error(data.message || 'Failed to fetch payment');
    return data;
  },

  getPaymentsByOrder: async (orderId) => {
    const { response, data } = await callApi(`/payments/order/${orderId}`);
    if (!response.ok) throw new Error(data.message || 'Failed to fetch payments');
    return data;
  },

  getPaymentsByPatient: async (patientId) => {
    const { response, data } = await callApi(`/payments/patient/${patientId}`);
    if (!response.ok) throw new Error(data.message || 'Failed to fetch payments');
    return data;
  },

  refundPayment: async (paymentId) => {
    const { response, data } = await callApi(`/payments/${paymentId}/refund`, { method: 'POST' });
    if (!response.ok) throw new Error(data.message || 'Failed to refund payment');
    return data;
  },
};
