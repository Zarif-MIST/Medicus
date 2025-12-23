import "./Navbar.css";
import logo from "../assets/Try.svg";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Left: Logo */}
        <div className="logo">
          <img src={logo} alt="MedicUS Logo" />
        </div>

        {/* Right: Links + Button (GROUPED) */}
        <div className="nav-right">
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#doctors">Doctors</a></li>
            <li><a href="#pharmacy">Pharmacy</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <button className="nav-btn">Get Started</button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
