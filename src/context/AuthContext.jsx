import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("medicus_user");
    const savedToken = localStorage.getItem("medicus_token");
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("medicus_user");
      }
    }
    
    if (savedToken) {
      setToken(savedToken);
    }
    
    setInitializing(false);
  }, []);

  const login = (username, role) => {
    const userData = {
      username,
      role,
      loginTime: new Date().toISOString(),
    };
    setUser(userData);
    localStorage.setItem("medicus_user", JSON.stringify(userData));
  };

  const setAuthToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("medicus_token", newToken);
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
    <AuthContext.Provider value={{ user, token, login, setAuthToken, logout, initializing }}>
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

