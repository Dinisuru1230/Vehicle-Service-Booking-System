import React, { useState, useEffect } from 'react';
import { adminCustomerAPI } from '../api/apiClient';
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
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  ShieldCheck,
  Award,
  TrendingUp,
  Sparkles,
  ExternalLink,
  UserCheck,
  UserPlus,
  FileText,
  Gauge,
  Key,
  Layers,
  ArrowUpDown,
  Building2,
} from 'lucide-react';

const initialCustomers = [
  {
    id: 'CUST-1001',
    firstName: 'Alexander',
    lastName: 'Wright',
    initials: 'AW',
    avatarBg: 'avatar-blue',
    email: 'a.wright@velocitymotors.com',
    phone: '+1 (555) 234-5678',
    city: 'San Francisco, CA',
    address: '1420 Market St, Suite 400',
    memberSince: 'March 2022',
    tier: 'VIP Platinum',
    tierBadgeClass: 'badge-tier-vip',
    status: 'In-Bay',
    statusBadgeClass: 'status-inbay',
    lifetimeSpend: 8450.0,
    totalVisits: 8,
    lastVisit: 'Oct 14, 2024 • Track Alignment & Camber',
    notes: 'Laguna Seca track day driver. Always requests Motul 300V 5W-40 and Castrol SRF high-temp brake fluid.',
    vehicles: [
      {
        id: 'VEH-01',
        make: 'BMW',
        model: 'M3 Competition (G80)',
        year: 2023,
        plate: 'CA 8XYZ901',
        vin: 'WBA33AY08PFS18920',
        mileage: '14,200 mi',
        color: 'Isle of Man Green',
        inBay: true,
        lastService: 'Track Alignment & Camber',
      },
      {
        id: 'VEH-02',
        make: 'BMW',
        model: 'M4 CS (F82)',
        year: 2020,
        plate: 'CA 7M4CS01',
        vin: 'WBA33AY07PFS99124',
        mileage: '28,400 mi',
        color: 'San Marino Blue',
        inBay: false,
        lastService: 'Brake Rotor Lathe & Caliper Seal',
      },
    ],
    serviceHistory: [
      {
        ref: '#APX-84920',
        vehicle: '2023 BMW M3 Competition',
        service: 'Track Alignment & Dynamic Corner Balancing',
        date: 'Oct 14, 2024',
        tech: 'Dave Miller',
        bay: 'Bay 3 (Hunter Elite Alignment)',
        cost: 450.0,
        status: 'In-Bay',
      },
      {
        ref: '#APX-81204',
        vehicle: '2023 BMW M3 Competition',
        service: 'Custom ECU Dyno Calibration & Boost Curve',
        date: 'Jul 22, 2024',
        tech: 'Sam Rivera',
        bay: 'Bay 6 (Dyno Cell)',
        cost: 1200.0,
        status: 'Completed',
      },
      {
        ref: '#APX-76491',
        vehicle: '2020 BMW M4 CS',
        service: 'Major Inspection & Synthetic Oil Service',
        date: 'Feb 10, 2024',
        tech: 'Alex Wong',
        bay: 'Bay 1 (Quick Service)',
        cost: 380.0,
        status: 'Completed',
      },
    ],
  },
  {
    id: 'CUST-1002',
    firstName: 'Elena',
    lastName: 'Rostova',
    initials: 'ER',
    avatarBg: 'avatar-purple',
    email: 'elena.rostova@apexcapital.io',
    phone: '+1 (555) 891-2345',
    city: 'Palo Alto, CA',
    address: '840 University Ave',
    memberSince: 'January 2021',
    tier: 'VIP Platinum',
    tierBadgeClass: 'badge-tier-vip',
    status: 'In-Bay',
    statusBadgeClass: 'status-inbay',
    lifetimeSpend: 14890.0,
    totalVisits: 12,
    lastVisit: 'Oct 14, 2024 • Corner Weighting & Suspension',
    notes: 'Member of Porsche Club of America Golden Gate Region. High sensitivity to paint protection and ceramic coatings.',
    vehicles: [
      {
        id: 'VEH-03',
        make: 'Porsche',
        model: '911 GT3 RS (992)',
        year: 2021,
        plate: 'CA 9TRK911',
        vin: 'WP0AF2A97MS29104',
        mileage: '6,800 mi',
        color: 'Shark Blue',
        inBay: true,
        lastService: 'Corner Weighting & Aero Downforce Setup',
      },
      {
        id: 'VEH-04',
        make: 'Porsche',
        model: 'Taycan Turbo S',
        year: 2024,
        plate: 'CA 4EV911',
        vin: 'WP0AB2Y14PSA19024',
        mileage: '4,200 mi',
        color: 'Frozen Blue Metallic',
        inBay: false,
        lastService: 'BMS High-Voltage Insulation Test',
      },
    ],
    serviceHistory: [
      {
        ref: '#APX-85104',
        vehicle: '2021 Porsche 911 GT3 RS',
        service: 'Corner Weighting & Suspension Aero Setup',
        date: 'Oct 14, 2024',
        tech: 'Elena Rostova & Dave M.',
        bay: 'Bay 4 (Precision Suspension)',
        cost: 620.0,
        status: 'In-Bay',
      },
      {
        ref: '#APX-82910',
        vehicle: '2021 Porsche 911 GT3 RS',
        service: 'Track Brake Pad Bedding & Carbon Ceramic Check',
        date: 'Aug 04, 2024',
        tech: 'Alex Wong',
        bay: 'Bay 2',
        cost: 950.0,
        status: 'Completed',
      },
      {
        ref: '#APX-79012',
        vehicle: '2024 Porsche Taycan Turbo S',
        service: 'BMS Battery Diagnostic & 800V Coolant Flush',
        date: 'Apr 18, 2024',
        tech: 'Sam Rivera',
        bay: 'Bay 5 (EV High-Voltage)',
        cost: 840.0,
        status: 'Completed',
      },
    ],
  },
  {
    id: 'CUST-1003',
    firstName: 'David',
    lastName: 'Chen',
    initials: 'DC',
    avatarBg: 'avatar-teal',
    email: 'd.chen@bayarealogistics.com',
    phone: '+1 (555) 432-8765',
    city: 'Oakland, CA',
    address: '2200 Maritime St, Dock 7',
    memberSince: 'September 2022',
    tier: 'Corporate Fleet',
    tierBadgeClass: 'badge-tier-fleet',
    status: 'Active',
    statusBadgeClass: 'status-active',
    lifetimeSpend: 18320.0,
    totalVisits: 24,
    lastVisit: 'Oct 11, 2024 • Fleet PM Inspection (3 Vans)',
    notes: 'Fleet manager for Bay Area Express Delivery. Requires monthly billing statements and priority same-day turnaround.',
    vehicles: [
      {
        id: 'VEH-05',
        make: 'Ford',
        model: 'Transit 250 High Roof',
        year: 2022,
        plate: 'CA 4FLT881',
        vin: '1FTBR1Y88NKA10492',
        mileage: '78,400 mi',
        color: 'Oxford White',
        inBay: false,
        lastService: 'Brake Rotors & Heavy Duty Pads',
      },
      {
        id: 'VEH-06',
        make: 'Ram',
        model: 'ProMaster 3500 Cargo',
        year: 2023,
        plate: 'CA 5FLT912',
        vin: '3C6URVF27PE591823',
        mileage: '54,100 mi',
        color: 'Bright White',
        inBay: false,
        lastService: 'Transmission Fluid Flush & Filter',
      },
      {
        id: 'VEH-07',
        make: 'Mercedes-Benz',
        model: 'Sprinter 2500 Turbo Diesel',
        year: 2021,
        plate: 'CA 3FLT104',
        vin: 'W1X70ED39MP019234',
        mileage: '92,300 mi',
        color: 'Arctic White',
        inBay: false,
        lastService: 'DEF Injector Service & DPF Regeneration',
      },
    ],
    serviceHistory: [
      {
        ref: '#APX-84190',
        vehicle: '2022 Ford Transit 250',
        service: 'Commercial Fleet Brake & Tire Package',
        date: 'Oct 11, 2024',
        tech: 'Dave Miller',
        bay: 'Bay 3',
        cost: 890.0,
        status: 'Completed',
      },
      {
        ref: '#APX-83100',
        vehicle: '2023 Ram ProMaster',
        service: 'Transmission Fluid & Drive Belt Replacement',
        date: 'Sep 19, 2024',
        tech: 'Alex Wong',
        bay: 'Bay 1',
        cost: 650.0,
        status: 'Completed',
      },
    ],
  },
  {
    id: 'CUST-1004',
    firstName: 'Sophia',
    lastName: 'Martinez',
    initials: 'SM',
    avatarBg: 'avatar-amber',
    email: 'sophia.martinez@lumina-tech.com',
    phone: '+1 (555) 765-4321',
    city: 'San Jose, CA',
    address: '410 Santana Row, Apt 502',
    memberSince: 'June 2023',
    tier: 'Gold Member',
    tierBadgeClass: 'badge-tier-gold',
    status: 'Active',
    statusBadgeClass: 'status-active',
    lifetimeSpend: 5120.0,
    totalVisits: 6,
    lastVisit: 'Oct 09, 2024 • Major 30k Factory Service',
    notes: 'Audi quattro club member. Prefers text message notifications for completion milestones.',
    vehicles: [
      {
        id: 'VEH-08',
        make: 'Audi',
        model: 'RS6 Avant Quattro',
        year: 2020,
        plate: 'CA 6QTR042',
        vin: 'WAUZZZF27LN019248',
        mileage: '32,100 mi',
        color: 'Nardo Gray',
        inBay: false,
        lastService: 'Major 30k Factory Service',
      },
    ],
    serviceHistory: [
      {
        ref: '#APX-79102',
        vehicle: '2020 Audi RS6 Avant',
        service: 'Major Factory 30,000 Mile Service Package',
        date: 'Oct 09, 2024',
        tech: 'Dave Miller',
        bay: 'Bay 2',
        cost: 920.0,
        status: 'Completed',
      },
      {
        ref: '#APX-75199',
        vehicle: '2020 Audi RS6 Avant',
        service: '4-Wheel High Speed Dynamic Balance',
        date: 'May 14, 2024',
        tech: 'Alex Wong',
        bay: 'Bay 4',
        cost: 180.0,
        status: 'Completed',
      },
    ],
  },
  {
    id: 'CUST-1005',
    firstName: 'Rachel',
    lastName: 'Adams',
    initials: 'RA',
    avatarBg: 'avatar-pink',
    email: 'rachel.adams@adamslaw.com',
    phone: '+1 (555) 345-6789',
    city: 'San Francisco, CA',
    address: '555 California St, 32nd Fl',
    memberSince: 'August 2022',
    tier: 'Gold Member',
    tierBadgeClass: 'badge-tier-gold',
    status: 'Active',
    statusBadgeClass: 'status-active',
    lifetimeSpend: 11200.0,
    totalVisits: 9,
    lastVisit: 'Oct 02, 2024 • Ceramic Brake Inspection',
    notes: 'Exclusively services AMG models. Requires enclosed trailer pickup if service extends beyond 2 days.',
    vehicles: [
      {
        id: 'VEH-09',
        make: 'Mercedes-AMG',
        model: 'GT R Coupe',
        year: 2022,
        plate: 'CA 5AMG019',
        vin: 'WDDYJ7JA8NA018249',
        mileage: '11,400 mi',
        color: 'Green Hell Magno',
        inBay: false,
        lastService: 'Ceramic Brake Inspection & Carbon Pads',
      },
      {
        id: 'VEH-10',
        make: 'Mercedes-AMG',
        model: 'G63 4x4²',
        year: 2021,
        plate: 'CA 9G63TRK',
        vin: 'WDCYC7JH1MA091823',
        mileage: '24,800 mi',
        color: 'Obsidian Black',
        inBay: false,
        lastService: 'Portal Axle Gearbox Fluid Flush',
      },
    ],
    serviceHistory: [
      {
        ref: '#APX-83901',
        vehicle: '2022 Mercedes-AMG GT R',
        service: 'Carbon Ceramic Brake Inspection & Flush',
        date: 'Oct 02, 2024',
        tech: 'Dave Miller',
        bay: 'Bay 3',
        cost: 780.0,
        status: 'Completed',
      },
      {
        ref: '#APX-81014',
        vehicle: '2021 Mercedes-AMG G63',
        service: 'Portal Axle Gearbox Fluid & Alignment',
        date: 'Jun 19, 2024',
        tech: 'Alex Wong',
        bay: 'Bay 2',
        cost: 1150.0,
        status: 'Completed',
      },
    ],
  },
  {
    id: 'CUST-1006',
    firstName: 'Marcus',
    lastName: 'Holloway',
    initials: 'MH',
    avatarBg: 'avatar-indigo',
    email: 'm.holloway@nexus-ai.org',
    phone: '+1 (555) 678-9012',
    city: 'Fremont, CA',
    address: '3900 Tesla Rd',
    memberSince: 'February 2024',
    tier: 'Standard',
    tierBadgeClass: 'badge-tier-standard',
    status: 'Active',
    statusBadgeClass: 'status-active',
    lifetimeSpend: 1890.0,
    totalVisits: 3,
    lastVisit: 'Sep 28, 2024 • EV Suspension Bushings Check',
    notes: 'Interested in track coilovers and upgraded performance brake fluid for autocross weekends.',
    vehicles: [
      {
        id: 'VEH-11',
        make: 'Tesla',
        model: 'Model 3 Performance',
        year: 2019,
        plate: 'CA 7TES912',
        vin: '5YJ3E1EB2KF192834',
        mileage: '49,200 mi',
        color: 'Solid Black',
        inBay: false,
        lastService: 'EV Suspension Bushings & Alignment',
      },
    ],
    serviceHistory: [
      {
        ref: '#APX-83112',
        vehicle: '2019 Tesla Model 3 Performance',
        service: 'EV Suspension Bushings & Laser Alignment',
        date: 'Sep 28, 2024',
        tech: 'Sam Rivera',
        bay: 'Bay 5',
        cost: 480.0,
        status: 'Completed',
      },
    ],
  },
  {
    id: 'CUST-1007',
    firstName: 'James',
    lastName: 'Wilson',
    initials: 'JW',
    avatarBg: 'avatar-slate',
    email: 'j.wilson@norcal-engines.net',
    phone: '+1 (555) 543-2109',
    city: 'Hayward, CA',
    address: '182 Industrial Blvd',
    memberSince: 'May 2023',
    tier: 'Standard',
    tierBadgeClass: 'badge-tier-standard',
    status: 'Active',
    statusBadgeClass: 'status-active',
    lifetimeSpend: 2640.0,
    totalVisits: 4,
    lastVisit: 'Sep 15, 2024 • Tremec 6-Speed Fluid & Diff',
    notes: 'Self-proclaimed classic and modern muscle enthusiast. Uses car for weekend canyon runs.',
    vehicles: [
      {
        id: 'VEH-12',
        make: 'Ford',
        model: 'Mustang Mach 1 (Handling Pack)',
        year: 2021,
        plate: 'CA 3MCH091',
        vin: '1FA6P8R07M5102934',
        mileage: '22,100 mi',
        color: 'Fighter Jet Gray',
        inBay: false,
        lastService: 'Tremec 6-Speed Manual Fluid & Torsen Diff',
      },
    ],
    serviceHistory: [
      {
        ref: '#APX-82405',
        vehicle: '2021 Ford Mustang Mach 1',
        service: 'Tremec 6-Speed Fluid & Torsen Diff Flush',
        date: 'Sep 15, 2024',
        tech: 'Dave Miller',
        bay: 'Bay 1',
        cost: 390.0,
        status: 'Completed',
      },
    ],
  },
  {
    id: 'CUST-1008',
    firstName: 'Claire',
    lastName: 'Dupont',
    initials: 'CD',
    avatarBg: 'avatar-emerald',
    email: 'c.dupont@dupont-luxury.fr',
    phone: '+1 (555) 908-1122',
    city: 'Atherton, CA',
    address: '92 Isabella Ave',
    memberSince: 'October 2022',
    tier: 'VIP Platinum',
    tierBadgeClass: 'badge-tier-vip',
    status: 'Active',
    statusBadgeClass: 'status-active',
    lifetimeSpend: 16500.0,
    totalVisits: 5,
    lastVisit: 'Aug 29, 2024 • Hybrid V6 Turbo Diagnostics',
    notes: 'Exotic supercar collector. Requests Marcus Vance (Master Tech) personally oversee all vehicle maintenance.',
    vehicles: [
      {
        id: 'VEH-13',
        make: 'Ferrari',
        model: '296 GTB Hybrid',
        year: 2023,
        plate: 'CA 2EXO811',
        vin: 'ZFF98RHA7P0291048',
        mileage: '3,800 mi',
        color: 'Rosso Corsa',
        inBay: false,
        lastService: 'Hybrid V6 Twin-Turbo Diagnostics & Software',
      },
    ],
    serviceHistory: [
      {
        ref: '#APX-81990',
        vehicle: '2023 Ferrari 296 GTB',
        service: 'Annual Certified Inspection & Hybrid Firmware',
        date: 'Aug 29, 2024',
        tech: 'Marcus Vance',
        bay: 'Bay 6',
        cost: 2400.0,
        status: 'Completed',
      },
    ],
  },
];

const AdminCustomersPage = ({
  onNavigateDashboard,
  onNavigateBookings,
  onNavigateServices,
  onNavigateStaff,
  onNavigateSettings,
  onNavigateProfile,
  onNavigateHome,
}) => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Feedback
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailTab, setDetailTab] = useState('garage'); // 'garage' | 'history' | 'notes'
  const [activeModal, setActiveModal] = useState(null); // 'add_customer' | 'edit_customer' | 'add_vehicle' | 'delete_confirm'
  const [toastMsg, setToastMsg] = useState(null);

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'San Francisco, CA',
    address: '',
    tier: 'Standard',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: 2023,
    vehiclePlate: '',
    vehicleVin: '',
    notes: '',
  });

  // New Vehicle in Garage Form State
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: 2024,
    plate: '',
    vin: '',
    mileage: '5,000 mi',
    color: 'Metallic Silver',
  });

  // Fetch live customers from Backend on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCustomers = async () => {
      try {
        const res = await adminCustomerAPI.getCustomers({ limit: 100 });
        if (isMounted && res.success && res.customers && res.customers.length > 0) {
          setCustomers(res.customers);
        }
      } catch (err) {
        console.warn('[AdminCustomersPage] Backend sync fallback to initial dataset:', err.message);
      }
    };
    fetchCustomers();
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filter & Search Logic
  const filteredCustomers = customers
    .filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (c.firstName && c.firstName.toLowerCase().includes(q)) ||
        (c.lastName && c.lastName.toLowerCase().includes(q)) ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.vehicles &&
          c.vehicles.some(
            (v) =>
              (v.make && v.make.toLowerCase().includes(q)) ||
              (v.model && v.model.toLowerCase().includes(q)) ||
              (v.plate && v.plate.toLowerCase().includes(q))
          ));

      const matchesTier =
        tierFilter === 'All' || (c.tier && c.tier.toLowerCase() === tierFilter.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'In-Bay' && c.status === 'In-Bay') ||
        (statusFilter === 'Active' && c.status === 'Active') ||
        (statusFilter === 'Inactive' && c.status === 'Inactive');

      return matchesSearch && matchesTier && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'spend') return (b.lifetimeSpend || 0) - (a.lifetimeSpend || 0);
      if (sortBy === 'vehicles') return (b.vehicles?.length || 0) - (a.vehicles?.length || 0);
      if (sortBy === 'name') return (a.lastName || a.name || '').localeCompare(b.lastName || b.name || '');
      return (b.totalVisits || 0) - (a.totalVisits || 0); // default recent/visits
    });

  // Pagination calculation
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Metric counts
  const totalRegisteredVehicles = customers.reduce(
    (sum, c) => sum + (c.vehicles ? c.vehicles.length : 0),
    0
  );
  const vipCount = customers.filter(
    (c) => c.tier === 'VIP Platinum' || c.tier === 'Corporate Fleet'
  ).length;

  // Handlers
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.firstName || !newCustomer.email) {
      showToast('Please provide customer name and email.');
      return;
    }

    try {
      const res = await adminCustomerAPI.createCustomer({
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        name: `${newCustomer.firstName} ${newCustomer.lastName || ''}`.trim(),
        email: newCustomer.email,
        phone: newCustomer.phone,
        city: newCustomer.city,
        address: newCustomer.address,
        tier: newCustomer.tier,
        vehicleMake: newCustomer.vehicleMake,
        vehicleModel: newCustomer.vehicleModel,
        vehicleYear: newCustomer.vehicleYear,
        vehiclePlate: newCustomer.vehiclePlate,
        vehicleVin: newCustomer.vehicleVin,
        notes: newCustomer.notes,
      });

      if (res.success && res.customer) {
        setCustomers([res.customer, ...customers]);
        showToast(`Customer ${res.customer.name} registered successfully!`);
      } else {
        throw new Error(res.message || 'Customer creation failed');
      }
    } catch (err) {
      console.warn('Backend create customer fallback:', err.message);
      const createdId = `CUST-${1000 + customers.length + 1}`;
      const initials = `${newCustomer.firstName[0]}${newCustomer.lastName ? newCustomer.lastName[0] : ''}`.toUpperCase();

      const createdCustomer = {
        id: createdId,
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName || '',
        name: `${newCustomer.firstName} ${newCustomer.lastName || ''}`.trim(),
        initials,
        avatarBg: 'avatar-blue',
        email: newCustomer.email,
        phone: newCustomer.phone || '+1 (555) 000-0000',
        city: newCustomer.city || 'Bay Area, CA',
        address: newCustomer.address || 'Confidential Residence',
        memberSince: 'October 2024',
        tier: newCustomer.tier,
        tierBadgeClass:
          newCustomer.tier === 'VIP Platinum'
            ? 'badge-tier-vip'
            : newCustomer.tier === 'Corporate Fleet'
            ? 'badge-tier-fleet'
            : newCustomer.tier === 'Gold Member'
            ? 'badge-tier-gold'
            : 'badge-tier-standard',
        status: 'Active',
        statusBadgeClass: 'status-active',
        lifetimeSpend: 0.0,
        totalVisits: 0,
        lastVisit: 'New Account • No Services Yet',
        notes: newCustomer.notes || 'Newly registered vehicle owner.',
        vehicles: newCustomer.vehicleMake
          ? [
              {
                id: `VEH-${Date.now().toString().slice(-4)}`,
                make: newCustomer.vehicleMake,
                model: newCustomer.vehicleModel || 'Standard',
                year: Number(newCustomer.vehicleYear) || 2023,
                plate: newCustomer.vehiclePlate || 'TEMP-REG',
                vin: newCustomer.vehicleVin || 'PENDING-VERIFICATION',
                mileage: '0 mi',
                color: 'Standard',
                inBay: false,
                lastService: 'Intake Inspection Pending',
              },
            ]
          : [],
        serviceHistory: [],
      };

      setCustomers([createdCustomer, ...customers]);
      showToast(`Customer ${createdCustomer.firstName} registered successfully!`);
    }

    setActiveModal(null);
    setNewCustomer({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: 'San Francisco, CA',
      address: '',
      tier: 'Standard',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: 2023,
      vehiclePlate: '',
      vehicleVin: '',
      notes: '',
    });
  };

  const handleAddVehicleToCustomer = async (e) => {
    e.preventDefault();
    if (!newVehicle.make || !newVehicle.model) {
      showToast('Please specify vehicle make and model.');
      return;
    }

    try {
      const res = await adminCustomerAPI.addCustomerVehicle(selectedCustomer.id, newVehicle);
      if (res.success && res.vehicle) {
        const addedVeh = {
          id: res.vehicle.id,
          make: res.vehicle.make,
          model: res.vehicle.model,
          year: res.vehicle.year,
          plate: res.vehicle.plate,
          vin: res.vehicle.vin,
          mileage: res.vehicle.mileage,
          color: res.vehicle.color,
          inBay: Boolean(res.vehicle.inBay),
          lastService: res.vehicle.lastService || 'Recently Added to Garage',
        };

        const updated = customers.map((c) => {
          if (c.id === selectedCustomer.id) {
            return { ...c, vehicles: [...(c.vehicles || []), addedVeh] };
          }
          return c;
        });

        setCustomers(updated);
        setSelectedCustomer({
          ...selectedCustomer,
          vehicles: [...(selectedCustomer.vehicles || []), addedVeh],
        });
        showToast(`Vehicle ${addedVeh.year} ${addedVeh.make} ${addedVeh.model} added to garage!`);
      } else {
        throw new Error(res.message || 'Add vehicle failed');
      }
    } catch (err) {
      console.warn('Backend add vehicle fallback:', err.message);
      const createdVeh = {
        id: `VEH-${Date.now().toString().slice(-4)}`,
        make: newVehicle.make,
        model: newVehicle.model,
        year: Number(newVehicle.year) || 2024,
        plate: newVehicle.plate || 'CA-PENDING',
        vin: newVehicle.vin || 'VIN-ON-FILE',
        mileage: newVehicle.mileage,
        color: newVehicle.color,
        inBay: false,
        lastService: 'Recently Added to Garage',
      };

      const updated = customers.map((c) => {
        if (c.id === selectedCustomer.id) {
          const updatedVehicles = [...(c.vehicles || []), createdVeh];
          return { ...c, vehicles: updatedVehicles };
        }
        return c;
      });

      setCustomers(updated);
      setSelectedCustomer({
        ...selectedCustomer,
        vehicles: [...(selectedCustomer.vehicles || []), createdVeh],
      });
      showToast(`Vehicle ${createdVeh.year} ${createdVeh.make} ${createdVeh.model} added to garage!`);
    }
    setActiveModal(null);
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await adminCustomerAPI.deleteCustomer(id);
    } catch (err) {
      console.warn('Backend delete customer fallback:', err.message);
    }
    setCustomers(customers.filter((c) => c.id !== id));
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer(null);
    }
    setActiveModal(null);
    showToast('Customer profile archived.');
  };

  return (
    <div className="admin-portal-root">
      {/* Toast Alert Notification */}
      {toastMsg && (
        <div className="admin-toast-banner">
          <CheckCircle2 size={18} className="toast-icon text-green" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================
          LEFT SIDEBAR (Admin Console Navigation)
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
              className="admin-nav-item active"
            >
              <UserCheck size={18} />
              <span>Customers</span>
              <span className="badge-counter-pill count-blue">{customers.length}</span>
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

        {/* Sidebar Footer with Profile Link */}
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
        {/* Top Header App Bar */}
        <header className="admin-topbar">
          <div className="topbar-breadcrumb">
            <span className="crumb-gray">Admin</span>
            <span className="crumb-separator">/</span>
            <span className="crumb-dark">Customers &amp; Garages</span>
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
              onClick={() => showToast('All customer garage feeds are updated.')}
              className="topbar-icon-btn"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="notification-indicator-dot"></span>
            </button>

            <div
              className="topbar-avatar-btn"
              onClick={onNavigateProfile}
              title="Open Administrator Profile"
            >
              <span>MV</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="admin-content-area">
          {/* Header Row */}
          <div className="manage-bookings-header-row">
            <div className="header-left-title-block">
              <div className="eyebrows-badge-row">
                <span className="badge-logistics-pill">CLIENT RELATIONSHIP MANAGEMENT</span>
                <span className="live-bay-feed-indicator">
                  <span className="pulse-green-dot"></span>
                  <span>GARAGE TELEMETRY ACTIVE</span>
                </span>
              </div>

              <h1 className="manage-bookings-title">Customer Directory</h1>
              <p className="manage-bookings-subtitle">
                Manage registered vehicle owners, corporate fleet accounts, vehicle garages, and service histories.
              </p>
            </div>

            <div className="header-right-action-cluster">
              <button
                type="button"
                onClick={() => showToast('Exporting customer database & vehicle list (CSV)...')}
                className="btn-export-csv"
              >
                <Download size={15} />
                <span>Export Directory</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('add_customer')}
                className="btn-create-booking-blue"
              >
                <Plus size={16} />
                <span>New Customer</span>
              </button>
            </div>
          </div>

          {/* 4 Metric / KPI Counter Cards */}
          <div className="admin-stats-grid mb-4">
            {/* Card 1: TOTAL CUSTOMERS */}
            <div className="admin-stat-metric-card">
              <div className="stat-card-header">
                <span className="stat-card-eyebrow">TOTAL CUSTOMERS</span>
                <div className="stat-card-icon-box bg-light-blue">
                  <Users size={18} className="text-blue" />
                </div>
              </div>
              <div className="stat-card-number">1,842</div>
              <div className="stat-card-footer-pill-line">
                <span className="stat-pill-highlight green">↗ +12%</span>
                <span className="stat-pill-label">vs previous month</span>
              </div>
            </div>

            {/* Card 2: REGISTERED FLEET & GARAGE */}
            <div className="admin-stat-metric-card">
              <div className="stat-card-header">
                <span className="stat-card-eyebrow">ACTIVE FLEET GARAGE</span>
                <div className="stat-card-icon-box bg-light-purple">
                  <Car size={18} className="text-purple" />
                </div>
              </div>
              <div className="stat-card-number">{totalRegisteredVehicles + 2390}</div>
              <div className="stat-card-footer-pill-line">
                <span className="stat-pill-highlight purple">1.3 Cars / Owner</span>
                <span className="stat-pill-label">fleet average</span>
              </div>
            </div>

            {/* Card 3: VIP & FLEET ACCOUNTS */}
            <div className="admin-stat-metric-card">
              <div className="stat-card-header">
                <span className="stat-card-eyebrow">VIP &amp; FLEET ACCOUNTS</span>
                <div className="stat-card-icon-box bg-light-amber">
                  <Award size={18} className="text-amber" />
                </div>
              </div>
              <div className="stat-card-number">186</div>
              <div className="stat-card-footer-pill-line">
                <span className="stat-pill-highlight green">Top 10% Spenders</span>
                <span className="stat-pill-label">concierge tiers</span>
              </div>
            </div>

            {/* Card 4: SERVICE RETENTION */}
            <div className="admin-stat-metric-card">
              <div className="stat-card-header">
                <span className="stat-card-eyebrow">REPEAT RETENTION</span>
                <div className="stat-card-icon-box bg-light-green">
                  <ShieldCheck size={18} className="text-green" />
                </div>
              </div>
              <div className="stat-card-number">88.4%</div>
              <div className="stat-card-footer-pill-line">
                <span className="stat-pill-highlight green">↗ +3.2%</span>
                <span className="stat-pill-label">loyalty benchmark</span>
              </div>
            </div>
          </div>

          {/* Search, Filter & View Mode Toolbar */}
          <div className="bookings-filter-bar-card mb-4">
            <div className="filter-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by customer name, email, phone, car model, plate..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Dropdown 1: Tier Filter */}
            <div className="filter-dropdown-box">
              <select
                value={tierFilter}
                onChange={(e) => {
                  setTierFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                <option value="All">Tier: All Tiers</option>
                <option value="VIP Platinum">Tier: VIP Platinum</option>
                <option value="Corporate Fleet">Tier: Corporate Fleet</option>
                <option value="Gold Member">Tier: Gold Member</option>
                <option value="Standard">Tier: Standard</option>
              </select>
              <ChevronDown size={14} className="dropdown-caret" />
            </div>

            {/* Dropdown 2: Status Filter */}
            <div className="filter-dropdown-box">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                <option value="All">Status: All Statuses</option>
                <option value="In-Bay">In-Bay Active</option>
                <option value="Active">Active Account</option>
                <option value="Inactive">Inactive</option>
              </select>
              <Filter size={14} className="dropdown-caret" />
            </div>

            {/* Dropdown 3: Sort By */}
            <div className="filter-dropdown-box">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="recent">Sort: Most Visits</option>
                <option value="spend">Sort: Highest Spend</option>
                <option value="vehicles">Sort: Most Vehicles</option>
                <option value="name">Sort: Name (A-Z)</option>
              </select>
              <ArrowUpDown size={14} className="dropdown-caret" />
            </div>

            {/* View Switcher: Table vs Cards */}
            <div className="view-toggle-cluster">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`btn-view-toggle ${viewMode === 'table' ? 'active' : ''}`}
                title="Table View"
              >
                <Layers size={15} />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`btn-view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
                title="Garage Cards View"
              >
                <Car size={15} />
                <span>Cards</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Tag Strip */}
          <div className="customer-quick-chips-row mb-4">
            <span className="chip-label">Quick Filter:</span>
            {['All', 'VIP Platinum', 'Corporate Fleet', 'Gold Member', 'Standard'].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => {
                  setTierFilter(tier);
                  setCurrentPage(1);
                }}
                className={`customer-chip-pill ${tierFilter === tier ? 'active' : ''}`}
              >
                {tier}
              </button>
            ))}
            <span className="customer-results-counter">
              Showing <strong>{filteredCustomers.length}</strong> registered accounts
            </span>
          </div>

          {/* ========================================================
              VIEW MODE 1: DATA TABLE VIEW
              ======================================================== */}
          {viewMode === 'table' && (
            <div className="bookings-table-container mb-4">
              <table className="bookings-table">
                <thead className="bookings-thead">
                  <tr>
                    <th>CUSTOMER</th>
                    <th>CONTACT &amp; LOCATION</th>
                    <th>GARAGE / FLEET</th>
                    <th>TIER &amp; STATUS</th>
                    <th>TOTAL VISITS</th>
                    <th>LIFETIME SPEND</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="bookings-tbody">
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem' }}>
                        <div className="empty-state-wrap">
                          <Users size={40} className="text-muted mb-2" />
                          <h4 style={{ color: '#0f172a', fontWeight: 700, margin: '0 0 0.5rem' }}>
                            No customers match your search criteria
                          </h4>
                          <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0 0 1rem' }}>
                            Try adjusting your filters or search terms.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setTierFilter('All');
                              setStatusFilter('All');
                            }}
                            className="btn-settings-discard"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((cust) => (
                      <tr key={cust.id} className="table-row-hoverable">
                        {/* 1. Customer Column */}
                        <td>
                          <div
                            className="customer-identity-cell"
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setDetailTab('garage');
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className={`customer-avatar-badge ${cust.avatarBg}`}>
                              <span>{cust.initials}</span>
                            </div>
                            <div className="customer-id-col">
                              <span className="customer-name-link">
                                {cust.firstName} {cust.lastName}
                              </span>
                              <span className="customer-sub-id">{cust.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Contact Column */}
                        <td>
                          <div className="customer-contact-cell">
                            <div className="contact-line">
                              <Mail size={13} className="text-muted mr-1" />
                              <span className="contact-text">{cust.email}</span>
                            </div>
                            <div className="contact-line">
                              <Phone size={13} className="text-muted mr-1" />
                              <span className="contact-text">{cust.phone}</span>
                            </div>
                            <div className="contact-line text-xs text-muted">
                              <MapPin size={12} className="mr-1" />
                              <span>{cust.city}</span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Garage / Fleet Column */}
                        <td>
                          <div className="customer-garage-cell">
                            <div className="garage-count-pill">
                              <Car size={13} className="mr-1" />
                              <span>
                                {cust.vehicles.length}{' '}
                                {cust.vehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
                              </span>
                            </div>
                            <div className="vehicles-summary-list">
                              {cust.vehicles.map((v) => (
                                <span key={v.id} className="veh-mini-tag">
                                  {v.year} {v.make} {v.model.split(' ')[0]}
                                  {v.inBay && (
                                    <span className="dot-green-pulse-inline" title="In-Bay Today"></span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* 4. Tier & Status Column */}
                        <td>
                          <div className="customer-tier-cell">
                            <span className={`tier-badge-pill ${cust.tierBadgeClass}`}>
                              {cust.tier}
                            </span>
                            <span className={`status-pill-small ${cust.statusBadgeClass}`}>
                              {cust.status === 'In-Bay' && (
                                <span className="dot-green-small mr-1"></span>
                              )}
                              {cust.status}
                            </span>
                          </div>
                        </td>

                        {/* 5. Visits Column */}
                        <td>
                          <div className="customer-visits-cell">
                            <span className="visits-number">{cust.totalVisits} Visits</span>
                            <span className="visits-last-meta">{cust.lastVisit}</span>
                          </div>
                        </td>

                        {/* 6. Lifetime Spend Column */}
                        <td>
                          <div className="customer-spend-cell">
                            <span className="spend-number">
                              LKR {cust.lifetimeSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="spend-label">Lifetime Value</span>
                          </div>
                        </td>

                        {/* 7. Actions Column */}
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-actions-cluster">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCustomer(cust);
                                setDetailTab('garage');
                              }}
                              className="btn-action-icon"
                              title="View Customer Profile & Garage"
                            >
                              <Eye size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCustomer(cust);
                                setActiveModal('add_vehicle');
                              }}
                              className="btn-action-icon text-blue"
                              title="Add Vehicle to Garage"
                            >
                              <Plus size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                handleDeleteCustomer(cust.id);
                              }}
                              className="btn-action-icon text-red"
                              title="Archive Customer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================
              VIEW MODE 2: VISUAL GARAGE CARDS VIEW
              ======================================================== */}
          {viewMode === 'cards' && (
            <div className="customer-cards-grid mb-4">
              {paginatedCustomers.map((cust) => (
                <div key={cust.id} className="customer-profile-card">
                  <div className="customer-card-header">
                    <div className="header-avatar-col">
                      <div className={`customer-avatar-large ${cust.avatarBg}`}>
                        <span>{cust.initials}</span>
                      </div>
                      <div>
                        <h3 className="card-customer-name">
                          {cust.firstName} {cust.lastName}
                        </h3>
                        <div className="card-customer-meta">
                          <span>{cust.id}</span>
                          <span>•</span>
                          <span>Member since {cust.memberSince}</span>
                        </div>
                      </div>
                    </div>

                    <div className="header-badges-col">
                      <span className={`tier-badge-pill ${cust.tierBadgeClass}`}>
                        {cust.tier}
                      </span>
                    </div>
                  </div>

                  <div className="card-contact-strip">
                    <div className="contact-pill-item">
                      <Mail size={13} className="mr-1 text-blue" />
                      <span>{cust.email}</span>
                    </div>
                    <div className="contact-pill-item">
                      <Phone size={13} className="mr-1 text-green" />
                      <span>{cust.phone}</span>
                    </div>
                  </div>

                  {/* Registered Garage Section */}
                  <div className="card-garage-box">
                    <div className="garage-box-title">
                      <span className="font-semibold text-slate-800">
                        Registered Garage ({cust.vehicles.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setActiveModal('add_vehicle');
                        }}
                        className="btn-garage-add-link"
                      >
                        + Add Car
                      </button>
                    </div>

                    <div className="garage-vehicles-stack">
                      {cust.vehicles.map((veh) => (
                        <div key={veh.id} className="card-veh-item">
                          <div className="veh-left">
                            <Car size={16} className="text-blue mr-2" />
                            <div>
                              <div className="veh-title">
                                {veh.year} {veh.make} {veh.model}
                              </div>
                              <div className="veh-sub">
                                Plate: <strong>{veh.plate}</strong> • {veh.mileage}
                              </div>
                            </div>
                          </div>

                          {veh.inBay && (
                            <span className="in-bay-indicator-tag">
                              <span className="pulse-dot"></span> In-Bay
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Metrics & Action */}
                  <div className="card-footer-strip">
                    <div className="footer-metric">
                      <span className="footer-metric-val">
                        LKR {cust.lifetimeSpend.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </span>
                      <span className="footer-metric-lbl">Total Spend</span>
                    </div>

                    <div className="footer-metric">
                      <span className="footer-metric-val">{cust.totalVisits}</span>
                      <span className="footer-metric-lbl">Services</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(cust);
                        setDetailTab('garage');
                      }}
                      className="btn-card-inspect"
                    >
                      <Eye size={14} className="mr-1" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="pagination-footer-row">
            <div className="pagination-info-text">
              Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (
              {filteredCustomers.length} total customers)
            </div>

            <div className="pagination-buttons-group">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="btn-pagination-nav"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="pagination-pages-list">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`btn-page-number ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-pagination-nav"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================
          MODAL 1: CUSTOMER DETAILS & GARAGE DRAWER
          ======================================================== */}
      {selectedCustomer && (
        <div className="admin-modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="admin-modal-card modal-large-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="modal-customer-header-left">
                <div className={`customer-avatar-large ${selectedCustomer.avatarBg}`}>
                  <span>{selectedCustomer.initials}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="modal-title-bold">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </h2>
                    <span className={`tier-badge-pill ${selectedCustomer.tierBadgeClass}`}>
                      {selectedCustomer.tier}
                    </span>
                  </div>
                  <div className="modal-subtitle-row">
                    <span>{selectedCustomer.id}</span>
                    <span>•</span>
                    <span>Member since {selectedCustomer.memberSince}</span>
                    <span>•</span>
                    <span>{selectedCustomer.city}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="modal-nav-tabs-line">
              <button
                type="button"
                onClick={() => setDetailTab('garage')}
                className={`modal-tab-btn ${detailTab === 'garage' ? 'active' : ''}`}
              >
                <Car size={16} className="mr-1 inline-icon" />
                <span>Registered Garage ({selectedCustomer.vehicles.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailTab('history')}
                className={`modal-tab-btn ${detailTab === 'history' ? 'active' : ''}`}
              >
                <Clock size={16} className="mr-1 inline-icon" />
                <span>Service History ({selectedCustomer.serviceHistory.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailTab('notes')}
                className={`modal-tab-btn ${detailTab === 'notes' ? 'active' : ''}`}
              >
                <FileText size={16} className="mr-1 inline-icon" />
                <span>Customer Notes &amp; Preferences</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="modal-body-scrollable">
              {/* TAB 1: GARAGE */}
              {detailTab === 'garage' && (
                <div>
                  <div className="garage-tab-header">
                    <div>
                      <h4 className="tab-subheading">Vehicles in Customer Fleet</h4>
                      <p className="tab-subtext">
                        Active registered vehicles, license plates, VIN registry, and bay statuses.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal('add_vehicle')}
                      className="btn-create-booking-blue"
                    >
                      <Plus size={15} />
                      <span>Add New Vehicle</span>
                    </button>
                  </div>

                  <div className="vehicles-cards-grid">
                    {selectedCustomer.vehicles.map((v) => (
                      <div key={v.id} className="vehicle-detail-card">
                        <div className="veh-card-top">
                          <div className="veh-car-icon-wrap">
                            <Car size={24} className="text-blue" />
                          </div>
                          <div className="veh-identity">
                            <h5 className="veh-card-name">
                              {v.year} {v.make} {v.model}
                            </h5>
                            <span className="veh-color-tag">{v.color}</span>
                          </div>
                          {v.inBay && (
                            <span className="badge-in-bay-live">
                              <span className="pulse-green-dot"></span> In Bay
                            </span>
                          )}
                        </div>

                        <div className="veh-specs-grid">
                          <div className="spec-item">
                            <span className="spec-lbl">LICENSE PLATE</span>
                            <span className="spec-val plate-styled">{v.plate}</span>
                          </div>
                          <div className="spec-item">
                            <span className="spec-lbl">MILEAGE</span>
                            <span className="spec-val">{v.mileage}</span>
                          </div>
                          <div className="spec-item col-span-2">
                            <span className="spec-lbl">VEHICLE IDENTIFICATION NUMBER (VIN)</span>
                            <span className="spec-val font-mono text-xs">{v.vin}</span>
                          </div>
                        </div>

                        <div className="veh-card-footer">
                          <div className="last-service-info">
                            <span className="text-xs text-muted">Latest Service:</span>
                            <div className="text-xs font-semibold text-slate-800">
                              {v.lastService}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              showToast(`Scheduling booking flow for ${v.year} ${v.make} ${v.model}...`)
                            }
                            className="btn-quick-schedule"
                          >
                            <Calendar size={13} className="mr-1" />
                            <span>Book Bay</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SERVICE HISTORY */}
              {detailTab === 'history' && (
                <div>
                  <h4 className="tab-subheading">Past Work Orders &amp; Appointments</h4>
                  <p className="tab-subtext">
                    Historical workshop service records, allocated master technicians, and invoices.
                  </p>

                  <div className="history-timeline-wrap">
                    {selectedCustomer.serviceHistory.length === 0 ? (
                      <div className="empty-history-box">
                        <Clock size={32} className="text-muted mb-2" />
                        <p>No past appointments recorded for this profile yet.</p>
                      </div>
                    ) : (
                      selectedCustomer.serviceHistory.map((item, idx) => (
                        <div key={idx} className="timeline-history-card">
                          <div className="history-ref-line">
                            <span className="history-ref-pill">{item.ref}</span>
                            <span className="history-date-txt">{item.date}</span>
                          </div>

                          <div className="history-service-title">{item.service}</div>
                          <div className="history-meta-strip">
                            <span>Vehicle: <strong>{item.vehicle}</strong></span>
                            <span>•</span>
                            <span>Tech: <strong>{item.tech}</strong></span>
                            <span>•</span>
                            <span>{item.bay}</span>
                          </div>

                          <div className="history-footer-row">
                            <div className="history-cost-tag">
                              Invoice: <strong>LKR {item.cost.toFixed(2)}</strong>
                            </div>

                            <button
                              type="button"
                              onClick={() => showToast(`Generating invoice receipt for ${item.ref}...`)}
                              className="btn-history-receipt"
                            >
                              <FileText size={13} className="mr-1" />
                              <span>Download PDF Invoice</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: NOTES & PREFERENCES */}
              {detailTab === 'notes' && (
                <div>
                  <h4 className="tab-subheading">Workshop Dispatch Notes</h4>
                  <p className="tab-subtext">
                    Driver preferences, technical fluid specifications, and special instructions.
                  </p>

                  <div className="notes-box-card">
                    <p className="notes-content-text">{selectedCustomer.notes}</p>
                  </div>

                  <div className="customer-summary-pills-row mt-4">
                    <div className="summary-pill">
                      <span className="lbl">Total Workshop Spend:</span>
                      <span className="val text-blue">
                        LKR {selectedCustomer.lifetimeSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="summary-pill">
                      <span className="lbl">Lifetime Visits:</span>
                      <span className="val">{selectedCustomer.totalVisits}</span>
                    </div>

                    <div className="summary-pill">
                      <span className="lbl">Account Status:</span>
                      <span className="val text-green">{selectedCustomer.status}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions-right">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="btn-settings-discard"
              >
                Close Drawer
              </button>
              <button
                type="button"
                onClick={() => showToast(`Customer account profile #${selectedCustomer.id} updated.`)}
                className="btn-topbar-primary"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: ADD NEW CUSTOMER MODAL
          ======================================================== */}
      {activeModal === 'add_customer' && (
        <div className="admin-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="admin-modal-card modal-standard-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <h2 className="modal-title-bold">Register New Customer</h2>
                <p className="modal-subtitle-text">
                  Create an automotive customer profile and register their primary vehicle.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="modal-form-fields">
              <div className="form-section-title">1. Customer Personal Information</div>
              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel"
                    value={newCustomer.firstName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Adams"
                    value={newCustomer.lastName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rachel@example.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Direct Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 234-5678"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label>City &amp; State</label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Customer Tier</label>
                  <select
                    value={newCustomer.tier}
                    onChange={(e) => setNewCustomer({ ...newCustomer, tier: e.target.value })}
                    className="admin-form-select"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Gold Member">Gold Member</option>
                    <option value="VIP Platinum">VIP Platinum</option>
                    <option value="Corporate Fleet">Corporate Fleet</option>
                  </select>
                </div>
              </div>

              <div className="form-section-title mt-4">2. Initial Vehicle in Garage</div>
              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label>Vehicle Make</label>
                  <input
                    type="text"
                    placeholder="e.g. BMW, Porsche, Mercedes"
                    value={newCustomer.vehicleMake}
                    onChange={(e) => setNewCustomer({ ...newCustomer, vehicleMake: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Model &amp; Trim</label>
                  <input
                    type="text"
                    placeholder="e.g. M3 Competition"
                    value={newCustomer.vehicleModel}
                    onChange={(e) => setNewCustomer({ ...newCustomer, vehicleModel: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    min="1980"
                    max="2026"
                    value={newCustomer.vehicleYear}
                    onChange={(e) => setNewCustomer({ ...newCustomer, vehicleYear: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label>License Plate</label>
                  <input
                    type="text"
                    placeholder="e.g. CA 8XYZ901"
                    value={newCustomer.vehiclePlate}
                    onChange={(e) => setNewCustomer({ ...newCustomer, vehiclePlate: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="form-group mb-4">
                <label>Technical Preferences or Driver Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Prefers synthetic Motul oil, track inspection, weekend driver..."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  className="admin-form-input"
                  style={{ height: 'auto', padding: '0.65rem 0.85rem' }}
                />
              </div>

              <div className="modal-actions-right">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn-settings-discard"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-topbar-primary">
                  <CheckCircle2 size={16} />
                  <span>Register Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: ADD VEHICLE TO GARAGE MODAL
          ======================================================== */}
      {activeModal === 'add_vehicle' && selectedCustomer && (
        <div className="admin-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="admin-modal-card modal-standard-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <h2 className="modal-title-bold">Add Vehicle to Garage</h2>
                <p className="modal-subtitle-text">
                  Register a vehicle to {selectedCustomer.firstName} {selectedCustomer.lastName}'s fleet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddVehicleToCustomer} className="modal-form-fields">
              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label>Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Porsche, Audi, Ford"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Model &amp; Specification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 911 Carrera S"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    min="1980"
                    max="2026"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label>License Plate *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CA 9TRK911"
                    value={newVehicle.plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="grid-two-cols mb-3">
                <div className="form-group">
                  <label>Current Mileage</label>
                  <input
                    type="text"
                    placeholder="e.g. 18,500 mi"
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Exterior Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Guards Red"
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="form-group mb-4">
                <label>VIN (Vehicle Identification Number)</label>
                <input
                  type="text"
                  placeholder="e.g. WP0AB2Y14PSA19024"
                  value={newVehicle.vin}
                  onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="modal-actions-right">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn-settings-discard"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-topbar-primary">
                  <Plus size={16} />
                  <span>Add to Customer Garage</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;
