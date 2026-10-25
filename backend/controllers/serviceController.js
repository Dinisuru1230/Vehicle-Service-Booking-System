const prisma = require('../config/prisma');

// Default initial catalog data for auto-seeding
const defaultServicesSeed = [
  {
    serviceCode: 'SVC-101',
    title: 'Periodic Maintenance & Synthetic Oil',
    subtitle: 'Synthetic oil change & filter inspection',
    description:
      'Computerized engine scan, full synthetic oil drain, OEM filter replacement, and comprehensive multi-point chassis safety inspection.',
    category: 'Maintenance',
    duration: '45 mins',
    price: 89.0,
    badge: '40-POINT INSPECTION',
    image: '/periodic_maintenance.jpg',
    iconType: 'wrench',
    tags: JSON.stringify(['Castrol Edge Pro', 'Bosch Filters', 'Battery Check']),
    checklist: JSON.stringify([
      'Full synthetic oil drain and fresh Castrol/Motul refill',
      'OEM filter replacement and drain plug washer torque',
      'Engine air filter and micro-cabin HEPA filter inspection',
      'Electronic tire pressure and tread depth sensor audit',
      'Comprehensive 40-point safety and fluid level check',
    ]),
    status: 'Active',
    isPopular: true,
  },
  {
    serviceCode: 'SVC-102',
    title: 'Brake System Repair & Resurfacing',
    subtitle: 'Pad renewal & rotor safety check',
    description:
      'Rotor runout measurement, precision micro-lathe skim, low-dust Brembo/Akebono ceramic compound pad installation, and fluid flush.',
    category: 'Brakes & Chassis',
    duration: '60 mins',
    price: 149.0,
    badge: 'SAFETY CRITICAL',
    image: '/brake_service.jpg',
    iconType: 'disc',
    tags: JSON.stringify(['Brembo / Akebono', 'DOT 4 Synthetic', 'Rotor Gauge']),
    checklist: JSON.stringify([
      'High-precision micrometer rotor thickness check',
      'Rotor skim / micro-lathe resurfacing on dynamic rig',
      'Ceramic low-dust pad installation with guide pin lube',
      'Hydraulic brake line pressure bleed with DOT 4 fluid',
      'Emergency handbrake cable and electronic caliper calibration',
    ]),
    status: 'Active',
    isPopular: true,
  },
  {
    serviceCode: 'SVC-103',
    title: 'Engine Diagnostics & Level-3 ECU Scan',
    subtitle: 'Engine check light & systems scan',
    description:
      'Deep fault code extraction across all CAN-bus networks, live fuel trim & O2 sensor evaluation, spark plug check, and factory firmware ECU calibration.',
    category: 'Engine & ECU',
    duration: '30 mins',
    price: 79.0,
    badge: 'LEVEL-3 TELEMETRY',
    image: '/ecu_tuning.jpg',
    iconType: 'cpu',
    tags: JSON.stringify(['DTC Scan', 'Fuel Trim Maps', 'Live Data Log']),
    checklist: JSON.stringify([
      'Complete CAN-bus diagnostic interrogation (all modules)',
      'Live fuel trim (STFT/LTFT) and wideband O2 sensor log',
      'Oscilloscope ignition secondary waveform analysis',
      'Throttle body adaptation and idle airflow relearn',
      'Diagnostic report generation with factory repair guidance',
    ]),
    status: 'Active',
    isPopular: true,
  },
  {
    serviceCode: 'SVC-104',
    title: 'Climate Control & High-Pressure Flush',
    subtitle: 'Refrigerant recharge & cabin filter',
    description:
      'R134a/R1234yf automated evacuation, leak dye vacuum check, antimicrobial cabin steam treatment, and cabin micro-filter renewal.',
    category: 'Maintenance',
    duration: '40 mins',
    price: 99.0,
    badge: 'CLIMATE PRECISION',
    image: '/periodic_maintenance.jpg',
    iconType: 'fan',
    tags: JSON.stringify(['Refrigerant Purge', 'Core Sanitize', 'HEPA Filter']),
    checklist: JSON.stringify([
      'Automated refrigerant recovery, moisture vacuum & oil injection',
      'High/low pressure line gauge telemetry audit',
      'Evaporator core antimicrobial deep steam sterilization',
      'Cabin activated-charcoal microfilter replacement',
      'Compressor clutch cycle and vent temperature delta test',
    ]),
    status: 'Active',
    isPopular: false,
  },
  {
    serviceCode: 'SVC-105',
    title: 'Laser Alignment & Corner Balancing',
    subtitle: 'Multi-axis rig camber/toe tuning',
    description:
      'Computerized multi-axis laser camber/caster rig, corner scale weight distribution, road-force balance, and track geometry setup.',
    category: 'Brakes & Chassis',
    duration: '75 mins',
    price: 129.0,
    badge: 'CHASSIS DYNAMICS',
    image: '/brake_service.jpg',
    iconType: 'sliders',
    tags: JSON.stringify(['Laser Rig', 'Corner Weight', 'Camber / Toe']),
    checklist: JSON.stringify([
      'Laser sensor wheel target clamp and runout compensation',
      'Camber, caster, and toe geometry adjustment to factory/track specs',
      'Four-corner scale individual corner balancing',
      'Steering angle sensor (SAS) electronic zero calibration',
      'High-speed road force wheel balance evaluation',
    ]),
    status: 'Active',
    isPopular: false,
  },
  {
    serviceCode: 'SVC-106',
    title: '48V Hybrid & Electrical Diagnostics',
    subtitle: 'High-voltage isolation & battery test',
    description:
      'High-voltage isolation testing, DC-DC converter calibration, auxiliary AGM cell health check, and charging circuit load analysis.',
    category: 'Electrical',
    duration: '50 mins',
    price: 119.0,
    badge: 'HIGH VOLTAGE',
    image: '/periodic_maintenance.jpg',
    iconType: 'battery',
    tags: JSON.stringify(['48V Hybrid', 'AGM Cell', 'Isolation Test']),
    checklist: JSON.stringify([
      'CAT-III multimeter high-voltage safety isolation check',
      '48V lithium auxiliary pack internal resistance audit',
      '12V starter AGM battery cold cranking amp (CCA) load test',
      'Alternator/generator ripple voltage and diode test',
      'Electronic parasitic drain and sleep current analysis',
    ]),
    status: 'Active',
    isPopular: false,
  },
  {
    serviceCode: 'SVC-107',
    title: 'Transmission & DCT Fluid Exchange',
    subtitle: 'Dual-clutch pressurized purge & adaptation',
    description:
      'Pressurized dual-clutch transmission purge, pan filter replacement, mechatronic adaptation run, and valve body solenoid audit.',
    category: 'Engine & ECU',
    duration: '90 mins',
    price: 189.0,
    badge: 'POWERTRAIN CARE',
    image: '/ecu_tuning.jpg',
    iconType: 'wrench',
    tags: JSON.stringify(['ZF / PDK Fluid', 'Solenoid Check', 'Adaptation Reset']),
    checklist: JSON.stringify([
      'Temperature-controlled automated fluid drain & flush',
      'Internal transmission filter and magnetic pan pan debris audit',
      'OEM synthetic DCT/ATF specification fluid refill',
      'Mechatronic clutch bite point and shift pressure relearn',
      'Hot road test evaluation with shift telemetry logging',
    ]),
    status: 'Active',
    isPopular: false,
  },
  {
    serviceCode: 'SVC-108',
    title: 'Track-Prep Aerodynamics & Fluids',
    subtitle: 'SRF brake flush, corner balancing & aero torque',
    description:
      'High-boiling Castrol SRF brake fluid flush, splitter angle torque check, track camber plate tune, and cooling duct inspection.',
    category: 'Engine & ECU',
    duration: '120 mins',
    price: 249.0,
    badge: 'MOTORSPORT SPEC',
    image: '/ecu_tuning.jpg',
    iconType: 'sparkles',
    tags: JSON.stringify(['Castrol SRF', 'Aero Downforce', 'Brake Ducts']),
    checklist: JSON.stringify([
      'Castrol SRF extreme-temp brake fluid flush (310°C dry boiling)',
      'Front splitter & rear wing element torque check',
      'Brake cooling duct clearance and high-flow routing inspection',
      'Adjustable sway bar end-link preload adjustment',
      'Track-specific tire pyrometer baseline temperature setup',
    ]),
    status: 'Active',
    isPopular: true,
  },
];

// Helper to auto-seed services if table is empty
const ensureServicesSeeded = async () => {
  try {
    const count = await prisma.service.count();
    if (count === 0) {
      for (const item of defaultServicesSeed) {
        await prisma.service.create({
          data: item,
        });
      }
      console.log(`[Service] Auto-seeded ${defaultServicesSeed.length} catalog services.`);
    }
  } catch (err) {
    console.warn('[Service] Auto-seed skipped:', err.message);
  }
};

// Helper to format service object
const formatService = (s) => {
  let tags = [];
  let checklist = [];

  try {
    tags = s.tags ? JSON.parse(s.tags) : [];
  } catch {
    tags = [];
  }

  try {
    checklist = s.checklist ? JSON.parse(s.checklist) : [];
  } catch {
    checklist = [];
  }

  // Category badge class helper
  let categoryClass = 'badge-cat-blue';
  if (s.category === 'Brakes & Chassis') categoryClass = 'badge-cat-slate';
  else if (s.category === 'Engine & ECU') categoryClass = 'badge-cat-indigo';
  else if (s.category === 'Electrical') categoryClass = 'badge-cat-amber';

  return {
    id: s.id,
    serviceCode: s.serviceCode,
    title: s.title,
    subtitle: s.subtitle || '',
    description: s.description,
    category: s.category,
    categoryClass,
    duration: s.duration,
    price: s.price,
    badge: s.badge || '',
    image: s.image || '/periodic_maintenance.jpg',
    iconType: s.iconType || 'wrench',
    tags,
    checklist,
    status: s.status,
    isPopular: Boolean(s.isPopular),
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
};

/**
 * @desc    List all active services (with optional category, search, and sorting)
 * @route   GET /api/services
 * @access  Public
 */
const getServices = async (req, res) => {
  try {
    await ensureServicesSeeded();

    const { category, search, status, popular, sortBy } = req.query;

    const where = {};

    // Filter by status (default: 'Active')
    if (status && status !== 'all') {
      where.status = status;
    } else if (!status) {
      where.status = 'Active';
    }

    // Filter by category
    if (category && category.toLowerCase() !== 'all' && category.toLowerCase() !== 'all services') {
      where.category = {
        equals: category.trim(),
      };
    }

    // Filter by popular
    if (popular === 'true') {
      where.isPopular = true;
    }

    // Search query
    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { serviceCode: { contains: q } },
        { category: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    // Order by
    let orderBy = { serviceCode: 'asc' };
    if (sortBy === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'title') {
      orderBy = { title: 'asc' };
    }

    const services = await prisma.service.findMany({
      where,
      orderBy,
    });

    res.status(200).json({
      success: true,
      count: services.length,
      services: services.map(formatService),
    });
  } catch (error) {
    console.error('[Services Error] Failed to fetch services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service catalog. Please try again.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get service details and included checklist items
 * @route   GET /api/services/:id
 * @access  Public
 */
const getServiceById = async (req, res) => {
  try {
    await ensureServicesSeeded();

    const { id } = req.params;

    // Search by UUID id or serviceCode
    const service = await prisma.service.findFirst({
      where: {
        OR: [{ id: id }, { serviceCode: id }],
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service with identifier '${id}' was not found in the catalog.`,
      });
    }

    res.status(200).json({
      success: true,
      service: formatService(service),
    });
  } catch (error) {
    console.error(`[Services Error] Failed to fetch service ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service details.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get service categories and icon mappings
 * @route   GET /api/services/categories
 * @access  Public
 */
const getServiceCategories = async (req, res) => {
  try {
    await ensureServicesSeeded();

    const services = await prisma.service.findMany({
      where: { status: 'Active' },
      select: { category: true },
    });

    // Group counts
    const counts = {};
    services.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });

    const categoryDefinitions = [
      {
        id: 'all',
        name: 'All Services',
        count: services.length,
        iconType: 'layers',
        badgeClass: 'badge-cat-blue',
        description: 'Comprehensive high-performance vehicle workshop catalog.',
      },
      {
        id: 'maintenance',
        name: 'Maintenance',
        count: counts['Maintenance'] || 0,
        iconType: 'wrench',
        badgeClass: 'badge-cat-blue',
        description:
          'Factory scheduled periodic inspections, full synthetic fluid flushes, and micro-cabin filtration.',
      },
      {
        id: 'brakes-chassis',
        name: 'Brakes & Chassis',
        count: counts['Brakes & Chassis'] || 0,
        iconType: 'disc',
        badgeClass: 'badge-cat-slate',
        description:
          'Precision rotor micro-lathe resurfacing, low-dust ceramic pads, and computerized laser alignment.',
      },
      {
        id: 'engine-ecu',
        name: 'Engine & ECU',
        count: counts['Engine & ECU'] || 0,
        iconType: 'cpu',
        badgeClass: 'badge-cat-indigo',
        description:
          'Full CAN-bus interrogations, fuel trim telemetry, oscilloscope logs, and dyno ECU calibration.',
      },
      {
        id: 'electrical',
        name: 'Electrical',
        count: counts['Electrical'] || 0,
        iconType: 'battery',
        badgeClass: 'badge-cat-amber',
        description:
          '48V hybrid isolation testing, auxiliary AGM cell loads, and alternator ripple diagnostics.',
      },
    ];

    res.status(200).json({
      success: true,
      totalActiveServices: services.length,
      categories: categoryDefinitions,
    });
  } catch (error) {
    console.error('[Services Error] Failed to fetch service categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service categories.',
      error: error.message,
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  getServiceCategories,
  ensureServicesSeeded,
};
