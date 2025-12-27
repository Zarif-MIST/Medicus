import React, { useState } from "react";
import Navbar from "../Navbar";            // adjust path if needed
import "./Doctorstyle.css";

const roles = ["Doctor", "Pharmacy", "Patient"];

export default function DoctorLoginPage() {
  const [selectedRole, setSelectedRole] = useState("Patient");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ selectedRole, username, password });
  };

  return (
    <div className="login-root">
      <Navbar />

      <main className="login-main">
        <section className="login-card">
          {/* Left red panel */}
          <div className="login-left">
            <h1 className="login-brand">Medicus</h1>

            <p className="login-left-text">
              Comprehensive healthcare management system connecting doctors,
              pharmacists, and patients.
            </p>

            <div className="login-bullets">
              <div className="login-bullet">
                <p className="bullet-title">For Doctors</p>
                <p className="bullet-body">
                  Manage patients, appointments, and prescriptions
                </p>
              </div>
              <div className="login-bullet">
                <p className="bullet-title">For Pharmacists</p>
                <p className="bullet-body">
                  Process prescriptions and manage inventory
                </p>
              </div>
              <div className="login-bullet">
                <p className="bullet-title">For Patients</p>
                <p className="bullet-body">
                  Access medical records and prescriptions
                </p>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="login-right">
            <header className="login-right-header">
              <p className="welcome-small">Welcome,</p>
              <p className="welcome-main">Please, select your role:</p>
            </header>

            {/* role buttons */}
            <div className="role-row">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={
                    "role-card" +
                    (selectedRole === role ? " role-card-active" : "")
                  }
                >
                  <span className="role-icon">
                    {role === "Doctor" && <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.3333 3.33301V6.66634" stroke="white" stroke-opacity="0.8" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.33331 3.33301V6.66634" stroke="white" stroke-opacity="0.8" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.33331 5H6.66665C5.78259 5 4.93474 5.35119 4.30962 5.97631C3.6845 6.60143 3.33331 7.44928 3.33331 8.33333V15C3.33331 17.6522 4.38688 20.1957 6.26225 22.0711C8.13761 23.9464 10.6811 25 13.3333 25C15.9855 25 18.529 23.9464 20.4044 22.0711C22.2797 20.1957 23.3333 17.6522 23.3333 15V8.33333C23.3333 7.44928 22.9821 6.60143 22.357 5.97631C21.7319 5.35119 20.884 5 20 5H18.3333" stroke="white" stroke-opacity="0.8" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.3333 25C13.3333 27.6522 14.3869 30.1957 16.2622 32.0711C18.1376 33.9464 20.6811 35 23.3333 35C25.9855 35 28.529 33.9464 30.4044 32.0711C32.2797 30.1957 33.3333 27.6522 33.3333 25V20" stroke="white" stroke-opacity="0.8" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M33.3333 19.9997C35.1743 19.9997 36.6667 18.5073 36.6667 16.6663C36.6667 14.8254 35.1743 13.333 33.3333 13.333C31.4924 13.333 30 14.8254 30 16.6663C30 18.5073 31.4924 19.9997 33.3333 19.9997Z" stroke="white" stroke-opacity="0.8" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
}
                    {role === "Pharmacy"}
                    {role === "Patient" && "👤"}
                  </span>
                  <span className="role-label">{role}</span>
                </button>
              ))}
            </div>

            {/* form */}
            <form className="login-form" onSubmit={handleSubmit}>
              <label className="form-field">
                <span className="field-label">User Name</span>
                <input
                  type="text"
                  placeholder="Doctor_ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>

              <label className="form-field">
                <span className="field-label">Password</span>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <div className="forgot-row">
                <a href="#forgot">Forgot your password?</a>
              </div>

              <button type="submit" className="signin-btn">
                Sign In
              </button>

              <p className="signup-text">
                New User? <a href="#signup">Signup</a>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
