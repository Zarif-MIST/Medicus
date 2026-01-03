import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Doctordash.css";
import { useAuth } from "../../context/AuthContext";

export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patientId, setPatientId] = useState("");

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user || user.role !== "Doctor") {
      navigate("/login/doctor");
    }
  }, [user, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    const id = patientId.trim();
    if (!id) return;
    navigate(`/doctor/diagnosis/${encodeURIComponent(id)}`);
  };

  const handlePatientSearch = () => {
    navigate("/doctor/search");
  };

  const handleRecentPrescriptions = () => {
    navigate("/doctor/recent-prescriptions");
  };

  

  if (!user) {
    return null; // Will redirect automatically
  }

  return (
    <div className="dash-root">
      <main className="dash-main">
        {/* HERO BANNER */}
        <section className="dash-hero">
          <svg width="103" height="103" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 9.08824C0 4.07077 4.07077 0 9.08824 0H18.1765C21.5278 0 24.2353 2.70754 24.2353 6.05882C24.2353 9.41011 21.5278 12.1176 18.1765 12.1176H12.1176V36.3529C12.1176 46.3879 20.2592 54.5294 30.2941 54.5294C40.329 54.5294 48.4706 46.3879 48.4706 36.3529V12.1176H42.4118C39.0605 12.1176 36.3529 9.41011 36.3529 6.05882C36.3529 2.70754 39.0605 0 42.4118 0H51.5C56.5175 0 60.5882 4.07077 60.5882 9.08824V36.3529C60.5882 51.0077 50.1746 63.239 36.3529 66.0412V69.6765C36.3529 81.3965 45.8388 90.8824 57.5588 90.8824C69.2789 90.8824 78.7647 81.3965 78.7647 69.6765V53.4881C71.7024 50.9888 66.6471 44.2673 66.6471 36.3529C66.6471 26.318 74.7886 18.1765 84.8235 18.1765C94.8585 18.1765 103 26.318 103 36.3529C103 44.2673 97.9447 51.0077 90.8824 53.4881V69.6765C90.8824 88.0801 75.9625 103 57.5588 103C39.1551 103 24.2353 88.0801 24.2353 69.6765V66.0412C10.4136 63.239 0 51.0077 0 36.3529V9.08824ZM84.8235 42.4118C88.1748 42.4118 90.8824 39.7042 90.8824 36.3529C90.8824 33.0017 88.1748 30.2941 84.8235 30.2941C81.4722 30.2941 78.7647 33.0017 78.7647 36.3529C78.7647 39.7042 81.4722 42.4118 84.8235 42.4118Z" fill="#FFF8F0"/>
</svg>

          <div className="dash-hero-text">
            <h1>Welcome Back, Dr. {user.username}</h1>
            <p>Access patient data, create diagnoses, and manage prescriptions</p>
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <div className="dash-actions">
          <button className="dash-action-card" onClick={handlePatientSearch}>
            <span className="action-icon">🔍</span>
            <span>Patient Search</span>
          </button>
          <button className="dash-action-card" onClick={handleRecentPrescriptions}>
            <span className="action-icon">📋</span>
            <span>Recent Prescriptions</span>
          </button>
         
        </div>

        {/* PATIENT LOOKUP */}
        <section className="lookup-section">
          <div className="lookup-header">
            <div className="lookup-title-row">
              <span className="lookup-big-icon">🔍</span>
              <div>
                <h2>Patient Lookup</h2>
                <p>Enter Patient ID to access medical records</p>
              </div>
            </div>
          </div>

          <form className="lookup-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="lookup-input"
            />
            <button type="submit" className="lookup-button">
              <span className="lookup-btn-icon">🔍</span>
              <span>Search</span>
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}