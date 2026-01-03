import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Doctorstyle.css";

export default function RegistrationPage() {
  const navigate = useNavigate();

  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    license: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreed) {
      alert("Please agree to the terms and conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password must match");
      return;
    }

    console.log({ ...formData, agreed });

    // ✅ Route to doctor login page
    navigate("/login/doctor");
  };

  return (
    <div className="registration-page-wrapper">
      <main className="registration-main-content">
        <div className="registration-form-container">
          {/* Left Panel - Info */}
          <div className="registration-left-panel">
            <div className="registration-icon">
              <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 12.3529C0 5.53309 5.53309 0 12.3529 0H24.7059C29.261 0 32.9412 3.68015 32.9412 8.23529C32.9412 12.7904 29.261 16.4706 24.7059 16.4706H16.4706V49.4118C16.4706 63.0515 27.5368 74.1176 41.1765 74.1176C54.8162 74.1176 65.8824 63.0515 65.8824 49.4118V16.4706H57.6471C53.0919 16.4706 49.4118 12.7904 49.4118 8.23529C49.4118 3.68015 53.0919 0 57.6471 0H70C76.8199 0 82.3529 5.53309 82.3529 12.3529V49.4118C82.3529 69.3309 68.1985 85.9559 49.4118 89.7647V94.7059C49.4118 110.636 62.3051 123.529 78.2353 123.529C94.1654 123.529 107.059 110.636 107.059 94.7059V72.7022C97.4596 69.3051 90.5882 60.1691 90.5882 49.4118C90.5882 35.7721 101.654 24.7059 115.294 24.7059C128.934 24.7059 140 35.7721 140 49.4118C140 60.1691 133.129 69.3309 123.529 72.7022V94.7059C123.529 119.721 103.25 140 78.2353 140C53.2206 140 32.9412 119.721 32.9412 94.7059V89.7647C14.1544 85.9559 0 69.3309 0 49.4118V12.3529ZM115.294 57.6471C119.849 57.6471 123.529 53.9669 123.529 49.4118C123.529 44.8566 119.849 41.1765 115.294 41.1765C110.739 41.1765 107.059 44.8566 107.059 49.4118C107.059 53.9669 110.739 57.6471 115.294 57.6471Z" fill="#FFF8F0"/>
              </svg>
            </div>

            <h2 className="registration-heading">Complete your profile to access all features</h2>

            <div className="registration-features-list">
              <div className="registration-feature-item">
                <span className="feature-bullet">•</span>
                <div>
                  <h3>Secure & Private</h3>
                  <p>Your information is encrypted and protected</p>
                </div>
              </div>

              <div className="registration-feature-item">
                <span className="feature-bullet">•</span>
                <div>
                  <h3>Quick Setup</h3>
                  <p>Get started in less than 2 minutes</p>
                </div>
              </div>

              <div className="registration-feature-item">
                <span className="feature-bullet">•</span>
                <div>
                  <h3>24/7 Support</h3>
                  <p>Our team is here to help you anytime</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="registration-right-panel">
            <form className="registration-form" onSubmit={handleSubmit}>
              <input type="text" name="fullName" placeholder="Full name" className="registration-input"
                value={formData.fullName} onChange={handleChange} required />

              <input type="email" name="email" placeholder="Email" className="registration-input"
                value={formData.email} onChange={handleChange} required />

              <input type="tel" name="phone" placeholder="Phone number" className="registration-input"
                value={formData.phone} onChange={handleChange} required />

              <input type="text" name="dob" placeholder="Date of birth" className="registration-input"
                value={formData.dob} onChange={handleChange} required />

              <input type="text" name="license" placeholder="BMDC License Number" className="registration-input"
                value={formData.license} onChange={handleChange} required />

              <input type="password" name="password" placeholder="Password" className="registration-input"
                value={formData.password} onChange={handleChange} required />

              <input type="password" name="confirmPassword" placeholder="Confirm Password" className="registration-input"
                value={formData.confirmPassword} onChange={handleChange} required />

              <div className="registration-checkbox">
                <input id="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <label htmlFor="terms">
                  I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
                </label>
              </div>

              <button type="submit" className="registration-submit-btn">Register</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
