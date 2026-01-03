import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [doctor, setDoctor] = useState(() => {
    // persist login (best practice for your level)
    const saved = localStorage.getItem("doctor_auth");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (doctor) localStorage.setItem("doctor_auth", JSON.stringify(doctor));
    else localStorage.removeItem("doctor_auth");
  }, [doctor]);

  const loginDoctor = (payload) => {
    // payload example: { username, role }
    setDoctor(payload);
  };

  const logoutDoctor = () => setDoctor(null);

  const value = useMemo(
    () => ({ doctor, loginDoctor, logoutDoctor }),
    [doctor]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
