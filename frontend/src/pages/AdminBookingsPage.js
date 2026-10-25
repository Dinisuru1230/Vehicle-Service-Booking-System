import React, { useState, useEffect } from 'react';
import { adminBookingAPI } from '../api/apiClient';
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
  MessageSquare,
  Activity,
  Gauge,
  X,
  UserCheck,
  Loader2,
  Save,
} from 'lucide-react';

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
  const [bookings, setBookings] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bayFilter, setBayFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMsg, setToastMsg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Inspector Assignment State
  const [assignBay, setAssignBay] = useState('');
  const [assignTech, setAssignTech] = useState('');
  const [isUpdatingAssignment, setIsUpdatingAssignment] = useState(false);

  // New Booking Form state
  const [newBooking, setNewBooking] = useState({
    customer: '',
    phone: '',
    vehicle: '',
    plate: '',
    serviceTitle: 'Periodic Maintenance & Synthetic Oil',
    time: 'Today, 04:30 PM',
    bay: 'Bay 3 (Lift Heavy)',
    technician: 'Dave Miller',
    totalCost: '14900',
    notes: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, metricsRes] = await Promise.allSettled([
        adminBookingAPI.getBookings(),
        adminBookingAPI.getMetrics(),
      ]);

      if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.success && Array.isArray(bookingsRes.value.bookings)) {
        setBookings(bookingsRes.value.bookings);
      }
      if (metricsRes.status === 'fulfilled' && metricsRes.value?.success && metricsRes.value.metrics) {
        setMetrics(metricsRes.value.metrics);
      }
    } catch (err) {
      console.warn('[AdminBookings] Could not load live bookings from API:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update selected booking's assignment form when a row is clicked
  useEffect(() => {
    if (selectedBooking) {
      setAssignBay(selectedBooking.bay || 'Bay 3 (Lift Heavy)');
      setAssignTech(selectedBooking.technician || 'Dave Miller');
    }
  }, [selectedBooking]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await adminBookingAPI.updateStatus(bookingId, newStatus);
      if (res && res.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus, statusClass: getStatusClass(newStatus) } : b))
        );
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking((prev) => ({
            ...prev,
            status: newStatus,
            statusClass: getStatusClass(newStatus),
          }));
        }
        showToast(`Booking #${bookingId} status updated to ${newStatus}.`);
        fetchBookings();
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
      showToast(`Error: ${err.message || 'Failed to update status'}`);
    }
  };

  const handleUpdateAssignment = async () => {
    if (!selectedBooking) return;
    setIsUpdatingAssignment(true);
    try {
      const res = await adminBookingAPI.assignTechnicianAndBay(selectedBooking.id, {
        bay: assignBay,
        technician: assignTech,
      });
      if (res && res.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === selectedBooking.id ? { ...b, bay: assignBay, technician: assignTech } : b))
        );
        setSelectedBooking((prev) => ({ ...prev, bay: assignBay, technician: assignTech }));
        showToast(`Assigned ${assignTech} & ${assignBay} to #${selectedBooking.id}.`);
        fetchBookings();
      }
    } catch (err) {
      showToast(`Assignment failed: ${err.message}`);
    } finally {
      setIsUpdatingAssignment(false);
    }
  };

  const getStatusClass = (st) => {
    switch (st) {
      case 'Pending':
        return 'status-pending-amber';
      case 'Confirmed':
        return 'status-confirmed-indigo';
      case 'In-Bay':
        return 'status-inbay-blue';
      case 'Completed':
        return 'status-completed-emerald';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-confirmed-indigo';
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((item) => {
    if (statusFilter !== 'All' && (item.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (bayFilter !== 'All' && !(item.bay || '').toLowerCase().includes(bayFilter.toLowerCase())) return false;
    if (categoryFilter !== 'All' && !(item.serviceTitle || '').toLowerCase().includes(categoryFilter.toLowerCase())) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        (item.id || '').toLowerCase().includes(q) ||
        (item.bookingRef || '').toLowerCase().includes(q) ||
        (item.customer || item.customerName || '').toLowerCase().includes(q) ||
        (item.vehicle || item.vehicleText || '').toLowerCase().includes(q) ||
        (item.serviceTitle || '').toLowerCase().includes(q) ||
        (item.technician || '').toLowerCase().includes(q) ||
        (item.plate || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleExportCSV = () => {
    if (!bookings || bookings.length === 0) {
      showToast('No booking records to export.');
      return;
    }
    const headers = ['Booking ID', 'Customer', 'Vehicle', 'Plate', 'Service Package', 'Scheduled Date', 'Scheduled Time', 'Bay', 'Technician', 'Status', 'Total Cost (LKR)'];
    const rows = bookings.map((b) => [
      `"${b.id || b.bookingRef || ''}"`,
      `"${b.customer || b.customerName || ''}"`,
      `"${b.vehicle || b.vehicleText || ''}"`,
      `"${b.plate || ''}"`,
      `"${b.serviceTitle || ''}"`,
      `"${b.scheduledDate || ''}"`,
      `"${b.scheduledTime || b.time || ''}"`,
      `"${b.bay || ''}"`,
      `"${b.technician || ''}"`,
      `"${b.status || ''}"`,
      `"${b.totalCost || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ApexDrive_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported workshop bookings to CSV successfully.');
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await adminBookingAPI.createBooking({
        customer: newBooking.customer,
        phone: newBooking.phone,
        vehicle: newBooking.vehicle,
        plate: newBooking.plate || 'CA 999ZZ',
        serviceTitle: newBooking.serviceTitle,
        time: newBooking.time,
        bay: newBooking.bay,
        technician: newBooking.technician,
        totalCost: parseFloat(newBooking.totalCost || 14900),
        status: 'Confirmed',
        notes: newBooking.notes,
      });
      if (res && res.success && res.booking) {
        showToast(`Booking #${res.booking.id || res.booking.bookingRef} scheduled successfully!`);
        setModalOpen(false);
        setNewBooking({
          customer: '',
          phone: '',
          vehicle: '',
          plate: '',
          serviceTitle: 'Periodic Maintenance & Synthetic Oil',
          time: 'Today, 04:30 PM',
          bay: 'Bay 3 (Lift Heavy)',
          technician: 'Dave Miller',
          totalCost: '14900',
          notes: '',
        });
        await fetchBookings();
      } else {
        throw new Error(res?.message || 'Failed to schedule booking');
      }
    } catch (err) {
      showToast(`Booking error: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Real Metric Counters
  const totalBookingsCount = metrics?.totalBookings ?? bookings.length;
  const pendingConfirmationCount = metrics?.pendingConfirmation ?? bookings.filter((b) => b.status === 'Pending').length;
  const todaysInBayCount = metrics?.todaysInBay ?? bookings.filter((b) => b.status === 'In-Bay').length;
  const completedTodayCount = metrics?.completedToday ?? bookings.filter((b) => b.status === 'Completed').length;
  const grossInvoicedDisplay = metrics?.grossInvoiced || `LKR ${bookings.filter((b) => b.status === 'Completed').reduce((sum, b) => sum + (b.totalCost || 0), 0).toLocaleString()}`;
  const bayUtilRate = metrics?.bayUtilizationRate || `${Math.min(100, Math.round((todaysInBayCount / 6) * 100))}%`;

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
              <span className="badge-counter-pill">{totalBookingsCount}</span>
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
              onClick={() => showToast('Live system logs & bookings synced.')}
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
                  <span>LIVE DATABASE FEED</span>
                </span>
              </div>

              <h1 className="manage-bookings-title">Manage Bookings</h1>
              <p className="manage-bookings-subtitle">
                Track, filter, and assign vehicle service appointments and workshop bay schedules with live telemetry.
              </p>
            </div>

            <div className="header-right-action-cluster">
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-export-csv"
                title="Download CSV export of current bookings"
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
              <div className="stat-card-number">{totalBookingsCount}</div>
              <div className="stat-card-footer-pill-line">
                <span className="stat-pill-highlight green">Live Database</span>
                <span className="stat-pill-label">Total active &amp; history</span>
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
              <div className="stat-card-number">{pendingConfirmationCount}</div>
              <div className="stat-card-footer-pill-line">
                <span className={`stat-pill-highlight ${pendingConfirmationCount > 0 ? 'coral' : 'green'}`}>
                  {pendingConfirmationCount > 0 ? 'Action Required' : 'All Clear'}
                </span>
                <span className="stat-pill-label">Awaiting intake queue</span>
              </div>
            </div>

            {/* Card 3: TODAY'S IN-BAY */}
            <div className="admin-stat-metric-card">
              <div className="stat-card-header">
                <span className="stat-card-eyebrow">ACTIVE IN-BAY</span>
                <div className="stat-card-icon-box bg-light-indigo">
                  <Building2 size={18} className="text-indigo" />
                </div>
              </div>
              <div className="stat-card-number">{todaysInBayCount}</div>
              <div className="stat-card-footer-pill-line">
                <span className="stat-pill-highlight blue">{todaysInBayCount} of 6 bays</span>
                <span className="stat-pill-label">Active workshop lifts</span>
              </div>
            </div>

            {/* Card 4: COMPLETED TODAY */}
            <div className="admin-stat-metric-card">
              <div className="stat-card-header">
                <span className="stat-card-eyebrow">COMPLETED JOBS</span>
                <div className="stat-card-icon-box bg-light-green">
                  <CheckCircle2 size={18} className="text-green" />
                </div>
              </div>
              <div className="stat-card-number">{completedTodayCount}</div>
              <div className="stat-card-footer-pill-line">
                <span className="stat-pill-highlight green">{grossInvoicedDisplay}</span>
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
                placeholder="Search by ID, customer, vehicle, plate, tech..."
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
                <option value="Cancelled">Status: Cancelled</option>
              </select>
              <ChevronDown size={14} className="dropdown-caret" />
            </div>

            {/* Dropdown 2: Category */}
            <div className="filter-dropdown-box">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">Category: All Services</option>
                <option value="Brake">Brake Service</option>
                <option value="Periodic Maintenance">Periodic Maintenance</option>
                <option value="Track Alignment">Track Alignment</option>
                <option value="Battery Health">Battery &amp; EV</option>
                <option value="Powertrain">Powertrain Inspection</option>
                <option value="Alternator">Alternator &amp; Hybrid</option>
              </select>
              <Filter size={14} className="dropdown-caret" />
            </div>

            {/* Dropdown 3: Bay */}
            <div className="filter-dropdown-box">
              <select
                value={bayFilter}
                onChange={(e) => setBayFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">Bay: All Bays</option>
                <option value="Bay 1">Bay 1 (Dyno Rack)</option>
                <option value="Bay 2">Bay 2 (QC Signed)</option>
                <option value="Bay 3">Bay 3 (Lift Heavy)</option>
                <option value="Bay 4">Bay 4 (Scheduled)</option>
                <option value="Bay 5">Bay 5 (EV Station)</option>
                <option value="Bay 6">Bay 6 (East Annex)</option>
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
                fetchBookings();
              }}
              className="btn-clear-filters"
              title="Reset all filters and refresh from database"
            >
              <RotateCcw size={15} className={isLoading ? 'spin-animation' : ''} />
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
                    <th>PRICE (LKR)</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5">
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                          <Loader2 size={32} className="spin-animation text-blue" style={{ margin: '0 auto 0.75rem' }} />
                          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading live workshop bookings from database...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5">
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
                        key={b.id || b.bookingRef}
                        className="booking-interactive-row"
                        onClick={() => setSelectedBooking(b)}
                        title="Click to view and update booking details"
                      >
                        {/* 1. BOOKING ID */}
                        <td className="cell-booking-id">
                          <span className="booking-id-badge">#{b.bookingRef ? b.bookingRef.replace(/^#/, '') : b.id}</span>
                        </td>

                        {/* 2. CUSTOMER & VEHICLE */}
                        <td className="cell-customer-vehicle">
                          <div className="customer-avatar-lockup">
                            <div className="customer-avatar-circle">
                              <span>{b.initials || 'CU'}</span>
                            </div>
                            <div className="customer-text-col">
                              <span className="customer-full-name">{b.customer || b.customerName}</span>
                              <span className="customer-vehicle-meta">
                                {b.vehicle || b.vehicleText} • {b.plate}
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
                            {b.timeIcon === 'clock' && <Clock size={15} className="time-icon-blue" />}
                            {b.timeIcon === 'lift' && <Activity size={15} className="time-icon-blue" />}
                            {b.timeIcon === 'calendar' && <Calendar size={15} className="time-icon-blue" />}
                            {b.timeIcon === 'check' && <CheckCircle2 size={15} className="time-icon-green" />}
                            <span className="schedule-time-text">{b.time || b.scheduledTime}</span>
                          </div>
                          <div className={`schedule-bay-subtext ${b.bayHighlight || ''}`}>
                            {b.bay || 'Bay Standby'}
                          </div>
                        </td>

                        {/* 5. TECHNICIAN */}
                        <td className="cell-technician">
                          <div className="tech-avatar-lockup">
                            <div className={`tech-avatar-circle ${b.techBg || 'tech-dark'}`}>
                              <span>{b.techInitials || 'DM'}</span>
                            </div>
                            <span className="tech-name-text">{b.technician || 'Unassigned'}</span>
                          </div>
                        </td>

                        {/* 6. PRICE (LKR) */}
                        <td className="cell-price">
                          <strong style={{ color: '#0066f5', fontSize: '0.92rem' }}>
                            {b.price || `LKR ${Number(b.totalCost || 0).toFixed(2)}`}
                          </strong>
                        </td>

                        {/* 7. STATUS */}
                        <td className="cell-status">
                          <span className={`status-pill ${b.statusClass || getStatusClass(b.status)}`}>
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
                Showing <strong>1–{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> bookings in database
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

                {[1].map((p) => (
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
                  disabled={true}
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
                <span className="card-accent-tag text-green">{bayUtilRate} ACTIVE</span>
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
                      strokeDasharray={`${parseInt(bayUtilRate, 10) || 50}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="donut-center-text">
                    <span className="donut-pct">{bayUtilRate}</span>
                  </div>
                </div>

                <p className="donut-desc">
                  {todaysInBayCount} of 6 hydraulic bay platforms actively running services or scheduled for intake.
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
                  Intake turnaround running smoothly across all certified bays with real-time technician telemetry.
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
                <span className="card-accent-tag text-muted">SYSTEM ONLINE</span>
              </div>

              <div className="alerts-card-content">
                <div className="alerts-callout-box">
                  <div className="alerts-icon-box">
                    <MessageSquare size={18} className="text-blue" />
                  </div>
                  <div className="alerts-text-block">
                    <h5 className="alerts-title">SMS &amp; Email Customer Triggers</h5>
                    <p className="alerts-sub">
                      Intake notifications, bay status alerts, and invoice delivery active across {totalBookingsCount} bookings.
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
                  placeholder="e.g. Kasun Jayawardena"
                  required
                  value={newBooking.customer}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, customer: e.target.value })
                  }
                  className="admin-form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label className="field-label">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. +94 77 123 4567"
                  value={newBooking.phone}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, phone: e.target.value })
                  }
                  className="admin-form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label className="field-label">Vehicle Make &amp; Model</label>
                <input
                  type="text"
                  placeholder="e.g. 2024 Toyota Land Cruiser"
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
                  placeholder="e.g. WP CAB-1234"
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
                  <option>40-Point Powertrain Inspection</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label className="field-label">Estimated Price (LKR)</label>
                <input
                  type="number"
                  placeholder="14900"
                  value={newBooking.totalCost}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, totalCost: e.target.value })
                  }
                  className="admin-form-input"
                />
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

              <div className="form-group mb-3">
                <label className="field-label">Lead Technician</label>
                <select
                  value={newBooking.technician}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, technician: e.target.value })
                  }
                  className="admin-form-input"
                >
                  <option>Dave Miller</option>
                  <option>Marcus Vance</option>
                  <option>Sam Rivera</option>
                  <option>Sarah Chen</option>
                  <option>Alex Wong</option>
                </select>
              </div>

              <div className="modal-actions-right">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-form-cancel"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-topbar-primary"
                  disabled={isCreating}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  {isCreating ? (
                    <>
                      <Loader2 size={15} className="spin-animation" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <span>Confirm &amp; Schedule</span>
                  )}
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
            style={{ maxWidth: '580px' }}
          >
            <div className="modal-header-line">
              <h3 className="modal-title">
                Booking Inspector (#{selectedBooking.bookingRef ? selectedBooking.bookingRef.replace(/^#/, '') : selectedBooking.id})
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
                  <h4>{selectedBooking.customer || selectedBooking.customerName}</h4>
                  <p className="text-muted">
                    {selectedBooking.vehicle || selectedBooking.vehicleText} • Plate: {selectedBooking.plate}
                  </p>
                </div>
                <span className={`status-pill ${selectedBooking.statusClass || getStatusClass(selectedBooking.status)}`}>
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
                  <span>{selectedBooking.serviceDetail || 'Precision High-Performance Intake Protocol'}</span>
                </div>
                <div className="spec-row">
                  <span>Scheduled Time:</span>
                  <span>{selectedBooking.scheduledDate ? `${selectedBooking.scheduledDate}, ` : ''}{selectedBooking.scheduledTime || selectedBooking.time}</span>
                </div>
                <div className="spec-row">
                  <span>Service Facility:</span>
                  <span>{selectedBooking.hub || 'Apex Central Hub'}</span>
                </div>
                <div className="spec-row">
                  <span>Service Cost:</span>
                  <strong style={{ color: '#0066f5' }}>
                    {selectedBooking.price || `LKR ${Number(selectedBooking.totalCost || 0).toFixed(2)}`}
                  </strong>
                </div>

                {selectedBooking.notes && (
                  <div className="spec-row" style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px' }}>
                    <span>Customer Notes:</span>
                    <span>{selectedBooking.notes}</span>
                  </div>
                )}

                {/* Status Switcher */}
                <div className="spec-row" style={{ marginTop: '0.85rem', alignItems: 'center' }}>
                  <span>Update Status:</span>
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                    {['Pending', 'Confirmed', 'In-Bay', 'Completed', 'Cancelled'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(selectedBooking.id, st)}
                        className={`status-pill ${selectedBooking.status === st ? 'active-pill' : ''}`}
                        style={{
                          cursor: 'pointer',
                          opacity: selectedBooking.status === st ? 1 : 0.65,
                          border: selectedBooking.status === st ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: selectedBooking.status === st ? '#eff6ff' : '#ffffff',
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bay & Technician Reassignment */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Reassign Bay &amp; Technician
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Workshop Bay</label>
                      <select
                        value={assignBay}
                        onChange={(e) => setAssignBay(e.target.value)}
                        className="admin-form-input"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      >
                        <option>Bay 1 (Dyno Rack)</option>
                        <option>Bay 2 (QC Signed)</option>
                        <option>Bay 3 (Lift Heavy)</option>
                        <option>Bay 4 (Scheduled)</option>
                        <option>Bay 5 (EV Station)</option>
                        <option>Bay 6 (East Annex)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Lead Technician</label>
                      <select
                        value={assignTech}
                        onChange={(e) => setAssignTech(e.target.value)}
                        className="admin-form-input"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      >
                        <option>Dave Miller</option>
                        <option>Marcus Vance</option>
                        <option>Sam Rivera</option>
                        <option>Sarah Chen</option>
                        <option>Alex Wong</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.65rem' }}>
                    <button
                      type="button"
                      onClick={handleUpdateAssignment}
                      disabled={isUpdatingAssignment}
                      className="btn-light-action"
                      style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}
                    >
                      <Save size={14} />
                      <span>{isUpdatingAssignment ? 'Saving...' : 'Update Assignment'}</span>
                    </button>
                  </div>
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
