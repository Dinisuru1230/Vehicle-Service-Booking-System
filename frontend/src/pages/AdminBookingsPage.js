import React, { useState } from 'react';
import {
  Car,
  LayoutDashboard,
  Calendar,
  Wrench,
  Users,
  Settings,
  LogOut,
  Plus,
  Bell,
  Download,
  Search,
  Filter,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Activity,
  Gauge,
  X,
  FileSpreadsheet,
  UserCheck,
} from 'lucide-react';

const initialBookings = [
  {
    id: 'APX-84920',
    initials: 'AW',
    avatarBg: 'avatar-light-blue',
    customer: 'Alexander Wright',
    vehicle: '2023 BMW M3',
    plate: 'CA 8XYZ901',
    serviceTitle: 'Periodic Maintenance & Synthetic Oil',
    serviceDetail: 'Tier 1 Service • 4.8L TwinPower Spec',
    time: 'Today, 10:30 AM',
    bay: 'Bay 3 (Lift Heavy)',
    timeIcon: 'clock',
    techInitials: 'DM',
    techBg: 'tech-dark',
    technician: 'Dave Miller',
    status: 'Pending',
    statusClass: 'status-pending-amber',
  },
  {
    id: 'APX-85104',
    initials: 'ER',
    avatarBg: 'avatar-light-blue',
    customer: 'Elena Rostova',
    vehicle: '2021 Porsche 911 GT3 RS',
    plate: 'NV 3TRK77',
    serviceTitle: 'Track Alignment & Corner Balance',
    serviceDetail: 'Laser Chassis Rig • Aero Calibration',
    time: 'Today, 11:00 AM',
    bay: 'Bay 1 (Dyno Rack)',
    bayHighlight: 'text-blue',
    timeIcon: 'lift',
    techInitials: 'MV',
    techBg: 'tech-blue',
    technician: 'Marcus Vance',
    status: 'In-Bay',
    statusClass: 'status-inbay-blue',
  },
  {
    id: 'APX-85219',
    initials: 'LH',
    avatarBg: 'avatar-light-blue',
    customer: 'Liam Henderson',
    vehicle: '2022 Tesla Model S',
    plate: 'CA 5EV202',
    serviceTitle: 'Battery Health & EV Diagnostics',
    serviceDetail: 'Cell Voltage Delta • Thermal Loop Run',
    time: 'Today, 11:15 AM',
    bay: 'Bay 5 (EV Station)',
    timeIcon: 'calendar',
    techInitials: 'SR',
    techBg: 'tech-slate',
    technician: 'Sam Rivera',
    status: 'Confirmed',
    statusClass: 'status-confirmed-indigo',
  },
  {
    id: 'APX-79102',
    initials: 'SM',
    avatarBg: 'avatar-light-blue',
    customer: 'Sophia Martinez',
    vehicle: '2020 Audi RS6 Avant',
    plate: 'NY RS6-88',
    serviceTitle: 'Brake System Lathe & Pad Service',
    serviceDetail: 'Carbon Ceramic Inspection • Bleed',
    time: 'Today, 08:45 AM',
    bay: 'Bay 2 (Done • QC Signed)',
    bayHighlight: 'text-green',
    timeIcon: 'check',
    techInitials: 'DM',
    techBg: 'tech-dark',
    technician: 'Dave Miller',
    status: 'Completed',
    statusClass: 'status-completed-emerald',
  },
  {
    id: 'APX-79088',
    initials: 'DC',
    avatarBg: 'avatar-light-blue',
    customer: 'David Chen',
    vehicle: '2024 Ford F-150 Lightning',
    plate: 'WA 9LGT44',
    serviceTitle: '40-Point Powertrain Inspection',
    serviceDetail: 'Drivetrain Telemetry • Inverter Log',
    time: 'Today, 02:00 PM',
    bay: 'Bay 4 (Scheduled)',
    timeIcon: 'clock',
    techInitials: 'AW',
    techBg: 'tech-slate',
    technician: 'Alex Wong',
    status: 'Pending',
    statusClass: 'status-pending-amber',
  },
  {
    id: 'APX-78954',
    initials: 'SJ',
    avatarBg: 'avatar-light-blue',
    customer: 'Sarah Jenkins',
    vehicle: '2022 Mercedes-AMG C63',
    plate: 'TX AMG-10',
    serviceTitle: 'ECU Tuning & Dyno Run',
    serviceDetail: 'Custom Map Calibration • Boost Curve',
    time: 'Today, 03:30 PM',
    bay: 'Bay 6 (Acoustic Cell)',
    timeIcon: 'calendar',
    techInitials: 'SR',
    techBg: 'tech-slate',
    technician: 'Sam Rivera',
    status: 'Confirmed',
    statusClass: 'status-confirmed-indigo',
  },
];

const AdminBookingsPage = ({
  onNavigateDashboard,
  onNavigateCustomers,
  onNavigateServices,
  onNavigateStaff,
  onNavigateSettings,
  onNavigateHome,
  onNavigateBook,
  onNavigateProfile,
}) => {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bayFilter, setBayFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMsg, setToastMsg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // New Booking Form state
  const [newBooking, setNewBooking] = useState({
    customer: '',
    vehicle: '',
    plate: '',
    serviceTitle: 'Periodic Maintenance & Synthetic Oil',
    time: 'Today, 04:30 PM',
    bay: 'Bay 3 (Lift Heavy)',
    technician: 'Dave Miller',
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((item) => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (bayFilter !== 'All' && !item.bay.includes(bayFilter)) return false;
    if (categoryFilter !== 'All' && !item.serviceTitle.includes(categoryFilter)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.vehicle.toLowerCase().includes(q) ||
        item.serviceTitle.toLowerCase().includes(q) ||
        item.technician.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleCreateBooking = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `APX-${Math.floor(10000 + Math.random() * 90000)}`,
      initials: newBooking.customer
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'CU',
      avatarBg: 'avatar-light-blue',
      customer: newBooking.customer || 'New Customer',
      vehicle: newBooking.vehicle || '2024 Vehicle',
      plate: newBooking.plate || 'CA 999ZZ',
      serviceTitle: newBooking.serviceTitle,
      serviceDetail: 'Scheduled Standard Intake Protocol',
      time: newBooking.time,
      bay: newBooking.bay,
      timeIcon: 'clock',
      techInitials: 'DM',
      techBg: 'tech-dark',
      technician: newBooking.technician,
      status: 'Confirmed',
      statusClass: 'status-confirmed-indigo',
    };

    setBookings([newEntry, ...bookings]);
    setModalOpen(false);
    showToast(`Booking #${newEntry.id} scheduled successfully!`);
    setNewBooking({
      customer: '',
      vehicle: '',
      plate: '',
      serviceTitle: 'Periodic Maintenance & Synthetic Oil',
      time: 'Today, 04:30 PM',
      bay: 'Bay 3 (Lift Heavy)',
      technician: 'Dave Miller',
    });
  };

  return (
    <div className="admin-portal-root">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="admin-toast-banner">
          <CheckCircle2 size={18} className="toast-icon text-green" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================
          LEFT SIDEBAR (Bookings Active)
          ======================================================== */}
      <aside className="admin-sidebar">
        <div className="admin-brand-header">
          <div className="admin-brand-icon">
            <Car size={20} />
          </div>
          <div className="admin-brand-text">
            <div className="brand-title">
              APEX<span className="brand-accent">DRIVE</span>
            </div>
            <div className="brand-sub">ADMIN CONSOLE</div>
          </div>
        </div>

        <div className="admin-nav-section">
          <span className="admin-nav-label">MAIN MENU</span>
          <nav className="admin-nav-menu">
            <button
              type="button"
              onClick={onNavigateDashboard}
              className="admin-nav-item"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className="admin-nav-item active"
            >
              <Calendar size={18} />
              <span>Bookings</span>
              <span className="badge-counter-pill">12</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateCustomers) {
                  onNavigateCustomers();
                } else {
                  showToast('Customer accounts directory');
                }
              }}
              className="admin-nav-item"
            >
              <UserCheck size={18} />
              <span>Customers</span>
              <span className="badge-counter-pill count-blue">8</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateServices) {
                  onNavigateServices();
                } else {
                  showToast('Services & Pricing catalog');
                }
              }}
              className="admin-nav-item"
            >
              <Wrench size={18} />
              <span>Services &amp; Pricing</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateStaff) {
                  onNavigateStaff();
                } else {
                  showToast('Staff & Technicians roster');
                }
              }}
              className="admin-nav-item"
            >
              <Users size={18} />
              <span>Staff &amp; Technicians</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateSettings) {
                  onNavigateSettings();
                } else {
                  showToast('Console Settings');
                }
              }}
              className="admin-nav-item"
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <div
            className="admin-user-info-row"
            onClick={onNavigateProfile}
            style={{ cursor: 'pointer' }}
            title="Open Admin Profile"
          >
            <div className="admin-avatar-small">
              <span>MV</span>
            </div>
            <div className="admin-name-col">
              <div className="admin-name">Marcus Vance</div>
              <div className="admin-role">Admin</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="btn-admin-signout"
            title="Return to customer website"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          RIGHT MAIN WRAP
          ======================================================== */}
      <div className="admin-main-wrap">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-breadcrumb">
            <span className="crumb-gray">Admin</span>
            <span className="crumb-separator">/</span>
            <span className="crumb-dark">Bookings</span>
          </div>

          <div className="topbar-actions-cluster">
            <button
              type="button"
              onClick={onNavigateHome}
              className="btn-client-view"
              title="View customer facing website"
            >
              <ExternalLink size={14} />
              <span>Client Site</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Notifications are all caught up.')}
              className="topbar-icon-btn"
              title="Notifications"
            >
              <Bell size={18} />
            </button>

            <div
              className="topbar-avatar-btn"
              onClick={onNavigateProfile}
              title="Open Admin Profile"
            >
              <span>MV</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content-area">
          {/* Header Row */}
          <div className="manage-bookings-header-row">
            <div className="header-left-title-block">
              <div className="eyebrows-badge-row">
                <span className="badge-logistics-pill">WORKSHOP LOGISTICS</span>
                <span className="live-bay-feed-indicator">
                  <span className="pulse-green-dot"></span>
                  <span>LIVE BAY FEED</span>
                </span>
              </div>

              <h1 className="manage-bookings-title">Manage Bookings</h1>
              <p className="manage-bookings-subtitle">
                Track, filter, and assign vehicle service appointments and workshop bay schedules.
              </p>
            </div>

            <div className="header-right-action-cluster">
              <button
                type="button"
                onClick={() => showToast('Exporting bookings database to CSV format...')}
                className="btn-export-csv"
              >
                <Download size={15} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn-create-booking-blue"
              >
                <Plus size={16} />
                <span>Create Booking</span>
              </button>
            </div>
          </div>

          {/* 4 Counter Cards */}
          <div className="admin-stats-grid mb-4">
            {/* Card 1: TOTAL BOOKINGS */}
            <div className="admin-stat-metric-card">
              <div className="stat-card-header">
                <span className="stat-card-eyebrow">TOTAL BOOKINGS</span>
                <div className="stat-card-icon-box bg-light-blue">
                  <Calendar size={18} className="text-blue" />
                </div>
              </div>
              <div className="stat-card-number">1,248</div>
              <div className="stat-card-footer-pill-line">
                <span className="stat-pill-highlight green">↗ +8%</span>
                <span className="stat-pill-label">vs previous week</span>
              </div>
            </div>

            {/* Card 2: PENDING CONFIRMATION */}
            <div className="admin-stat-metric-card">
              <div className="stat-card-header">
                <span className="stat-card-eyebrow">PENDING CONFIRMATION</span>
                <div className="stat-card-icon-box bg-light-coral">
                  <Clock size={18} className="text-coral" />
                </div>
              </div>
              <div className="stat-card-number">14</div>
              <div className="stat-card-footer-pill-line">
                <span className="stat-pill-highlight coral">Action Required</span>
                <span className="stat-pill-label">Awaiting intake queue</span>
              </div>
            </div>

            {/* Card 3: TODAY'S IN-BAY */}
            <div className="admin-stat-metric-card">
              <div className="stat-card-header">
                <span className="stat-card-eyebrow">TODAY'S IN-BAY</span>
                <div className="stat-card-icon-box bg-light-indigo">
                  <Building2 size={18} className="text-indigo" />
                </div>
              </div>
              <div className="stat-card-number">8</div>
              <div className="stat-card-footer-pill-line">
                <span className="stat-pill-highlight blue">Bay 1–8 active</span>
                <span className="stat-pill-label">Full capacity utilized</span>
              </div>
            </div>

            {/* Card 4: COMPLETED TODAY */}
            <div className="admin-stat-metric-card">
              <div className="stat-card-header">
                <span className="stat-card-eyebrow">COMPLETED TODAY</span>
                <div className="stat-card-icon-box bg-light-green">
                  <CheckCircle2 size={18} className="text-green" />
                </div>
              </div>
              <div className="stat-card-number">38</div>
              <div className="stat-card-footer-pill-line">
                <span className="stat-pill-highlight green">$4,650</span>
                <span className="stat-pill-label">gross invoiced</span>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar Card */}
          <div className="manage-bookings-filter-bar">
            {/* Search Input */}
            <div className="filter-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by booking ID, customer name, vehicle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-search-input"
              />
            </div>

            {/* Dropdown 1: Status */}
            <div className="filter-dropdown-box">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">Status: All Statuses</option>
                <option value="Pending">Status: Pending</option>
                <option value="In-Bay">Status: In-Bay</option>
                <option value="Confirmed">Status: Confirmed</option>
                <option value="Completed">Status: Completed</option>
              </select>
              <ChevronDown size={14} className="dropdown-caret" />
            </div>

            {/* Dropdown 2: Date */}
            <div className="filter-dropdown-box">
              <select className="filter-select">
                <option>Date: Today (Oct 24, 2025)</option>
                <option>Tomorrow (Oct 25, 2025)</option>
                <option>This Week</option>
                <option>All Dates</option>
              </select>
              <Calendar size={14} className="dropdown-caret" />
            </div>

            {/* Dropdown 3: Category */}
            <div className="filter-dropdown-box">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">Category: All Services</option>
                <option value="Periodic Maintenance">Periodic Maintenance</option>
                <option value="Track Alignment">Track Alignment</option>
                <option value="Battery Health">Battery Health &amp; EV</option>
                <option value="Brake System">Brake Lathe &amp; Pads</option>
                <option value="Powertrain">Powertrain Inspection</option>
                <option value="ECU Tuning">ECU Tuning &amp; Dyno</option>
              </select>
              <Filter size={14} className="dropdown-caret" />
            </div>

            {/* Dropdown 4: Bay / Tech */}
            <div className="filter-dropdown-box">
              <select
                value={bayFilter}
                onChange={(e) => setBayFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">Bay / Tech: All Bays</option>
                <option value="Bay 1">Bay 1 (Dyno Rack)</option>
                <option value="Bay 2">Bay 2 (Lathe &amp; QC)</option>
                <option value="Bay 3">Bay 3 (Lift Heavy)</option>
                <option value="Bay 4">Bay 4 (Scheduled)</option>
                <option value="Bay 5">Bay 5 (EV Station)</option>
                <option value="Bay 6">Bay 6 (Acoustic Cell)</option>
              </select>
              <Wrench size={14} className="dropdown-caret" />
            </div>

            {/* Clear / Reset Filter Button */}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setBayFilter('All');
                setCategoryFilter('All');
              }}
              className="btn-clear-filters"
              title="Reset all filters"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Bookings Table Card */}
          <div className="manage-bookings-table-card">
            <div className="table-responsive-wrapper">
              <table className="manage-bookings-table">
                <thead>
                  <tr>
                    <th>BOOKING ID</th>
                    <th>CUSTOMER &amp; VEHICLE</th>
                    <th>SERVICE PACKAGE</th>
                    <th>SCHEDULED TIME &amp; BAY</th>
                    <th>TECHNICIAN</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5">
                        <div className="empty-filter-state">
                          <AlertCircle size={36} className="text-muted mb-2" />
                          <h4>No matching bookings found</h4>
                          <p>Try resetting your filter parameters or search keyword.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr
                        key={b.id}
                        className="booking-interactive-row"
                        onClick={() => setSelectedBooking(b)}
                      >
                        {/* 1. BOOKING ID */}
                        <td className="cell-booking-id">
                          <span className="booking-id-badge">#{b.id}</span>
                        </td>

                        {/* 2. CUSTOMER & VEHICLE */}
                        <td className="cell-customer-vehicle">
                          <div className="customer-avatar-lockup">
                            <div className="customer-avatar-circle">
                              <span>{b.initials}</span>
                            </div>
                            <div className="customer-text-col">
                              <span className="customer-full-name">{b.customer}</span>
                              <span className="customer-vehicle-meta">
                                {b.vehicle} • {b.plate}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 3. SERVICE PACKAGE */}
                        <td className="cell-service-package">
                          <div className="service-title-bold">{b.serviceTitle}</div>
                          <div className="service-sub-detail">{b.serviceDetail}</div>
                        </td>

                        {/* 4. SCHEDULED TIME & BAY */}
                        <td className="cell-schedule-bay">
                          <div className="schedule-time-row">
                            {b.timeIcon === 'clock' && (
                              <Clock size={15} className="time-icon-blue" />
                            )}
                            {b.timeIcon === 'lift' && (
                              <Activity size={15} className="time-icon-blue" />
                            )}
                            {b.timeIcon === 'calendar' && (
                              <Calendar size={15} className="time-icon-blue" />
                            )}
                            {b.timeIcon === 'check' && (
                              <CheckCircle2 size={15} className="time-icon-green" />
                            )}
                            <span className="schedule-time-text">{b.time}</span>
                          </div>
                          <div className={`schedule-bay-subtext ${b.bayHighlight || ''}`}>
                            {b.bay}
                          </div>
                        </td>

                        {/* 5. TECHNICIAN */}
                        <td className="cell-technician">
                          <div className="tech-avatar-lockup">
                            <div className={`tech-avatar-circle ${b.techBg}`}>
                              <span>{b.techInitials}</span>
                            </div>
                            <span className="tech-name-text">{b.technician}</span>
                          </div>
                        </td>

                        {/* 6. STATUS */}
                        <td className="cell-status">
                          <span className={`status-pill ${b.statusClass}`}>
                            <span className="status-dot"></span>
                            <span>{b.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Row */}
            <div className="table-pagination-row">
              <span className="pagination-info-text">
                Showing <strong>1–{filteredBookings.length}</strong> of <strong>38</strong> bookings today
              </span>

              <div className="pagination-buttons-cluster">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="btn-pagination-nav"
                >
                  Previous
                </button>

                {[1, 2, 3, 4].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`btn-pagination-page ${currentPage === p ? 'active' : ''}`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="btn-pagination-nav"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Bottom 3 Analytic / Status Cards Row */}
          <div className="manage-bookings-bottom-analytics">
            {/* Card 1: Bay Utilization Rate */}
            <div className="analytics-stat-card">
              <div className="card-top-header">
                <div className="header-icon-label">
                  <Gauge size={18} className="text-blue" />
                  <span className="card-label">Bay Utilization Rate</span>
                </div>
                <span className="card-accent-tag text-green">92% OPTIMAL</span>
              </div>

              <div className="donut-meter-content">
                <div className="donut-meter-wrap">
                  <svg viewBox="0 0 36 36" className="circular-donut">
                    <path
                      className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle-fill"
                      strokeDasharray="92, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="donut-center-text">
                    <span className="donut-pct">92%</span>
                  </div>
                </div>

                <p className="donut-desc">
                  6 of 6 hydraulic bay platforms actively scheduled or turning around. Next scheduled slot available at 04:45 PM.
                </p>
              </div>
            </div>

            {/* Card 2: Average Service Pace */}
            <div className="analytics-stat-card">
              <div className="card-top-header">
                <div className="header-icon-label">
                  <Clock size={18} className="text-blue" />
                  <span className="card-label">Average Service Pace</span>
                </div>
                <span className="card-accent-tag text-muted">TARGET: 1.5H</span>
              </div>

              <div className="pace-meter-content">
                <div className="pace-number-row">
                  <span className="pace-big-num">1h 18m</span>
                  <span className="pace-faster-pill">-12m faster</span>
                </div>

                <div className="pace-progress-track">
                  <div className="pace-progress-bar" style={{ width: '74%' }}></div>
                </div>

                <p className="pace-desc">
                  Intake turnaround running smoothly with zero dyno bottlenecks.
                </p>
              </div>
            </div>

            {/* Card 3: Automated Alerts */}
            <div className="analytics-stat-card">
              <div className="card-top-header">
                <div className="header-icon-label">
                  <Bell size={18} className="text-blue" />
                  <span className="card-label">Automated Alerts</span>
                </div>
                <span className="card-accent-tag text-muted">SYSTEM OK</span>
              </div>

              <div className="alerts-card-content">
                <div className="alerts-callout-box">
                  <div className="alerts-icon-box">
                    <MessageSquare size={18} className="text-blue" />
                  </div>
                  <div className="alerts-text-block">
                    <h5 className="alerts-title">SMS Customer Reminders</h5>
                    <p className="alerts-sub">
                      36/38 dispatch triggers delivered with 100% confirmation delivery rate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================
          CREATE BOOKING MODAL
          ======================================================== */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content admin-action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-line">
              <h3 className="modal-title">Create New Service Booking</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-close-modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="modal-body-pad">
              <div className="form-group mb-3">
                <label className="field-label">Customer Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Belfort"
                  required
                  value={newBooking.customer}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, customer: e.target.value })
                  }
                  className="admin-form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label className="field-label">Vehicle Make &amp; Model</label>
                <input
                  type="text"
                  placeholder="e.g. 2024 Audi RS6 Avant"
                  required
                  value={newBooking.vehicle}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, vehicle: e.target.value })
                  }
                  className="admin-form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label className="field-label">License Plate / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. TX-902-KPL"
                  value={newBooking.plate}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, plate: e.target.value })
                  }
                  className="admin-form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label className="field-label">Service Package</label>
                <select
                  value={newBooking.serviceTitle}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, serviceTitle: e.target.value })
                  }
                  className="admin-form-input"
                >
                  <option>Periodic Maintenance &amp; Synthetic Oil</option>
                  <option>Track Alignment &amp; Corner Balance</option>
                  <option>Battery Health &amp; EV Diagnostics</option>
                  <option>Brake System Lathe &amp; Pad Service</option>
                  <option>ECU Tuning &amp; Dyno Run</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label className="field-label">Assigned Bay</label>
                <select
                  value={newBooking.bay}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, bay: e.target.value })
                  }
                  className="admin-form-input"
                >
                  <option>Bay 1 (Dyno Rack)</option>
                  <option>Bay 2 (Lathe &amp; QC)</option>
                  <option>Bay 3 (Lift Heavy)</option>
                  <option>Bay 4 (Scheduled)</option>
                  <option>Bay 5 (EV Station)</option>
                  <option>Bay 6 (Acoustic Cell)</option>
                </select>
              </div>

              <div className="modal-actions-right">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-form-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-topbar-primary">
                  Confirm &amp; Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          BOOKING DETAILS INSPECTOR MODAL
          ======================================================== */}
      {selectedBooking && (
        <div className="modal-backdrop" onClick={() => setSelectedBooking(null)}>
          <div
            className="modal-content admin-action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-line">
              <h3 className="modal-title">
                Booking Details (#{selectedBooking.id})
              </h3>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="btn-close-modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-pad">
              <div className="booking-inspector-header">
                <div>
                  <h4>{selectedBooking.customer}</h4>
                  <p className="text-muted">
                    {selectedBooking.vehicle} • {selectedBooking.plate}
                  </p>
                </div>
                <span className={`status-pill ${selectedBooking.statusClass}`}>
                  {selectedBooking.status}
                </span>
              </div>

              <hr className="divider-line" />

              <div className="inspector-specs-list">
                <div className="spec-row">
                  <span>Service Package:</span>
                  <strong>{selectedBooking.serviceTitle}</strong>
                </div>
                <div className="spec-row">
                  <span>Scope / Protocol:</span>
                  <span>{selectedBooking.serviceDetail}</span>
                </div>
                <div className="spec-row">
                  <span>Scheduled Time:</span>
                  <span>{selectedBooking.time}</span>
                </div>
                <div className="spec-row">
                  <span>Workshop Bay:</span>
                  <span className="text-blue">{selectedBooking.bay}</span>
                </div>
                <div className="spec-row">
                  <span>Lead Technician:</span>
                  <strong>{selectedBooking.technician}</strong>
                </div>
              </div>

              <div className="modal-actions-right mt-4">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Dispatched technician notification to ${selectedBooking.technician}.`);
                    setSelectedBooking(null);
                  }}
                  className="btn-table-action-outline"
                >
                  Notify Tech
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="btn-topbar-primary"
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

export default AdminBookingsPage;
