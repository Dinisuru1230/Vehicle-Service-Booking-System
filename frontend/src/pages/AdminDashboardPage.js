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
  TrendingUp,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  FileText,
  UserPlus,
  DollarSign,
  Search,
  Filter,
  X,
  ExternalLink,
  UserCheck,
} from 'lucide-react';

const initialBookings = [
  {
    ref: '#APX-84920',
    customer: 'Alexander Wright',
    vehicle: '2023 BMW M3',
    service: 'ECU Tuning & Dyno',
    time: '10:30 AM',
    status: 'Pending',
    statusClass: 'status-pending-coral',
    actionText: 'Review',
    actionType: 'primary',
  },
  {
    ref: '#APX-85104',
    customer: 'Elena Rostova',
    vehicle: '2021 Porsche 911 GT3 RS',
    service: 'Track Alignment',
    time: '11:00 AM',
    status: 'In-Bay',
    statusClass: 'status-inbay-blue',
    actionText: 'Details',
    actionType: 'outline',
  },
  {
    ref: '#APX-85219',
    customer: 'Liam Henderson',
    vehicle: '2022 Tesla Model S',
    service: 'Battery Diagnostics',
    time: '11:15 AM',
    status: 'Confirmed',
    statusClass: 'status-confirmed-indigo',
    actionText: 'Assign',
    actionType: 'outline',
  },
  {
    ref: '#APX-79102',
    customer: 'Sophia Martinez',
    vehicle: '2020 Audi RS6 Avant',
    service: 'Major Service (30k)',
    time: '08:45 AM',
    status: 'Completed',
    statusClass: 'status-completed-emerald',
    actionText: 'Invoice',
    actionType: 'outline',
  },
];

const AdminDashboardPage = ({
  onNavigateHome,
  onNavigateBook,
  onNavigateBookings,
  onNavigateBookingsAdmin,
  onNavigateCustomersAdmin,
  onNavigateServicesAdmin,
  onNavigateStaffAdmin,
  onNavigateSettingsAdmin,
  onNavigateProfile,
}) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [bookingsList, setBookingsList] = useState(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null); // { type: 'new_booking' | 'add_customer' | 'invoice' | 'review' | 'details' | 'assign', data?: any }
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleActionClick = (row) => {
    if (row.actionText === 'Review') {
      setActiveModal({ type: 'review', data: row });
    } else if (row.actionText === 'Details') {
      setActiveModal({ type: 'details', data: row });
    } else if (row.actionText === 'Assign') {
      setActiveModal({ type: 'assign', data: row });
    } else if (row.actionText === 'Invoice') {
      setActiveModal({ type: 'invoice', data: row });
    }
  };

  return (
    <div className="admin-portal-root">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="admin-toast-banner">
          <CheckCircle2 size={18} className="toast-icon text-green" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================
          LEFT SIDEBAR (Main Navigation)
          ======================================================== */}
      <aside className="admin-sidebar">
        {/* Brand Lockup */}
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

        {/* Navigation Menu */}
        <div className="admin-nav-section">
          <span className="admin-nav-label">MAIN MENU</span>
          <nav className="admin-nav-menu">
            <button
              type="button"
              onClick={() => setActiveMenu('dashboard')}
              className={`admin-nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateBookingsAdmin) {
                  onNavigateBookingsAdmin();
                } else {
                  setActiveMenu('bookings');
                }
              }}
              className={`admin-nav-item ${activeMenu === 'bookings' ? 'active' : ''}`}
            >
              <Calendar size={18} />
              <span>Bookings</span>
              <span className="badge-counter-pill">12</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateCustomersAdmin) {
                  onNavigateCustomersAdmin();
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
                if (onNavigateServicesAdmin) {
                  onNavigateServicesAdmin();
                } else {
                  setActiveMenu('services');
                }
              }}
              className={`admin-nav-item ${activeMenu === 'services' ? 'active' : ''}`}
            >
              <Wrench size={18} />
              <span>Services &amp; Pricing</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateStaffAdmin) {
                  onNavigateStaffAdmin();
                } else {
                  setActiveMenu('staff');
                }
              }}
              className={`admin-nav-item ${activeMenu === 'staff' ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Staff &amp; Technicians</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateSettingsAdmin) {
                  onNavigateSettingsAdmin();
                } else {
                  setActiveMenu('settings');
                }
              }}
              className={`admin-nav-item ${activeMenu === 'settings' ? 'active' : ''}`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile & Sign Out Block */}
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
          RIGHT MAIN CONTAINER (Top Bar + Main Body)
          ======================================================== */}
      <div className="admin-main-wrap">
        {/* Top Header App Bar */}
        <header className="admin-topbar">
          <div className="topbar-breadcrumb">
            <span className="crumb-gray">Admin</span>
            <span className="crumb-separator">/</span>
            <span className="crumb-dark">
              {activeMenu === 'dashboard' && 'Dashboard'}
              {activeMenu === 'bookings' && 'Bookings Management'}
              {activeMenu === 'services' && 'Services & Catalog'}
              {activeMenu === 'staff' && 'Staff & Technicians'}
              {activeMenu === 'settings' && 'Settings'}
            </span>
          </div>

          <div className="topbar-actions-cluster">
            {/* Quick link to client portal */}
            <button
              type="button"
              onClick={onNavigateHome}
              className="btn-client-view"
              title="View customer facing website"
            >
              <ExternalLink size={14} />
              <span>Client Site</span>
            </button>

            {/* + New Booking Primary CTA */}
            <button
              type="button"
              onClick={() => setActiveModal({ type: 'new_booking' })}
              className="btn-topbar-primary"
            >
              <Plus size={16} />
              <span>New Booking</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => showToast('All notifications are up to date.')}
              className="topbar-icon-btn"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="notification-indicator-dot"></span>
            </button>

            {/* User Profile Avatar */}
            <div
              className="topbar-avatar-btn"
              onClick={onNavigateProfile}
              title="Open Admin Profile"
            >
              <span>MV</span>
            </div>
          </div>
        </header>

        {/* Main Body Content */}
        <main className="admin-content-area">
          {activeMenu === 'dashboard' && (
            <>
              {/* 1. Dashboard Overview Header Card */}
              <div className="dashboard-overview-card">
                <div className="overview-title-block">
                  <h1 className="overview-heading">Dashboard Overview</h1>
                  <p className="overview-subtext">
                    Overview of today's bookings, service activity, and workshop status.
                  </p>
                </div>

                <div className="overview-actions-group">
                  <div className="badge-today-date">
                    <Calendar size={15} className="text-blue" />
                    <span>Today: Oct 24, 2025</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast('Exporting daily operations report (PDF/CSV)...')}
                    className="btn-export-report"
                  >
                    <Download size={15} />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              {/* 2. 4-Stat Metric Summary Cards */}
              <div className="admin-stats-grid">
                {/* Stat 1: Total Bookings */}
                <div className="admin-stat-metric-card">
                  <div className="stat-card-header">
                    <span className="stat-card-eyebrow">TOTAL BOOKINGS</span>
                    <div className="stat-card-icon-box bg-light-blue">
                      <Calendar size={18} className="text-blue" />
                    </div>
                  </div>
                  <div className="stat-card-number">1,248</div>
                  <div className="stat-card-trend trend-green">
                    <TrendingUp size={14} />
                    <span>+12% vs last month</span>
                  </div>
                </div>

                {/* Stat 2: Pending Bookings */}
                <div className="admin-stat-metric-card">
                  <div className="stat-card-header">
                    <span className="stat-card-eyebrow">PENDING BOOKINGS</span>
                    <div className="stat-card-icon-box bg-light-coral">
                      <Clock size={18} className="text-coral" />
                    </div>
                  </div>
                  <div className="stat-card-number">14</div>
                  <div className="stat-card-trend trend-coral">
                    <AlertTriangle size={14} />
                    <span>Needs review</span>
                  </div>
                </div>

                {/* Stat 3: Active / In-Bay */}
                <div className="admin-stat-metric-card">
                  <div className="stat-card-header">
                    <span className="stat-card-eyebrow">ACTIVE / IN-BAY</span>
                    <div className="stat-card-icon-box bg-light-indigo">
                      <Activity size={18} className="text-indigo" />
                    </div>
                  </div>
                  <div className="stat-card-number">8</div>
                  <div className="stat-card-trend trend-gray">
                    <Users size={14} />
                    <span>Currently in service</span>
                  </div>
                </div>

                {/* Stat 4: Completed Today */}
                <div className="admin-stat-metric-card">
                  <div className="stat-card-header">
                    <span className="stat-card-eyebrow">COMPLETED TODAY</span>
                    <div className="stat-card-icon-box bg-light-green">
                      <CheckCircle2 size={18} className="text-green" />
                    </div>
                  </div>
                  <div className="stat-card-number">38</div>
                  <div className="stat-card-trend trend-green">
                    <DollarSign size={14} />
                    <span>$4,650 revenue</span>
                  </div>
                </div>
              </div>

              {/* 3. Bottom Grid: Recent Bookings (Left) + Workshop Bays & Quick Actions (Right) */}
              <div className="admin-bottom-grid">
                {/* Left Column: Recent Bookings */}
                <div className="recent-bookings-container">
                  <div className="recent-bookings-header">
                    <div className="bookings-header-title-box">
                      <h2 className="recent-title">Recent Bookings</h2>
                      <span className="badge-today-pill">Today</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateBookingsAdmin) {
                          onNavigateBookingsAdmin();
                        } else {
                          setActiveMenu('bookings');
                        }
                      }}
                      className="link-view-all-bookings"
                    >
                      <span>View All Bookings</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Table Component */}
                  <div className="admin-table-responsive">
                    <table className="admin-bookings-table">
                      <thead>
                        <tr>
                          <th>BOOKING REF</th>
                          <th>CUSTOMER &amp; VEHICLE</th>
                          <th>SERVICE PACKAGE</th>
                          <th>TIME</th>
                          <th>STATUS</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookingsList.map((row) => (
                          <tr key={row.ref}>
                            {/* REF */}
                            <td className="cell-ref">
                              <span className="booking-ref-blue">{row.ref}</span>
                            </td>

                            {/* CUSTOMER & VEHICLE */}
                            <td className="cell-customer">
                              <div className="customer-name-bold">{row.customer}</div>
                              <div className="vehicle-subtext">{row.vehicle}</div>
                            </td>

                            {/* SERVICE PACKAGE */}
                            <td className="cell-service">{row.service}</td>

                            {/* TIME */}
                            <td className="cell-time">{row.time}</td>

                            {/* STATUS */}
                            <td className="cell-status">
                              <span className={`status-pill ${row.statusClass}`}>
                                <span className="status-dot"></span>
                                <span>{row.status}</span>
                              </span>
                            </td>

                            {/* ACTION BUTTON */}
                            <td className="cell-action">
                              <button
                                type="button"
                                onClick={() => handleActionClick(row)}
                                className={
                                  row.actionType === 'primary'
                                    ? 'btn-table-action-primary'
                                    : 'btn-table-action-outline'
                                }
                              >
                                {row.actionText}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Column: Workshop Bays & Quick Actions */}
                <div className="admin-sidebar-panels-col">
                  {/* Panel 1: Workshop Bays */}
                  <div className="workshop-bays-panel">
                    <div className="bays-header-row">
                      <h3 className="bays-title">Workshop Bays</h3>
                      <span className="badge-occupied-green">8 / 10 Occupied</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="bays-progress-track">
                      <div className="bays-progress-fill" style={{ width: '80%' }}></div>
                    </div>

                    {/* 2 Sub Boxes: Bay 1-6 & Bay 7-8 */}
                    <div className="bays-breakdown-row">
                      <div className="bay-subcard bg-blue-tint">
                        <div className="bay-number-bold">Bay 1 – 6</div>
                        <div className="bay-status-line">
                          <span className="dot-blue"></span>
                          <span>In Service</span>
                        </div>
                      </div>

                      <div className="bay-subcard bg-green-tint">
                        <div className="bay-number-bold">Bay 7 – 8</div>
                        <div className="bay-status-line">
                          <span className="dot-green"></span>
                          <span>Available</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="bays-footer-meta">
                      <span>Lead Tech: <strong>Dave Miller</strong></span>
                      <span>Shift: <strong>AM</strong></span>
                    </div>
                  </div>

                  {/* Panel 2: Quick Actions */}
                  <div className="quick-actions-panel">
                    <h3 className="quick-actions-title">Quick Actions</h3>

                    <div className="quick-actions-list">
                      {/* Action 1 */}
                      <div
                        className="quick-action-card action-calendar"
                        onClick={() => setActiveModal({ type: 'new_booking' })}
                      >
                        <div className="action-left-info">
                          <div className="action-icon-box box-blue">
                            <Calendar size={18} />
                          </div>
                          <span className="action-label">Schedule Appointment</span>
                        </div>
                        <ChevronRight size={18} className="action-chevron" />
                      </div>

                      {/* Action 2 */}
                      <div
                        className="quick-action-card action-customer"
                        onClick={() => setActiveModal({ type: 'add_customer' })}
                      >
                        <div className="action-left-info">
                          <div className="action-icon-box box-indigo">
                            <UserPlus size={18} />
                          </div>
                          <span className="action-label">Add Customer</span>
                        </div>
                        <ChevronRight size={18} className="action-chevron" />
                      </div>

                      {/* Action 3 */}
                      <div
                        className="quick-action-card action-invoice"
                        onClick={() =>
                          setActiveModal({
                            type: 'invoice',
                            data: {
                              customer: 'Alexander Wright',
                              ref: '#APX-84920',
                              service: 'ECU Tuning & Dyno',
                            },
                          })
                        }
                      >
                        <div className="action-left-info">
                          <div className="action-icon-box box-green">
                            <FileText size={18} />
                          </div>
                          <span className="action-label">Generate Invoice</span>
                        </div>
                        <ChevronRight size={18} className="action-chevron" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bookings View */}
          {activeMenu === 'bookings' && (
            <div className="admin-subview-panel">
              <div className="subview-header">
                <div>
                  <h2 className="subview-title">All Service Bookings</h2>
                  <p className="subview-desc">
                    Real-time queue of pending, active, and completed appointments across all bays.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal({ type: 'new_booking' })}
                  className="btn-topbar-primary"
                >
                  <Plus size={16} />
                  <span>New Booking</span>
                </button>
              </div>

              <div className="admin-table-responsive mt-3">
                <table className="admin-bookings-table">
                  <thead>
                    <tr>
                      <th>BOOKING REF</th>
                      <th>CUSTOMER &amp; VEHICLE</th>
                      <th>SERVICE PACKAGE</th>
                      <th>TIME</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsList.map((row) => (
                      <tr key={row.ref}>
                        <td className="cell-ref">
                          <span className="booking-ref-blue">{row.ref}</span>
                        </td>
                        <td className="cell-customer">
                          <div className="customer-name-bold">{row.customer}</div>
                          <div className="vehicle-subtext">{row.vehicle}</div>
                        </td>
                        <td className="cell-service">{row.service}</td>
                        <td className="cell-time">{row.time}</td>
                        <td className="cell-status">
                          <span className={`status-pill ${row.statusClass}`}>
                            <span className="status-dot"></span>
                            <span>{row.status}</span>
                          </span>
                        </td>
                        <td className="cell-action">
                          <button
                            type="button"
                            onClick={() => handleActionClick(row)}
                            className="btn-table-action-primary"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Services & Pricing View */}
          {activeMenu === 'services' && (
            <div className="admin-subview-panel">
              <div className="subview-header">
                <div>
                  <h2 className="subview-title">Service Packages &amp; Pricing</h2>
                  <p className="subview-desc">
                    Manage available diagnostics, maintenance procedures, and labor rates.
                  </p>
                </div>
              </div>

              <div className="admin-catalog-grid mt-3">
                {[
                  { title: 'Periodic Maintenance Service', price: '$89.00', time: '90 Mins' },
                  { title: 'Brake System Repair & Pads', price: '$149.00', time: '120 Mins' },
                  { title: 'ECU Stage 1 Tuning & Dyno', price: '$199.00', time: '60 Mins' },
                  { title: 'Climate Control Overhaul', price: '$99.00', time: '45 Mins' },
                ].map((s, idx) => (
                  <div key={idx} className="admin-catalog-card">
                    <h4>{s.title}</h4>
                    <div className="cat-price text-blue">{s.price}</div>
                    <div className="cat-time">{s.time} standard allocation</div>
                    <button
                      type="button"
                      onClick={() => showToast(`Updated ${s.title} settings.`)}
                      className="btn-table-action-outline mt-2"
                    >
                      Edit Rate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff View */}
          {activeMenu === 'staff' && (
            <div className="admin-subview-panel">
              <div className="subview-header">
                <div>
                  <h2 className="subview-title">Technicians &amp; Bay Assignments</h2>
                  <p className="subview-desc">
                    Active team roster and station assignments.
                  </p>
                </div>
              </div>

              <div className="admin-staff-list mt-3">
                {[
                  { name: 'Dave Miller', role: 'ASE Master Technician', bay: 'Bay 01–04 (Lead)' },
                  { name: 'Elena Rostova', role: 'Chief Systems Engineer', bay: 'Bay 05 (Dyno)' },
                  { name: 'Sam Rivera', role: 'EV Systems Specialist', bay: 'Bay 06 (High Voltage)' },
                  { name: 'Sarah Chen', role: 'Maintenance Technician', bay: 'Bay 07–08' },
                ].map((t, i) => (
                  <div key={i} className="staff-row-card">
                    <div>
                      <strong>{t.name}</strong>
                      <div className="text-muted">{t.role}</div>
                    </div>
                    <div className="badge-bay-assign">{t.bay}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeMenu === 'settings' && (
            <div className="admin-subview-panel">
              <div className="subview-header">
                <div>
                  <h2 className="subview-title">Console Settings</h2>
                  <p className="subview-desc">
                    Configure telemetry integrations, automated reminders, and dispatch hours.
                  </p>
                </div>
              </div>

              <div className="settings-cards-box mt-3">
                <div className="settings-item-row">
                  <div>
                    <strong>Automated SMS Dispatch Reminders</strong>
                    <p className="text-muted">Send automatic customer alerts 24 hours prior.</p>
                  </div>
                  <span className="badge-enabled">ENABLED</span>
                </div>
                <div className="settings-item-row">
                  <div>
                    <strong>Workshop Telemetry Stream</strong>
                    <p className="text-muted">Broadcast live Bay step progression to customer portal.</p>
                  </div>
                  <span className="badge-enabled">ENABLED</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================
          INTERACTIVE ACTION MODALS
          ======================================================== */}
      {activeModal && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            className="modal-content admin-action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-line">
              <h3 className="modal-title">
                {activeModal.type === 'new_booking' && 'Create New Service Booking'}
                {activeModal.type === 'add_customer' && 'Add New Customer Profile'}
                {activeModal.type === 'invoice' && 'Generate & Print Service Invoice'}
                {activeModal.type === 'review' && 'Review Service Intake (#APX-84920)'}
                {activeModal.type === 'details' && 'In-Bay Diagnostic Telemetry (#APX-85104)'}
                {activeModal.type === 'assign' && 'Assign Technician to Bay (#APX-85219)'}
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
              {activeModal.type === 'new_booking' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast('New service booking successfully added to schedule!');
                    setActiveModal(null);
                  }}
                  className="modal-form-fields"
                >
                  <div className="form-group mb-3">
                    <label>Customer Full Name</label>
                    <input
                      type="text"
                      defaultValue="David Sterling"
                      required
                      className="admin-form-input"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Vehicle Make &amp; Model</label>
                    <input
                      type="text"
                      defaultValue="2024 Porsche 911 Carrera"
                      required
                      className="admin-form-input"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Requested Service</label>
                    <select className="admin-form-input">
                      <option>Periodic Maintenance Service</option>
                      <option>Brake Inspection &amp; Pad Renewal</option>
                      <option>ECU Tuning &amp; Dyno</option>
                      <option>Battery Health Test</option>
                    </select>
                  </div>
                  <div className="modal-actions-right">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="btn-form-cancel"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-topbar-primary">
                      Confirm Booking
                    </button>
                  </div>
                </form>
              )}

              {activeModal.type === 'add_customer' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast('Customer record created successfully!');
                    setActiveModal(null);
                  }}
                  className="modal-form-fields"
                >
                  <div className="form-group mb-3">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rachel Adams"
                      required
                      className="admin-form-input"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="rachel@example.com"
                      required
                      className="admin-form-input"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 019-3920"
                      required
                      className="admin-form-input"
                    />
                  </div>
                  <div className="modal-actions-right">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="btn-form-cancel"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-topbar-primary">
                      Save Customer
                    </button>
                  </div>
                </form>
              )}

              {activeModal.type === 'invoice' && (
                <div className="admin-invoice-modal-content">
                  <div className="invoice-header-meta">
                    <div>
                      <strong>Invoice #INV-{activeModal.data?.ref?.replace('#', '') || '79102'}</strong>
                      <div className="text-muted">Issued: Oct 24, 2025</div>
                    </div>
                    <span className="badge-paid">PAID</span>
                  </div>

                  <hr className="divider-line" />

                  <div className="invoice-row-line">
                    <span>Customer:</span>
                    <strong>{activeModal.data?.customer || 'Sophia Martinez'}</strong>
                  </div>
                  <div className="invoice-row-line">
                    <span>Service:</span>
                    <span>{activeModal.data?.service || 'Major Service (30k)'}</span>
                  </div>
                  <div className="invoice-row-line">
                    <span>Parts &amp; Fluids:</span>
                    <span>$240.00</span>
                  </div>
                  <div className="invoice-row-line">
                    <span>Labor (2.5 hrs):</span>
                    <span>$375.00</span>
                  </div>
                  <div className="invoice-row-line total-bold">
                    <span>Total Settled:</span>
                    <span className="text-blue">$615.00</span>
                  </div>

                  <div className="modal-actions-right mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        showToast('Invoice PDF downloaded.');
                        setActiveModal(null);
                      }}
                      className="btn-topbar-primary"
                    >
                      Download Invoice PDF
                    </button>
                  </div>
                </div>
              )}

              {activeModal.type === 'review' && (
                <div className="admin-review-box">
                  <p>Intake requested for <strong>{activeModal.data.vehicle}</strong> by {activeModal.data.customer}.</p>
                  <p className="text-muted">Service: {activeModal.data.service} • Scheduled: {activeModal.data.time}</p>
                  <div className="modal-actions-right mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingsList(
                          bookingsList.map((b) =>
                            b.ref === activeModal.data.ref
                              ? { ...b, status: 'Confirmed', statusClass: 'status-confirmed-indigo', actionText: 'Assign' }
                              : b
                          )
                        );
                        showToast('Booking approved and marked as Confirmed.');
                        setActiveModal(null);
                      }}
                      className="btn-topbar-primary"
                    >
                      Approve Booking
                    </button>
                  </div>
                </div>
              )}

              {activeModal.type === 'details' && (
                <div className="admin-review-box">
                  <p>Active live telemetry on <strong>Bay 05 (Dyno &amp; Laser Alignment)</strong>.</p>
                  <p className="text-muted">Vehicle: {activeModal.data.vehicle} • Assigned: Elena Rostova</p>
                  <div className="modal-actions-right mt-3">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="btn-topbar-primary"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}

              {activeModal.type === 'assign' && (
                <div className="admin-review-box">
                  <p>Select technician and available bay for <strong>{activeModal.data.vehicle}</strong>:</p>
                  <div className="form-group mb-3 mt-2">
                    <label>Select Technician</label>
                    <select className="admin-form-input">
                      <option>Sam Rivera (EV Specialist) - Bay 06</option>
                      <option>Dave Miller (Master Tech) - Bay 02</option>
                      <option>Sarah Chen (Mechanic) - Bay 07</option>
                    </select>
                  </div>
                  <div className="modal-actions-right mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingsList(
                          bookingsList.map((b) =>
                            b.ref === activeModal.data.ref
                              ? { ...b, status: 'In-Bay', statusClass: 'status-inbay-blue', actionText: 'Details' }
                              : b
                          )
                        );
                        showToast('Vehicle assigned to Bay 06.');
                        setActiveModal(null);
                      }}
                      className="btn-topbar-primary"
                    >
                      Assign to Bay
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

export default AdminDashboardPage;
