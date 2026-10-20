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
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  Activity,
  Star,
  Award,
  Smartphone,
  Laptop,
  Camera,
  ExternalLink,
  ChevronRight,
  User,
  Key,
  UserCheck,
} from 'lucide-react';

const AdminProfilePage = ({
  onNavigateDashboard,
  onNavigateBookings,
  onNavigateCustomers,
  onNavigateServices,
  onNavigateStaff,
  onNavigateSettings,
  onNavigateHome,
}) => {
  const [profile, setProfile] = useState({
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'm.vance@apexdrive.io',
    phone: '+1 (555) 234-8901',
    role: 'Lead Workshop Administrator & Master Tech',
    department: 'Technical Operations & Workshop Logistics',
    location: 'Bay Area Precision Service Hub #742',
    bio: 'Overseeing daily shop floor workflow, hydraulic bay allocation, high-voltage EV diagnostic protocols, and master calibration standards across 14 technicians.',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
  });

  const [notifications, setNotifications] = useState({
    criticalBayStoppage: true,
    vipBookingInbound: true,
    dailyShiftSummary: true,
    partsBottlenecks: false,
  });

  const [toastMsg, setToastMsg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Admin profile and security preferences saved successfully!');
    }, 450);
  };

  const handleTerminateSessions = () => {
    showToast('All other active admin browser sessions terminated.');
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
          LEFT SIDEBAR
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
              onClick={onNavigateSettings}
              className="admin-nav-item"
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info-row admin-user-active-profile">
            <div className="admin-avatar-small">
              <span>MV</span>
            </div>
            <div className="admin-name-col">
              <div className="admin-name">Marcus Vance</div>
              <div className="admin-role">Super Admin</div>
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
            <span className="crumb-dark">Administrator Profile</span>
          </div>

          <div className="topbar-actions-cluster">
            <button
              type="button"
              onClick={onNavigateHome}
              className="btn-client-view"
            >
              <ExternalLink size={14} />
              <span>Client Site</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('All notifications are up to date.')}
              className="topbar-icon-btn"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="notification-indicator-dot"></span>
            </button>

            <div
              className="topbar-avatar-btn active-ring"
              title="Administrator Profile"
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
                <span>SYSTEM ADMINISTRATOR • ACCESS CLEARANCE LEVEL 4</span>
              </div>
              <h1 className="settings-page-title">Administrator Profile</h1>
              <p className="settings-page-subtitle">
                Manage your credentials, root permissions, emergency alert routing, and personal telemetry.
              </p>
            </div>

            <div className="settings-header-actions">
              <button
                type="button"
                onClick={() => showToast('Viewing system audit trails...')}
                className="btn-settings-discard"
              >
                Audit Log
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="btn-settings-save"
              >
                <CheckCircle2 size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </div>

          {/* Hero Banner Identity Card */}
          <div className="admin-profile-hero-card">
            <div className="hero-profile-left">
              <div className="hero-avatar-wrapper">
                <div className="hero-avatar-circle">
                  <span>MV</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Avatar upload dialog ready.')}
                  className="hero-avatar-camera-btn"
                  title="Upload profile photo"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div className="hero-profile-meta">
                <div className="hero-name-row">
                  <h2 className="hero-name">Marcus Vance</h2>
                  <span className="hero-role-pill">Super Admin</span>
                  <span className="hero-status-pill">
                    <span className="dot-green-small mr-1"></span>
                    <span>Active Session</span>
                  </span>
                </div>

                <div className="hero-subtext-row">
                  <span>
                    <Briefcase size={14} className="mr-1 inline-icon" />
                    Lead Workshop Administrator &amp; Master Tech
                  </span>
                  <span>•</span>
                  <span>
                    <MapPin size={14} className="mr-1 inline-icon" />
                    Bay Area Precision Hub #742
                  </span>
                  <span>•</span>
                  <span>
                    <Clock size={14} className="mr-1 inline-icon" />
                    Member since Oct 2021
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="hero-stats-strip">
              <div className="hero-stat-box">
                <div className="hero-stat-num">1,248</div>
                <div className="hero-stat-lbl">Bookings Managed</div>
              </div>

              <div className="hero-stat-box">
                <div className="hero-stat-num text-green">99.4%</div>
                <div className="hero-stat-lbl">Quality Pass Rate</div>
              </div>

              <div className="hero-stat-box">
                <div className="hero-stat-num text-amber">
                  4.9 <Star size={14} className="inline-star" />
                </div>
                <div className="hero-stat-lbl">Technician Score</div>
              </div>

              <div className="hero-stat-box">
                <div className="hero-stat-num text-blue">
                  <ShieldCheck size={20} className="inline-icon mr-1" />
                  Secured
                </div>
                <div className="hero-stat-lbl">2FA Verified</div>
              </div>
            </div>
          </div>

          {/* 2-Column Split Grid */}
          <div className="admin-profile-split-grid">
            {/* ========================================================
                LEFT COLUMN: Personal Details & Security Credentials
                ======================================================== */}
            <div className="profile-left-col">
              {/* Card 1: Personal Information */}
              <div className="settings-panel-card">
                <div className="panel-header-line">
                  <div className="panel-header-left">
                    <div className="panel-header-icon-box">
                      <User size={20} className="text-blue" />
                    </div>
                    <div className="panel-header-text">
                      <h3 className="panel-title">Personal &amp; Contact Information</h3>
                      <p className="panel-subtitle">
                        Administrative identity and contact channels for dispatch.
                      </p>
                    </div>
                  </div>
                  <span className="panel-id-pill">STAFF ID: #ADM-001</span>
                </div>

                <div className="panel-form-body">
                  <div className="grid-two-cols mb-4">
                    <div className="form-group">
                      <label className="settings-field-label">First Name</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile({ ...profile, firstName: e.target.value })
                        }
                        className="settings-text-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="settings-field-label">Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
                        className="settings-text-input"
                      />
                    </div>
                  </div>

                  <div className="grid-two-cols mb-4">
                    <div className="form-group">
                      <label className="settings-field-label">Administrator Email</label>
                      <div className="settings-input-wrap">
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          className="settings-text-input"
                        />
                        <Mail size={16} className="input-right-icon" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="settings-field-label">Direct Contact Phone</label>
                      <div className="settings-input-wrap">
                        <input
                          type="text"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          className="settings-text-input"
                        />
                        <Phone size={16} className="input-right-icon" />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label className="settings-field-label">Job Title &amp; Primary Role</label>
                    <div className="settings-input-wrap">
                      <input
                        type="text"
                        value={profile.role}
                        onChange={(e) =>
                          setProfile({ ...profile, role: e.target.value })
                        }
                        className="settings-text-input"
                      />
                      <Briefcase size={16} className="input-right-icon" />
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label className="settings-field-label">Assigned Facility</label>
                    <div className="settings-input-wrap">
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                        className="settings-text-input"
                      />
                      <MapPin size={16} className="input-right-icon" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="settings-field-label">Administrative Responsibilities</label>
                    <textarea
                      rows={3}
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      className="settings-text-input"
                      style={{ height: 'auto', padding: '0.75rem 0.95rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Security & Authentication */}
              <div className="settings-panel-card">
                <div className="panel-header-line">
                  <div className="panel-header-left">
                    <div className="panel-header-icon-box">
                      <Key size={20} className="text-blue" />
                    </div>
                    <div className="panel-header-text">
                      <h3 className="panel-title">Security &amp; Authentication</h3>
                      <p className="panel-subtitle">
                        Manage master console credentials, password strength, and active logins.
                      </p>
                    </div>
                  </div>
                  <span className="badge-system-online">
                    <ShieldCheck size={14} className="mr-1 inline-icon" />
                    <span>2FA Enforced</span>
                  </span>
                </div>

                <div className="panel-form-body">
                  {/* Two-Factor Status Callout */}
                  <div className="two-factor-status-box mb-4">
                    <div className="two-factor-icon-wrap">
                      <Smartphone size={22} className="text-blue" />
                    </div>
                    <div className="two-factor-text">
                      <div className="two-factor-title">
                        Two-Factor Authentication (TOTP App)
                      </div>
                      <div className="two-factor-sub">
                        Active via Google Authenticator. High-privilege actions require 6-digit confirmation.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('2FA setup QR regenerated.')}
                      className="btn-reconfigure-2fa"
                    >
                      Reconfigure
                    </button>
                  </div>

                  {/* Password Change Fields */}
                  <div className="form-group mb-4">
                    <label className="settings-field-label">Current Master Password</label>
                    <div className="settings-input-wrap">
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={security.currentPassword}
                        onChange={(e) =>
                          setSecurity({ ...security, currentPassword: e.target.value })
                        }
                        className="settings-text-input"
                      />
                      <Lock size={16} className="input-right-icon" />
                    </div>
                  </div>

                  <div className="grid-two-cols mb-4">
                    <div className="form-group">
                      <label className="settings-field-label">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter minimum 10 characters"
                        value={security.newPassword}
                        onChange={(e) =>
                          setSecurity({ ...security, newPassword: e.target.value })
                        }
                        className="settings-text-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="settings-field-label">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Re-enter new password"
                        value={security.confirmPassword}
                        onChange={(e) =>
                          setSecurity({ ...security, confirmPassword: e.target.value })
                        }
                        className="settings-text-input"
                      />
                    </div>
                  </div>

                  {/* Active Sessions Box */}
                  <div className="active-sessions-box">
                    <div className="session-item-row">
                      <div className="session-icon-wrap">
                        <Laptop size={18} className="text-blue" />
                      </div>
                      <div className="session-info">
                        <div className="session-title">
                          Windows 11 • Chrome 132 (Current Session)
                        </div>
                        <div className="session-meta">
                          IP: 192.168.1.42 • Bay Area, CA • Active Now
                        </div>
                      </div>
                      <span className="badge-this-device">This Device</span>
                    </div>

                    <div className="session-footer-line">
                      <button
                        type="button"
                        onClick={handleTerminateSessions}
                        className="btn-terminate-sessions"
                      >
                        Sign Out Other Devices
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                RIGHT COLUMN: Privileges, Notifications & Audit Log
                ======================================================== */}
            <div className="profile-right-col">
              {/* Card 1: Role Privileges & Permissions */}
              <div className="settings-panel-card mb-4">
                <div className="panel-header-line">
                  <div className="panel-header-left">
                    <div className="panel-header-icon-box">
                      <Shield size={20} className="text-blue" />
                    </div>
                    <div className="panel-header-text">
                      <h3 className="panel-title">Role Privileges</h3>
                      <p className="panel-subtitle">Clearance Level 4 Master Access</p>
                    </div>
                  </div>
                </div>

                <div className="privileges-list">
                  <div className="privilege-item">
                    <div className="privilege-label-col">
                      <span className="privilege-name">Workshop Logistics &amp; Bays</span>
                      <span className="privilege-desc">Dispatch, queue and assign bays 1-8</span>
                    </div>
                    <span className="privilege-badge badge-full-control">Full Control</span>
                  </div>

                  <div className="privilege-item">
                    <div className="privilege-label-col">
                      <span className="privilege-name">Service Catalog &amp; Pricing</span>
                      <span className="privilege-desc">Publish, edit, delete procedures</span>
                    </div>
                    <span className="privilege-badge badge-full-control">Read / Write</span>
                  </div>

                  <div className="privilege-item">
                    <div className="privilege-label-col">
                      <span className="privilege-name">Staff &amp; Technicians</span>
                      <span className="privilege-desc">Roster, credentials, cert audits</span>
                    </div>
                    <span className="privilege-badge badge-full-control">Full Control</span>
                  </div>

                  <div className="privilege-item">
                    <div className="privilege-label-col">
                      <span className="privilege-name">Core System Configuration</span>
                      <span className="privilege-desc">Operating hours, intake rates, rules</span>
                    </div>
                    <span className="privilege-badge badge-master">Master Admin</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Dispatch & Critical Alerts */}
              <div className="settings-panel-card mb-4">
                <div className="panel-header-line">
                  <div className="panel-header-left">
                    <div className="panel-header-icon-box">
                      <Bell size={20} className="text-blue" />
                    </div>
                    <div className="panel-header-text">
                      <h3 className="panel-title">Dispatch Notifications</h3>
                      <p className="panel-subtitle">Real-time alerts sent to your device</p>
                    </div>
                  </div>
                </div>

                <div className="notifications-toggle-list">
                  <div className="notification-toggle-row">
                    <div>
                      <div className="toggle-title">Critical Bay Bottlenecks</div>
                      <div className="toggle-desc">Instant push &amp; SMS when hydraulic bays exceed capacity</div>
                    </div>
                    <label className="switch-toggle-label">
                      <input
                        type="checkbox"
                        checked={notifications.criticalBayStoppage}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            criticalBayStoppage: e.target.checked,
                          })
                        }
                      />
                      <span className="switch-slider round"></span>
                    </label>
                  </div>

                  <div className="notification-toggle-row">
                    <div>
                      <div className="toggle-title">VIP &amp; High-Priority Bookings</div>
                      <div className="toggle-desc">Immediate notice on exotic or high-ticket reservations</div>
                    </div>
                    <label className="switch-toggle-label">
                      <input
                        type="checkbox"
                        checked={notifications.vipBookingInbound}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            vipBookingInbound: e.target.checked,
                          })
                        }
                      />
                      <span className="switch-slider round"></span>
                    </label>
                  </div>

                  <div className="notification-toggle-row">
                    <div>
                      <div className="toggle-title">Daily Shift Handover Report</div>
                      <div className="toggle-desc">Email digest delivered at 04:15 PM shift transition</div>
                    </div>
                    <label className="switch-toggle-label">
                      <input
                        type="checkbox"
                        checked={notifications.dailyShiftSummary}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            dailyShiftSummary: e.target.checked,
                          })
                        }
                      />
                      <span className="switch-slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Card 3: Recent Administrative Audit Trail */}
              <div className="settings-panel-card">
                <div className="panel-header-line">
                  <div className="panel-header-left">
                    <div className="panel-header-icon-box">
                      <Activity size={20} className="text-blue" />
                    </div>
                    <div className="panel-header-text">
                      <h3 className="panel-title">Admin Audit Trail</h3>
                      <p className="panel-subtitle">Recent actions logged under this account</p>
                    </div>
                  </div>
                </div>

                <div className="audit-timeline-list">
                  <div className="audit-item">
                    <div className="audit-dot dot-blue"></div>
                    <div className="audit-content">
                      <div className="audit-title">Approved Booking #APX-84920</div>
                      <div className="audit-meta">Today, 09:45 AM • Alexander Wright (BMW M3)</div>
                    </div>
                  </div>

                  <div className="audit-item">
                    <div className="audit-dot dot-green"></div>
                    <div className="audit-content">
                      <div className="audit-title">Assigned Bay 3 to Dave Miller</div>
                      <div className="audit-meta">Today, 08:30 AM • Heavy Lift Schedule</div>
                    </div>
                  </div>

                  <div className="audit-item">
                    <div className="audit-dot dot-purple"></div>
                    <div className="audit-content">
                      <div className="audit-title">Updated Max Hourly Intake</div>
                      <div className="audit-meta">Yesterday, 04:30 PM • Set to 4 Cars/Hour</div>
                    </div>
                  </div>

                  <div className="audit-item">
                    <div className="audit-dot dot-gray"></div>
                    <div className="audit-content">
                      <div className="audit-title">Added Service Package #SVC-101</div>
                      <div className="audit-meta">2 days ago • Periodic Maintenance &amp; Synthetic Oil</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfilePage;
