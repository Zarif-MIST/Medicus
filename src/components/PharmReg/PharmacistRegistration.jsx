import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/PharmacistRegister.css';

export default function PharmacistRegistration() {
  const navigate = useNavigate();

  return (
    <section className="register-section">
      <div className="register-container">
        <div className="info-card">
          <div className="user-icon">
            <svg width="120" height="120" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M56.3955 57.7283L91.9582 93.2955L57.8475 127.406C52.935 132.314 46.5007 134.773 40.0665 134.773C33.6322 134.773 27.198 132.314 22.2855 127.406C12.4605 117.586 12.4605 101.66 22.2855 91.839L56.3955 57.7283Z" fill="#FFF8F0" stroke="#FFF8F0" strokeWidth="0.78125" />
              <path d="M124.05 25.635C132.577 34.1625 132.577 48.0375 124.05 56.565L91.9575 88.6575L61.0275 57.7275L93.12 25.635C97.245 21.5025 102.743 19.23 108.585 19.23C114.428 19.23 119.917 21.5025 124.05 25.635Z" fill="#92140C" stroke="#92140C" strokeWidth="0.78125" />
              <path d="M128.685 21C139.77 32.085 139.77 50.1225 128.685 61.2L60.165 129.728C54.7875 135.09 47.655 138.053 40.065 138.053C32.4825 138.053 25.3425 135.098 19.965 129.728C14.595 124.358 11.64 117.218 11.64 109.62C11.64 102.03 14.595 94.8901 19.965 89.5201L88.485 21C93.8475 15.63 100.988 12.675 108.585 12.675C116.183 12.675 123.315 15.63 128.685 21Z" stroke="#FFF8F0" strokeWidth="0.78125" />
              <path d="M55.53 125.085L87.3225 93.2925L56.3925 62.3625L24.6 94.155C20.4675 98.2875 18.195 103.778 18.195 109.62C18.195 115.463 20.4675 120.96 24.6 125.085C28.74 129.218 34.23 131.498 40.065 131.498C45.9 131.498 51.3975 129.218 55.53 125.085Z" fill="#FFF8F0" stroke="#FFF8F0" strokeWidth="0.78125" />
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

        <div className="form-card">
          <form
            className="register-form"
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/pharmacy-dashboard');
            }}
          >
            <input type="text" placeholder="Full name" required />
            <input type="email" placeholder="Email" required />
            <input type="tel" placeholder="Phone number" />
            <input type="text" placeholder="Pharmacy name" />
            <input type="text" placeholder="Pharmacy license number" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm password" required />

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
