import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FileText,
  Award,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Headphones,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  MessageSquare,
  Building2,
  Truck,
  Sparkles,
} from 'lucide-react';

const AboutUsPage = ({
  onNavigateHome,
  onNavigateBook,
  onNavigateBookings,
  onNavigateAbout,
  onNavigateLogin,
  onNavigateRegister,
}) => {
  return (
    <div className="about-us-page-root">
      {/* 1. Global Navbar with 'About Us' active */}
      <Navbar
        activeTab="about"
        onNavigateHome={onNavigateHome}
        onNavigateBook={onNavigateBook}
        onNavigateBookings={onNavigateBookings}
        onNavigateAbout={onNavigateAbout}
        onNavigateLogin={onNavigateLogin}
        onNavigateRegister={onNavigateRegister}
      />

      <main className="about-us-main-container">
        {/* ========================================================
            HERO SECTION: Engineered for Precision. Driven by Trust.
            ======================================================== */}
        <section className="about-hero-section">
          {/* Eyebrow Pill */}
          <div className="about-badge-pill">
            <span className="pill-dot"></span>
            <span>ABOUT APEXDRIVE</span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="about-hero-heading">
            Engineered for Precision.{' '}
            <span className="text-blue">Driven by Trust.</span>
          </h1>

          {/* Subtitle description */}
          <p className="about-hero-desc">
            Founded on clinical lab precision and radical transparency, ApexDrive pairs certified master technicians with dealership-exceeding diagnostics. We ensure every calibration is completely verifiable and stress-free.
          </p>

          {/* 3 Key Stats Cards Row */}
          <div className="about-stats-row">
            {/* Stat 1 */}
            <div className="about-stat-card">
              <span className="about-stat-num text-blue">45,000+</span>
              <span className="about-stat-title">Vehicles Serviced</span>
              <span className="about-stat-subtitle">Calibrated to factory spec</span>
            </div>

            {/* Stat 2 */}
            <div className="about-stat-card">
              <span className="about-stat-num text-green">99.4%</span>
              <span className="about-stat-title">First-Time Fix</span>
              <span className="about-stat-subtitle">Diagnostic accuracy rate</span>
            </div>

            {/* Stat 3 */}
            <div className="about-stat-card">
              <span className="about-stat-num text-dark">8 Bays</span>
              <span className="about-stat-title">Master Diagnostic Bays</span>
              <span className="about-stat-subtitle">Active staging &amp; telemetry</span>
            </div>
          </div>
        </section>

        {/* ========================================================
            STANDARDS SECTION: Core Operating Principles
            ======================================================== */}
        <section className="about-standards-section">
          <div className="section-header-center">
            <span className="section-eyebrow text-blue">OUR STANDARDS</span>
            <h2 className="section-title">Core Operating Principles</h2>
            <p className="section-subtitle">
              Simple, honest vehicle care backed by verifiable digital telemetry.
            </p>
          </div>

          <div className="about-principles-grid">
            {/* Principle Card 1 */}
            <div className="about-principle-card">
              <div className="principle-icon-box">
                <FileText size={22} className="text-blue" />
              </div>
              <h3 className="principle-title">Transparent Pricing</h3>
              <p className="principle-desc">
                Complete quote clarity before work begins. Live status updates, multi-point digital inspection logs, and zero unexpected add-ons.
              </p>
            </div>

            {/* Principle Card 2 */}
            <div className="about-principle-card">
              <div className="principle-icon-box">
                <Award size={22} className="text-blue" />
              </div>
              <h3 className="principle-title">Certified Master Techs</h3>
              <p className="principle-desc">
                Every technician holds ASE Master and OEM certifications across high-performance, European, EV, and hybrid powertrains.
              </p>
            </div>

            {/* Principle Card 3 */}
            <div className="about-principle-card">
              <div className="principle-icon-box">
                <ShieldCheck size={22} className="text-blue" />
              </div>
              <h3 className="principle-title">OEM Parts Guarantee</h3>
              <p className="principle-desc">
                Factory-original components backed by our nationwide 24-month, 24,000-mile parts and mechanical labor warranty.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            TEAM SECTION: Engineering Leadership
            ======================================================== */}
        <section className="about-team-section">
          <div className="section-header-center">
            <span className="section-eyebrow text-blue">OUR TEAM</span>
            <h2 className="section-title">Engineering Leadership</h2>
            <p className="section-subtitle">
              Seasoned professionals responsible for diagnostic accuracy and service delivery.
            </p>
          </div>

          <div className="about-team-grid">
            {/* Team Member 1 */}
            <div className="about-team-card">
              <div className="team-avatar-wrapper">
                <img
                  src="/marcus_vance.jpg"
                  alt="Marcus Vance"
                  className="team-avatar-img"
                />
              </div>
              <h3 className="team-member-name">Marcus Vance</h3>
              <span className="team-member-role">FOUNDER &amp; MASTER TECH</span>
              <p className="team-member-bio">
                18+ years in precision vehicle diagnostics and high-performance calibration.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="about-team-card">
              <div className="team-avatar-wrapper">
                <img
                  src="/elena_rostova.jpg"
                  alt="Elena Rostova"
                  className="team-avatar-img"
                />
              </div>
              <h3 className="team-member-name">Elena Rostova</h3>
              <span className="team-member-role">CHIEF SYSTEMS ENGINEER</span>
              <p className="team-member-bio">
                Laser geometry, suspension kinematics, and dynamic chassis balancing.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="about-team-card">
              <div className="team-avatar-wrapper">
                <img
                  src="/sam_rivera.jpg"
                  alt="Sam Rivera"
                  className="team-avatar-img"
                />
              </div>
              <h3 className="team-member-name">Sam Rivera</h3>
              <span className="team-member-role">EV SYSTEMS SPECIALIST</span>
              <p className="team-member-bio">
                High-voltage battery architecture, regenerative drive, and power electronics.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            HUBS SECTION: Flagship Service Center & Hubs
            ======================================================== */}
        <section className="about-hubs-section">
          <div className="section-header-center">
            <div className="about-badge-pill">
              <span className="pill-dot"></span>
              <span>VISIT OUR FACILITIES</span>
            </div>
            <h2 className="section-title">Flagship Service Center &amp; Hubs</h2>
            <p className="section-subtitle">
              Conveniently located for rapid intake, same-day diagnostics, and complimentary concierge pickup.
            </p>
          </div>

          <div className="about-hubs-grid">
            {/* Hub Card 1 */}
            <div className="about-hub-card">
              <div className="hub-top-row">
                <span className="hub-eyebrow text-blue">PRIMARY DIAGNOSTICS &amp; BAY 01–08</span>
                <div className="hub-icon-box">
                  <Building2 size={18} className="text-blue" />
                </div>
              </div>

              <h3 className="hub-title">Apex Metro Flagship Hub</h3>

              <div className="hub-details-list">
                <div className="hub-detail-item">
                  <MapPin size={16} className="detail-icon" />
                  <span className="detail-text">
                    742 Performance Way, Automotive District, CA 90210
                  </span>
                </div>

                <div className="hub-detail-item">
                  <Clock size={16} className="detail-icon" />
                  <div className="detail-text">
                    <div>Mon - Fri: 06:30 AM - 08:00 PM</div>
                    <div>Sat: 07:30 AM - 06:00 PM</div>
                  </div>
                </div>

                <div className="hub-detail-item">
                  <Phone size={16} className="detail-icon" />
                  <span className="detail-text">
                    1-800-APEX-CAR / (555) 019-2834
                  </span>
                </div>

                <div className="hub-detail-item">
                  <Mail size={16} className="detail-icon" />
                  <span className="detail-text">service@apexdrive.com</span>
                </div>
              </div>

              <div className="hub-action-buttons">
                <button
                  type="button"
                  onClick={() => window.open('https://maps.google.com', '_blank')}
                  className="btn-hub-primary"
                >
                  <Navigation size={15} />
                  <span>Get Directions</span>
                </button>

                <a href="tel:1-800-APEX-CAR" className="btn-hub-secondary">
                  <PhoneCall size={15} />
                  <span>Call Bay</span>
                </a>
              </div>
            </div>

            {/* Hub Card 2 */}
            <div className="about-hub-card">
              <div className="hub-top-row">
                <span className="hub-eyebrow text-blue">RAPID DROP-OFF &amp; MOBILE FLEET</span>
                <div className="hub-icon-box">
                  <Truck size={18} className="text-blue" />
                </div>
              </div>

              <h3 className="hub-title">Westside Express Intake &amp; Valet</h3>

              <div className="hub-details-list">
                <div className="hub-detail-item">
                  <MapPin size={16} className="detail-icon" />
                  <span className="detail-text">
                    1284 Innovation Blvd, West Industrial Park, CA 90404
                  </span>
                </div>

                <div className="hub-detail-item">
                  <Clock size={16} className="detail-icon" />
                  <div className="detail-text">
                    <div>Mon - Sat: 07:00 AM - 07:00 PM</div>
                  </div>
                </div>

                <div className="hub-detail-item">
                  <Phone size={16} className="detail-icon" />
                  <span className="detail-text">(555) 019-5820</span>
                </div>

                <div className="hub-detail-item">
                  <Mail size={16} className="detail-icon" />
                  <span className="detail-text">westside@apexdrive.com</span>
                </div>
              </div>

              <div className="hub-action-buttons">
                <button
                  type="button"
                  onClick={() => window.open('https://maps.google.com', '_blank')}
                  className="btn-hub-primary"
                >
                  <Navigation size={15} />
                  <span>Get Directions</span>
                </button>

                <button
                  type="button"
                  onClick={onNavigateBook}
                  className="btn-hub-secondary"
                >
                  <Clock size={15} />
                  <span>Schedule Valet</span>
                </button>
              </div>
            </div>

            {/* Hub Card 3 */}
            <div className="about-hub-card">
              <div className="hub-top-row">
                <span className="hub-eyebrow text-green">ALWAYS ACTIVE</span>
                <div className="hub-icon-box">
                  <Headphones size={18} className="text-blue" />
                </div>
              </div>

              <h3 className="hub-title">24/7 Dispatch &amp; Support</h3>

              <div className="hub-details-list">
                <div className="hub-detail-item">
                  <span className="hub-asterisk text-blue">*</span>
                  <div className="detail-text">
                    <strong className="text-dark">1-800-APEX-CAR</strong>
                    <div className="sub-caption">24/7 Roadside &amp; Towing Priority</div>
                  </div>
                </div>

                <div className="hub-detail-item">
                  <MessageSquare size={16} className="detail-icon" />
                  <div className="detail-text">
                    <strong className="text-dark">(555) 019-HELP</strong>
                    <div className="sub-caption">WhatsApp Support &amp; Direct SMS</div>
                  </div>
                </div>

                <div className="hub-detail-item">
                  <Mail size={16} className="detail-icon" />
                  <span className="detail-text">support@apexdrive.com</span>
                </div>
              </div>

              {/* Callout Box */}
              <div className="hub-callout-box">
                <CheckCircle2 size={16} className="callout-check-icon text-green" />
                <span className="callout-text">
                  Guaranteed 15-minute response for active service customers.
                </span>
              </div>

              {/* Emergency Dispatch Button */}
              <div className="hub-action-buttons">
                <a
                  href="tel:1-800-APEX-CAR"
                  className="btn-hub-primary full-width"
                >
                  <PhoneCall size={15} />
                  <span>Call Emergency Dispatch</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            CTA BANNER: Ready to experience precision maintenance?
            ======================================================== */}
        <section className="about-cta-banner">
          <div className="cta-banner-content">
            <h3 className="cta-banner-title">
              Ready to experience precision maintenance?
            </h3>
            <p className="cta-banner-subtitle">
              Book your inspection or service appointment in under 60 seconds.
            </p>
          </div>

          <div className="cta-banner-buttons-group">
            <button
              type="button"
              onClick={onNavigateBook}
              className="btn-cta-blue"
            >
              <span>Book a Service</span>
              <ArrowRight size={16} />
            </button>

            <a href="tel:1-800-APEX-CAR" className="btn-cta-dark">
              <Phone size={15} />
              <span>1-800-APEX-CAR</span>
            </a>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
