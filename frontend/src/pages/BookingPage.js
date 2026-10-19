import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Car,
  Calendar as CalendarIcon,
  Clock,
  Check,
  CheckCircle2,
  Wrench,
  Disc,
  Activity,
  Snowflake,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const serviceOptions = [
  {
    id: 'basic-maint',
    title: 'Basic Maintenance',
    subtitle: 'Oil, filter change & fluid top-off',
    duration: '~45 mins',
    price: 89.0,
    icon: Wrench,
  },
  {
    id: 'brake-pads',
    title: 'Brake Inspection & Pads',
    subtitle: 'Pad renewal & rotor safety check',
    duration: '~60 mins',
    price: 149.0,
    icon: Disc,
  },
  {
    id: 'diagnostics',
    title: 'Full Diagnostics',
    subtitle: 'Engine check light & systems scan',
    duration: '~30 mins',
    price: 79.0,
    icon: Activity,
  },
  {
    id: 'ac-climate',
    title: 'AC & Climate Service',
    subtitle: 'Refrigerant recharge & cabin filter',
    duration: '~40 mins',
    price: 99.0,
    icon: Snowflake,
  },
];

const morningSlots = ['08:30 AM', '10:00 AM', '11:30 AM'];
const afternoonSlots = ['01:30 PM', '03:00 PM', '04:15 PM'];

const BookingPage = ({
  onNavigateHome,
  onNavigateLogin,
  onNavigateBookings,
  onNavigateAbout,
}) => {
  // Contact & Vehicle state
  const [fullName, setFullName] = useState('Marcus Vance');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 019-2834');
  const [vehicleMake, setVehicleMake] = useState('2023 BMW M3 Competition');
  const [licensePlate, setLicensePlate] = useState('TX-784-KPL');
  const [notes, setNotes] = useState('');

  // Selected Services state (Defaulting to Basic Maintenance & Full Diagnostics matching mockup)
  const [selectedServices, setSelectedServices] = useState([
    'basic-maint',
    'diagnostics',
  ]);

  // Calendar Date & Slot state
  const [selectedDay, setSelectedDay] = useState(14);
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [currentMonth, setCurrentMonth] = useState('October');
  const [currentYear, setCurrentYear] = useState(2025);

  // Booking Confirmation State
  const [isBooked, setIsBooked] = useState(false);

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length === 1) return; // Keep at least one selected
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const activeServicesList = serviceOptions.filter((s) =>
    selectedServices.includes(s.id)
  );

  const totalPrice = activeServicesList.reduce((acc, curr) => acc + curr.price, 0);

  const handleConfirm = () => {
    setIsBooked(true);
  };

  return (
    <div className="booking-page-root">
      {/* Navbar with Book Service active */}
      <Navbar
        activeTab="book"
        onNavigateHome={onNavigateHome}
        onNavigateBookings={onNavigateBookings}
        onNavigateAbout={onNavigateAbout}
        onNavigateLogin={onNavigateLogin}
      />

      <main className="booking-main-container">
        {/* Page Header */}
        <div className="booking-header-block">
          <h1 className="booking-page-title">Book a Service</h1>
          <p className="booking-page-subtitle">
            Schedule your next maintenance or inspection in three easy steps.
          </p>

          {/* Step Indicator Floating Bar */}
          <div className="booking-steps-bar">
            <div className="step-item active">
              <span className="step-number-circle filled">1</span>
              <span className="step-name">Vehicle &amp; Contact</span>
            </div>
            <div className="step-item">
              <span className="step-number-circle">2</span>
              <span className="step-name">Select Service</span>
            </div>
            <div className="step-item">
              <span className="step-number-circle">3</span>
              <span className="step-name">Date &amp; Time</span>
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns (Main Form on Left, Summary on Right) */}
        <div className="booking-layout-grid">
          {/* ================= LEFT MAIN COLUMN ================= */}
          <div className="booking-forms-column">
            {/* 1. Your Vehicle & Contact Info Card */}
            <div className="booking-card-panel">
              <div className="card-panel-header">
                <span className="panel-step-num">1</span>
                <h2 className="panel-title">Your Vehicle &amp; Contact Info</h2>
              </div>

              <div className="panel-form-grid">
                <div className="form-input-box">
                  <label className="input-field-label">FULL NAME</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="styled-form-input"
                  />
                </div>

                <div className="form-input-box">
                  <label className="input-field-label">PHONE NUMBER</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="styled-form-input"
                  />
                </div>

                <div className="form-input-box">
                  <label className="input-field-label">VEHICLE MAKE, MODEL &amp; YEAR</label>
                  <input
                    type="text"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    className="styled-form-input"
                  />
                </div>

                <div className="form-input-box">
                  <label className="input-field-label">LICENSE PLATE NUMBER</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="styled-form-input"
                  />
                </div>
              </div>
            </div>

            {/* 2. Choose Services Card */}
            <div className="booking-card-panel">
              <div className="card-panel-header justify-between">
                <div className="header-left-title">
                  <span className="panel-step-num">2</span>
                  <h2 className="panel-title">Choose Services</h2>
                </div>
                <span className="select-hint-text">Select one or more</span>
              </div>

              {/* 2x2 Services Grid */}
              <div className="services-selection-grid">
                {serviceOptions.map((srv) => {
                  const isSelected = selectedServices.includes(srv.id);
                  const IconComponent = srv.icon;

                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`service-option-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="service-card-top-row">
                        <div className="service-icon-box">
                          <IconComponent size={20} className="srv-icon" />
                        </div>
                        <div className="service-info-text">
                          <h4 className="srv-title">{srv.title}</h4>
                          <p className="srv-subtitle">{srv.subtitle}</p>
                        </div>
                        <div className={`srv-custom-checkbox ${isSelected ? 'checked' : ''}`}>
                          {isSelected && <Check size={14} className="check-mark" />}
                        </div>
                      </div>

                      <div className="service-card-bottom-row">
                        <div className="srv-duration">
                          <Clock size={14} className="clock-icon" />
                          <span>{srv.duration}</span>
                        </div>
                        <span className={`srv-price ${isSelected ? 'selected-price' : ''}`}>
                          ${srv.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional Notes */}
              <div className="optional-notes-group">
                <label className="input-field-label">OPTIONAL NOTES / QUESTIONS</label>
                <input
                  type="text"
                  placeholder="Any specific issues or symptoms we should know about?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="styled-form-input"
                />
              </div>
            </div>

            {/* 3. Pick Date & Time Card */}
            <div className="booking-card-panel">
              <div className="card-panel-header">
                <span className="panel-step-num">3</span>
                <h2 className="panel-title">Pick Date &amp; Time</h2>
              </div>

              <div className="datetime-picker-grid">
                {/* Calendar Component */}
                <div className="calendar-widget-box">
                  <div className="cal-month-header">
                    <span className="cal-month-title">
                      {currentMonth} {currentYear}
                    </span>
                    <div className="cal-nav-buttons">
                      <button type="button" className="cal-nav-arrow" aria-label="Previous Month">
                        <ChevronLeft size={16} />
                      </button>
                      <button type="button" className="cal-nav-arrow" aria-label="Next Month">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Day Headers */}
                  <div className="cal-days-header-row">
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                    <span>S</span>
                  </div>

                  {/* Calendar Numbers Grid */}
                  <div className="cal-numbers-grid">
                    {/* Week 1 */}
                    <span className="cal-day-num faded">29</span>
                    <span className="cal-day-num faded">30</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(1)}>1</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(2)}>2</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(3)}>3</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(4)}>4</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(5)}>5</span>

                    {/* Week 2 */}
                    <span className="cal-day-num" onClick={() => setSelectedDay(6)}>6</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(7)}>7</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(8)}>8</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(9)}>9</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(10)}>10</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(11)}>11</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(12)}>12</span>

                    {/* Week 3 */}
                    <span className="cal-day-num" onClick={() => setSelectedDay(13)}>13</span>
                    <span
                      className={`cal-day-num ${selectedDay === 14 ? 'selected-day' : ''}`}
                      onClick={() => setSelectedDay(14)}
                    >
                      14
                    </span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(15)}>15</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(16)}>16</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(17)}>17</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(18)}>18</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(19)}>19</span>

                    {/* Week 4 */}
                    <span className="cal-day-num" onClick={() => setSelectedDay(20)}>20</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(21)}>21</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(22)}>22</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(23)}>23</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(24)}>24</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(25)}>25</span>
                    <span className="cal-day-num" onClick={() => setSelectedDay(26)}>26</span>
                  </div>

                  <div className="cal-selected-notice">
                    Tuesday, Oct {selectedDay} selected
                  </div>
                </div>

                {/* Slots Column */}
                <div className="slots-picker-column">
                  {/* Morning Slots */}
                  <div className="slots-group">
                    <span className="slots-group-title">MORNING SLOTS</span>
                    <div className="slots-pills-cluster">
                      {morningSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`time-slot-pill ${selectedSlot === slot ? 'active-slot' : ''}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Afternoon Slots */}
                  <div className="slots-group">
                    <span className="slots-group-title">AFTERNOON SLOTS</span>
                    <div className="slots-pills-cluster">
                      {afternoonSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`time-slot-pill ${selectedSlot === slot ? 'active-slot' : ''}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SUMMARY COLUMN ================= */}
          <div className="booking-summary-sidebar">
            <div className="summary-sticky-card">
              <h3 className="summary-heading">Appointment Summary</h3>

              {/* Vehicle Badge Box */}
              <div className="summary-vehicle-box">
                <div className="vehicle-icon-circle">
                  <Car size={18} className="summary-car-icon" />
                </div>
                <div className="summary-veh-details">
                  <span className="veh-tag">VEHICLE</span>
                  <span className="veh-model-name">{vehicleMake}</span>
                  <span className="veh-plate-sub">{licensePlate}</span>
                </div>
              </div>

              {/* Date & Time Lines */}
              <div className="summary-info-rows">
                <div className="summary-info-line">
                  <span className="info-line-label">
                    <CalendarIcon size={15} className="line-icon" />
                    <span>Date:</span>
                  </span>
                  <span className="info-line-val">
                    Tuesday, Oct {selectedDay}, 2025
                  </span>
                </div>

                <div className="summary-info-line">
                  <span className="info-line-label">
                    <Clock size={15} className="line-icon" />
                    <span>Time:</span>
                  </span>
                  <span className="info-line-val highlight-time">{selectedSlot}</span>
                </div>
              </div>

              {/* Selected Services Breakdown */}
              <div className="summary-services-breakdown">
                <span className="breakdown-header">
                  SELECTED SERVICES ({activeServicesList.length})
                </span>
                <div className="breakdown-list">
                  {activeServicesList.map((srv) => (
                    <div key={srv.id} className="breakdown-row">
                      <span className="breakdown-name">{srv.title}</span>
                      <span className="breakdown-price">${srv.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider & Total */}
              <div className="summary-total-section">
                <div className="total-display-row">
                  <span className="total-due-text">Total Due at Bay</span>
                  <span className="total-amount-number">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="pay-guarantee-note">
                  Pay after inspection. Free cancellation anytime.
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleConfirm}
                className="btn-confirm-appointment"
              >
                <span>Confirm &amp; Book Appointment</span>
                <ArrowRight size={17} className="btn-arrow" />
              </button>
            </div>

            {/* Bottom Warranty Guarantee Box */}
            <div className="warranty-guarantee-card">
              <ShieldCheck size={24} className="warranty-check-icon" />
              <div className="warranty-text-block">
                <span className="warranty-bold-title">Certified Master Technicians</span>
                <p className="warranty-desc-text">
                  All work includes a 12-month / 12,000-mile warranty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {isBooked && (
        <div className="modal-backdrop" onClick={() => setIsBooked(false)}>
          <div className="modal-content booking-success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon-wrap">
              <CheckCircle2 size={48} className="success-check-big" />
            </div>
            <h3 className="modal-title text-center">Appointment Confirmed!</h3>
            <p className="modal-desc text-center">
              Your service appointment for the <strong>{vehicleMake}</strong> has been confirmed for <strong>Tuesday, Oct {selectedDay}, 2025 at {selectedSlot}</strong>.
            </p>
            <div className="success-details-pill">
              <span>Bay 03 Reserved</span> • <span>Estimate: ${totalPrice.toFixed(2)}</span>
            </div>
            <div className="modal-actions justify-center">
              <button
                onClick={() => setIsBooked(false)}
                className="btn-primary"
              >
                Done &amp; View Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BookingPage;
