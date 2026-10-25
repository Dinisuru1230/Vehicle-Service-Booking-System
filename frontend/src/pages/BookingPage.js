import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { serviceAPI, bookingAPI, vehicleAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import './BookingPage.css';
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
  Cpu,
  Fan,
  SlidersHorizontal,
  BatteryCharging,
  Sparkles,
  Search,
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';

// Fallback catalog matching backend database seeds
const fallbackServices = [
  {
    id: 'SVC-101',
    serviceCode: 'SVC-101',
    title: 'Periodic Maintenance & Synthetic Oil',
    subtitle: 'Synthetic oil change & filter inspection',
    duration: '45 mins',
    price: 89.0,
    iconType: 'wrench',
    category: 'Maintenance',
    badge: '40-POINT INSPECTION',
    isPopular: true,
  },
  {
    id: 'SVC-102',
    serviceCode: 'SVC-102',
    title: 'Brake System Repair & Resurfacing',
    subtitle: 'Pad renewal & rotor safety check',
    duration: '60 mins',
    price: 149.0,
    iconType: 'disc',
    category: 'Brakes & Chassis',
    badge: 'SAFETY CRITICAL',
    isPopular: true,
  },
  {
    id: 'SVC-103',
    serviceCode: 'SVC-103',
    title: 'Engine Diagnostics & Level-3 ECU Scan',
    subtitle: 'Engine check light & systems scan',
    duration: '30 mins',
    price: 79.0,
    iconType: 'cpu',
    category: 'Engine & ECU',
    badge: 'LEVEL-3 TELEMETRY',
    isPopular: true,
  },
  {
    id: 'SVC-104',
    serviceCode: 'SVC-104',
    title: 'Climate Control & High-Pressure Flush',
    subtitle: 'Refrigerant recharge & cabin filter',
    duration: '40 mins',
    price: 99.0,
    iconType: 'fan',
    category: 'Maintenance',
    badge: 'CLIMATE PRECISION',
    isPopular: false,
  },
  {
    id: 'SVC-105',
    serviceCode: 'SVC-105',
    title: 'Laser Alignment & Corner Balancing',
    subtitle: 'Multi-axis rig camber/toe tuning',
    duration: '75 mins',
    price: 129.0,
    iconType: 'sliders',
    category: 'Brakes & Chassis',
    badge: 'CHASSIS DYNAMICS',
    isPopular: false,
  },
  {
    id: 'SVC-106',
    serviceCode: 'SVC-106',
    title: '48V Hybrid & Electrical Diagnostics',
    subtitle: 'High-voltage isolation & battery test',
    duration: '50 mins',
    price: 119.0,
    iconType: 'battery',
    category: 'Electrical',
    badge: 'HIGH VOLTAGE',
    isPopular: false,
  },
  {
    id: 'SVC-107',
    serviceCode: 'SVC-107',
    title: 'Transmission & DCT Fluid Exchange',
    subtitle: 'Dual-clutch pressurized purge & adaptation',
    duration: '90 mins',
    price: 189.0,
    iconType: 'wrench',
    category: 'Engine & ECU',
    badge: 'POWERTRAIN CARE',
    isPopular: false,
  },
  {
    id: 'SVC-108',
    serviceCode: 'SVC-108',
    title: 'Track-Prep Aerodynamics & Fluids',
    subtitle: 'SRF brake flush, corner balancing & aero torque',
    duration: '120 mins',
    price: 249.0,
    iconType: 'sparkles',
    category: 'Engine & ECU',
    badge: 'MOTORSPORT SPEC',
    isPopular: true,
  },
];

const getServiceIconComponent = (iconType) => {
  const norm = (iconType || '').toLowerCase();
  switch (norm) {
    case 'disc':
      return Disc;
    case 'cpu':
      return Cpu;
    case 'activity':
      return Activity;
    case 'fan':
    case 'snowflake':
      return Snowflake;
    case 'sliders':
    case 'slidershorizontal':
      return SlidersHorizontal;
    case 'battery':
    case 'batterycharging':
      return BatteryCharging;
    case 'sparkles':
      return Sparkles;
    case 'wrench':
    default:
      return Wrench;
  }
};

const morningSlots = ['08:30 AM', '10:00 AM', '11:30 AM'];
const afternoonSlots = ['01:30 PM', '03:00 PM', '04:15 PM'];

const BookingPage = ({
  onNavigateHome,
  onNavigateBook,
  onNavigateBookings,
  onNavigateAbout,
  onNavigateProfile,
  onNavigateAdmin,
  onNavigateLogin,
  onNavigateRegister,
  initialService,
}) => {
  const { user, isAuthenticated } = useAuth();

  // Contact & Vehicle state
  const [fullName, setFullName] = useState('Marcus Vance');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 019-2834');
  const [vehicleMake, setVehicleMake] = useState('2023 BMW M3 Competition');
  const [licensePlate, setLicensePlate] = useState('TX-784-KPL');
  const [userVehicles, setUserVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [notes, setNotes] = useState('');

  // Live Services state from API
  const [services, setServices] = useState(fallbackServices);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolve initial selected service key from initialService prop
  const getInitialSelectedServices = () => {
    if (!initialService) return ['SVC-101'];
    if (typeof initialService === 'string') return [initialService];
    if (initialService.serviceCode) return [initialService.serviceCode];
    if (typeof initialService.id === 'string' && initialService.id.startsWith('SVC')) {
      return [initialService.id];
    }
    const titleStr = (initialService.title || initialService.name || initialService.service || '').toLowerCase();
    if (titleStr.includes('brake') || titleStr.includes('pad') || titleStr.includes('rotor')) return ['SVC-102'];
    if (titleStr.includes('ecu') || titleStr.includes('tuning') || titleStr.includes('diagnos')) return ['SVC-103'];
    if (titleStr.includes('climate') || titleStr.includes('ac') || titleStr.includes('refrigerant')) return ['SVC-104'];
    if (titleStr.includes('align') || titleStr.includes('suspension') || titleStr.includes('laser')) return ['SVC-105'];
    if (titleStr.includes('battery') || titleStr.includes('hybrid') || titleStr.includes('48v')) return ['SVC-106'];
    return ['SVC-101'];
  };

  // Selected Services state - defaults to single primary service or matched initial service
  const [selectedServices, setSelectedServices] = useState(getInitialSelectedServices);

  // Calendar Date & Slot state
  const [selectedDay, setSelectedDay] = useState(14);
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [currentMonth, setCurrentMonth] = useState('October');
  const [currentYear, setCurrentYear] = useState(2025);

  // Booking Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookedConfirmation, setBookedConfirmation] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  // 1. Fetch live services from backend API on mount
  const fetchServices = async () => {
    setIsLoadingServices(true);
    setServicesError(null);
    try {
      const res = await serviceAPI.getServices();
      if (res && res.success && Array.isArray(res.services) && res.services.length > 0) {
        const activeOnly = res.services.filter((s) => s.status !== 'Inactive');
        setServices(activeOnly.length > 0 ? activeOnly : res.services);
      } else if (Array.isArray(res) && res.length > 0) {
        setServices(res);
      }
    } catch (err) {
      console.warn('[BookingPage] Could not fetch services from API, using fallback catalog:', err);
      setServicesError('Catalog loaded from local cache');
    } finally {
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 2. Pre-fill user profile and vehicles when user is logged in
  useEffect(() => {
    if (user) {
      const computedName =
        user.firstName || user.lastName
          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
          : user.name || '';
      if (computedName) setFullName(computedName);
      if (user.phone) setPhoneNumber(user.phone);

      const fetchUserVehicles = async () => {
        try {
          const res = await vehicleAPI.getVehicles();
          const list = res?.vehicles || (Array.isArray(res) ? res : []);
          if (list.length > 0) {
            setUserVehicles(list);
            const primaryVeh = list.find((v) => v.isPrimary) || list[0];
            setSelectedVehicleId(primaryVeh.id);
            setVehicleMake(
              primaryVeh.name || `${primaryVeh.year} ${primaryVeh.make} ${primaryVeh.model}`
            );
            setLicensePlate(primaryVeh.plate || primaryVeh.license || '');
          }
        } catch {
          // Ignore vehicle fetch error for guest/offline
        }
      };
      fetchUserVehicles();
    }
  }, [user]);

  // 3. Handle initial service passed via props (e.g. from Landing Page Book Now)
  useEffect(() => {
    if (!initialService) return;

    const code =
      typeof initialService === 'string'
        ? initialService
        : initialService.serviceCode ||
          initialService.code ||
          (typeof initialService.id === 'string' && initialService.id.startsWith('SVC')
            ? initialService.id
            : null);

    const titleStr =
      typeof initialService === 'object'
        ? (initialService.title || initialService.name || initialService.service || '').toLowerCase()
        : '';

    if (services.length > 0) {
      let matched = null;

      // 1. Match by serviceCode or id
      if (code) {
        matched = services.find((s) => s.serviceCode === code || s.id === code);
      }

      // 2. Match by exact or partial title
      if (!matched && titleStr) {
        matched = services.find((s) => {
          const sTitle = (s.title || '').toLowerCase();
          return sTitle === titleStr || sTitle.includes(titleStr) || titleStr.includes(sTitle);
        });
      }

      // 3. Match by keyword mapping
      if (!matched && titleStr) {
        const keywordMap = [
          { kws: ['oil', 'periodic', 'maintenance'], code: 'SVC-101' },
          { kws: ['brake', 'pad', 'rotor', 'stopping'], code: 'SVC-102' },
          { kws: ['ecu', 'engine', 'diagnostic', 'tuning', 'telemetry', 'scan'], code: 'SVC-103' },
          { kws: ['climate', 'ac', 'air condition', 'flush', 'refrigerant'], code: 'SVC-104' },
          { kws: ['align', 'suspension', 'corner balance', 'laser', 'steering'], code: 'SVC-105' },
          { kws: ['battery', 'hybrid', '48v', 'electrical', 'crank'], code: 'SVC-106' },
        ];
        for (const map of keywordMap) {
          if (map.kws.some((kw) => titleStr.includes(kw))) {
            matched = services.find((s) => s.serviceCode === map.code);
            if (matched) break;
          }
        }
      }

      if (matched) {
        setSelectedServices([matched.serviceCode || matched.id]);
        setActiveCategory('All');
      } else if (code) {
        setSelectedServices([code]);
      }
    } else if (code) {
      setSelectedServices([code]);
    }

    // Pre-fill vehicle if passed from dispatcher
    if (typeof initialService === 'object' && initialService.vehicle) {
      const vehMap = {
        bmw_m3: '2023 BMW M3 Competition',
        porsche_911: '2022 Porsche 911 Carrera',
        audi_q7: '2023 Audi Q7 Quattro',
        tesla_s: '2022 Tesla Model S Plaid',
        merc_amg: '2024 Mercedes-AMG C63',
      };
      const mappedVeh = vehMap[initialService.vehicle] || initialService.vehicle;
      if (mappedVeh) {
        setVehicleMake(mappedVeh);
      }
    }
  }, [initialService, services]);

  // Handle vehicle dropdown selection
  const handleVehicleSelect = (e) => {
    const val = e.target.value;
    setSelectedVehicleId(val);
    if (val === 'custom') {
      return;
    }
    const found = userVehicles.find((v) => v.id === val);
    if (found) {
      setVehicleMake(found.name || `${found.year} ${found.make} ${found.model}`);
      setLicensePlate(found.plate || found.license || '');
    }
  };

  // Toggle service selection (allows toggling any service on/off freely)
  const toggleService = (srv) => {
    const key = srv.serviceCode || srv.id;
    const isSelected = selectedServices.some(
      (sKey) => sKey === srv.id || sKey === srv.serviceCode
    );

    if (isSelected) {
      setSelectedServices(
        selectedServices.filter((sKey) => sKey !== srv.id && sKey !== srv.serviceCode)
      );
    } else {
      setSelectedServices([...selectedServices, key]);
    }
  };

  // Derive categories list dynamically
  const categories = useMemo(() => {
    const set = new Set();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [services]);

  // Filter services by category and search
  const displayedServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesCategory =
        activeCategory === 'All' || srv.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        srv.title.toLowerCase().includes(q) ||
        (srv.subtitle && srv.subtitle.toLowerCase().includes(q)) ||
        (srv.category && srv.category.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  // Active services matching selected keys
  const activeServicesList = useMemo(() => {
    return services.filter((s) =>
      selectedServices.some((key) => key === s.id || key === s.serviceCode)
    );
  }, [services, selectedServices]);

  const totalPrice = useMemo(() => {
    return activeServicesList.reduce(
      (acc, curr) => acc + (parseFloat(curr.price) || 0),
      0
    );
  }, [activeServicesList]);

  // Submit appointment
  const handleConfirm = async () => {
    setIsSubmitting(true);
    setBookingError(null);

    const bookingPayload = {
      vehicleId: selectedVehicleId && selectedVehicleId !== 'custom' ? selectedVehicleId : undefined,
      vehicleMake,
      licensePlate,
      fullName,
      phoneNumber,
      serviceItems: activeServicesList.map((s) => ({
        id: s.serviceCode || s.id,
        title: s.title,
        price: parseFloat(s.price),
        duration: s.duration,
      })),
      selectedServices: activeServicesList.map((s) => s.serviceCode || s.id),
      serviceTitle: activeServicesList.map((s) => s.title).join(' & '),
      serviceDetail: activeServicesList[0]?.subtitle || activeServicesList[0]?.description || '',
      selectedDay,
      currentMonth,
      currentYear,
      scheduledDate: `Tuesday, Oct ${selectedDay}, ${currentYear}`,
      selectedSlot,
      scheduledTime: selectedSlot,
      hub: 'Apex Central Precision Hub',
      notes,
      totalCost: totalPrice,
      totalPrice,
    };

    if (isAuthenticated) {
      try {
        const res = await bookingAPI.createBooking(bookingPayload);
        if (res && res.success && res.booking) {
          setBookedConfirmation(res.booking);
          setIsBooked(true);
        } else {
          setBookedConfirmation({
            bookingRef: '#APX-' + Math.floor(10000 + Math.random() * 90000),
            bay: 'Bay 03 (Precision Lift)',
            totalCost: totalPrice,
          });
          setIsBooked(true);
        }
      } catch (err) {
        console.error('Booking failed:', err);
        setBookingError(err.message || 'Failed to submit appointment. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Guest booking mock confirmation
      setBookedConfirmation({
        bookingRef: '#APX-' + Math.floor(10000 + Math.random() * 90000),
        bay: 'Bay 03 (Standby)',
        totalCost: totalPrice,
      });
      setIsBooked(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-page-root">
      {/* Navbar with Book Service active */}
      <Navbar
        activeTab="book"
        onNavigateHome={onNavigateHome}
        onNavigateBook={onNavigateBook}
        onNavigateBookings={onNavigateBookings}
        onNavigateAbout={onNavigateAbout}
        onNavigateProfile={onNavigateProfile}
        onNavigateAdmin={onNavigateAdmin}
        onNavigateLogin={onNavigateLogin}
        onNavigateRegister={onNavigateRegister}
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
            <div className="step-item active">
              <span className="step-number-circle filled">2</span>
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
                {/* Saved vehicle selector if user has vehicles */}
                {userVehicles.length > 0 && (
                  <div className="vehicle-picker-toggle-row">
                    <div style={{ width: '100%' }}>
                      <label className="input-field-label">SAVED GARAGE VEHICLES</label>
                      <select
                        value={selectedVehicleId}
                        onChange={handleVehicleSelect}
                        className="vehicle-saved-select"
                      >
                        {userVehicles.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name || `${v.year} ${v.make} ${v.model}`} ({v.plate || v.license || 'No Plate'})
                          </option>
                        ))}
                        <option value="custom">+ Enter a different vehicle</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="form-input-box">
                  <label className="input-field-label">FULL NAME</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="styled-form-input"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-input-box">
                  <label className="input-field-label">PHONE NUMBER</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="styled-form-input"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="form-input-box">
                  <label className="input-field-label">VEHICLE MAKE, MODEL &amp; YEAR</label>
                  <input
                    type="text"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    className="styled-form-input"
                    placeholder="e.g. 2023 BMW M3 Competition"
                  />
                </div>

                <div className="form-input-box">
                  <label className="input-field-label">LICENSE PLATE NUMBER</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="styled-form-input"
                    placeholder="e.g. TX-784-KPL"
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="select-hint-text">Select one or more</span>
                  <button
                    type="button"
                    onClick={fetchServices}
                    className="services-reload-btn"
                    title="Reload live services from database"
                  >
                    <RefreshCw size={14} className={isLoadingServices ? 'spin-animation' : ''} />
                  </button>
                </div>
              </div>

              {/* Toolbar: Dedicated Search Bar + Category Filter Tabs */}
              <div className="services-controls-stack">
                <div className="services-search-wrapper">
                  <Search size={16} className="services-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services by name, package or keyword (e.g. oil, brake, ecu)..."
                    className="services-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="services-search-clear-btn"
                      title="Clear search"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="services-filter-tabs-row">
                  <div className="services-filter-tabs">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`service-filter-tab ${activeCategory === cat ? 'active' : ''}`}
                      >
                        {cat} {cat === 'All' ? `(${services.length})` : ''}
                      </button>
                    ))}
                  </div>
                  {searchQuery && (
                    <span className="services-search-count-hint">
                      {displayedServices.length} {displayedServices.length === 1 ? 'service found' : 'services found'}
                    </span>
                  )}
                </div>
              </div>

              {/* Services Grid or Loading Skeletons */}
              <div className="services-selection-grid">
                {isLoadingServices ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={`skel-${idx}`} className="services-skeleton-card">
                      <div className="service-card-top-row">
                        <div className="skeleton-shimmer-box" style={{ width: 38, height: 38 }} />
                        <div style={{ flex: 1 }}>
                          <div className="skeleton-shimmer-box" style={{ width: '70%', height: 16, marginBottom: 8 }} />
                          <div className="skeleton-shimmer-box" style={{ width: '90%', height: 12 }} />
                        </div>
                      </div>
                      <div className="service-card-bottom-row">
                        <div className="skeleton-shimmer-box" style={{ width: '35%', height: 14 }} />
                        <div className="skeleton-shimmer-box" style={{ width: '25%', height: 18 }} />
                      </div>
                    </div>
                  ))
                ) : displayedServices.length === 0 ? (
                  <div className="services-empty-state">
                    <p style={{ fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                      {searchQuery
                        ? `No services found matching "${searchQuery}"`
                        : `No services found in category "${activeCategory}"`}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                      Try choosing another category or clearing your search filter.
                    </p>
                    {(searchQuery || activeCategory !== 'All') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setActiveCategory('All');
                        }}
                        className="services-reset-filters-btn"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                ) : (
                  displayedServices.map((srv) => {
                    const isSelected = selectedServices.some(
                      (key) => key === srv.id || key === srv.serviceCode
                    );
                    const IconComponent = getServiceIconComponent(srv.iconType);
                    const durationStr = srv.duration
                      ? srv.duration.startsWith('~')
                        ? srv.duration
                        : `~${srv.duration}`
                      : '~45 mins';
                    const priceNum = parseFloat(srv.price) || 0;

                    return (
                      <div
                        key={srv.id || srv.serviceCode}
                        onClick={() => toggleService(srv)}
                        className={`service-option-card ${isSelected ? 'selected' : ''}`}
                      >
                        <div>
                          {srv.badge && (
                            <span className={`srv-badge-tag ${srv.isPopular ? 'badge-popular' : ''}`}>
                              {srv.badge}
                            </span>
                          )}
                          <div className="service-card-top-row">
                            <div className="service-icon-box">
                              <IconComponent size={20} className="srv-icon" />
                            </div>
                            <div className="service-info-text">
                              <h4 className="srv-title">{srv.title}</h4>
                              <p className="srv-subtitle">{srv.subtitle || srv.description}</p>
                            </div>
                            <div className={`srv-custom-checkbox ${isSelected ? 'checked' : ''}`}>
                              {isSelected && <Check size={14} className="check-mark" />}
                            </div>
                          </div>
                        </div>

                        <div className="service-card-bottom-row">
                          <div className="srv-duration">
                            <Clock size={14} className="clock-icon" />
                            <span>{durationStr}</span>
                          </div>
                          <span className={`srv-price ${isSelected ? 'selected-price' : ''}`}>
                            LKR {priceNum.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
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
                  <span className="veh-model-name">{vehicleMake || 'Select Vehicle'}</span>
                  <span className="veh-plate-sub">{licensePlate || 'Plate Pending'}</span>
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
                    Tuesday, Oct {selectedDay}, {currentYear}
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
                  {activeServicesList.length === 0 ? (
                    <div style={{ padding: '0.65rem 0', color: '#94a3b8', fontSize: '0.84rem' }}>
                      No service selected. Click a service above to select.
                    </div>
                  ) : (
                    activeServicesList.map((srv) => (
                      <div key={srv.id || srv.serviceCode} className="breakdown-row">
                        <span className="breakdown-name">{srv.title}</span>
                        <span className="breakdown-price">LKR {(parseFloat(srv.price) || 0).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Error message banner if booking failed */}
              {bookingError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    marginBottom: '1rem',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Divider & Total */}
              <div className="summary-total-section">
                <div className="total-display-row">
                  <span className="total-due-text">Total Due at Bay</span>
                  <span className="total-amount-number">LKR {totalPrice.toFixed(2)}</span>
                </div>
                <p className="pay-guarantee-note">
                  Pay after inspection. Free cancellation anytime.
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting || activeServicesList.length === 0}
                className="btn-confirm-appointment"
                style={{
                  opacity: isSubmitting || activeServicesList.length === 0 ? 0.6 : 1,
                  cursor: activeServicesList.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={17} className="spin-animation" />
                    <span>Confirming Appointment...</span>
                  </>
                ) : activeServicesList.length === 0 ? (
                  <span>Select a Service to Continue</span>
                ) : (
                  <>
                    <span>Confirm &amp; Book Appointment</span>
                    <ArrowRight size={17} className="btn-arrow" />
                  </>
                )}
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
              Your service appointment for the <strong>{vehicleMake}</strong> has been confirmed for{' '}
              <strong>
                Tuesday, Oct {selectedDay}, {currentYear} at {selectedSlot}
              </strong>.
            </p>
            <div className="success-details-pill">
              <span>{bookedConfirmation?.bookingRef || '#APX-84920'}</span> •{' '}
              <span>{bookedConfirmation?.bay || 'Bay Standby Reserved'}</span> •{' '}
              <span>Estimate: LKR {totalPrice.toFixed(2)}</span>
            </div>
            <div className="modal-actions justify-center" style={{ gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setIsBooked(false);
                  if (onNavigateBookings) onNavigateBookings();
                }}
                className="btn-primary"
              >
                View My Bookings
              </button>
              <button
                type="button"
                onClick={() => setIsBooked(false)}
                className="btn-secondary"
              >
                Close
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
