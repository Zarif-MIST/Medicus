import React, { createContext, useState, useContext, useEffect } from "react";
import { apiService } from "../services/apiService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("medicus_token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("medicus_user");
    const savedToken = localStorage.getItem("medicus_token");
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error("Failed to parse saved data:", error);
        localStorage.removeItem("medicus_user");
        localStorage.removeItem("medicus_token");
      }
    }
    setInitializing(false);
  }, []);

  // Doctor Register
  const doctorRegister = async (doctorData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.doctorRegister(doctorData);
      if (response.token) {
        localStorage.setItem("medicus_token", response.token);
        localStorage.setItem(
          "medicus_user",
          JSON.stringify({ ...response.doctor, role: "doctor" })
        );
        localStorage.setItem("medicus_role", "doctor");
        setToken(response.token);
        setUser({ ...response.doctor, role: "doctor" });
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Doctor Login
  const doctorLogin = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.doctorLogin(identifier, password);
      if (response.token) {
        localStorage.setItem("medicus_token", response.token);
        localStorage.setItem(
          "medicus_user",
          JSON.stringify({ ...response.doctor, role: "doctor" })
        );
        localStorage.setItem("medicus_role", "doctor");
        setToken(response.token);
        setUser({ ...response.doctor, role: "doctor" });
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Patient Register
  const patientRegister = async (patientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.patientRegister(patientData);
      if (response.token) {
        localStorage.setItem("medicus_token", response.token);
        localStorage.setItem(
          "medicus_user",
          JSON.stringify({ ...response.patient, role: "patient" })
        );
        localStorage.setItem("medicus_role", "patient");
        setToken(response.token);
        setUser({ ...response.patient, role: "patient" });
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Patient Login
  const patientLogin = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.patientLogin(identifier, password);
      if (response.token) {
        localStorage.setItem("medicus_token", response.token);
        localStorage.setItem(
          "medicus_user",
          JSON.stringify({ ...response.patient, role: "patient" })
        );
        localStorage.setItem("medicus_role", "patient");
        setToken(response.token);
        setUser({ ...response.patient, role: "patient" });
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Pharmacy Register
  const pharmacyRegister = async (pharmacyData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.pharmacyRegister(pharmacyData);
      if (response.token) {
        localStorage.setItem("medicus_token", response.token);
        localStorage.setItem(
          "medicus_user",
          JSON.stringify({ ...response.pharmacy, role: "pharmacy" })
        );
        localStorage.setItem("medicus_role", "pharmacy");
        setToken(response.token);
        setUser({ ...response.pharmacy, role: "pharmacy" });
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Pharmacy Login
  const pharmacyLogin = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.pharmacyLogin(identifier, password);
      if (response.token) {
        localStorage.setItem("medicus_token", response.token);
        localStorage.setItem(
          "medicus_user",
          JSON.stringify({ ...response.pharmacy, role: "pharmacy" })
        );
        localStorage.setItem("medicus_role", "pharmacy");
        setToken(response.token);
        setUser({ ...response.pharmacy, role: "pharmacy" });
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin Login (works for all roles)
  const adminLogin = async (role) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (role === "doctor") {
        response = await apiService.doctorAdminLogin();
      } else if (role === "patient") {
        response = await apiService.patientAdminLogin();
      } else if (role === "pharmacy") {
        response = await apiService.pharmacyAdminLogin();
      }

      if (response.token) {
        localStorage.setItem("medicus_token", response.token);
        localStorage.setItem("medicus_user", JSON.stringify(response.user));
        localStorage.setItem("medicus_role", `${role}_admin`);
        setToken(response.token);
        setUser({ ...response.user, role: `${role}_admin` });
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("medicus_user");
    localStorage.removeItem("medicus_token");
    localStorage.removeItem("medicus_role");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        initializing,
        doctorRegister,
        doctorLogin,
        patientRegister,
        patientLogin,
        pharmacyRegister,
        pharmacyLogin,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}