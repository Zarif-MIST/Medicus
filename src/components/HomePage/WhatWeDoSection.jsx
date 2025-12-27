// src/components/WhatWeDoSection.jsx
import React from 'react';
import '../HomePage/Styles/WhatWeDoSection.css'; // We'll create this CSS file next

export default function WhatWeDoSection() {
  return (
    <section className="what-we-do-section">
      <div className="what-we-do-container">
        <h2 className="section-title">What do we Do?</h2>

        <div className="content-wrapper">
          <h3 className="main-heading">
            We Provide a comprehensive<br />
            one-stop, error-free solution<br />
            for Medicine Prescribing<br />
            System.
          </h3>
        </div>
      </div>
    </section>
  );
}