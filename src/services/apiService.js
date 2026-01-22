// Use relative URLs so CRA proxy routes to backend at http://localhost:5001
const API_BASE_URL = '/api';

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
    const data = await response.json();
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

  getPrescriptionsByPatient: async (patientId) => {
    const response = await fetch(`${API_BASE_URL}/prescriptions/patient/${patientId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
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
};
