import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Doctorlogin.css";
import { useAuth } from "../../context/AuthContext";

const roles = ["Doctor", "Pharmacy", "Patient"];

export default function DoctorLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState("Patient");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    // Save user to auth context and localStorage
    login(username, selectedRole);

    console.log({ selectedRole, username, password });

    // ✅ route based on role
    if (selectedRole === "Doctor") navigate("/doctor/dashboard");
    else if (selectedRole === "Pharmacy") navigate("/pharmacy/dashboard");
    else navigate("/dashboard"); // patient dashboard (your existing route)
  };

  const goToSignup = (e) => {
    e.preventDefault();

    // ✅ signup route based on role
    if (selectedRole === "Doctor") navigate("/register/doctor");
    else if (selectedRole === "Pharmacy") navigate("/register/pharmacy");
    else navigate("/register/patient");
  };

  return (
    <div className="login-root">
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
                    "role-card" + (selectedRole === role ? " role-card-active" : "")
                  }
                >
                  <span className="role-icon">
                    {role === "Doctor" && (
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.3333 3.33301V6.66634" stroke="white" strokeOpacity="0.8" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.33331 3.33301V6.66634" stroke="white" strokeOpacity="0.8" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.33331 5H6.66665C5.78259 5 4.93474 5.35119 4.30962 5.97631C3.6845 6.60143 3.33331 7.44928 3.33331 8.33333V15C3.33331 17.6522 4.38688 20.1957 6.26225 22.0711C8.13761 23.9464 10.6811 25 13.3333 25C15.9855 25 18.529 23.9464 20.4044 22.0711C22.2797 20.1957 23.3333 17.6522 23.3333 15V8.33333C23.3333 7.44928 22.9821 6.60143 22.357 5.97631C21.7319 5.35119 20.884 5 20 5H18.3333" stroke="white" strokeOpacity="0.8" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.3333 25C13.3333 27.6522 14.3869 30.1957 16.2622 32.0711C18.1376 33.9464 20.6811 35 23.3333 35C25.9855 35 28.529 33.9464 30.4044 32.0711C32.2797 30.1957 33.3333 27.6522 33.3333 25V20" stroke="white" strokeOpacity="0.8" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M33.3333 19.9997C35.1743 19.9997 36.6667 18.5073 36.6667 16.6663C36.6667 14.8254 35.1743 13.333 33.3333 13.333C31.4924 13.333 30 14.8254 30 16.6663C30 18.5073 31.4924 19.9997 33.3333 19.9997Z" stroke="white" strokeOpacity="0.8" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}

                    {/* ✅ FIX: role name is "Pharmacy" not "pharmacy" */}
                    {role === "Pharmacy" && (
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 34.1663L34.1666 17.4997C34.9454 16.7365 35.5652 15.8264 35.9901 14.8222C36.415 13.818 36.6366 12.7395 36.6421 11.6491C36.6476 10.5587 36.4369 9.47801 36.0222 8.46954C35.6075 7.46108 34.9969 6.54483 34.2259 5.77379C33.4548 5.00275 32.5386 4.39221 31.5301 3.97747C30.5217 3.56273 29.441 3.35202 28.3506 3.35753C27.2602 3.36303 26.1817 3.58465 25.1775 4.00955C24.1732 4.43446 23.2632 5.05422 22.5 5.83301L5.83332 22.4997C5.05453 23.2629 4.43476 24.1729 4.00986 25.1771C3.58495 26.1814 3.36334 27.2599 3.35783 28.3503C3.35233 29.4407 3.56303 30.5214 3.97777 31.5298C4.39251 32.5383 5.00305 33.4545 5.7741 34.2256C6.54514 34.9966 7.46138 35.6072 8.46985 36.0219C9.47831 36.4366 10.559 36.6473 11.6494 36.6418C12.7398 36.6363 13.8183 36.4147 14.8225 35.9898C15.8267 35.5649 16.7368 34.9451 17.5 34.1663Z" stroke="white" strokeOpacity="0.8" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.1667 14.167L25.8334 25.8337" stroke="white" strokeOpacity="0.8" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}

                    {role === "Patient" && (
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M31.6667 35V31.6667C31.6667 29.8986 30.9643 28.2029 29.7141 26.9526C28.4638 25.7024 26.7682 25 25 25H15C13.2319 25 11.5362 25.7024 10.286 26.9526C9.03575 28.2029 8.33337 29.8986 8.33337 31.6667V35" stroke="white" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 18.3333C23.6819 18.3333 26.6667 15.3486 26.6667 11.6667C26.6667 7.98477 23.6819 5 20 5C16.3181 5 13.3334 7.98477 13.3334 11.6667C13.3334 15.3486 16.3181 18.3333 20 18.3333Z" stroke="white" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>

                  <span className="role-label">{role}</span>
                </button>
              ))}
            </div>

             {/* form */}
            <form className="login-form" onSubmit={handleSubmit}>
              {error && <div className="login-error">{error}</div>}

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
                <a href="#forgot" onClick={(e) => e.preventDefault()}>
                  Forgot your password?
                </a>
              </div>

              {/* ✅ Sign In routes to dashboard */}
              <button type="submit" className="signin-btn">
                Sign In
              </button>

              {/* ✅ Signup routes to registration */}
              <p className="signup-text">
                New User?{" "}
                <button
                  type="button"
                  className="signup-link-btn"
                  onClick={goToSignup}
                >
                  Signup
                </button>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
