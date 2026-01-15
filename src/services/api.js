const API_URL = 'http://localhost:5000/api';

/**
 * Register a new doctor
 */
export const registerDoctor = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register/doctor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 */
export const loginUser = async (username, password, role) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get doctor profile
 */
export const getDoctorProfile = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/doctor/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get patient by ID
 */
export const getPatient = async (patientId) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/patient/${patientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch patient');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new patient
 */
export const createPatient = async (patientData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(patientData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create patient');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get patient prescription history
 */
export const getPatientHistory = async (patientId) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/patient/${patientId}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch patient history');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get recent prescriptions for logged-in doctor
 */
export const getRecentPrescriptions = async (limit = 10) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/prescription/recent?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch prescriptions');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new prescription
 */
export const createPrescription = async (prescriptionData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/prescription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(prescriptionData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create prescription');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update prescription status
 */
export const updatePrescriptionStatus = async (prescriptionId, status) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/prescription/${prescriptionId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update prescription status');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
