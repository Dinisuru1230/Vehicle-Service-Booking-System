import React from 'react';
import { Car } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="landing-footer">
      <div className="footer-container">
        {/* Top 4-Column Grid */}
        <div className="footer-columns-grid">
          {/* Column 1: Brand & Mission */}
          <div className="footer-brand-column">
            <div className="footer-brand-lockup">
              <div className="footer-logo-box">
                <Car size={18} className="footer-car-icon" />
              </div>
              <span className="footer-brand-title">ApexDrive Hub</span>
            </div>
            <p className="footer-brand-desc">
              Next-generation vehicle service scheduling, precision diagnostics, and telemetry-guided maintenance. Engineered for automotive reliability and operational transparency.
            </p>
          </div>

          {/* Column 2: Service Categories */}
          <div className="footer-links-column">
            <h4 className="footer-col-heading">SERVICE CATEGORIES</h4>
            <ul className="footer-links-list">
              <li><a href="#services">Diagnostic Scan &amp; DTC</a></li>
              <li><a href="#services">Factory Scheduled Service</a></li>
              <li><a href="#services">Brake System &amp; Fluid Flush</a></li>
              <li><a href="#services">EV Battery &amp; Telemetry</a></li>
              <li><a href="#services">Tire, Alignment &amp; Chassis</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Portal */}
          <div className="footer-links-column">
            <h4 className="footer-col-heading">CUSTOMER PORTAL</h4>
            <ul className="footer-links-list">
              <li><a href="#track">Real-Time Track Booking</a></li>
              <li><a href="#centers">Find Service Centers</a></li>
              <li><a href="#packages">Maintenance Packages</a></li>
              <li><a href="#warranty">Warranty &amp; Service Guarantee</a></li>
              <li><a href="#account">Client Account Portal</a></li>
            </ul>
          </div>

          {/* Column 4: Service Hours */}
          <div className="footer-hours-column">
            <h4 className="footer-col-heading">SERVICE HOURS</h4>
            <div className="hours-block">
              <div className="hours-row">
                <span className="days-label">Mon - Fri:</span>
                <span className="time-val">06:30 AM – 08:00 PM EST</span>
              </div>
              <div className="hours-row">
                <span className="days-label">Saturday:</span>
                <span className="time-val">07:30 AM – 06:00 PM EST</span>
              </div>
              <div className="hours-row">
                <span className="days-label">Sunday:</span>
                <span className="time-val emergency">Emergency Roadside Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="footer-bottom-bar">
          <span className="copyright-text">
            &copy; 2025 ApexDrive Service Technologies, Inc. All rights reserved.
          </span>
          <div className="legal-links-group">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#compliance">OEM Compliance</a>
            <a href="#status">System Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
