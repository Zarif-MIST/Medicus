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
