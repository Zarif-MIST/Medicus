import React, { useState } from 'react';
import './pharmareg.css'; // We'll define the styles in a separate CSS file
import { Link } from "react-router-dom";

function Pharmacy() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [license, setLicense] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  
  return (
    <div className="container">

      <div className="main-content">
        <div className="left-panel">
          <div className="pill-icon">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M56.3955 57.7285L91.9582 93.2958L57.8475 127.407C52.935 132.315 46.5007 134.773 40.0665 134.773C33.6322 134.773 27.198 132.315 22.2855 127.407C12.4605 117.586 12.4605 101.66 22.2855 91.8393L56.3955 57.7285Z" fill="#92140C" stroke="#92140C" stroke-width="0.78125"/>
<path d="M124.05 25.6345C132.577 34.162 132.577 48.037 124.05 56.5645L91.9573 88.657L61.0273 57.727L93.1198 25.6345C97.2448 21.502 102.742 19.2295 108.585 19.2295C114.427 19.2295 119.917 21.502 124.05 25.6345ZM116.175 31.8895C116.76 30.1795 115.845 28.312 114.135 27.727C110.413 26.4495 106.392 26.3267 102.6 27.3745C101.907 27.5638 101.296 27.9753 100.859 28.5457C100.423 29.1161 100.186 29.8139 100.185 30.532C100.185 30.817 100.222 31.1095 100.305 31.402C100.777 33.1495 102.585 34.177 104.332 33.697C106.875 32.9995 109.53 33.082 112.005 33.9295C112.357 34.0495 112.717 34.1095 113.07 34.1095C114.472 34.1095 115.717 33.217 116.175 31.8895ZM93.9598 41.677C94.2647 41.373 94.5066 41.0117 94.6716 40.6141C94.8367 40.2164 94.9216 39.7901 94.9216 39.3595C94.9216 38.9289 94.8367 38.5026 94.6716 38.1049C94.5066 37.7072 94.2647 37.346 93.9598 37.042C92.6848 35.767 90.6073 35.767 89.3248 37.042L75.5398 50.827C75.0815 51.2859 74.7694 51.8704 74.6429 52.5066C74.5164 53.1428 74.5812 53.8022 74.8291 54.4016C75.0771 55.0009 75.497 55.5134 76.036 55.8744C76.5749 56.2353 77.2087 56.4285 77.8573 56.4295C78.7273 56.4295 79.5598 56.0845 80.1748 55.4695L93.9598 41.677Z" fill="#FFF8F0" stroke="#92140C" stroke-width="0.78125"/>
<path d="M128.685 20.9998C139.77 32.0848 139.77 50.1223 128.685 61.1998L60.1649 129.727C54.7874 135.09 47.6549 138.052 40.0649 138.052C32.4824 138.052 25.3424 135.097 19.9649 129.727C14.5949 124.357 11.6399 117.217 11.6399 109.62C11.6399 102.03 14.5949 94.8898 19.9649 89.5198L88.4849 20.9998C93.8474 15.6298 100.987 12.6748 108.585 12.6748C116.182 12.6748 123.315 15.6298 128.685 20.9998ZM124.05 56.5648C132.577 48.0373 132.577 34.1623 124.05 25.6348C119.917 21.5023 114.427 19.2298 108.585 19.2298C102.742 19.2298 97.2449 21.5023 93.1199 25.6348L61.0274 57.7273L91.9574 88.6573L124.05 56.5648ZM55.5299 125.085L87.3224 93.2923L56.3924 62.3623L24.5999 94.1548C20.4674 98.2873 18.1949 103.777 18.1949 109.62C18.1949 115.462 20.4674 120.96 24.5999 125.085C28.7399 129.217 34.2299 131.497 40.0649 131.497C45.8999 131.497 51.3974 129.217 55.5299 125.085Z" fill="#FFF8F0" stroke="#92140C" stroke-width="0.78125"/>
<path d="M114.135 27.7273C115.845 28.3123 116.76 30.1798 116.175 31.8898C115.953 32.5371 115.534 33.099 114.978 33.4969C114.421 33.8949 113.754 34.1092 113.07 34.1098C112.717 34.1098 112.357 34.0498 112.005 33.9298C109.53 33.0823 106.875 32.9998 104.332 33.6973C102.585 34.1773 100.777 33.1498 100.305 31.4023C100.222 31.1098 100.185 30.8173 100.185 30.5323C100.185 29.0923 101.145 27.7723 102.6 27.3748C106.417 26.3248 110.4 26.4523 114.135 27.7273ZM93.9598 37.0423C94.2647 37.3464 94.5066 37.7076 94.6716 38.1053C94.8367 38.5029 94.9216 38.9293 94.9216 39.3598C94.9216 39.7904 94.8367 40.2167 94.6716 40.6144C94.5066 41.0121 94.2647 41.3733 93.9598 41.6773L80.1748 55.4698C79.5598 56.0848 78.7273 56.4298 77.8573 56.4298C77.2087 56.4288 76.5749 56.2356 76.0359 55.8747C75.497 55.5138 75.0771 55.0013 74.8291 54.4019C74.5812 53.8025 74.5164 53.1431 74.6429 52.5069C74.7693 51.8707 75.0815 51.2863 75.5398 50.8273L89.3248 37.0423C90.6073 35.7673 92.6848 35.7673 93.9598 37.0423Z" fill="#92140C" stroke="#92140C" stroke-width="0.78125"/>
</svg>

          </div>
          <h2>Complete your profile to access all features</h2>
          <ul className="benefits">
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

        <div className="right-panel">
          <form className="register-form">
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="Date of birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Pharmacy License Number"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <label className="terms">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
            <Link to="/pharmacydash" style={{color: 'inherit', textDecoration: 'none'}}>
            <button type="submit" className="register-btn">
              Register
              
            </button>
              </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Pharmacy;