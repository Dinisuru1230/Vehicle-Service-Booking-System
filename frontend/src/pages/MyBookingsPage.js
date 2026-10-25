import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookingAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
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
  X,
  Loader2,
  AlertTriangle,
  Printer,
  ShieldCheck,
  ChevronRight,
  Gauge,
} from 'lucide-react';

const mockBookingsData = [
  {
    id: 'APX-84920',
    bookingRef: '#APX-84920',
    title: 'Brake Renewal & Routine Inspection',
    serviceTitle: 'Brake Renewal & Routine Inspection',
    status: 'In-Bay',
    statusGroup: 'active',
    statusLabel: 'In Progress',
    statusBadgeClass: 'badge-confirmed-blue',
    month: 'OCT',
    day: '19',
    vehicle: '2023 BMW M3 Competition',
    vehicleText: '2023 BMW M3 Competition',
    plate: 'CA 8XYZ901',
    time: 'Today, 10:30 AM',
    hub: 'Apex Central Hub',
    bay: 'Bay 3 (Lift Heavy)',
    technician: 'Dave Miller',
    price: 'LKR 149.00',
    totalCost: 149.0,
    telemetry: {
      step: 3,
      totalSteps: 4,
      stepName: 'Step 3 of 4: Brake Renewal & Routine Inspection',
      estCompletion: 'Today at 4:30 PM',
      progressPercent: 75,
      milestones: [
        { step: 1, name: '1. Vehicle Checked-in', status: 'completed', time: 'Completed (09:45 AM)' },
        { step: 2, name: '2. Multi-Point Check', status: 'completed', time: 'Completed (10:15 AM)' },
        { step: 3, name: '3. Brake & Mechanical Service', status: 'active', time: 'In Progress (Now)' },
        { step: 4, name: '4. Final Road Test & QC', status: 'queued', time: 'Queued next' },
      ],
    },
  },
  {
    id: 'APX-85104',
    bookingRef: '#APX-85104',
    title: 'Engine Diagnostic & Stage 1 ECU Calibration',
    serviceTitle: 'Engine Diagnostic & Stage 1 ECU Calibration',
    status: 'Confirmed',
    statusGroup: 'upcoming',
    statusLabel: 'Confirmed',
    statusBadgeClass: 'badge-confirmed-green',
    month: 'NOV',
    day: '02',
    vehicle: '2021 Porsche 911 GT3 RS',
    vehicleText: '2021 Porsche 911 GT3 RS',
    plate: 'NV 3TRK77',
    time: 'Today, 11:00 AM',
    hub: 'Apex Central Hub',
    bay: 'Bay 1 (Dyno Rack)',
    technician: 'Marcus Vance',
    price: 'LKR 129.00',
    totalCost: 129.0,
  },
  {
    id: 'APX-85219',
    bookingRef: '#APX-85219',
    title: 'Battery Health & EV Diagnostics',
    serviceTitle: 'Battery Health & EV Diagnostics',
    status: 'Confirmed',
    statusGroup: 'upcoming',
    statusLabel: 'Confirmed',
    statusBadgeClass: 'badge-confirmed-blue',
    month: 'NOV',
    day: '08',
    vehicle: '2022 Tesla Model S Plaid',
    vehicleText: '2022 Tesla Model S Plaid',
    plate: 'CA 5EV202',
    time: 'Today, 09:00 AM',
    hub: 'Downtown Flagship',
    bay: 'Bay 5 (EV Station)',
    technician: 'Sam Rivera',
    price: 'LKR 99.00',
    totalCost: 99.0,
  },
  {
    id: 'APX-79102',
    bookingRef: '#APX-79102',
    title: 'Brake System Lathe & Pad Service',
    serviceTitle: 'Brake System Lathe & Pad Service',
    status: 'Completed',
    statusGroup: 'completed',
    statusLabel: 'Completed',
    statusBadgeClass: 'badge-completed-gray',
    month: 'AUG',
    day: '14',
    vehicle: '2020 Audi RS6 Avant',
    vehicleText: '2020 Audi RS6 Avant',
    plate: 'NY RS6-88',
    time: 'Today, 08:45 AM',
    technician: 'Sarah Chen',
    hub: 'Apex Central Hub',
    bay: 'Bay 2 (Done • QC Signed)',
    price: 'LKR 249.00',
    totalCost: 249.0,
  },
  {
    id: 'APX-77401',
    bookingRef: '#APX-77401',
    title: '48V Hybrid Alternator Inspection & Battery Service',
    serviceTitle: '48V Hybrid Alternator Inspection & Battery Service',
    status: 'Completed',
    statusGroup: 'completed',
    statusLabel: 'Completed',
    statusBadgeClass: 'badge-completed-gray',
    month: 'JUL',
    day: '20',
    vehicle: '2019 Audi S5 Coupe',
    vehicleText: '2019 Audi S5 Coupe',
    plate: 'CA 7AUD99',
    time: 'Today, 10:00 AM',
    technician: 'Sam Rivera',
    hub: 'Apex East Annex',
    bay: 'Bay 6',
    price: 'LKR 119.00',
    totalCost: 119.0,
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
  const { user } = useAuth();
  const [bookingsList, setBookingsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState('All');

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // { type: 'details' | 'advisor' | 'invoice' | 'reschedule' | 'cancel', id, data }
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [detailedBooking, setDetailedBooking] = useState(null);

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('10:00 AM');
  const [rescheduleNotes, setRescheduleNotes] = useState('');
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);

  // Cancel Form State
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  // Toast / Status Message
  const [statusFeedback, setStatusFeedback] = useState(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const guestRefs = localStorage.getItem('apexdrive_guest_bookings') || '';
      const params = {};
      if (guestRefs) params.guestRefs = guestRefs;
      if (user?.email) params.email = user.email;
      if (user?.phone) params.phone = user.phone;

      const res = await bookingAPI.getMyBookings(params);
      if (res && res.success && Array.isArray(res.bookings)) {
        setBookingsList(res.bookings);
      } else {
        setBookingsList([]);
      }
    } catch (err) {
      console.warn('[MyBookingsPage] Fetch bookings failed:', err.message);
      setBookingsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  // Open Invoice Modal and load itemized breakdown
  const handleOpenInvoice = async (item) => {
    setActiveModal({ type: 'invoice', id: item.id, data: item });
    setModalLoading(true);
    setModalError(null);
    setInvoiceData(null);
    try {
      const res = await bookingAPI.getInvoice(item.id);
      if (res && res.success && res.invoice) {
        setInvoiceData(res.invoice);
      } else {
        setModalError(res?.message || 'Unable to load invoice data.');
      }
    } catch (err) {
      setModalError(err.message || 'Error fetching invoice breakdown.');
    } finally {
      setModalLoading(false);
    }
  };

  // Open Details Modal and load complete telemetry and booking info
  const handleOpenDetails = async (item) => {
    setActiveModal({ type: 'details', id: item.id, data: item });
    setModalLoading(true);
    setModalError(null);
    setDetailedBooking(item);
    try {
      const res = await bookingAPI.getBooking(item.id);
      if (res && res.success && res.booking) {
        setDetailedBooking(res.booking);
      }
    } catch (err) {
      console.warn('[handleOpenDetails] Telemetry fetch fallback:', err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Open Reschedule Modal
  const handleOpenReschedule = (item) => {
    setActiveModal({ type: 'reschedule', id: item.id, data: item });
    setModalError(null);
    setRescheduleDate(item.scheduledDate || '');
    setRescheduleSlot(item.scheduledTime || '10:00 AM');
    setRescheduleNotes('');
  };

  // Submit Reschedule to Backend
  const handleConfirmReschedule = async () => {
    if (!activeModal?.id) return;
    setIsSubmittingReschedule(true);
    setModalError(null);
    try {
      const payload = {
        scheduledDate: rescheduleDate || activeModal.data.scheduledDate || 'NOV 15, 2025',
        scheduledTime: rescheduleSlot || '10:00 AM',
        notes: rescheduleNotes ? `Reschedule note: ${rescheduleNotes}` : undefined,
      };
      const res = await bookingAPI.rescheduleBooking(activeModal.id, payload);
      if (res && res.success) {
        setStatusFeedback(`Appointment #${activeModal.data.bookingRef || activeModal.id} rescheduled to ${payload.scheduledDate} at ${payload.scheduledTime}!`);
        setActiveModal(null);
        await fetchBookings();
        setTimeout(() => setStatusFeedback(null), 5000);
      } else {
        setModalError(res?.message || 'Failed to reschedule appointment.');
      }
    } catch (err) {
      setModalError(err.message || 'Error executing reschedule request.');
    } finally {
      setIsSubmittingReschedule(false);
    }
  };

  // Open Cancel Modal
  const handleOpenCancel = (item) => {
    setActiveModal({ type: 'cancel', id: item.id, data: item });
    setModalError(null);
    setCancelReason('');
  };

  // Submit Cancellation to Backend
  const handleConfirmCancel = async () => {
    if (!activeModal?.id) return;
    setIsSubmittingCancel(true);
    setModalError(null);
    try {
      const res = await bookingAPI.cancelBooking(activeModal.id, cancelReason || 'Customer requested cancellation via portal');
      if (res && res.success) {
        setStatusFeedback(`Appointment #${activeModal.data.bookingRef || activeModal.id} has been cancelled.`);
        setActiveModal(null);
        await fetchBookings();
        setTimeout(() => setStatusFeedback(null), 5000);
      } else {
        setModalError(res?.message || 'Failed to cancel booking.');
      }
    } catch (err) {
      setModalError(err.message || 'Error processing cancellation.');
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  // Dynamic status counts
  const activeCount = bookingsList.filter(
    (b) => b.status === 'In-Bay' || b.statusGroup === 'active'
  ).length;
  const upcomingCount = bookingsList.filter(
    (b) => b.status === 'Confirmed' || b.status === 'Pending' || b.statusGroup === 'upcoming'
  ).length;
  const completedCount = bookingsList.filter(
    (b) => b.status === 'Completed' || b.statusGroup === 'completed'
  ).length;
  const cancelledCount = bookingsList.filter(
    (b) => b.status === 'Cancelled' || b.statusGroup === 'cancelled'
  ).length;
  const totalCount = bookingsList.length;

  // Active / Featured Booking: only show real in-bay active or upcoming confirmed/pending
  const featuredActiveBooking =
    bookingsList.find((b) => b.status === 'In-Bay' || b.statusGroup === 'active') ||
    bookingsList.find((b) => b.status === 'Confirmed' || b.status === 'Pending' || b.statusGroup === 'upcoming') ||
    null;

  // Filter logic
  const filteredList = bookingsList.filter((item) => {
    const isAct = item.status === 'In-Bay' || item.statusGroup === 'active';
    const isUpc = item.status === 'Confirmed' || item.status === 'Pending' || item.statusGroup === 'upcoming';
    const isComp = item.status === 'Completed' || item.statusGroup === 'completed';
    const isCanc = item.status === 'Cancelled' || item.statusGroup === 'cancelled';

    if (activeFilter === 'Active' && !isAct) return false;
    if (activeFilter === 'Upcoming' && !isUpc) return false;
    if (activeFilter === 'Completed' && !isComp) return false;
    if (activeFilter === 'Cancelled' && !isCanc) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        (item.id || '').toLowerCase().includes(q) ||
        (item.bookingRef || '').toLowerCase().includes(q) ||
        (item.title || item.serviceTitle || '').toLowerCase().includes(q) ||
        (item.vehicle || item.vehicleText || '').toLowerCase().includes(q) ||
        (item.plate || '').toLowerCase().includes(q) ||
        (item.technician || '').toLowerCase().includes(q);
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
        {/* Feedback / Notification Toast */}
        {statusFeedback && (
          <div className="status-toast-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldCheck size={20} />
              <span>{statusFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusFeedback(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* 2. Page Header Row */}
        <div className="bookings-page-header">
          <div className="header-text-block">
            <h1 className="bookings-title">My Bookings</h1>
            <p className="bookings-subtitle">
              Track live service progress, review upcoming appointments, and view maintenance history with real-time workshop telemetry.
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

        {/* 3. 4-Stat Counters Row (Active, Upcoming, Past, Cancelled) */}
        <div className="bookings-stats-row">
          {/* Card 1: Active Bookings */}
          <div
            className={`status-counter-card ${activeFilter === 'Active' ? 'card-active-filter' : activeFilter === 'All' ? 'active-card' : ''}`}
            onClick={() => setActiveFilter(activeFilter === 'Active' ? 'All' : 'Active')}
            title="Filter by Active Bookings"
          >
            <div className="counter-left">
              <span className="counter-eyebrow">ACTIVE BOOKINGS</span>
              <div className="counter-number-line">
                <span className="bold-num text-blue">{String(activeCount).padStart(2, '0')}</span>
                <span className="num-subtext">In progress today</span>
              </div>
            </div>
            <div className="counter-icon-wrap icon-blue">
              <Wrench size={18} />
            </div>
          </div>

          {/* Card 2: Upcoming Appointments */}
          <div
            className={`status-counter-card ${activeFilter === 'Upcoming' ? 'card-upcoming-filter' : ''}`}
            onClick={() => setActiveFilter(activeFilter === 'Upcoming' ? 'All' : 'Upcoming')}
            title="Filter by Upcoming Appointments"
          >
            <div className="counter-left">
              <span className="counter-eyebrow">UPCOMING APPOINTMENTS</span>
              <div className="counter-number-line">
                <span className="bold-num">{String(upcomingCount).padStart(2, '0')}</span>
                <span className="num-subtext">Scheduled</span>
              </div>
            </div>
            <div className="counter-icon-wrap icon-gray">
              <Calendar size={18} />
            </div>
          </div>

          {/* Card 3: Past Services */}
          <div
            className={`status-counter-card ${activeFilter === 'Completed' ? 'card-completed-filter' : ''}`}
            onClick={() => setActiveFilter(activeFilter === 'Completed' ? 'All' : 'Completed')}
            title="Filter by Past Services"
          >
            <div className="counter-left">
              <span className="counter-eyebrow">PAST SERVICES</span>
              <div className="counter-number-line">
                <span className="bold-num">{String(completedCount).padStart(2, '0')}</span>
                <span className="num-subtext text-green">Completed</span>
              </div>
            </div>
            <div className="counter-icon-wrap icon-green">
              <CheckCircle2 size={18} />
            </div>
          </div>

          {/* Card 4: Cancelled Bookings */}
          <div
            className={`status-counter-card ${activeFilter === 'Cancelled' ? 'card-cancelled-filter' : ''}`}
            onClick={() => setActiveFilter(activeFilter === 'Cancelled' ? 'All' : 'Cancelled')}
            title="Filter by Cancelled Bookings"
          >
            <div className="counter-left">
              <span className="counter-eyebrow">CANCELLED BOOKINGS</span>
              <div className="counter-number-line">
                <span className="bold-num text-red">{String(cancelledCount).padStart(2, '0')}</span>
                <span className="num-subtext">Archived</span>
              </div>
            </div>
            <div className="counter-icon-wrap icon-red">
              <X size={18} />
            </div>
          </div>
        </div>

        {/* 4. Live In-Progress Featured Service Card */}
        {featuredActiveBooking && (
          <div className="active-service-featured-card">
            {/* Top Row: Info & Action Buttons */}
            <div className="featured-card-top-row">
              <div className="service-main-meta">
                <div className="meta-badge-line">
                  <span className={`in-progress-pill ${featuredActiveBooking.status === 'In-Bay' ? '' : 'upcoming-pill'}`}>
                    {featuredActiveBooking.status === 'In-Bay' ? (
                      <span className="pulse-dot-white"></span>
                    ) : (
                      <Calendar size={13} style={{ marginRight: '0.35rem' }} />
                    )}
                    <span>{featuredActiveBooking.status === 'In-Bay' ? 'In-Bay Active' : 'Upcoming Appointment'}</span>
                  </span>
                  <span className="booking-ref-text">
                    Booking {featuredActiveBooking.bookingRef || `#${featuredActiveBooking.id}`}
                  </span>
                </div>

                <h2 className="live-service-title">
                  {featuredActiveBooking.title || featuredActiveBooking.serviceTitle}
                </h2>

                <div className="live-service-specs">
                  <div className="spec-item">
                    <Car size={16} className="spec-icon" />
                    <span>{featuredActiveBooking.vehicle || featuredActiveBooking.vehicleText}</span>
                  </div>
                  <div className="spec-item">
                    <MapPin size={16} className="spec-icon" />
                    <span>
                      {featuredActiveBooking.hub || 'Apex Central Hub'} • {featuredActiveBooking.bay || 'Bay 03'}
                    </span>
                  </div>
                  {featuredActiveBooking.plate && (
                    <div className="spec-item">
                      <span className="text-muted">Plate:</span>
                      <strong>{featuredActiveBooking.plate}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="service-right-actions">
                <div className="est-completion-box">
                  <Clock size={16} className="clock-blue-icon" />
                  <span>
                    {featuredActiveBooking.status === 'In-Bay' ? 'Est. Completion: ' : 'Appointment Window: '}
                    <strong>
                      {featuredActiveBooking.status === 'In-Bay'
                        ? `Today at ${featuredActiveBooking.scheduledTime || '4:30 PM'}`
                        : `${featuredActiveBooking.scheduledDate || 'Scheduled'} • ${featuredActiveBooking.scheduledTime || '10:00 AM'}`}
                    </strong>
                  </span>
                </div>

                <div className="action-buttons-cluster">
                  <button
                    type="button"
                    onClick={() => handleOpenDetails(featuredActiveBooking)}
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
                        id: featuredActiveBooking.id,
                        data: {
                          advisor: featuredActiveBooking.technician || 'Carlos Mendez',
                          directLine: '+1 (800) 555-0142',
                          bay: featuredActiveBooking.bay || 'Bay 03',
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
                <span className="stepper-label">Live Workshop Telemetry &amp; Milestones</span>
                <span className="stepper-step-indicator">
                  {featuredActiveBooking.telemetry?.stepName ||
                    `Step 3 of 4: ${featuredActiveBooking.title || 'Precision Service Protocol'}`}
                </span>
              </div>

              <div className="milestones-steps-grid">
                {(
                  featuredActiveBooking.telemetry?.milestones || [
                    { step: 1, name: '1. Vehicle Checked-in', status: 'completed', time: 'Completed (09:45 AM)' },
                    { step: 2, name: '2. Multi-Point Check', status: 'completed', time: 'Completed (10:15 AM)' },
                    { step: 3, name: '3. Mechanical Service', status: 'active', time: 'In Progress (Now)' },
                    { step: 4, name: '4. Final Road Test & QC', status: 'queued', time: 'Queued next' },
                  ]
                ).map((m) => {
                  const isDone = m.status === 'completed';
                  const isCur = m.status === 'active';
                  return (
                    <div
                      key={m.step}
                      className={`milestone-card ${isDone ? 'completed-step' : isCur ? 'active-step' : 'queued-step'}`}
                    >
                      <div className={`milestone-icon-circle ${isDone ? 'green' : isCur ? 'blue' : 'gray'}`}>
                        {isDone ? (
                          <Check size={16} />
                        ) : isCur ? (
                          <RotateCw size={15} className="spin-slow" />
                        ) : (
                          <span>{m.step}</span>
                        )}
                      </div>
                      <div className="milestone-text">
                        <span className={`milestone-name ${isCur ? 'text-blue' : !isDone ? 'text-muted' : ''}`}>
                          {m.name}
                        </span>
                        <span className={`milestone-time ${isDone ? 'green' : isCur ? 'text-blue' : 'text-muted'}`}>
                          {m.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. Filter Pills & Search Controls Bar */}
        <div className="bookings-controls-wrapper">
          {/* Tabs Top Row */}
          <div className="bookings-filter-tabs">
            {[
              `All (${totalCount})`,
              `Active (${activeCount})`,
              `Upcoming (${upcomingCount})`,
              `Completed (${completedCount})`,
              `Cancelled (${cancelledCount})`,
            ].map((tab) => {
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
                placeholder="Search by Ref ID, Vehicle, Plate, or Service..."
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
                <option value="year">2025 / 2026</option>
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

            {/* Reload / Reset Filter Button */}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedHub('All');
                setActiveFilter('All');
                fetchBookings();
              }}
              className="btn-refresh-filter"
              title="Refresh live bookings from server"
            >
              <RotateCw size={15} className={isLoading ? 'spin-animation' : ''} />
            </button>
          </div>
        </div>

        {/* 6. List of Bookings */}
        <div className="bookings-records-list">
          {isLoading ? (
            <div className="bookings-loading-state">
              <Loader2 size={36} className="spin-animation text-blue" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', color: '#0f172a' }}>Loading Bookings...</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>Retrieving live vehicle service records from database.</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="empty-bookings-notice">
              <Calendar size={42} className="empty-icon" />
              <h3>No Bookings Found</h3>
              <p>
                {searchQuery || activeFilter !== 'All' || selectedHub !== 'All'
                  ? 'No service bookings match your search or filter criteria.'
                  : user
                    ? `You don't have any service bookings registered under ${user.email} yet.`
                    : 'No scheduled service bookings found. Book your first appointment today!'}
              </p>
              {searchQuery || activeFilter !== 'All' || selectedHub !== 'All' ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('All');
                    setSelectedHub('All');
                  }}
                  className="btn-light-action"
                  style={{ marginTop: '1rem' }}
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNavigateBook}
                  className="btn-book-new-service"
                  style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <PlusCircle size={18} />
                  <span>Book New Service</span>
                </button>
              )}
            </div>
          ) : (
            filteredList.map((item) => (
              <div key={item.id} className="booking-record-card">
                {/* Date Left Badge */}
                <div
                  className={`record-date-badge ${
                    item.status === 'Cancelled' || item.statusGroup === 'cancelled'
                      ? 'date-cancelled'
                      : item.statusGroup === 'completed' || item.status === 'Completed'
                        ? 'date-completed'
                        : 'date-upcoming'
                  }`}
                >
                  <span className="badge-month">{item.month || 'NOV'}</span>
                  <span className="badge-day">{item.day || '15'}</span>
                </div>

                {/* Center Content */}
                <div className="record-center-info">
                  <div className="record-title-row">
                    <h3 className="record-title">{item.title || item.serviceTitle}</h3>
                    <span className={`status-pill ${item.statusBadgeClass || 'badge-confirmed-blue'}`}>
                      {item.statusLabel || item.status}
                    </span>
                  </div>

                  <div className="record-meta-line">
                    <span>{item.vehicle || item.vehicleText}</span>
                    {item.plate && (
                      <>
                        <span className="dot-divider">•</span>
                        <span>Plate: {item.plate}</span>
                      </>
                    )}
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
                    <span className="dot-divider">•</span>
                    <span>{item.hub || 'Apex Central Hub'}</span>
                    <span className="dot-divider">•</span>
                    <strong style={{ color: '#0066f5' }}>{item.price}</strong>
                    <span className="dot-divider">•</span>
                    <span className="ref-tag">#{item.bookingRef ? item.bookingRef.replace(/^#/, '') : item.id}</span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="record-actions-group">
                  {/* Invoice action for completed or in-bay bookings */}
                  {(item.status === 'Completed' || item.status === 'completed' || item.status === 'In-Bay' || item.statusGroup === 'completed') && (
                    <button
                      type="button"
                      onClick={() => handleOpenInvoice(item)}
                      className="btn-record-action"
                      title="View itemized service invoice"
                    >
                      <FileText size={14} className="action-icon" />
                      <span>Invoice</span>
                    </button>
                  )}

                  {/* Reschedule action for upcoming bookings */}
                  {(item.status === 'Confirmed' || item.status === 'Pending' || item.statusGroup === 'upcoming') && (
                    <button
                      type="button"
                      onClick={() => handleOpenReschedule(item)}
                      className="btn-record-action"
                      title="Reschedule this appointment"
                    >
                      <Calendar size={14} className="action-icon" />
                      <span>Reschedule</span>
                    </button>
                  )}

                  {/* Cancel button for upcoming appointments */}
                  {(item.status === 'Confirmed' || item.status === 'Pending' || item.statusGroup === 'upcoming') && (
                    <button
                      type="button"
                      onClick={() => handleOpenCancel(item)}
                      className="btn-record-cancel"
                      title="Cancel this appointment"
                    >
                      <X size={13} />
                      <span>Cancel</span>
                    </button>
                  )}

                  {/* Re-book action for cancelled bookings */}
                  {(item.status === 'Cancelled' || item.statusGroup === 'cancelled') && (
                    <button
                      type="button"
                      onClick={onNavigateBook}
                      className="btn-record-action text-blue"
                      title="Rebook this service appointment"
                    >
                      <RotateCw size={13} className="action-icon" />
                      <span>Re-Book</span>
                    </button>
                  )}

                  {/* View Details always available */}
                  <button
                    type="button"
                    onClick={() => handleOpenDetails(item)}
                    className="btn-record-action"
                    title="View complete booking telemetry"
                  >
                    <span>View Details</span>
                  </button>
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
              onClick={() => alert('Opening ApexDrive Help Center & Technical FAQs.')}
              className="btn-help-center"
            >
              <HelpCircle size={15} />
              <span>Help Center</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Connecting to Master Advisor Hotline: 1-800-APEX-CAR')}
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

      {/* ========================================================================= */}
      {/* Interactive Modals */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            className={`modal-content booking-detail-modal ${activeModal.type === 'invoice' ? 'modal-lg' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header-line">
              <h3 className="modal-title">
                {activeModal.type === 'invoice' && 'Itemized Service Invoice'}
                {activeModal.type === 'details' && 'Booking Details & Telemetry'}
                {activeModal.type === 'advisor' && 'Dedicated Service Advisor'}
                {activeModal.type === 'reschedule' && 'Reschedule Appointment'}
                {activeModal.type === 'cancel' && 'Cancel Service Appointment'}
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
              {modalError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.88rem' }}>
                  {modalError}
                </div>
              )}

              {/* ---------------- 1. INVOICE MODAL ---------------- */}
              {activeModal.type === 'invoice' && (
                <div>
                  {modalLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <Loader2 size={32} className="spin-animation" style={{ color: '#0066f5', margin: '0 auto 0.75rem' }} />
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Generating official service invoice breakdown...</p>
                    </div>
                  ) : invoiceData ? (
                    <div>
                      {/* Meta header */}
                      <div className="invoice-header-meta">
                        <div>
                          <div className="invoice-num-title">{invoiceData.invoiceNumber}</div>
                          <div className="invoice-date-text">
                            Issued: {invoiceData.invoiceDate} • Due: {invoiceData.dueDate}
                          </div>
                        </div>
                        <div>
                          <span className={invoiceData.paymentStatus === 'Paid' ? 'invoice-paid-badge' : 'status-pill status-pending-amber'}>
                            {invoiceData.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="invoice-info-grid">
                        <div className="invoice-info-block">
                          <div className="info-block-title">Customer Details</div>
                          <div><strong>{invoiceData.customer?.name}</strong></div>
                          <div style={{ color: '#64748b' }}>{invoiceData.customer?.email}</div>
                          <div style={{ color: '#0066f5', fontWeight: 600, marginTop: '0.2rem' }}>
                            {invoiceData.customer?.discountApplied}
                          </div>
                        </div>
                        <div className="invoice-info-block">
                          <div className="info-block-title">Vehicle &amp; Facility</div>
                          <div><strong>{invoiceData.vehicle?.vehicleName}</strong></div>
                          <div style={{ color: '#64748b' }}>Plate: {invoiceData.vehicle?.plate} • {invoiceData.vehicle?.mileage}</div>
                          <div style={{ color: '#475569', marginTop: '0.2rem' }}>{invoiceData.hub}</div>
                        </div>
                      </div>

                      {/* Breakdown table */}
                      <div className="invoice-table-wrap">
                        <table className="invoice-items-table">
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th style={{ textAlign: 'center' }}>Qty / Hrs</th>
                              <th style={{ textAlign: 'right' }}>Total (LKR)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceData.itemizedBreakdown?.map((item, idx) => (
                              <tr key={idx}>
                                <td>
                                  <strong>{item.code}</strong> - {item.description}
                                </td>
                                <td style={{ textAlign: 'center', color: '#64748b' }}>
                                  {item.hours || item.quantity}
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                  {item.rate}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Financials totals */}
                      <div className="invoice-summary-box">
                        <div className="inv-line">
                          <span>Service Subtotal:</span>
                          <span>LKR {Number(invoiceData.financials?.subtotal || 0).toFixed(2)}</span>
                        </div>
                        {invoiceData.financials?.discount > 0 && (
                          <div className="inv-line" style={{ color: '#16a34a' }}>
                            <span>Member Privilege Discount ({invoiceData.financials.discountLabel}):</span>
                            <span>-LKR {Number(invoiceData.financials.discount).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="inv-line">
                          <span>Hazardous Materials &amp; Environmental Recycling:</span>
                          <span>LKR {Number(invoiceData.financials?.environmentalFee || 0).toFixed(2)}</span>
                        </div>
                        <div className="inv-line">
                          <span>California / State Sales &amp; Service Tax ({invoiceData.financials?.taxRate}):</span>
                          <span>LKR {Number(invoiceData.financials?.taxAmount || 0).toFixed(2)}</span>
                        </div>
                        <div className="inv-line bold">
                          <span>Total Amount:</span>
                          <span className="text-blue" style={{ fontSize: '1.25rem' }}>
                            LKR {Number(invoiceData.financials?.grandTotal || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.75rem', textAlign: 'center' }}>
                        {invoiceData.terms}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
                      Invoice details unavailable for this booking.
                    </div>
                  )}

                  <div className="modal-actions-bar">
                    {invoiceData && (
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="btn-secondary-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                      >
                        <Printer size={15} />
                        <span>Print / Save PDF</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="btn-primary"
                    >
                      Close Invoice
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- 2. DETAILS MODAL ---------------- */}
              {activeModal.type === 'details' && (
                <div>
                  {modalLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <Loader2 size={32} className="spin-animation" style={{ color: '#0066f5', margin: '0 auto 0.75rem' }} />
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading live diagnostic telemetry...</p>
                    </div>
                  ) : detailedBooking ? (
                    <div className="details-preview">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span className="ref-tag" style={{ fontSize: '0.9rem' }}>
                          Booking {detailedBooking.bookingRef || `#${detailedBooking.id}`}
                        </span>
                        <span className={`status-pill ${detailedBooking.statusBadgeClass || 'badge-confirmed-blue'}`}>
                          {detailedBooking.statusLabel || detailedBooking.status}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                        {detailedBooking.title || detailedBooking.serviceTitle}
                      </h4>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                        {detailedBooking.serviceDetail || 'Precision High-Performance Intake Service Protocol'}
                      </p>

                      <div className="detail-specs-box">
                        <div>
                          <strong>Vehicle:</strong> {detailedBooking.vehicle || detailedBooking.vehicleText} (Plate: {detailedBooking.plate || 'CA 8XYZ901'})
                        </div>
                        <div>
                          <strong>Service Hub &amp; Bay:</strong> {detailedBooking.hub || 'Apex Central Hub'} • {detailedBooking.bay || 'Bay 03'}
                        </div>
                        <div>
                          <strong>Assigned Master Technician:</strong> {detailedBooking.technician || 'Dave Miller (ASE Master)'}
                        </div>
                        <div>
                          <strong>Appointment Window:</strong> {detailedBooking.scheduledDate || 'Today'} at {detailedBooking.scheduledTime || '10:00 AM'}
                        </div>
                        <div>
                          <strong>Estimated Cost:</strong> <span style={{ color: '#0066f5', fontWeight: 700 }}>{detailedBooking.price || `LKR ${Number(detailedBooking.totalCost || 0).toFixed(2)}`}</span>
                        </div>
                        {detailedBooking.notes && (
                          <div style={{ background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '0.35rem' }}>
                            <strong>Customer Notes:</strong> {detailedBooking.notes}
                          </div>
                        )}
                        {detailedBooking.cancellationReason && (
                          <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #fecaca', marginTop: '0.35rem' }}>
                            <strong>Cancellation Reason:</strong> {detailedBooking.cancellationReason}
                          </div>
                        )}
                      </div>

                      {detailedBooking.telemetry && (
                        <div style={{ marginTop: '1.25rem' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                            Telemetry Step: {detailedBooking.telemetry.stepName}
                          </div>
                          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${detailedBooking.telemetry.progressPercent || 50}%`,
                                height: '100%',
                                background: '#0066f5',
                                borderRadius: '4px',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="modal-actions-bar">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="btn-primary"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- 3. RESCHEDULE MODAL ---------------- */}
              {activeModal.type === 'reschedule' && (
                <div className="reschedule-preview">
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                    Select a new appointment window for:
                  </p>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                    {activeModal.data.title || activeModal.data.serviceTitle}
                  </h4>
                  <p style={{ color: '#0066f5', fontSize: '0.88rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                    Current slot: {activeModal.data.scheduledDate || 'Today'}, {activeModal.data.scheduledTime || '10:00 AM'}
                  </p>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                      Choose New Date
                    </label>
                    <input
                      type="text"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      placeholder="e.g. NOV 18, 2025"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.95rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                      Choose Time Window
                    </label>
                    <div className="reschedule-slots-grid">
                      {['09:00 AM', '10:30 AM', '01:30 PM', '03:30 PM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setRescheduleSlot(slot)}
                          className={`slot-option ${rescheduleSlot === slot ? 'active' : ''}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                      Reschedule Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={rescheduleNotes}
                      onChange={(e) => setRescheduleNotes(e.target.value)}
                      placeholder="Special instructions or notes for intake team..."
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.95rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div className="modal-actions-bar">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="btn-secondary-outline"
                      disabled={isSubmittingReschedule}
                    >
                      Keep Current Window
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmReschedule}
                      disabled={isSubmittingReschedule}
                      className="btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                    >
                      {isSubmittingReschedule ? (
                        <>
                          <Loader2 size={16} className="spin-animation" />
                          <span>Rescheduling...</span>
                        </>
                      ) : (
                        <span>Confirm Reschedule</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- 4. CANCEL MODAL ---------------- */}
              {activeModal.type === 'cancel' && (
                <div>
                  <div className="cancel-warning-box">
                    <AlertTriangle size={24} style={{ color: '#ea580c', flexShrink: 0 }} />
                    <div className="cancel-warning-text">
                      <strong>Are you sure you want to cancel this booking?</strong>
                      <p style={{ marginTop: '0.25rem' }}>
                        Your reserved service bay and technician allocation for <strong>{activeModal.data.title || activeModal.data.serviceTitle}</strong> will be released.
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                      Reason for Cancellation
                    </label>
                    <textarea
                      rows={3}
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Please let us know why you are cancelling (e.g. Schedule conflict, sold vehicle, etc.)..."
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.95rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div className="modal-actions-bar">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="btn-secondary-outline"
                      disabled={isSubmittingCancel}
                    >
                      Keep Appointment
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCancel}
                      disabled={isSubmittingCancel}
                      className="btn-danger-confirm"
                    >
                      {isSubmittingCancel ? (
                        <>
                          <Loader2 size={16} className="spin-animation" />
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        <span>Yes, Cancel Appointment</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- 5. ADVISOR MODAL ---------------- */}
              {activeModal.type === 'advisor' && (
                <div className="advisor-preview">
                  <div className="advisor-avatar-box">
                    <MessageSquare size={24} className="text-blue" />
                  </div>
                  <h4>Connected with {activeModal.data.advisor}</h4>
                  <p>Dedicated {activeModal.data.bay || 'Apex Precision'} Service Specialist</p>
                  <div className="advisor-contact-pill">
                    <span>Direct Hotline: {activeModal.data.directLine}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '1rem' }}>
                    Our master technicians provide direct telemetry consults and real-time bay updates.
                  </p>

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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
