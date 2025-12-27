// src/components/FeaturesSection.jsx
import React from 'react';
import '../HomePage/Styles/FeaturesSection.css'; // We'll create this CSS file next

export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 8.92857C0 4.29688 2.90441 0.491072 6.61765 0.044643V0H32.3529C37.2243 0 41.1765 4.79911 41.1765 10.7143V30.3571H25C21.3419 30.3571 18.3824 33.9509 18.3824 38.3929V45.0893C18.3824 47.8013 16.5717 50 14.3382 50C12.1048 50 10.2941 47.8013 10.2941 45.0893V19.6429H4.41176C1.9761 19.6429 0 17.2433 0 14.2857V8.92857ZM21.7647 50C22.4173 48.5379 22.7941 46.8638 22.7941 45.0893V38.3929C22.7941 36.9085 23.7776 35.7143 25 35.7143H47.7941C49.0165 35.7143 50 36.9085 50 38.3929V41.0714C50 46.0045 46.7096 50 42.6471 50H21.7647ZM7.35294 5.35714C5.7261 5.35714 4.41176 6.95312 4.41176 8.92857V14.2857H10.2941V8.92857C10.2941 6.95312 8.97978 5.35714 7.35294 5.35714Z" fill="#FFF8F0"/>
</svg>

      ),
      title: 'Error-Free Prescriptions',
      description: 'Digital prescriptions eliminate handwriting errors',
    },
    {
      icon: (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M40.627 20.3095C40.627 24.7913 39.1718 28.9313 36.7205 32.2902L49.0844 44.6614C50.3052 45.882 50.3052 47.8641 49.0844 49.0846C47.8637 50.3051 45.8811 50.3051 44.6604 49.0846L32.2965 36.7134C28.937 39.1642 24.7961 40.619 20.3135 40.619C9.09224 40.619 0 31.5286 0 20.3095C0 9.09046 9.09224 0 20.3135 0C31.5347 0 40.627 9.09046 40.627 20.3095ZM20.3135 34.37C28.0775 34.37 34.3767 28.0721 34.3767 20.3095C34.3767 12.547 28.0775 6.24908 20.3135 6.24908C12.5494 6.24908 6.25031 12.547 6.25031 20.3095C6.25031 28.0721 12.5494 34.37 20.3135 34.37Z" fill="#FFF8F0"/>
</svg>

      ),
      title: 'Patient ID Search',
      description: 'Secure patient data access via unique ID',
    },
    {
      icon: (
       <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 10H17V5H12V10ZM7 3.75C7 1.67969 8.67969 0 10.75 0H18.25C20.3203 0 22 1.67969 22 3.75V11.25C22 13.3203 20.3203 15 18.25 15H10.75C8.67969 15 7 13.3203 7 11.25V3.75ZM12 30H17V25H12V30ZM7 23.75C7 21.6797 8.67969 20 10.75 20H18.25C20.3203 20 22 21.6797 22 23.75V31.25C22 33.3203 20.3203 35 18.25 35H10.75C8.67969 35 7 33.3203 7 31.25V23.75ZM32 5V10H37V5H32ZM30.75 0H38.25C40.3203 0 42 1.67969 42 3.75V11.25C42 13.3203 40.3203 15 38.25 15H30.75C28.6797 15 27 13.3203 27 11.25V3.75C27 1.67969 28.6797 0 30.75 0ZM29.5 25C28.1172 25 27 23.8828 27 22.5C27 21.1172 28.1172 20 29.5 20C30.8828 20 32 21.1172 32 22.5C32 23.8828 30.8828 25 29.5 25ZM29.5 30C30.8828 30 32 31.1172 32 32.5C32 33.8828 30.8828 35 29.5 35C28.1172 35 27 33.8828 27 32.5C27 31.1172 28.1172 30 29.5 30ZM37 32.5C37 31.1172 38.1172 30 39.5 30C40.8828 30 42 31.1172 42 32.5C42 33.8828 40.8828 35 39.5 35C38.1172 35 37 33.8828 37 32.5ZM39.5 25C38.1172 25 37 23.8828 37 22.5C37 21.1172 38.1172 20 39.5 20C40.8828 20 42 21.1172 42 22.5C42 23.8828 40.8828 25 39.5 25ZM37 27.5C37 28.8828 35.8828 30 34.5 30C33.1172 30 32 28.8828 32 27.5C32 26.1172 33.1172 25 34.5 25C35.8828 25 37 26.1172 37 27.5Z" fill="#FFF8F0"/>
</svg>

      ),
      title: 'QR Verification',
      description: 'Prevent fraud with unique QR codes',
    },
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="features-title">
          The Most <span className="highlight">Trusted</span> Healthcare Platform
        </h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}