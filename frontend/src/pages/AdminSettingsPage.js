import React, { useState } from 'react';
import {
  Car,
  LayoutDashboard,
  Calendar,
  Wrench,
  Users,
  Settings,
  LogOut,
  Bell,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  MessageSquare,
  SlidersHorizontal,
  Ban,
  Activity,
  ChevronDown,
  Gauge,
  Radio,
  RotateCcw,
  UserCheck,
} from 'lucide-react';

const defaultSettings = {
  workshopName: 'ApexDrive Precision Service Hub',
  phone: '1-800-APEX-CAR',
  email: 'admin@apexdrive.io',
  address: '742 Evergreen Motorway, Bay Area, CA',
  timezone: 'Pacific Standard Time (UTC-8)',
  currency: 'LKR (Rs.) - Sri Lankan Rupee',

  weekdayEnabled: true,
  weekdayHours: '08:00 AM → 06:00 PM',
  saturdayEnabled: true,
  saturdayHours: '08:30 AM → 04:00 PM',
  sundayEnabled: false,

  activeBays: 8,
  maxIntakePerHour: 4,

  slotDuration: '45 Minutes',
  advanceWindow: '30 Days in advance',
  cancellationCutoff: '24 Hours prior',
  autoConfirm: true,
};

const AdminSettingsPage = ({
  onNavigateDashboard,
  onNavigateBookings,
  onNavigateCustomers,
  onNavigateServices,
  onNavigateStaff,
  onNavigateHome,
  onNavigateProfile,
}) => {
  const [formData, setFormData] = useState({ ...defaultSettings });
  const [toastMsg, setToastMsg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDiscard = () => {
    setFormData({ ...defaultSettings });
    showToast('Changes discarded. Restored workshop defaults.');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Workshop settings updated successfully!');
    }, 400);
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
          LEFT SIDEBAR (Settings Active)
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
              onClick={onNavigateBookings}
              className="admin-nav-item"
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
                  showToast('Customer directory');
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
              onClick={onNavigateServices}
              className="admin-nav-item"
            >
              <Wrench size={18} />
              <span>Services &amp; Pricing</span>
            </button>

            <button
              type="button"
              onClick={onNavigateStaff}
              className="admin-nav-item"
            >
              <Users size={18} />
              <span>Staff &amp; Technicians</span>
            </button>

            <button
              type="button"
              className="admin-nav-item active"
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
            <span className="crumb-dark">Settings</span>
          </div>

          <div className="topbar-actions-cluster">
            <button
              type="button"
              onClick={() => showToast('System telemetry status is normal.')}
              className="topbar-icon-btn"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="notification-indicator-dot"></span>
            </button>

            <div
              className="topbar-avatar-btn"
              onClick={onNavigateProfile}
              title="Admin Profile"
            >
              <span>MV</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content-area">
          {/* Header Row */}
          <div className="settings-header-row">
            <div className="settings-header-left">
              <div className="settings-eyebrow-line">
                <span className="dot-blue-inline"></span>
                <span>SYSTEM CONFIGURATION • CORE ENGINE V4.8</span>
              </div>
              <h1 className="settings-page-title">Workshop Settings</h1>
              <p className="settings-page-subtitle">
                Manage workshop operational parameters, booking business hours, notification preferences, and team permissions.
              </p>
            </div>

            <div className="settings-header-actions">
              <button
                type="button"
                onClick={handleDiscard}
                className="btn-settings-discard"
              >
                Discard
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="btn-settings-save"
              >
                <CheckCircle2 size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* 4 Metric / Status Cards */}
          <div className="settings-stats-grid">
            {/* Card 1: HYDRAULIC LIFTS */}
            <div className="settings-stat-card">
              <div className="settings-stat-left">
                <span className="stat-eyebrow-text">HYDRAULIC LIFTS</span>
                <div className="stat-value-text">{formData.activeBays} Active</div>
                <div className="stat-status-line text-green-accent">
                  <span className="dot-green-small mr-1"></span>
                  <span>100% Operational</span>
                </div>
              </div>
              <div className="stat-icon-box bg-light-blue">
                <Building2 size={20} className="text-blue" />
              </div>
            </div>

            {/* Card 2: INTAKE CAPACITY */}
            <div className="settings-stat-card">
              <div className="settings-stat-left">
                <span className="stat-eyebrow-text">INTAKE CAPACITY</span>
                <div className="stat-value-text">{formData.maxIntakePerHour} / Hour</div>
                <div className="stat-status-line text-muted">
                  Max parallel diagnostic intake
                </div>
              </div>
              <div className="stat-icon-box bg-light-blue">
                <Gauge size={20} className="text-blue" />
              </div>
            </div>

            {/* Card 3: 2FA COMPLIANCE */}
            <div className="settings-stat-card">
              <div className="settings-stat-left">
                <span className="stat-eyebrow-text">2FA COMPLIANCE</span>
                <div className="stat-value-text text-green-bold">100% Active</div>
                <div className="stat-status-line text-muted">
                  Enforced on 2 Admins
                </div>
              </div>
              <div className="stat-icon-box bg-light-green">
                <ShieldCheck size={20} className="text-green" />
              </div>
            </div>

            {/* Card 4: SMS DISPATCH RATE */}
            <div className="settings-stat-card">
              <div className="settings-stat-left">
                <span className="stat-eyebrow-text">SMS DISPATCH RATE</span>
                <div className="stat-value-text">99.8%</div>
                <div className="stat-status-line text-green-accent">
                  <Radio size={13} className="text-green mr-1" />
                  <span>Gateway Healthy</span>
                </div>
              </div>
              <div className="stat-icon-box bg-light-blue">
                <MessageSquare size={20} className="text-blue" />
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 1: Workshop Profile & Identity (Screenshot 1)
              ======================================================== */}
          <div className="settings-panel-card">
            <div className="panel-header-line">
              <div className="panel-header-left">
                <div className="panel-header-icon-box">
                  <Building2 size={20} className="text-blue" />
                </div>
                <div className="panel-header-text">
                  <h3 className="panel-title">Workshop Profile &amp; Identity</h3>
                  <p className="panel-subtitle">
                    General hub branding, customer-facing contact points, and localized currency.
                  </p>
                </div>
              </div>
              <span className="panel-id-pill">ID: WH-742-CA</span>
            </div>

            <div className="panel-form-body">
              {/* Field 1: Commercial Name */}
              <div className="form-group mb-4">
                <label className="settings-field-label">Workshop Commercial Name</label>
                <div className="settings-input-wrap">
                  <input
                    type="text"
                    value={formData.workshopName}
                    onChange={(e) =>
                      setFormData({ ...formData, workshopName: e.target.value })
                    }
                    className="settings-text-input"
                  />
                  <Building2 size={16} className="input-right-icon" />
                </div>
              </div>

              {/* Field 2: Phone & Email */}
              <div className="grid-two-cols mb-4">
                <div className="form-group">
                  <label className="settings-field-label">Support Contact Phone</label>
                  <div className="settings-input-wrap">
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="settings-text-input"
                    />
                    <Phone size={16} className="input-right-icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="settings-field-label">Central Support Email</label>
                  <div className="settings-input-wrap">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="settings-text-input"
                    />
                    <Mail size={16} className="input-right-icon" />
                  </div>
                </div>
              </div>

              {/* Field 3: Address */}
              <div className="form-group mb-4">
                <label className="settings-field-label">
                  Physical Address &amp; Service Intake Point
                </label>
                <div className="settings-input-wrap">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="settings-text-input"
                  />
                  <MapPin size={16} className="input-right-icon" />
                </div>
              </div>

              {/* Field 4: Timezone & Currency */}
              <div className="grid-two-cols">
                <div className="form-group">
                  <label className="settings-field-label">Operating Timezone</label>
                  <div className="settings-select-wrap">
                    <select
                      value={formData.timezone}
                      onChange={(e) =>
                        setFormData({ ...formData, timezone: e.target.value })
                      }
                      className="settings-select-input"
                    >
                      <option>Pacific Standard Time (UTC-8)</option>
                      <option>Eastern Standard Time (UTC-5)</option>
                      <option>Central Standard Time (UTC-6)</option>
                      <option>Mountain Standard Time (UTC-7)</option>
                      <option>Greenwich Mean Time (UTC+0)</option>
                    </select>
                    <ChevronDown size={15} className="select-dropdown-caret" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="settings-field-label">Billing Currency</label>
                  <div className="settings-select-wrap">
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="settings-select-input"
                    >
                      <option>LKR (Rs.) – Sri Lankan Rupee</option>
                      <option>USD ($) – United States Dollar</option>
                      <option>EUR (€) – Euro</option>
                      <option>GBP (£) – British Pound</option>
                      <option>CAD ($) – Canadian Dollar</option>
                      <option>AUD ($) – Australian Dollar</option>
                    </select>
                    <ChevronDown size={15} className="select-dropdown-caret" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 2: Operating Hours & Bay Capacity (Screenshot 2)
              ======================================================== */}
          <div className="settings-panel-card">
            <div className="panel-header-line">
              <div className="panel-header-left">
                <div className="panel-header-icon-box">
                  <Clock size={20} className="text-blue" />
                </div>
                <div className="panel-header-text">
                  <h3 className="panel-title">Operating Hours &amp; Bay Capacity</h3>
                  <p className="panel-subtitle">
                    Set weekly service availability and physical hoist concurrency.
                  </p>
                </div>
              </div>
              <span className="badge-system-online">
                <span className="dot-green-pulse mr-1"></span>
                <span>System Online</span>
              </span>
            </div>

            <div className="panel-form-body">
              {/* Daily Schedule Stack */}
              <div className="schedule-stack-card mb-4">
                {/* 1. Weekdays */}
                <div className="schedule-row-item">
                  <div className="schedule-item-left">
                    <div className="schedule-icon-square">
                      <Building2 size={16} className="text-blue" />
                    </div>
                    <div>
                      <div className="schedule-title-bold">
                        Monday – Friday (Weekdays)
                      </div>
                      <div className="schedule-subtext">
                        Standard diagnostic &amp; overhaul schedules
                      </div>
                    </div>
                  </div>

                  <div className="schedule-item-right">
                    <span className="time-range-badge">08:00 AM → 06:00 PM</span>
                    <label className="switch-toggle-label">
                      <input
                        type="checkbox"
                        checked={formData.weekdayEnabled}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            weekdayEnabled: e.target.checked,
                          })
                        }
                      />
                      <span className="switch-slider round"></span>
                    </label>
                  </div>
                </div>

                {/* 2. Saturday */}
                <div className="schedule-row-item">
                  <div className="schedule-item-left">
                    <div className="schedule-icon-square">
                      <Calendar size={16} className="text-blue" />
                    </div>
                    <div>
                      <div className="schedule-title-bold">
                        Saturday (Weekend Service)
                      </div>
                      <div className="schedule-subtext">
                        Express lube, fluids &amp; telemetry diagnostics only
                      </div>
                    </div>
                  </div>

                  <div className="schedule-item-right">
                    <div className="split-time-badges">
                      <span className="time-split-badge">08:30 AM</span>
                      <span className="time-split-arrow">→</span>
                      <span className="time-split-badge">04:00 PM</span>
                    </div>
                    <label className="switch-toggle-label">
                      <input
                        type="checkbox"
                        checked={formData.saturdayEnabled}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            saturdayEnabled: e.target.checked,
                          })
                        }
                      />
                      <span className="switch-slider round"></span>
                    </label>
                  </div>
                </div>

                {/* 3. Sunday */}
                <div className="schedule-row-item">
                  <div className="schedule-item-left">
                    <div className="schedule-icon-square bg-gray-subtle">
                      <Ban size={16} className="text-muted" />
                    </div>
                    <div>
                      <div className="schedule-title-bold">Sunday</div>
                      <div className="schedule-subtext">
                        Facility closed for mechanical calibration
                      </div>
                    </div>
                  </div>

                  <div className="schedule-item-right">
                    <span className="badge-closed-pill">Closed</span>
                    <label className="switch-toggle-label">
                      <input
                        type="checkbox"
                        checked={formData.sundayEnabled}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sundayEnabled: e.target.checked,
                          })
                        }
                      />
                      <span className="switch-slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 2 Sub-Cards: Active Hydraulic Bays & Max Concurrent Intake */}
              <div className="grid-two-cols">
                {/* Sub-Card 1: Active Hydraulic Bays */}
                <div className="capacity-slider-subcard">
                  <div className="slider-card-header">
                    <div>
                      <div className="slider-card-title">Active Hydraulic Bays</div>
                      <div className="slider-card-sub">
                        Physical hoists available for mechanical staging.
                      </div>
                    </div>
                    <span className="badge-active-bays">
                      {formData.activeBays} Active
                    </span>
                  </div>

                  <div className="slider-control-row">
                    <input
                      type="range"
                      min={1}
                      max={12}
                      value={formData.activeBays}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          activeBays: parseInt(e.target.value, 10),
                        })
                      }
                      className="custom-range-slider"
                    />
                    <div className="slider-value-box">
                      <strong>{formData.activeBays}</strong>
                      <span>Bays</span>
                    </div>
                  </div>
                </div>

                {/* Sub-Card 2: Max Concurrent Intake */}
                <div className="capacity-slider-subcard">
                  <div className="slider-card-header">
                    <div>
                      <div className="slider-card-title">Max Concurrent Intake</div>
                      <div className="slider-card-sub">
                        Hourly customer drop-off throughput capacity limit.
                      </div>
                    </div>
                    <span className="badge-active-bays">
                      {formData.maxIntakePerHour} Cars / Hr
                    </span>
                  </div>

                  <div className="slider-control-row">
                    <input
                      type="range"
                      min={1}
                      max={8}
                      value={formData.maxIntakePerHour}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxIntakePerHour: parseInt(e.target.value, 10),
                        })
                      }
                      className="custom-range-slider"
                    />
                    <div className="slider-value-box">
                      <strong>{formData.maxIntakePerHour}</strong>
                      <span>/ Hr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 3: Booking & Appointment Rules (Screenshot 2)
              ======================================================== */}
          <div className="settings-panel-card mb-5">
            <div className="panel-header-line">
              <div className="panel-header-left">
                <div className="panel-header-icon-box">
                  <SlidersHorizontal size={20} className="text-blue" />
                </div>
                <div className="panel-header-text">
                  <h3 className="panel-title">Booking &amp; Appointment Rules</h3>
                  <p className="panel-subtitle">
                    Configure buffer thresholds, cancellation terms, and automated confirmation.
                  </p>
                </div>
              </div>
            </div>

            <div className="panel-form-body">
              {/* 3 Dropdown Columns */}
              <div className="grid-three-cols mb-4">
                <div className="form-group">
                  <label className="settings-field-label">Default Slot Duration</label>
                  <div className="settings-select-wrap">
                    <select
                      value={formData.slotDuration}
                      onChange={(e) =>
                        setFormData({ ...formData, slotDuration: e.target.value })
                      }
                      className="settings-select-input"
                    >
                      <option>30 Minutes</option>
                      <option>45 Minutes</option>
                      <option>60 Minutes</option>
                      <option>90 Minutes</option>
                    </select>
                    <ChevronDown size={15} className="select-dropdown-caret" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="settings-field-label">Advance Booking Window</label>
                  <div className="settings-select-wrap">
                    <select
                      value={formData.advanceWindow}
                      onChange={(e) =>
                        setFormData({ ...formData, advanceWindow: e.target.value })
                      }
                      className="settings-select-input"
                    >
                      <option>14 Days in advance</option>
                      <option>30 Days in advance</option>
                      <option>60 Days in advance</option>
                      <option>90 Days in advance</option>
                    </select>
                    <ChevronDown size={15} className="select-dropdown-caret" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="settings-field-label">Cancellation Cut-off</label>
                  <div className="settings-select-wrap">
                    <select
                      value={formData.cancellationCutoff}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cancellationCutoff: e.target.value,
                        })
                      }
                      className="settings-select-input"
                    >
                      <option>12 Hours prior</option>
                      <option>24 Hours prior</option>
                      <option>48 Hours prior</option>
                      <option>72 Hours prior</option>
                    </select>
                    <ChevronDown size={15} className="select-dropdown-caret" />
                  </div>
                </div>
              </div>

              {/* Bottom Auto-Confirm Callout Box */}
              <div className="auto-confirm-callout-card">
                <div className="auto-confirm-text">
                  <h4 className="auto-confirm-title">
                    Auto–Confirm Maintenance Reservations
                  </h4>
                  <p className="auto-confirm-sub">
                    Automatically accept standard synthetic oil, tyre balancing, and safety inspections without manual admin clearance.
                  </p>
                </div>

                <label className="switch-toggle-label flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.autoConfirm}
                    onChange={(e) =>
                      setFormData({ ...formData, autoConfirm: e.target.checked })
                    }
                  />
                  <span className="switch-slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
