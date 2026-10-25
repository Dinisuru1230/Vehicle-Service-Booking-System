import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  RotateCcw,
  Clock,
  CheckCircle2,
  Building2,
  Zap,
  ShieldCheck,
  Check,
  Award,
  UserPlus,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { adminStaffAPI } from '../api/apiClient';

const initialStaff = [
  {
    id: 'TECH-01',
    initials: 'MV',
    avatarBg: 'avatar-blue',
    name: 'Marcus Vance',
    email: 'm.vance@apexdrive.io',
    role: 'Lead Master Technician',
    specialization: 'Powertrain & Calibration',
    bay: 'Bay 1',
    baySub: '(Dyno Rack)',
    bayDotColor: 'dot-blue',
    vehicleIcon: 'car',
    vehicleText: '2021 Porsche 911 GT3 RS',
    vehicleColor: 'text-dark',
    certs: [
      { name: 'ASE Master', color: 'badge-cert-blue' },
      { name: 'Porsche Gold', color: 'badge-cert-blue' },
    ],
    status: 'In-Bay',
    statusClass: 'status-inbay-blue',
  },
  {
    id: 'TECH-04',
    initials: 'DM',
    avatarBg: 'avatar-purple',
    name: 'Dave Miller',
    email: 'd.miller@apexdrive.io',
    role: 'Powertrain & Hydraulics',
    specialization: 'Engine Rebuild Specialist',
    bay: 'Bay 3',
    baySub: '(Heavy Lift)',
    bayDotColor: 'dot-blue',
    vehicleIcon: 'car',
    vehicleText: '2023 BMW M3 Competition',
    vehicleColor: 'text-dark',
    certs: [
      { name: 'BMW Tech L2', color: 'badge-cert-blue' },
      { name: 'Brembo Brake', color: 'badge-cert-blue' },
    ],
    status: 'In-Bay',
    statusClass: 'status-inbay-blue',
  },
  {
    id: 'TECH-07',
    initials: 'SR',
    avatarBg: 'avatar-green',
    name: 'Sam Rivera',
    email: 's.rivera@apexdrive.io',
    role: 'EV & High-Voltage Tech',
    specialization: 'Battery Cell Diagnostics',
    bay: 'Bay 5',
    baySub: '(EV Station)',
    bayDotColor: 'dot-dark',
    vehicleIcon: 'zap',
    vehicleText: '2022 Tesla Model S Plaid',
    vehicleColor: 'text-dark',
    certs: [
      { name: 'Tesla Level 3', color: 'badge-cert-green' },
      { name: 'Bosch EV', color: 'badge-cert-blue' },
    ],
    status: 'In-Bay',
    statusClass: 'status-inbay-blue',
  },
  {
    id: 'TECH-09',
    initials: 'AW',
    avatarBg: 'avatar-blue',
    name: 'Alex Wong',
    email: 'a.wong@apexdrive.io',
    role: 'Diagnostic & Electronics',
    specialization: 'CAN Bus & Telemetry',
    bay: 'Bay 4',
    baySub: '(Scheduled)',
    bayDotColor: 'dot-green',
    vehicleIcon: 'clock',
    vehicleText: '2024 Ford Lightning (02:30 PM)',
    vehicleColor: 'text-dark',
    certs: [
      { name: 'ASE Electrical', color: 'badge-cert-blue' },
      { name: 'Autel Pro', color: 'badge-cert-blue' },
    ],
    status: 'Scheduled',
    statusClass: 'status-scheduled-green',
  },
  {
    id: 'TECH-11',
    initials: 'ER',
    avatarBg: 'avatar-slate',
    name: 'Elena Rostova',
    email: 'e.rostova@apexdrive.io',
    role: 'Chassis & Suspension Tech',
    specialization: 'Laser Geometry & Camber',
    bay: 'Bay 2',
    baySub: '(Alignment Lift)',
    bayDotColor: 'dot-blue',
    vehicleIcon: 'car',
    vehicleText: '2020 Audi RS6 Avant',
    vehicleColor: 'text-dark',
    certs: [
      { name: 'Hunter L1', color: 'badge-cert-blue' },
      { name: 'Öhlins Tech', color: 'badge-cert-blue' },
    ],
    status: 'In-Bay',
    statusClass: 'status-inbay-blue',
  },
  {
    id: 'TECH-14',
    initials: 'LC',
    avatarBg: 'avatar-slate',
    name: 'Liam Chen',
    email: 'l.chen@apexdrive.io',
    role: 'General Maintenance Tech',
    specialization: 'Intake & Fluids Service',
    bay: 'Bay 7',
    baySub: '(Intake Prep)',
    bayDotColor: 'dot-green',
    vehicleIcon: 'check',
    vehicleText: 'Available for Dispatch',
    vehicleColor: 'text-green',
    certs: [
      { name: 'ASE Suspension', color: 'badge-cert-blue' },
      { name: 'DOT Certified', color: 'badge-cert-blue' },
    ],
    status: 'Available',
    statusClass: 'status-available-green',
  },
  // Remaining staff for full 14 roster count
  {
    id: 'TECH-02',
    initials: 'JB',
    avatarBg: 'avatar-blue',
    name: 'Jordan Belfort',
    email: 'j.belfort@apexdrive.io',
    role: 'Powertrain Specialist',
    specialization: 'Twin-Turbo Induction',
    bay: 'Bay 6',
    baySub: '(Acoustic Cell)',
    bayDotColor: 'dot-blue',
    vehicleIcon: 'car',
    vehicleText: '2022 Mercedes-AMG C63',
    vehicleColor: 'text-dark',
    certs: [
      { name: 'AMG Master', color: 'badge-cert-blue' },
      { name: 'ASE A1', color: 'badge-cert-blue' },
    ],
    status: 'In-Bay',
    statusClass: 'status-inbay-blue',
  },
  {
    id: 'TECH-05',
    initials: 'CM',
    avatarBg: 'avatar-purple',
    name: 'Carlos Mendez',
    email: 'c.mendez@apexdrive.io',
    role: 'Brake & Hydraulics Tech',
    specialization: 'Carbon Ceramic Lathe',
    bay: 'Bay 8',
    baySub: '(Rapid QC)',
    bayDotColor: 'dot-blue',
    vehicleIcon: 'car',
    vehicleText: '2021 Corvette Z06',
    vehicleColor: 'text-dark',
    certs: [
      { name: 'Brembo Gold', color: 'badge-cert-blue' },
      { name: 'ASE A5', color: 'badge-cert-blue' },
    ],
    status: 'In-Bay',
    statusClass: 'status-inbay-blue',
  },
  {
    id: 'TECH-08',
    initials: 'HT',
    avatarBg: 'avatar-green',
    name: 'Hiroshi Tanaka',
    email: 'h.tanaka@apexdrive.io',
    role: 'Tuning & Telemetry Engineer',
    specialization: 'Standalone ECU Maps',
    bay: 'Bay 1',
    baySub: '(Dyno Rack)',
    bayDotColor: 'dot-blue',
    vehicleIcon: 'car',
    vehicleText: '2023 Nissan GT-R Nismo',
    vehicleColor: 'text-dark',
    certs: [
      { name: 'MoTeC Pro', color: 'badge-cert-blue' },
      { name: 'Haltech Gold', color: 'badge-cert-blue' },
    ],
    status: 'In-Bay',
    statusClass: 'status-inbay-blue',
  },
  {
    id: 'TECH-12',
    initials: 'SM',
    avatarBg: 'avatar-blue',
    name: 'Sophia Martinez',
    email: 's.martinez@apexdrive.io',
    role: 'General Maintenance Tech',
    specialization: 'Synthetic Express',
    bay: 'Bay 7',
    baySub: '(Intake Prep)',
    bayDotColor: 'dot-green',
    vehicleIcon: 'check',
    vehicleText: 'Available for Dispatch',
    vehicleColor: 'text-green',
    certs: [
      { name: 'ASE G1', color: 'badge-cert-blue' },
      { name: 'Castrol Pro', color: 'badge-cert-blue' },
    ],
    status: 'Available',
    statusClass: 'status-available-green',
  },
  {
    id: 'TECH-03',
    initials: 'LV',
    avatarBg: 'avatar-slate',
    name: 'Lucas Vance',
    email: 'l.vance@apexdrive.io',
    role: 'Chassis & Suspension Tech',
    specialization: 'Corner Weighting & Setup',
    bay: 'Bay Standby',
    baySub: '(Shift Rotation)',
    bayDotColor: 'dot-dark',
    vehicleIcon: 'clock',
    vehicleText: 'Shift Rotational Standby',
    vehicleColor: 'text-muted',
    certs: [
      { name: 'Bilstein Tech', color: 'badge-cert-blue' },
      { name: 'ASE A4', color: 'badge-cert-blue' },
    ],
    status: 'Off-Duty',
    statusClass: 'status-offduty-gray',
  },
  {
    id: 'TECH-06',
    initials: 'DK',
    avatarBg: 'avatar-purple',
    name: 'Daniel Kim',
    email: 'd.kim@apexdrive.io',
    role: 'EV & High-Voltage Tech',
    specialization: 'Glycol Loop Flush',
    bay: 'Training Stall',
    baySub: '(Certification)',
    bayDotColor: 'dot-dark',
    vehicleIcon: 'clock',
    vehicleText: 'Training Protocol Session',
    vehicleColor: 'text-muted',
    certs: [
      { name: 'High Voltage L2', color: 'badge-cert-green' },
      { name: 'ASE A6', color: 'badge-cert-blue' },
    ],
    status: 'Off-Duty',
    statusClass: 'status-offduty-gray',
  },
  {
    id: 'TECH-10',
    initials: 'NR',
    avatarBg: 'avatar-green',
    name: 'Natalie Rossi',
    email: 'n.rossi@apexdrive.io',
    role: 'Powertrain & Hydraulics',
    specialization: 'Dual-Clutch Service',
    bay: 'Evening Shift',
    baySub: '(Roster Scheduled)',
    bayDotColor: 'dot-dark',
    vehicleIcon: 'clock',
    vehicleText: 'Scheduled for Evening Shift',
    vehicleColor: 'text-muted',
    certs: [
      { name: 'ZF Certified', color: 'badge-cert-blue' },
      { name: 'ASE A2', color: 'badge-cert-blue' },
    ],
    status: 'Off-Duty',
    statusClass: 'status-offduty-gray',
  },
  {
    id: 'TECH-13',
    initials: 'MB',
    avatarBg: 'avatar-slate',
    name: 'Matteo Bellini',
    email: 'm.bellini@apexdrive.io',
    role: 'Chassis & Suspension Tech',
    specialization: 'Roll Cage & Subframe',
    bay: 'Off-Site',
    baySub: '(SCCA Inspection)',
    bayDotColor: 'dot-dark',
    vehicleIcon: 'clock',
    vehicleText: 'Off-site inspection test',
    vehicleColor: 'text-muted',
    certs: [
      { name: 'TIG Master', color: 'badge-cert-blue' },
      { name: 'SCCA Tech', color: 'badge-cert-blue' },
    ],
    status: 'Off-Duty',
    statusClass: 'status-offduty-gray',
  },
];

const AdminStaffPage = ({
  onNavigateDashboard,
  onNavigateBookings,
  onNavigateCustomers,
  onNavigateServices,
  onNavigateSettings,
  onNavigateHome,
  onNavigateProfile,
}) => {
  const [staff, setStaff] = useState(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [bayFilter, setBayFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Live Metrics state
  const [liveMetrics, setLiveMetrics] = useState({
    totalStaff: 14,
    onDutyCount: 10,
    activeInBayCount: 8,
    efficiencyRate: 96,
  });

  // Fetch live staff roster and workshop metrics from backend on mount
  useEffect(() => {
    let isMounted = true;
    const loadStaffData = async () => {
      try {
        const [staffRes, metricsRes] = await Promise.all([
          adminStaffAPI.getStaff({ limit: 100 }),
          adminStaffAPI.getMetrics(),
        ]);
        if (isMounted) {
          if (staffRes.success && staffRes.staff && staffRes.staff.length > 0) {
            setStaff(staffRes.staff);
          }
          if (metricsRes.success && metricsRes.metrics) {
            setLiveMetrics(metricsRes.metrics);
          }
        }
      } catch (err) {
        console.warn('[AdminStaffPage] Live staff backend sync deferred:', err.message);
      }
    };

    loadStaffData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modals & Feedback
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // New Technician form state
  const [newTech, setNewTech] = useState({
    name: '',
    email: '',
    role: 'Lead Master Technician',
    specialization: 'Engine & Diagnostics',
    bay: 'Bay 1 (Dyno Rack)',
    vehicleText: 'Available for Dispatch',
    certs: 'ASE Master, OEM Specialist',
    status: 'Available',
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filter staff
  const filteredStaff = staff.filter((item) => {
    if (roleFilter !== 'All' && !item.role.toLowerCase().includes(roleFilter.toLowerCase())) {
      return false;
    }
    if (bayFilter !== 'All' && !item.bay.includes(bayFilter)) {
      return false;
    }
    if (statusFilter !== 'All' && item.status !== statusFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.specialization.toLowerCase().includes(q) ||
        item.vehicleText.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Pagination logic
  const totalItems = filteredStaff.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedStaff = filteredStaff.slice(startIndex, startIndex + itemsPerPage);

  // Vehicle Icon Helper
  const renderVehicleIcon = (type) => {
    switch (type) {
      case 'zap':
        return <Zap size={16} className="text-green flex-shrink-0" />;
      case 'clock':
        return <Clock size={16} className="text-muted flex-shrink-0" />;
      case 'check':
        return <CheckCircle2 size={16} className="text-green flex-shrink-0" />;
      case 'car':
      default:
        return <Car size={16} className="text-blue flex-shrink-0" />;
    }
  };

  // Handle Add Technician (Live backend API call with local fallback)
  const handleAddTechnician = async (e) => {
    e.preventDefault();
    try {
      const res = await adminStaffAPI.createStaff({
        name: newTech.name,
        email: newTech.email,
        role: newTech.role,
        specialization: newTech.specialization,
        bay: newTech.bay,
        vehicleText: newTech.vehicleText,
        certs: newTech.certs,
        status: newTech.status,
      });

      if (res.success && res.staff) {
        setStaff((prev) => [res.staff, ...prev]);
        showToast(res.message || `Technician "${res.staff.name}" added to workshop roster!`);
      }
    } catch (err) {
      // Local fallback
      const initials =
        newTech.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'TC';

      const certList = newTech.certs
        .split(',')
        .map((c) => ({ name: c.trim(), color: 'badge-cert-blue' }))
        .filter((c) => c.name.length > 0);

      const newEntry = {
        id: `TECH-${Math.floor(15 + Math.random() * 85)}`,
        initials,
        avatarBg: 'avatar-blue',
        name: newTech.name || 'New Technician',
        email: newTech.email || `${initials.toLowerCase()}@apexdrive.io`,
        role: newTech.role,
        specialization: newTech.specialization,
        bay: newTech.bay.split(' ')[0],
        baySub: newTech.bay.split(' ').slice(1).join(' ') || '(Assigned)',
        bayDotColor: 'dot-green',
        vehicleIcon: newTech.status === 'Available' ? 'check' : 'car',
        vehicleText: newTech.vehicleText || 'Available for Dispatch',
        vehicleColor: newTech.status === 'Available' ? 'text-green' : 'text-dark',
        certs: certList.length > 0 ? certList : [{ name: 'Certified Tech', color: 'badge-cert-blue' }],
        status: newTech.status,
        statusClass:
          newTech.status === 'In-Bay'
            ? 'status-inbay-blue'
            : newTech.status === 'Available'
            ? 'status-available-green'
            : 'status-scheduled-green',
      };

      setStaff((prev) => [newEntry, ...prev]);
      showToast(`Technician "${newEntry.name}" added to workshop roster!`);
    }

    setModalOpen(false);
    setNewTech({
      name: '',
      email: '',
      role: 'Lead Master Technician',
      specialization: 'Engine & Diagnostics',
      bay: 'Bay 1 (Dyno Rack)',
      vehicleText: 'Available for Dispatch',
      certs: 'ASE Master, OEM Specialist',
      status: 'Available',
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
          LEFT SIDEBAR (Staff & Technicians Active)
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
              onClick={onNavigateServices}
              className="admin-nav-item"
            >
              <Wrench size={18} />
              <span>Services &amp; Pricing</span>
            </button>

            <button
              type="button"
              className="admin-nav-item active"
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
                  showToast('Console system settings.');
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
            <span className="crumb-dark">Staff &amp; Technicians</span>
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
              onClick={() => showToast('All bay feeds and technician telemetry are live.')}
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
          <div className="staff-header-row">
            <div className="staff-header-left">
              <div className="staff-title-badge-wrap">
                <h1 className="staff-page-title">Staff &amp; Technicians</h1>
                <span className="staff-active-count-badge">14 Active</span>
              </div>
              <p className="staff-page-subtitle">
                Manage workshop mechanics, bay assignments, real-time workload, and certifications.
              </p>
            </div>

            <div className="staff-header-actions">
              <button
                type="button"
                onClick={() => showToast('Exporting certified technician roster (CSV)...')}
                className="btn-export-staff"
              >
                <Download size={15} />
                <span>Export Roster</span>
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn-add-tech-blue"
              >
                <UserPlus size={16} />
                <span>+ Add New Technician</span>
              </button>
            </div>
          </div>

          {/* 4 Top Metric Cards */}
          <div className="staff-stats-grid">
            {/* Card 1: TOTAL STAFF */}
            <div className="staff-stat-card">
              <div className="stat-card-top-line">
                <span className="stat-card-eyebrow">TOTAL STAFF</span>
                <div className="stat-icon-square bg-light-blue">
                  <Users size={18} className="text-blue" />
                </div>
              </div>
              <div className="stat-number-large">{liveMetrics.totalStaff || staff.length}</div>
              <div className="stat-footer-line">
                <span className="dot-blue-inline"></span>
                <span className="stat-footer-text">Active workshop team members</span>
              </div>
            </div>

            {/* Card 2: ON-DUTY TODAY */}
            <div className="staff-stat-card">
              <div className="stat-card-top-line">
                <span className="stat-card-eyebrow">ON-DUTY TODAY</span>
                <div className="stat-icon-square bg-light-green">
                  <UserPlus size={18} className="text-green" />
                </div>
              </div>
              <div className="stat-number-large">
                {liveMetrics.onDutyCount || 10}{' '}
                <span className="stat-number-subtext">/ {liveMetrics.totalStaff || staff.length} tech roster</span>
              </div>
              <div className="stat-footer-line text-green-accent">
                <Check size={14} className="text-green mr-1" />
                <span>{liveMetrics.bayCoverageText || 'All 8 bays covered'}</span>
              </div>
            </div>

            {/* Card 3: ACTIVE IN-BAY */}
            <div className="staff-stat-card">
              <div className="stat-card-top-line">
                <span className="stat-card-eyebrow">ACTIVE IN-BAY</span>
                <div className="stat-icon-square bg-light-indigo">
                  <Building2 size={18} className="text-indigo" />
                </div>
              </div>
              <div className="stat-number-large">{liveMetrics.activeInBayCount !== undefined ? liveMetrics.activeInBayCount : 7}</div>
              <div className="stat-footer-line text-blue-accent">
                <span className="dot-blue-inline"></span>
                <span>Active vehicles servicing in bays</span>
              </div>
            </div>

            {/* Card 4: EFFICIENCY RATE */}
            <div className="staff-stat-card">
              <div className="stat-card-top-line">
                <span className="stat-card-eyebrow">EFFICIENCY RATE</span>
                <div className="stat-icon-square bg-light-green">
                  <ShieldCheck size={18} className="text-green" />
                </div>
              </div>
              <div className="stat-number-large">{liveMetrics.efficiencyRate || 96}%</div>
              <div className="stat-footer-line text-green-accent">
                <TrendingUp size={14} className="text-green mr-1" />
                <span>Shop precision benchmark</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="staff-filter-bar">
            {/* Search Input */}
            <div className="staff-search-box">
              <Search size={16} className="search-icon-gray" />
              <input
                type="text"
                placeholder="Search technician by name, special..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="staff-search-input"
              />
            </div>

            {/* Dropdowns */}
            <div className="staff-dropdowns-group">
              {/* Dropdown 1: All Roles */}
              <div className="staff-select-wrapper">
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="staff-filter-select"
                >
                  <option value="All">All Roles</option>
                  <option value="Master">Master Technician</option>
                  <option value="Powertrain">Powertrain &amp; Hydraulics</option>
                  <option value="EV">EV &amp; High-Voltage</option>
                  <option value="Diagnostic">Diagnostic &amp; Electronics</option>
                  <option value="Chassis">Chassis &amp; Suspension</option>
                  <option value="Maintenance">General Maintenance</option>
                </select>
                <ChevronDown size={14} className="select-arrow-icon" />
              </div>

              {/* Dropdown 2: Bay: All Bays */}
              <div className="staff-select-wrapper">
                <select
                  value={bayFilter}
                  onChange={(e) => {
                    setBayFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="staff-filter-select"
                >
                  <option value="All">Bay: All Bays</option>
                  <option value="Bay 1">Bay 1 (Dyno Rack)</option>
                  <option value="Bay 2">Bay 2 (Alignment Lift)</option>
                  <option value="Bay 3">Bay 3 (Heavy Lift)</option>
                  <option value="Bay 4">Bay 4 (Scheduled)</option>
                  <option value="Bay 5">Bay 5 (EV Station)</option>
                  <option value="Bay 6">Bay 6 (Acoustic Cell)</option>
                  <option value="Bay 7">Bay 7 (Intake Prep)</option>
                  <option value="Bay 8">Bay 8 (Rapid QC)</option>
                </select>
                <ChevronDown size={14} className="select-arrow-icon" />
              </div>

              {/* Dropdown 3: Status: All */}
              <div className="staff-select-wrapper">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="staff-filter-select"
                >
                  <option value="All">Status: All</option>
                  <option value="In-Bay">Status: In-Bay</option>
                  <option value="Available">Status: Available</option>
                  <option value="Scheduled">Status: Scheduled</option>
                  <option value="Off-Duty">Status: Off-Duty</option>
                </select>
                <ChevronDown size={14} className="select-arrow-icon" />
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('All');
                  setBayFilter('All');
                  setStatusFilter('All');
                  setCurrentPage(1);
                }}
                className="btn-staff-reset"
                title="Reset all filters"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Technicians Table Card */}
          <div className="staff-table-card">
            <div className="table-responsive-wrapper">
              <table className="staff-data-table">
                <thead>
                  <tr>
                    <th>TECHNICIAN</th>
                    <th>ROLE &amp; SPECIALIZATION</th>
                    <th>ASSIGNED BAY</th>
                    <th>CURRENT VEHICLE / WORKLOAD</th>
                    <th>CERTIFICATIONS</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedStaff.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="empty-state-cell">
                        <div className="empty-filter-state">
                          <AlertCircle size={36} className="text-muted mb-2" />
                          <h4>No technicians found</h4>
                          <p>Try resetting the filter criteria or search keyword.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedStaff.map((tc) => (
                      <tr
                        key={tc.id}
                        className="staff-table-row"
                        onClick={() => setSelectedTech(tc)}
                      >
                        {/* 1. TECHNICIAN */}
                        <td className="cell-tech-profile">
                          <div className="tech-avatar-cluster">
                            <div className={`tech-circle-avatar ${tc.avatarBg}`}>
                              <span>{tc.initials}</span>
                            </div>
                            <div className="tech-name-col">
                              <span className="tech-full-name">{tc.name}</span>
                              <span className="tech-id-email">
                                #{tc.id} • {tc.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. ROLE & SPECIALIZATION */}
                        <td className="cell-role-spec">
                          <div className="role-title-bold">{tc.role}</div>
                          <div className="spec-subtext">{tc.specialization}</div>
                        </td>

                        {/* 3. ASSIGNED BAY */}
                        <td className="cell-assigned-bay">
                          <div className="bay-row-wrap">
                            <span className={`bay-dot ${tc.bayDotColor}`}></span>
                            <span className="bay-bold-name">{tc.bay}</span>
                            <span className="bay-sub-detail">{tc.baySub}</span>
                          </div>
                        </td>

                        {/* 4. CURRENT VEHICLE / WORKLOAD */}
                        <td className="cell-workload">
                          <div className="workload-item-row">
                            {renderVehicleIcon(tc.vehicleIcon)}
                            <span className={`workload-text-bold ${tc.vehicleColor}`}>
                              {tc.vehicleText}
                            </span>
                          </div>
                        </td>

                        {/* 5. CERTIFICATIONS */}
                        <td className="cell-certs">
                          <div className="certs-badges-wrap">
                            {tc.certs.map((c, i) => (
                              <span key={i} className={`cert-pill ${c.color}`}>
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* 6. STATUS */}
                        <td className="cell-status">
                          <span className={`status-pill ${tc.statusClass}`}>
                            <span className="status-dot"></span>
                            <span>{tc.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="table-pagination-row">
              <span className="pagination-info-text">
                Showing <strong>{totalItems === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of <strong>{totalItems}</strong> staff members
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="btn-pagination-nav"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================
              BOTTOM 3 ANALYTICS / COVERAGE CARDS (Screenshot 2)
              ======================================================== */}
          <div className="staff-bottom-analytics-grid">
            {/* Card 1: Bay Coverage */}
            <div className="staff-analytic-card">
              <div className="card-header-line">
                <div className="header-label-group">
                  <Building2 size={18} className="text-blue mr-2" />
                  <span className="card-title-text">Bay Coverage</span>
                </div>
                <span className="badge-coverage-active">100% Active</span>
              </div>

              <div className="card-middle-metric">
                <div className="metric-large-text">8 / 8 Active Bays</div>
                <div className="metric-unattended-sub">0 Bays Unattended</div>
              </div>

              <div className="coverage-progress-track">
                <div className="coverage-progress-bar" style={{ width: '100%' }}></div>
              </div>

              <p className="card-explanation-text">
                All service lifts, alignment platforms, and diagnostic stalls currently staffed.
              </p>
            </div>

            {/* Card 2: Current Shift */}
            <div className="staff-analytic-card">
              <div className="card-header-line">
                <div className="header-label-group">
                  <Clock size={18} className="text-blue mr-2" />
                  <span className="card-title-text">Current Shift</span>
                </div>
                <span className="badge-shift-pill">Shift 1 of 2</span>
              </div>

              <div className="shift-time-large">08:00 AM – 04:30 PM</div>
              <div className="shift-sub-title">Morning Full Diagnostic Rotation</div>

              <div className="shift-handover-footer">
                <div className="handover-time-box">
                  <span className="dot-green-pulse mr-1"></span>
                  <span>Next handover at 04:15 PM</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Full shift schedule rotation active.')}
                  className="btn-view-roster-link"
                >
                  <span>View Roster</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Card 3: Safety & Quality */}
            <div className="staff-analytic-card">
              <div className="card-header-line">
                <div className="header-label-group">
                  <ShieldCheck size={18} className="text-green mr-2" />
                  <span className="card-title-text">Safety &amp; Quality</span>
                </div>
                <span className="badge-standard-exceeded">Standard Exceeded</span>
              </div>

              <div className="quality-benchmark-row">
                <span className="quality-pct-large">99.4%</span>
                <span className="zero-rework-tag">Zero-Rework Benchmark</span>
              </div>

              <p className="card-explanation-text mt-3">
                420 consecutive vehicles serviced without post-delivery calibration discrepancies or returns.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================
          ADD NEW TECHNICIAN MODAL
          ======================================================== */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content admin-action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-line">
              <h3 className="modal-title">Add Technician to Roster</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-close-modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTechnician} className="modal-body-pad">
              <div className="form-group mb-3">
                <label className="field-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Liam Henderson"
                  required
                  value={newTech.name}
                  onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label className="field-label">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. l.henderson@apexdrive.io"
                  required
                  value={newTech.email}
                  onChange={(e) => setNewTech({ ...newTech, email: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label className="field-label">Role</label>
                  <select
                    value={newTech.role}
                    onChange={(e) => setNewTech({ ...newTech, role: e.target.value })}
                    className="admin-form-input"
                  >
                    <option>Lead Master Technician</option>
                    <option>Powertrain &amp; Hydraulics</option>
                    <option>EV &amp; High-Voltage Tech</option>
                    <option>Diagnostic &amp; Electronics</option>
                    <option>Chassis &amp; Suspension Tech</option>
                    <option>General Maintenance Tech</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Aero Alignment &amp; Dyno"
                    required
                    value={newTech.specialization}
                    onChange={(e) =>
                      setNewTech({ ...newTech, specialization: e.target.value })
                    }
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label className="field-label">Assigned Bay</label>
                  <select
                    value={newTech.bay}
                    onChange={(e) => setNewTech({ ...newTech, bay: e.target.value })}
                    className="admin-form-input"
                  >
                    <option>Bay 1 (Dyno Rack)</option>
                    <option>Bay 2 (Alignment Lift)</option>
                    <option>Bay 3 (Heavy Lift)</option>
                    <option>Bay 4 (Scheduled)</option>
                    <option>Bay 5 (EV Station)</option>
                    <option>Bay 6 (Acoustic Cell)</option>
                    <option>Bay 7 (Intake Prep)</option>
                    <option>Bay 8 (Rapid QC)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">Status</label>
                  <select
                    value={newTech.status}
                    onChange={(e) => setNewTech({ ...newTech, status: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Available">Available</option>
                    <option value="In-Bay">In-Bay</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Off-Duty">Off-Duty</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="field-label">Certifications (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. ASE Master, Porsche Gold"
                  value={newTech.certs}
                  onChange={(e) => setNewTech({ ...newTech, certs: e.target.value })}
                  className="admin-form-input"
                />
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
                  Confirm &amp; Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          TECHNICIAN DETAILS INSPECTOR MODAL
          ======================================================== */}
      {selectedTech && (
        <div className="modal-backdrop" onClick={() => setSelectedTech(null)}>
          <div
            className="modal-content admin-action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-line">
              <h3 className="modal-title">Technician Profile (#{selectedTech.id})</h3>
              <button
                type="button"
                onClick={() => setSelectedTech(null)}
                className="btn-close-modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-pad">
              <div className="tech-inspector-card">
                <div className={`tech-circle-avatar-large ${selectedTech.avatarBg}`}>
                  <span>{selectedTech.initials}</span>
                </div>
                <div className="tech-inspector-meta">
                  <h4>{selectedTech.name}</h4>
                  <p className="text-muted">{selectedTech.email}</p>
                  <span className={`status-pill ${selectedTech.statusClass} mt-1`}>
                    {selectedTech.status}
                  </span>
                </div>
              </div>

              <hr className="divider-line" />

              <div className="inspector-specs-list">
                <div className="spec-row">
                  <span>Role:</span>
                  <strong>{selectedTech.role}</strong>
                </div>
                <div className="spec-row">
                  <span>Specialization:</span>
                  <span>{selectedTech.specialization}</span>
                </div>
                <div className="spec-row">
                  <span>Assigned Bay:</span>
                  <span className="text-blue">
                    {selectedTech.bay} {selectedTech.baySub}
                  </span>
                </div>
                <div className="spec-row">
                  <span>Current Workload:</span>
                  <strong>{selectedTech.vehicleText}</strong>
                </div>
                <div className="spec-row">
                  <span>Certifications:</span>
                  <div className="certs-badges-wrap">
                    {selectedTech.certs.map((c, i) => (
                      <span key={i} className={`cert-pill ${c.color}`}>
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-actions-right mt-4">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Dispatched alert to ${selectedTech.name}'s mobile terminal.`);
                    setSelectedTech(null);
                  }}
                  className="btn-table-action-outline"
                >
                  Page Technician
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTech(null)}
                  className="btn-topbar-primary"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffPage;
