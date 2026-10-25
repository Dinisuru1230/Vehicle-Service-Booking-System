import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Car,
  Calendar,
  Clock,
  CheckCircle2,
  Check,
  Wrench,
  RotateCw,
  Search,
  Filter,
  MapPin,
  FileText,
  MessageSquare,
  Info,
  HelpCircle,
  PhoneCall,
  PlusCircle,
  ChevronDown,
  Gauge,
  X,
} from 'lucide-react';

const mockBookingsData = [
  {
    id: 'APX-85104',
    title: 'Engine Diagnostic & Stage 1 ECU Calibration',
    status: 'upcoming',
    statusLabel: 'Confirmed',
    statusBadgeClass: 'badge-confirmed-green',
    month: 'NOV',
    day: '02',
    vehicle: '2023 BMW M3 Competition',
    time: '02:00 PM EST',
    hub: 'Apex Central Hub',
    price: 'LKR 79.00',
  },
  {
    id: 'APX-85219',
    title: 'Climate Control Overhaul & High-Pressure Coolant Flush',
    status: 'upcoming',
    statusLabel: 'Confirmed',
    statusBadgeClass: 'badge-confirmed-blue',
    month: 'NOV',
    day: '08',
    vehicle: '2021 Porsche 911 GT3',
    time: '09:00 AM EST',
    hub: 'Downtown Flagship',
    price: 'LKR 99.00',
  },
  {
    id: 'APX-79102',
    title: 'Routine 15k Mi Synthetic Oil Service & Carbon Microfilter',
    status: 'completed',
    statusLabel: 'Completed',
    statusBadgeClass: 'badge-completed-gray',
    month: 'AUG',
    day: '14',
    vehicle: '2023 BMW M3 Competition',
    technician: 'Sarah Chen',
    hub: 'Apex Central Hub',
    price: 'LKR 89.00',
  },
  {
    id: 'APX-77401',
    title: '48V Hybrid Alternator Inspection & Battery Service',
    status: 'completed',
    statusLabel: 'Completed',
    statusBadgeClass: 'badge-completed-gray',
    month: 'JUL',
    day: '20',
    vehicle: '2019 Audi S5 Coupe',
    location: 'Apex East Annex',
    hub: 'Apex East Annex',
    price: 'LKR 119.00',
  },
  {
    id: 'APX-84920',
    title: 'Brake Renewal & Routine Inspection',
    status: 'active',
    statusLabel: 'In Progress',
    statusBadgeClass: 'badge-confirmed-blue',
    month: 'OCT',
    day: '19',
    vehicle: '2023 BMW M3 Competition',
    time: 'Est. 4:30 PM',
    hub: 'Apex Central Hub',
    price: 'LKR 149.00',
  },
];

const MyBookingsPage = ({
  onNavigateHome,
  onNavigateBook,
  onNavigateBookings,
  onNavigateAbout,
  onNavigateProfile,
  onNavigateAdmin,
  onNavigateLogin,
  onNavigateRegister,
}) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState('All');
  const [activeModal, setActiveModal] = useState(null); // { type: 'details' | 'advisor' | 'invoice' | 'reschedule', data: any }

  // Filter logic
  const filteredList = mockBookingsData.filter((item) => {
    // Tab filter
    if (activeFilter === 'Active' && item.status !== 'active') return false;
    if (activeFilter === 'Upcoming' && item.status !== 'upcoming') return false;
    if (activeFilter === 'Completed' && item.status !== 'completed') return false;
    if (activeFilter === 'All' && item.status === 'active') return false; // In 'All (5)' the active booking is prominently featured in the live widget above, displaying the 4 records matching the mockup

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.vehicle.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Hub filter
    if (selectedHub !== 'All' && item.hub !== selectedHub) {
      return false;
    }

    return true;
  });

  return (
    <div className="my-bookings-page-root">
      {/* 1. Global Navbar with My Bookings Active */}
      <Navbar
        activeTab="bookings"
        onNavigateHome={onNavigateHome}
        onNavigateBook={onNavigateBook}
        onNavigateBookings={onNavigateBookings}
        onNavigateAbout={onNavigateAbout}
        onNavigateProfile={onNavigateProfile}
        onNavigateAdmin={onNavigateAdmin}
        onNavigateLogin={onNavigateLogin}
        onNavigateRegister={onNavigateRegister}
      />

      <main className="my-bookings-main-container">
        {/* 2. Page Header Row */}
        <div className="bookings-page-header">
          <div className="header-text-block">
            <h1 className="bookings-title">My Bookings</h1>
            <p className="bookings-subtitle">
              Track live service progress, review upcoming appointments, and view maintenance history.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateBook}
            className="btn-book-new-service"
          >
            <PlusCircle size={18} className="btn-plus-icon" />
            <span>Book New Service</span>
          </button>
        </div>

        {/* 3. 3-Stat Counters Row */}
        <div className="bookings-stats-row">
          {/* Card 1: Active Bookings */}
          <div className="status-counter-card active-card">
            <div className="counter-left">
              <span className="counter-eyebrow">ACTIVE BOOKINGS</span>
              <div className="counter-number-line">
                <span className="bold-num text-blue">01</span>
                <span className="num-subtext">In progress today</span>
              </div>
            </div>
            <div className="counter-icon-wrap icon-blue">
              <Wrench size={18} />
            </div>
          </div>

          {/* Card 2: Upcoming Appointments */}
          <div className="status-counter-card">
            <div className="counter-left">
              <span className="counter-eyebrow">UPCOMING APPOINTMENTS</span>
              <div className="counter-number-line">
                <span className="bold-num">02</span>
                <span className="num-subtext">Scheduled</span>
              </div>
            </div>
            <div className="counter-icon-wrap icon-gray">
              <Calendar size={18} />
            </div>
          </div>

          {/* Card 3: Past Services */}
          <div className="status-counter-card">
            <div className="counter-left">
              <span className="counter-eyebrow">PAST SERVICES</span>
              <div className="counter-number-line">
                <span className="bold-num">02</span>
                <span className="num-subtext text-green">Completed</span>
              </div>
            </div>
            <div className="counter-icon-wrap icon-green">
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>

        {/* 4. Live In-Progress Featured Service Card */}
        <div className="active-service-featured-card">
          {/* Top Row: Info & Action Buttons */}
          <div className="featured-card-top-row">
            <div className="service-main-meta">
              <div className="meta-badge-line">
                <span className="in-progress-pill">
                  <span className="pulse-dot-white"></span>
                  <span>In Progress</span>
                </span>
                <span className="booking-ref-text">Booking #APX-84920</span>
              </div>

              <h2 className="live-service-title">
                Brake Renewal &amp; Routine Inspection
              </h2>

              <div className="live-service-specs">
                <div className="spec-item">
                  <Car size={16} className="spec-icon" />
                  <span>2023 BMW M3 Competition</span>
                </div>
                <div className="spec-item">
                  <MapPin size={16} className="spec-icon" />
                  <span>Apex Central Hub • Bay 04</span>
                </div>
              </div>
            </div>

            <div className="service-right-actions">
              <div className="est-completion-box">
                <Clock size={16} className="clock-blue-icon" />
                <span>
                  Est. Completion: <strong>Today at 4:30 PM</strong>
                </span>
              </div>

              <div className="action-buttons-cluster">
                <button
                  type="button"
                  onClick={() =>
                    setActiveModal({
                      type: 'details',
                      data: {
                        id: 'APX-84920',
                        title: 'Brake Renewal & Routine Inspection',
                        tech: 'David Miller (ASE Master)',
                        bay: 'Bay 04 (Live)',
                      },
                    })
                  }
                  className="btn-light-action"
                >
                  <Info size={15} />
                  <span>View Service Details</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveModal({
                      type: 'advisor',
                      data: {
                        advisor: 'Carlos Mendez',
                        directLine: '+1 (800) 555-0142',
                      },
                    })
                  }
                  className="btn-blue-action"
                >
                  <MessageSquare size={15} />
                  <span>Contact Service Advisor</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stepper Milestones */}
          <div className="stepper-section">
            <div className="stepper-header-line">
              <span className="stepper-label">Service Milestones</span>
              <span className="stepper-step-indicator">
                Step 3 of 4: Brake Service &amp; Parts Replacement
              </span>
            </div>

            <div className="milestones-steps-grid">
              {/* Step 1 */}
              <div className="milestone-card completed-step">
                <div className="milestone-icon-circle green">
                  <Check size={16} />
                </div>
                <div className="milestone-text">
                  <span className="milestone-name">1. Vehicle Checked-in</span>
                  <span className="milestone-time green">Completed (09:45 AM)</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="milestone-card completed-step">
                <div className="milestone-icon-circle green">
                  <Check size={16} />
                </div>
                <div className="milestone-text">
                  <span className="milestone-name">2. Multi-Point Check</span>
                  <span className="milestone-time green">Completed (10:15 AM)</span>
                </div>
              </div>

              {/* Step 3 (Active) */}
              <div className="milestone-card active-step">
                <div className="milestone-icon-circle blue">
                  <RotateCw size={15} className="spin-slow" />
                </div>
                <div className="milestone-text">
                  <span className="milestone-name text-blue">3. Brake Service</span>
                  <span className="milestone-time text-blue">In Progress (Now)</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="milestone-card queued-step">
                <div className="milestone-icon-circle gray">
                  <span>4</span>
                </div>
                <div className="milestone-text">
                  <span className="milestone-name text-muted">4. Final Road Test</span>
                  <span className="milestone-time text-muted">Queued next</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Filter Pills & Search Controls Bar */}
        <div className="bookings-controls-wrapper">
          {/* Tabs Top Row */}
          <div className="bookings-filter-tabs">
            {['All (5)', 'Active (1)', 'Upcoming (2)', 'Completed (2)'].map((tab) => {
              const tabName = tab.split(' ')[0];
              const isSelected = activeFilter === tabName;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tabName)}
                  className={`tab-filter-btn ${isSelected ? 'active' : ''}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search & Select Bar */}
          <div className="search-controls-bar">
            {/* Search Input */}
            <div className="search-field-box">
              <Search size={17} className="search-glass-icon" />
              <input
                type="text"
                placeholder="Search by Ref ID, Vehicle, or Service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Date Filter */}
            <div className="dropdown-filter-box">
              <Calendar size={15} className="dropdown-icon" />
              <select className="dropdown-select">
                <option value="all">All Dates</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Past 30 Days</option>
                <option value="year">2025</option>
              </select>
            </div>

            {/* Hub Filter */}
            <div className="dropdown-filter-box">
              <Filter size={15} className="dropdown-icon" />
              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="dropdown-select"
              >
                <option value="All">All Service Hubs</option>
                <option value="Apex Central Hub">Apex Central Hub</option>
                <option value="Downtown Flagship">Downtown Flagship</option>
                <option value="Apex East Annex">Apex East Annex</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedHub('All');
                setActiveFilter('All');
              }}
              className="btn-refresh-filter"
              title="Reset Filters"
            >
              <RotateCw size={15} />
            </button>
          </div>
        </div>

        {/* 6. List of Bookings */}
        <div className="bookings-records-list">
          {filteredList.length === 0 ? (
            <div className="empty-bookings-notice">
              <Calendar size={40} className="empty-icon" />
              <h3>No bookings found</h3>
              <p>Try clearing your search terms or filter criteria.</p>
            </div>
          ) : (
            filteredList.map((item) => (
              <div key={item.id} className="booking-record-card">
                {/* Date Left Badge */}
                <div
                  className={`record-date-badge ${
                    item.status === 'completed' ? 'date-completed' : 'date-upcoming'
                  }`}
                >
                  <span className="badge-month">{item.month}</span>
                  <span className="badge-day">{item.day}</span>
                </div>

                {/* Center Content */}
                <div className="record-center-info">
                  <div className="record-title-row">
                    <h3 className="record-title">{item.title}</h3>
                    <span className={`status-pill ${item.statusBadgeClass}`}>
                      {item.statusLabel}
                    </span>
                  </div>

                  <div className="record-meta-line">
                    <span>{item.vehicle}</span>
                    {item.time && (
                      <>
                        <span className="dot-divider">•</span>
                        <span>{item.time}</span>
                      </>
                    )}
                    {item.technician && (
                      <>
                        <span className="dot-divider">•</span>
                        <span>Tech: {item.technician}</span>
                      </>
                    )}
                    {item.location && (
                      <>
                        <span className="dot-divider">•</span>
                        <span>{item.location}</span>
                      </>
                    )}
                    <span className="dot-divider">•</span>
                    <span className="ref-tag">#{item.id}</span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="record-actions-group">
                  {item.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModal({
                          type: 'invoice',
                          data: item,
                        })
                      }
                      className="btn-record-action"
                    >
                      <FileText size={14} className="action-icon" />
                      <span>Invoice</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setActiveModal({
                        type: 'details',
                        data: item,
                      })
                    }
                    className="btn-record-action"
                  >
                    <span>View Details</span>
                  </button>

                  {item.status === 'upcoming' && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModal({
                          type: 'reschedule',
                          data: item,
                        })
                      }
                      className="btn-record-action"
                    >
                      <span>Reschedule</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 7. Bottom Help & Support Banner */}
        <div className="bookings-help-banner">
          <div className="help-banner-left">
            <div className="help-icon-box">
              <Gauge size={22} className="help-gauge-icon" />
            </div>
            <div className="help-text-block">
              <h4 className="help-heading">
                Need help with a booking or custom modification?
              </h4>
              <p className="help-subtext">
                Our certified master technicians and dedicated service advisors are available 7 days a week.
              </p>
            </div>
          </div>

          <div className="help-banner-actions">
            <button
              type="button"
              onClick={() => alert('Opening ApexDrive Help Center & FAQs.')}
              className="btn-help-center"
            >
              <HelpCircle size={15} />
              <span>Help Center</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Dialing service advisor: 1-800-APEX-CAR')}
              className="btn-contact-support"
            >
              <PhoneCall size={15} />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </main>

      {/* 8. Global Footer */}
      <Footer />

      {/* Interactive Modals */}
      {activeModal && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-content booking-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-line">
              <h3 className="modal-title">
                {activeModal.type === 'invoice' && 'Service Invoice'}
                {activeModal.type === 'details' && 'Booking Details'}
                {activeModal.type === 'advisor' && 'Direct Advisor Channel'}
                {activeModal.type === 'reschedule' && 'Reschedule Appointment'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="btn-close-modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-pad">
              {activeModal.type === 'invoice' && (
                <div className="invoice-preview">
                  <div className="invoice-meta-row">
                    <span>Invoice Ref: #INV-{activeModal.data.id}</span>
                    <span className="invoice-paid-badge">PAID</span>
                  </div>
                  <h4>{activeModal.data.title}</h4>
                  <p className="invoice-car-text">{activeModal.data.vehicle}</p>
                  <hr className="divider-subtle" />
                  <div className="invoice-totals">
                    <div className="inv-line">
                      <span>Service Total</span>
                      <span>{activeModal.data.price}</span>
                    </div>
                    <div className="inv-line">
                      <span>Parts &amp; Labor</span>
                      <span>Included</span>
                    </div>
                    <div className="inv-line bold">
                      <span>Amount Paid</span>
                      <span className="text-blue">{activeModal.data.price}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal.type === 'details' && (
                <div className="details-preview">
                  <p className="detail-ref">Ref: #{activeModal.data.id}</p>
                  <h4>{activeModal.data.title}</h4>
                  <p className="detail-sub">{activeModal.data.vehicle}</p>
                  <div className="detail-specs-box">
                    <div>
                      <strong>Location:</strong> {activeModal.data.hub || 'Apex Central Hub'}
                    </div>
                    <div>
                      <strong>Inspection:</strong> 40-Point Electronic Telemetry Scan
                    </div>
                    <div>
                      <strong>Warranty:</strong> 12 Months / 12,000 Miles
                    </div>
                  </div>
                </div>
              )}

              {activeModal.type === 'advisor' && (
                <div className="advisor-preview">
                  <div className="advisor-avatar-box">
                    <MessageSquare size={24} className="text-blue" />
                  </div>
                  <h4>Connected with {activeModal.data.advisor}</h4>
                  <p>Dedicated Bay 04 Service Specialist</p>
                  <div className="advisor-contact-pill">
                    <span>Direct Hotline: {activeModal.data.directLine}</span>
                  </div>
                </div>
              )}

              {activeModal.type === 'reschedule' && (
                <div className="reschedule-preview">
                  <p>Select a new appointment window for:</p>
                  <h4>{activeModal.data.title}</h4>
                  <div className="reschedule-options">
                    <button type="button" className="slot-option active">
                      Tomorrow, 10:00 AM
                    </button>
                    <button type="button" className="slot-option">
                      Thursday, 02:00 PM
                    </button>
                    <button type="button" className="slot-option">
                      Friday, 09:30 AM
                    </button>
                  </div>
                </div>
              )}

              <div className="modal-actions-bar">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn-primary"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
