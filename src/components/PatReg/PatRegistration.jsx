// src/components/RegisterSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../PatReg/styles/RegisterSection.css';

export default function RegisterSection() {
  const navigate = useNavigate();
  return (
    <section className="register-section">
      <div className="register-container">
        {/* Left Side - Info Card */}
        <div className="info-card">
          <div className="user-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="7" r="4" />
              <path d="M4.5 20.118a7.5 7.5 0 0115 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>

          <h2 className="info-title">Complete your profile to access all features</h2>

          <ul className="features-list">
            <li>
              <strong>Secure & Private</strong>
              <br />
              Your information is encrypted and protected
            </li>
            <li>
              <strong>Quick Setup</strong>
              <br />
              Get started in less than 2 minutes
            </li>
            <li>
              <strong>24/7 Support</strong>
              <br />
              Our team is here to help you anytime
            </li>
          </ul>
        </div>

        {/* Right Side - Form */}
        <div className="form-card">
          <form className="register-form" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <input type="text" placeholder="Full name" required />
            <input type="email" placeholder="Email" required />
            <input type="tel" placeholder="Phone number" />
            <input type="date" placeholder="Date of birth" />
            <input type="text" placeholder="Pharmacy License Number" />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />

            <label className="checkbox-label">
              <input type="checkbox" required />
              <span className="checkmark"></span>
              I agree to the Terms of Service and Privacy Policy
            </label>

            <button type="submit" className="register-button">
              Register
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}