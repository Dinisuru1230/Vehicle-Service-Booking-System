import React from 'react';
import { Car, Phone } from 'lucide-react';

const Navbar = ({
  activeTab = 'book',
  onNavigateHome,
  onNavigateBook,
  onNavigateBookings,
  onNavigateAbout,
  onNavigateProfile,
  onNavigateLogin,
  onNavigateRegister,
}) => {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand Lockup */}
        <div
          className="header-brand"
          onClick={onNavigateHome}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-icon-box">
            <Car size={20} className="brand-car-icon" />
          </div>
          <span className="brand-title">ApexDrive</span>
        </div>

        {/* Navigation Links */}
        <nav className="header-nav">
          <button
            type="button"
            onClick={onNavigateHome}
            className={`nav-item nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={onNavigateBook}
            className={`nav-item nav-btn ${activeTab === 'book' ? 'active' : ''}`}
          >
            Book Service
          </button>
          <button
            type="button"
            onClick={onNavigateBookings}
            className={`nav-item nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          >
            My Bookings
          </button>
          <button
            type="button"
            onClick={onNavigateAbout}
            className={`nav-item nav-btn ${activeTab === 'about' ? 'active' : ''}`}
          >
            About Us
          </button>
        </nav>

        {/* Right Section: Support & Profile */}
        <div className="header-right">
          <a href="tel:1-800-APEX-CAR" className="header-phone-link">
            <Phone size={16} className="phone-icon" />
            <span>1-800-APEX-CAR</span>
          </a>

          <div
            className="header-profile"
            onClick={onNavigateProfile || onNavigateLogin}
            title="Account & Garage Profile"
          >
            <div className="avatar-circle">
              <span>MV</span>
            </div>
            <span className="profile-name">Marcus Vance</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
