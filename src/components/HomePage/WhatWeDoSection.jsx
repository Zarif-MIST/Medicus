import React from 'react';
import './Styles/WhatWeDoSection.css';

function WhatWeDoSection() {
  return (
    <section className="what-we-do-section">
      <div className="what-we-do-container">
        <div className="what-we-do-left">
          <h2 className="what-we-do-title">What do we Do?</h2>
        </div>
        
        <div className="what-we-do-right">
          <div className="wave-background">
            <div className="content-overlay">
              <p className="what-we-do-description">
                We Provide a comprehensive<br />
                one-stop, error-free solution for<br />
                Medicine Prescribing System.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatWeDoSection;
