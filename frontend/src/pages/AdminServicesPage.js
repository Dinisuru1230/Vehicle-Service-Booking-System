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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  DollarSign,
  Layers,
  Edit3,
  Trash2,
  X,
  User,
  Disc,
  Cpu,
  Fan,
  SlidersHorizontal,
  BatteryCharging,
  Sparkles,
  ExternalLink,
  UserCheck,
} from 'lucide-react';

const initialServices = [
  {
    id: 'SVC-101',
    iconType: 'wrench',
    title: 'Periodic Maintenance & Synthetic Oil',
    description: 'Computerized engine scan, full oil drain, OEM filter & ...',
    category: 'Maintenance',
    categoryClass: 'badge-cat-blue',
    duration: '45 mins',
    price: 89.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-102',
    iconType: 'disc',
    title: 'Brake System Repair & Resurfacing',
    description: 'Rotor runout measurement, precision lathe skim, ...',
    category: 'Brakes & Chassis',
    categoryClass: 'badge-cat-slate',
    duration: '60 mins',
    price: 149.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-103',
    iconType: 'cpu',
    title: 'Engine Diagnostics & ECU Tuning',
    description: 'OBD-II CAN-bus sensor interrogations, timing map...',
    category: 'Diagnostics',
    categoryClass: 'badge-cat-blue',
    duration: '30 mins',
    price: 79.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-104',
    iconType: 'fan',
    title: 'Climate Control & R1234yf Overhaul',
    description: 'Vacuum leak check, compressor oil recharge, ...',
    category: 'Climate Control',
    categoryClass: 'badge-cat-cyan',
    duration: '40 mins',
    price: 99.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-105',
    iconType: 'sliders',
    title: '40-Point Chassis & Powertrain Inspection',
    description: 'Ball joint play, driveshaft torque checking, differential...',
    category: 'Diagnostics',
    categoryClass: 'badge-cat-blue',
    duration: '90 mins',
    price: 180.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-106',
    iconType: 'battery',
    title: 'Battery Health Test & Cold Crank Replacement',
    description: 'Impedance load test, terminal cleaning, BMS battery...',
    category: 'Electrical & EV',
    categoryClass: 'badge-cat-purple',
    duration: '40 mins',
    price: 119.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  // Additional packages to power full 18 count for pagination
  {
    id: 'SVC-107',
    iconType: 'wrench',
    title: 'Transmission Fluid Flush & Filter Renewal',
    description: 'Hydraulic pressure test, multi-plate clutch calibration...',
    category: 'Maintenance',
    categoryClass: 'badge-cat-blue',
    duration: '50 mins',
    price: 135.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-108',
    iconType: 'sliders',
    title: 'Laser 4-Wheel Alignment & Camber Tuning',
    description: 'Subframe centering, toe angle calibration for track use...',
    category: 'Brakes & Chassis',
    categoryClass: 'badge-cat-slate',
    duration: '55 mins',
    price: 125.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-109',
    iconType: 'cpu',
    title: 'High-Performance Dyno Pull & Graphing',
    description: 'AWD twin-retarder dyno session with torque curve printout...',
    category: 'Diagnostics',
    categoryClass: 'badge-cat-blue',
    duration: '60 mins',
    price: 210.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-110',
    iconType: 'fan',
    title: 'Cabin HEPA Filter & Ozone Sanitization',
    description: 'Bacterial evaporator core wash, active carbon filter install...',
    category: 'Climate Control',
    categoryClass: 'badge-cat-cyan',
    duration: '25 mins',
    price: 65.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-111',
    iconType: 'battery',
    title: 'EV Inverter Telemetry & Coolant Loop Refresh',
    description: 'Dielectric fluid swap, high-voltage contactor inspection...',
    category: 'Electrical & EV',
    categoryClass: 'badge-cat-purple',
    duration: '65 mins',
    price: 165.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-112',
    iconType: 'disc',
    title: 'Ceramic Composite Brake Pad Bedding',
    description: 'High-temp thermal cycling, rotor deglazing protocol...',
    category: 'Brakes & Chassis',
    categoryClass: 'badge-cat-slate',
    duration: '45 mins',
    price: 155.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-113',
    iconType: 'wrench',
    title: 'Spark Plug & Direct Ignition Coil Service',
    description: 'Iridium plug gap adjustment, coil boot dielectric sealing...',
    category: 'Maintenance',
    categoryClass: 'badge-cat-blue',
    duration: '40 mins',
    price: 95.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-114',
    iconType: 'cpu',
    title: 'Suspension ADAS Sensor Radar Calibration',
    description: 'Forward radar aiming target setup, camera optical sync...',
    category: 'Diagnostics',
    categoryClass: 'badge-cat-blue',
    duration: '50 mins',
    price: 140.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-115',
    iconType: 'sliders',
    title: 'Differential Locker Fluid & Seal Replacement',
    description: 'Limited-slip synthetic gear oil renewal, magnetic plug check...',
    category: 'Maintenance',
    categoryClass: 'badge-cat-blue',
    duration: '35 mins',
    price: 110.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-116',
    iconType: 'battery',
    title: 'Alternator Diode Ripple & Ground Strap Audit',
    description: 'Oscilloscope charging check, main grounding bus cleaning...',
    category: 'Electrical & EV',
    categoryClass: 'badge-cat-purple',
    duration: '30 mins',
    price: 75.0,
    status: 'Active',
    statusClass: 'status-active-green',
  },
  {
    id: 'SVC-117',
    iconType: 'wrench',
    title: 'Fuel Injection Ultrasonic Cleaning & Flow Match',
    description: 'Direct injector spray pattern analysis, O-ring renewal...',
    category: 'Maintenance',
    categoryClass: 'badge-cat-blue',
    duration: '60 mins',
    price: 120.0,
    status: 'Inactive',
    statusClass: 'status-inactive-gray',
  },
  {
    id: 'SVC-118',
    iconType: 'fan',
    title: 'Track Aerodynamic Venting & Radiator Scrub',
    description: 'Heat exchanger debris extraction, airflow shroud tuning...',
    category: 'Climate Control',
    categoryClass: 'badge-cat-cyan',
    duration: '45 mins',
    price: 85.0,
    status: 'Inactive',
    statusClass: 'status-inactive-gray',
  },
];

const AdminServicesPage = ({
  onNavigateDashboard,
  onNavigateBookings,
  onNavigateCustomers,
  onNavigateStaff,
  onNavigateSettings,
  onNavigateHome,
  onNavigateProfile,
}) => {
  const [services, setServices] = useState(initialServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & toast
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // New Service Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Maintenance',
    duration: '45 mins',
    price: '99.00',
    status: 'Active',
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filter logic
  const filteredServices = services.filter((item) => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Pagination calculation
  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  // Computed metrics
  const totalCount = services.length;
  const activeCount = services.filter((s) => s.status === 'Active').length;
  const avgPrice = (
    services.reduce((acc, curr) => acc + curr.price, 0) / (services.length || 1)
  ).toFixed(2);
  const avgDuration = Math.round(
    services.reduce((acc, curr) => acc + parseInt(curr.duration, 10), 0) /
      (services.length || 1)
  );

  // Icon renderer helper
  const renderServiceIcon = (type) => {
    switch (type) {
      case 'disc':
        return <Disc size={20} className="service-cell-icon" />;
      case 'cpu':
        return <Cpu size={20} className="service-cell-icon" />;
      case 'fan':
        return <Fan size={20} className="service-cell-icon" />;
      case 'sliders':
        return <SlidersHorizontal size={20} className="service-cell-icon" />;
      case 'battery':
        return <BatteryCharging size={20} className="service-cell-icon" />;
      case 'wrench':
      default:
        return <Wrench size={20} className="service-cell-icon" />;
    }
  };

  // Category badge class helper
  const getCategoryClass = (cat) => {
    switch (cat) {
      case 'Maintenance':
      case 'Diagnostics':
        return 'badge-cat-blue';
      case 'Brakes & Chassis':
        return 'badge-cat-slate';
      case 'Climate Control':
        return 'badge-cat-cyan';
      case 'Electrical & EV':
        return 'badge-cat-purple';
      default:
        return 'badge-cat-blue';
    }
  };

  // Create new service
  const handleCreateService = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `SVC-${Math.floor(100 + Math.random() * 900)}`,
      iconType: 'wrench',
      title: formData.title || 'New Performance Package',
      description: formData.description || 'Comprehensive multi-point protocol and inspection...',
      category: formData.category,
      categoryClass: getCategoryClass(formData.category),
      duration: formData.duration.includes('mins') ? formData.duration : `${formData.duration} mins`,
      price: parseFloat(formData.price) || 99.0,
      status: formData.status,
      statusClass: formData.status === 'Active' ? 'status-active-green' : 'status-inactive-gray',
    };

    setServices([newEntry, ...services]);
    setModalOpen(false);
    showToast(`Service "${newEntry.title}" added successfully!`);
    setFormData({
      title: '',
      description: '',
      category: 'Maintenance',
      duration: '45 mins',
      price: '99.00',
      status: 'Active',
    });
  };

  // Edit service save
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editItem) return;

    const updatedList = services.map((s) => {
      if (s.id === editItem.id) {
        return {
          ...editItem,
          categoryClass: getCategoryClass(editItem.category),
          statusClass: editItem.status === 'Active' ? 'status-active-green' : 'status-inactive-gray',
          price: parseFloat(editItem.price) || s.price,
        };
      }
      return s;
    });

    setServices(updatedList);
    setEditItem(null);
    showToast(`Service package updated successfully!`);
  };

  // Delete service
  const confirmDelete = () => {
    if (!deleteItem) return;
    setServices(services.filter((s) => s.id !== deleteItem.id));
    setDeleteItem(null);
    showToast(`Service package removed.`);
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
          LEFT SIDEBAR (Services & Pricing Active)
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
              className="admin-nav-item active"
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
                  showToast('Staff roster is synchronized.');
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
            <span className="crumb-dark">Services &amp; Pricing</span>
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
              onClick={() => showToast('Notifications are all caught up.')}
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
              <User size={18} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content-area">
          {/* Header Row */}
          <div className="services-header-row">
            <div className="services-header-text">
              <h1 className="services-page-title">Service Packages</h1>
              <p className="services-page-subtitle">
                Manage available vehicle maintenance procedures, bay times, and customer pricing.
              </p>
            </div>

            <div className="services-header-actions">
              <button
                type="button"
                onClick={() => showToast('Exporting service pricing catalog (CSV)...')}
                className="btn-export-list"
              >
                <Download size={15} />
                <span>Export List</span>
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn-add-package-blue"
              >
                <Plus size={16} />
                <span>Add Service</span>
              </button>
            </div>
          </div>

          {/* 4 Metric Counter Cards */}
          <div className="services-stats-grid">
            {/* Card 1: TOTAL SERVICES */}
            <div className="service-stat-card">
              <div className="stat-card-icon-square bg-square-blue">
                <Layers size={22} className="icon-blue" />
              </div>
              <div className="stat-card-info-col">
                <span className="stat-card-label-small">TOTAL SERVICES</span>
                <span className="stat-card-value-large">{totalCount}</span>
              </div>
            </div>

            {/* Card 2: ACTIVE SERVICES */}
            <div className="service-stat-card">
              <div className="stat-card-icon-square bg-square-green">
                <CheckCircle2 size={22} className="icon-green" />
              </div>
              <div className="stat-card-info-col">
                <span className="stat-card-label-small">ACTIVE SERVICES</span>
                <span className="stat-card-value-large">{activeCount}</span>
              </div>
            </div>

            {/* Card 3: AVERAGE PRICE */}
            <div className="service-stat-card">
              <div className="stat-card-icon-square bg-square-purple">
                <DollarSign size={22} className="icon-purple" />
              </div>
              <div className="stat-card-info-col">
                <span className="stat-card-label-small">AVERAGE PRICE</span>
                <span className="stat-card-value-large">LKR {avgPrice}</span>
              </div>
            </div>

            {/* Card 4: AVERAGE DURATION */}
            <div className="service-stat-card">
              <div className="stat-card-icon-square bg-square-cyan">
                <Clock size={22} className="icon-cyan" />
              </div>
              <div className="stat-card-info-col">
                <span className="stat-card-label-small">AVERAGE DURATION</span>
                <span className="stat-card-value-large">{avgDuration} mins</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="services-filter-bar">
            {/* Search Input */}
            <div className="services-search-box">
              <Search size={16} className="search-icon-gray" />
              <input
                type="text"
                placeholder="Search service or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="services-search-input"
              />
            </div>

            {/* Right Dropdowns */}
            <div className="services-dropdowns-group">
              {/* Category Dropdown */}
              <div className="service-select-wrapper">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="services-filter-select"
                >
                  <option value="All">All Categories</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Brakes &amp; Chassis">Brakes &amp; Chassis</option>
                  <option value="Diagnostics">Diagnostics</option>
                  <option value="Climate Control">Climate Control</option>
                  <option value="Electrical &amp; EV">Electrical &amp; EV</option>
                </select>
                <ChevronDown size={14} className="select-arrow-icon" />
              </div>

              {/* Status Dropdown */}
              <div className="service-select-wrapper">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="services-filter-select"
                >
                  <option value="All">Status: All</option>
                  <option value="Active">Status: Active</option>
                  <option value="Inactive">Status: Inactive</option>
                </select>
                <ChevronDown size={14} className="select-arrow-icon" />
              </div>
            </div>
          </div>

          {/* Services Table Card */}
          <div className="services-table-card">
            <div className="table-responsive-wrapper">
              <table className="services-data-table">
                <thead>
                  <tr>
                    <th>SERVICE DETAILS</th>
                    <th>CATEGORY</th>
                    <th>DURATION</th>
                    <th>PRICE</th>
                    <th>STATUS</th>
                    <th className="text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedServices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="empty-state-cell">
                        <div className="empty-filter-state">
                          <Wrench size={36} className="text-muted mb-2" />
                          <h4>No services match your filter</h4>
                          <p>Try searching for a different keyword or category.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedServices.map((svc) => (
                      <tr key={svc.id} className="services-table-row">
                        {/* 1. SERVICE DETAILS */}
                        <td className="cell-service-details">
                          <div className="service-details-lockup">
                            <div className="service-icon-box">
                              {renderServiceIcon(svc.iconType)}
                            </div>
                            <div className="service-title-text-col">
                              <h4 className="service-name-text">{svc.title}</h4>
                              <p className="service-desc-snippet">{svc.description}</p>
                            </div>
                          </div>
                        </td>

                        {/* 2. CATEGORY */}
                        <td className="cell-category">
                          <span className={`cat-pill ${svc.categoryClass}`}>
                            {svc.category}
                          </span>
                        </td>

                        {/* 3. DURATION */}
                        <td className="cell-duration">
                          <div className="duration-row-wrap">
                            <Clock size={15} className="duration-clock-gray" />
                            <span className="duration-text">{svc.duration}</span>
                          </div>
                        </td>

                        {/* 4. PRICE */}
                        <td className="cell-price">
                          <span className="price-bold-amount">
                            LKR {svc.price.toFixed(2)}
                          </span>
                        </td>

                        {/* 5. STATUS */}
                        <td className="cell-status">
                          <span className={`service-status-pill ${svc.statusClass}`}>
                            <span className="status-dot"></span>
                            <span>{svc.status}</span>
                          </span>
                        </td>

                        {/* 6. ACTIONS */}
                        <td className="cell-actions text-right">
                          <div className="action-icons-wrap">
                            <button
                              type="button"
                              onClick={() => setEditItem(svc)}
                              className="btn-action-icon edit"
                              title="Edit package"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteItem(svc)}
                              className="btn-action-icon delete"
                              title="Delete package"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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
                Showing <strong>{totalItems === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of <strong>{totalItems}</strong> service packages
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
        </main>
      </div>

      {/* ========================================================
          ADD NEW PACKAGE MODAL
          ======================================================== */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content admin-action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-line">
              <h3 className="modal-title">Add New Service Package</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-close-modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="modal-body-pad">
              <div className="form-group mb-3">
                <label className="field-label">Package Name</label>
                <input
                  type="text"
                  placeholder="e.g. Turbocharger Intercooler Inspection"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label className="field-label">Procedure Scope &amp; Details</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Boost leak smoke test, clamp torque verification, core wash..."
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label className="field-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Brakes &amp; Chassis">Brakes &amp; Chassis</option>
                    <option value="Diagnostics">Diagnostics</option>
                    <option value="Climate Control">Climate Control</option>
                    <option value="Electrical &amp; EV">Electrical &amp; EV</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">Duration (minutes)</label>
                  <input
                    type="text"
                    placeholder="e.g. 45 mins"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label className="field-label">Customer Price (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="89.00"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
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
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT PACKAGE MODAL
          ======================================================== */}
      {editItem && (
        <div className="modal-backdrop" onClick={() => setEditItem(null)}>
          <div
            className="modal-content admin-action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-line">
              <h3 className="modal-title">Edit Service Package</h3>
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="btn-close-modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="modal-body-pad">
              <div className="form-group mb-3">
                <label className="field-label">Package Name</label>
                <input
                  type="text"
                  required
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label className="field-label">Procedure Scope &amp; Details</label>
                <textarea
                  rows={2}
                  required
                  value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label className="field-label">Category</label>
                  <select
                    value={editItem.category}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Brakes &amp; Chassis">Brakes &amp; Chassis</option>
                    <option value="Diagnostics">Diagnostics</option>
                    <option value="Climate Control">Climate Control</option>
                    <option value="Electrical &amp; EV">Electrical &amp; EV</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">Duration</label>
                  <input
                    type="text"
                    required
                    value={editItem.duration}
                    onChange={(e) => setEditItem({ ...editItem, duration: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label className="field-label">Price (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editItem.price}
                    onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Status</label>
                  <select
                    value={editItem.status}
                    onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-right">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="btn-form-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-topbar-primary">
                  Update Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL
          ======================================================== */}
      {deleteItem && (
        <div className="modal-backdrop" onClick={() => setDeleteItem(null)}>
          <div
            className="modal-content admin-action-modal"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-line">
              <h3 className="modal-title">Delete Service Package</h3>
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                className="btn-close-modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-pad">
              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Are you sure you want to delete <strong>"{deleteItem.title}"</strong>? This will remove the package from the customer booking portal and schedule dispatch options.
              </p>

              <div className="modal-actions-right mt-4">
                <button
                  type="button"
                  onClick={() => setDeleteItem(null)}
                  className="btn-form-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="btn-delete-confirm"
                >
                  Delete Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServicesPage;
