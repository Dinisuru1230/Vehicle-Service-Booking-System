import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QuickDispatcher from '../components/QuickDispatcher';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const serviceCatalog = [
  {
    id: 1,
    serviceCode: 'SVC-101',
    title: 'Periodic Maintenance Service',
    category: 'Maintenance',
    badge: '40-POINT INSPECTION',
    badgeClass: 'badge-inspection',
    estTime: 'Est. 90 Mins',
    price: 89,
    image: '/periodic_maintenance.jpg',
    description:
      'Full synthetic oil exchange, multipoint safety telemetry, micro-cabin & engine filter upgrades, brake fluid testing, and electronic tire pressure reset.',
    tags: ['Castrol Edge Pro', 'Bosch Filters', 'Battery Check'],
  },
  {
    id: 2,
    serviceCode: 'SVC-102',
    title: 'Brake System Repair & Pad Replacement',
    category: 'Brakes & Chassis',
    badge: 'SAFETY CRITICAL',
    badgeClass: 'badge-safety',
    estTime: 'Est. 120 Mins',
    price: 149,
    image: '/brake_service.jpg',
    description:
      'Precision rotor micro-lathe resurfacing, low-dust ceramic compound pad installation, complete hydraulic brake line pressure bleed, and caliper lubrication.',
    tags: ['Brembo / Akebono', 'DOT 4 Synthetic', 'Rotor Gauge'],
  },
  {
    id: 3,
    serviceCode: 'SVC-103',
    title: 'Engine Diagnostics & ECU Tuning',
    category: 'Engine & ECU',
    badge: 'LEVEL-3 TELEMETRY',
    badgeClass: 'badge-telemetry',
    estTime: 'Est. 60 Mins',
    price: 79,
    image: '/ecu_tuning.jpg',
    description:
      'Deep fault code extraction across all CAN-bus networks, live fuel trim & O2 sensor evaluation, spark plug check, and factory firmware ECU calibration.',
    tags: ['DTC Scan', 'Fuel Trim Maps', 'Live Data Log'],
  },
  {
    id: 4,
    serviceCode: 'SVC-104',
    title: 'Climate Control & AC Overhaul',
    category: 'Maintenance',
    badge: 'CLIMATE PRECISION',
    badgeClass: 'badge-climate',
    estTime: 'Est. 75 Mins',
    price: 99,
    image: '/ac_climate.jpg',
    description:
      'High-vacuum evacuation, condenser leak dye testing, R134a or R1234yf precision recharge, antibacterial evaporator ultrasonic fogging treatment.',
    tags: ['UV Leak Dye', 'PAG Oil Refill', 'HEPA Filter'],
  },
  {
    id: 5,
    serviceCode: 'SVC-105',
    title: 'Suspension, Steering & Alignment',
    category: 'Brakes & Chassis',
    badge: '3D LASER ALIGNMENT',
    badgeClass: 'badge-alignment',
    estTime: 'Est. 45 Mins',
    price: 69,
    image: '/wheel_alignment.jpg',
    description:
      'High-accuracy camera sensors for camber, caster, and toe-in geometry, electronic steering angle sensor recalibration, and tie rod stress checks.',
    tags: ['Hunter Engineering', 'Camber/Toe', 'Ball Joints'],
  },
  {
    id: 6,
    serviceCode: 'SVC-106',
    title: 'Battery Health Test & Replacement',
    category: 'Electrical',
    badge: 'COLD CRANK TEST',
    badgeClass: 'badge-battery',
    estTime: 'Est. 40 Mins',
    price: 119,
    image: '/battery_health.jpg',
    description:
      'Full load conductance measurement, starting amperage evaluation, terminal anti-corrosion barrier seal, alternator diode ripple test, and BMS reset.',
    tags: ['Optima / Varta AGM', 'BMS Recoded', '3-Yr Free Replace'],
  },
];

const testimonials = [
  {
    id: 1,
    quote:
      'The video inspection clip they texted me pinpointed an uneven brake rotor wobble before it damaged my caliper. Pricing was exact to the cent of the online quote.',
    author: 'Marcus Vance',
    vehicle: 'BMW M3 Competition • 60k Service',
    initials: 'MV',
    avatarColor: 'avatar-blue',
  },
  {
    id: 2,
    quote:
      'ApexDrive picked up my Audi from my office in Midtown, resolved a stubborn check engine DTC (P0420) and returned it washed by 4:30 PM. Utterly seamless.',
    author: 'Sarah Lin',
    vehicle: 'Audi Q7 Quattro • Valet Service',
    initials: 'SL',
    avatarColor: 'avatar-yellow',
  },
  {
    id: 3,
    quote:
      'Finding a shop that genuinely understands EV telemetry, coolant loops, and AGM auxiliary batteries without dealer markups is rare. ApexDrive is the standard.',
    author: 'Devon Kessler',
    vehicle: 'Tesla Model S • High Voltage Diagnostic',
    initials: 'DK',
    avatarColor: 'avatar-gray',
  },
];

const LandingPage = ({
  onNavigateHome,
  onNavigateBook,
  onNavigateBookings,
  onNavigateAbout,
  onNavigateProfile,
  onNavigateAdmin,
  onNavigateLogin,
  onNavigateRegister,
}) => {
  const [activeCategory, setActiveCategory] = useState('All Services');
  const [modalService, setModalService] = useState(null);

  const categories = [
    'All Services',
    'Maintenance',
    'Engine & ECU',
    'Brakes & Chassis',
    'Electrical',
  ];

  const filteredServices =
    activeCategory === 'All Services'
      ? serviceCatalog
      : serviceCatalog.filter((s) => s.category === activeCategory);

  const handleBookService = (service) => {
    if (onNavigateBook) {
      onNavigateBook(service);
    }
  };

  return (
    <div className="landing-page-root">
      {/* 1. Global Navbar */}
      <Navbar
        activeTab="home"
        onNavigateHome={onNavigateHome}
        onNavigateBook={onNavigateBook}
        onNavigateBookings={onNavigateBookings}
        onNavigateAbout={onNavigateAbout}
        onNavigateProfile={onNavigateProfile}
        onNavigateAdmin={onNavigateAdmin}
        onNavigateLogin={onNavigateLogin}
        onNavigateRegister={onNavigateRegister}
      />

      <main className="landing-main-content">
        {/* 2. Hero Section */}
        <section className="landing-hero-section" id="home">
          <div className="hero-content-wrap">
            {/* Top Pill Badge */}
            <div className="hero-top-badge">
              <span className="green-dot"></span>
              <span>CERTIFIED MASTER TECHNICIANS • SAME-DAY DIAGNOSTICS</span>
            </div>

            {/* Headline */}
            <h1 className="hero-main-heading">
              Precision Care &amp; Routine Maintenance for Every Vehicle
            </h1>

            {/* Subtitle */}
            <p className="hero-main-subtitle">
              Transparent pricing, instant online slot booking, real-time bay tracking, and manufacturer-grade OEM parts guaranteed.
            </p>

            {/* Quick Service Dispatcher Widget */}
            <QuickDispatcher onBookClick={handleBookService} />

            {/* 4 Key Stats Metrics Row */}
            <div className="stats-row-grid">
              <div className="stat-card">
                <span className="stat-metric metric-blue">48,000+</span>
                <span className="stat-title">Vehicles Serviced</span>
                <span className="stat-desc">Full diagnostic history archived</span>
              </div>

              <div className="stat-card">
                <span className="stat-metric metric-orange">4.9/5 ★</span>
                <span className="stat-title">Customer Rating</span>
                <span className="stat-desc">Verified post-repair surveys</span>
              </div>

              <div className="stat-card">
                <span className="stat-metric metric-green">12 Mo / 12k Mi</span>
                <span className="stat-title">Warranty Protection</span>
                <span className="stat-desc">Nationwide parts &amp; labor lock</span>
              </div>

              <div className="stat-card">
                <span className="stat-metric metric-dark">ASE Master</span>
                <span className="stat-title">Factory Certified</span>
                <span className="stat-desc">OEM calibrated equipment</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Comprehensive Service Operations Catalog */}
        <section className="services-catalog-section" id="services">
          <div className="catalog-container">
            {/* Catalog Header */}
            <div className="catalog-header-flex">
              <div className="catalog-header-text">
                <span className="catalog-tag-label">HIGH-PRECISION CATALOG</span>
                <h2 className="catalog-main-title">
                  Comprehensive Service Operations
                </h2>
                <p className="catalog-subtitle">
                  From algorithmic OBD-II diagnostics to factory scheduled fluid restoration, each service is performed with zero guesswork.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="catalog-filter-pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`catalog-pill-btn ${activeCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 6 Service Cards Grid */}
            <div className="service-cards-grid">
              {filteredServices.map((item) => (
                <div key={item.id} className="service-item-card">
                  {/* Card Visual Header with Image */}
                  <div className="service-visual-wrapper">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="service-thumb-img"
                    />
                    <div className="service-img-overlay"></div>

                    {/* Tag Badge Top Left */}
                    <span className={`service-visual-badge ${item.badgeClass}`}>
                      {item.badge}
                    </span>

                    {/* Estimated Time Badge Bottom Right */}
                    <span className="service-est-time">
                      {item.estTime}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="service-card-body">
                    <div className="card-title-price-row">
                      <h3 className="card-service-title">{item.title}</h3>
                      <div className="card-price-block">
                        <span className="price-prefix">STARTING AT</span>
                        <span className="price-amount">LKR {item.price}</span>
                      </div>
                    </div>

                    <p className="card-description-text">{item.description}</p>

                    {/* Feature Chip Tags */}
                    <div className="service-chips-row">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="spec-chip">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="service-card-bottom-actions">
                      <button
                        type="button"
                        onClick={() => setModalService(item)}
                        className="btn-view-details"
                      >
                        <span>View Details</span>
                        <ChevronRight size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBookService(item)}
                        className="btn-book-now"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Verified Driver Experiences (Testimonials) */}
        <section className="testimonials-section">
          <div className="testimonials-container">
            <div className="testimonials-header">
              <span className="testim-tag">REAL TELEMETRY FEEDBACK</span>
              <h2 className="testim-title">Verified Driver Experiences</h2>
              <p className="testim-subtitle">
                Read how everyday commuters and high-performance track drivers rely on our master technicians.
              </p>
            </div>

            <div className="testimonials-cards-grid">
              {testimonials.map((t) => (
                <div key={t.id} className="testimonial-card">
                  {/* Rating Stars & Badge */}
                  <div className="testimonial-card-top">
                    <div className="stars-cluster">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} className="star-filled" />
                      ))}
                    </div>
                    <div className="verified-booking-pill">
                      <CheckCircle2 size={13} className="check-verified-icon" />
                      <span>Verified Booking</span>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="testimonial-quote-text">"{t.quote}"</p>

                  {/* Driver Bio */}
                  <div className="testimonial-driver-row">
                    <div className={`driver-avatar-circle ${t.avatarColor}`}>
                      <span>{t.initials}</span>
                    </div>
                    <div className="driver-meta">
                      <span className="driver-name">{t.author}</span>
                      <span className="driver-car">{t.vehicle}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Blue Gradient Call to Action Banner */}
        <section className="cta-banner-section">
          <div className="cta-banner-container">
            <div className="cta-banner-left">
              <span className="cta-eyebrow-pill">IMMEDIATE BAY RESERVATION</span>
              <h2 className="cta-banner-headline">
                Ready to experience stress-free vehicle maintenance?
              </h2>
              <p className="cta-banner-description">
                Lock your preferred appointment slot today. Master technicians standing by with transparent estimates and zero hidden fees.
              </p>
            </div>

            <div className="cta-banner-buttons">
              <button
                type="button"
                className="btn-cta-secondary"
                onClick={() => alert('Viewing all 42 authorized regional workshop hubs.')}
              >
                Explore All Centers
              </button>
              <button
                type="button"
                className="btn-cta-primary"
                onClick={() => handleBookService()}
              >
                <Calendar size={17} className="btn-cal-icon" />
                <span>Reserve Slot Now</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Global Footer */}
      <Footer />

      {/* Optional Service Details Quick Modal */}
      {modalService && (
        <div className="modal-backdrop" onClick={() => setModalService(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalService.image}
              alt={modalService.title}
              className="modal-banner-img"
            />
            <div className="modal-body-content">
              <div className="modal-top-row">
                <span className="modal-category-badge">{modalService.category}</span>
                <span className="modal-price">LKR {modalService.price}</span>
              </div>
              <h3 className="modal-title">{modalService.title}</h3>
              <p className="modal-desc">{modalService.description}</p>
              <div className="modal-chips">
                {modalService.tags.map((t, idx) => (
                  <span key={idx} className="spec-chip">
                    {t}
                  </span>
                ))}
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => setModalService(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleBookService(modalService);
                    setModalService(null);
                  }}
                  className="btn-primary"
                >
                  Confirm &amp; Book Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
