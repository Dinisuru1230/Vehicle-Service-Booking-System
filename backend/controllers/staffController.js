const prisma = require('../config/prisma');

// 14 Core Workshop Master Technicians matching AdminStaffPage.js
const defaultStaffSeed = [
  {
    staffCode: 'TECH-01',
    name: 'Marcus Vance',
    email: 'm.vance@apexdrive.io',
    phone: '+1 (555) 234-8901',
    role: 'Lead Master Technician',
    specialization: 'Powertrain & Calibration',
    bay: 'Bay 1',
    baySub: '(Dyno Rack)',
    status: 'In-Bay',
    vehicleText: '2021 Porsche 911 GT3 RS',
    vehicleIcon: 'car',
    avatarBg: 'avatar-blue',
    experience: '12+ years',
    efficiency: 98,
    certs: JSON.stringify([
      { name: 'ASE Master', color: 'badge-cert-blue' },
      { name: 'Porsche Gold', color: 'badge-cert-blue' },
    ]),
    notes: 'Shop supervisor & high-performance dyno calibration specialist.',
  },
  {
    staffCode: 'TECH-04',
    name: 'Dave Miller',
    email: 'd.miller@apexdrive.io',
    phone: '+1 (555) 345-6789',
    role: 'Powertrain & Hydraulics',
    specialization: 'Engine Rebuild Specialist',
    bay: 'Bay 3',
    baySub: '(Heavy Lift)',
    status: 'In-Bay',
    vehicleText: '2023 BMW M3 Competition',
    vehicleIcon: 'car',
    avatarBg: 'avatar-purple',
    experience: '9 years',
    efficiency: 97,
    certs: JSON.stringify([
      { name: 'BMW Tech L2', color: 'badge-cert-blue' },
      { name: 'Brembo Brake', color: 'badge-cert-blue' },
    ]),
    notes: 'Precision engine rebuilding and dual-clutch transmission overhaul.',
  },
  {
    staffCode: 'TECH-07',
    name: 'Sam Rivera',
    email: 's.rivera@apexdrive.io',
    phone: '+1 (555) 456-7890',
    role: 'EV & High-Voltage Tech',
    specialization: 'Battery Cell Diagnostics',
    bay: 'Bay 5',
    baySub: '(EV Station)',
    status: 'In-Bay',
    vehicleText: '2022 Tesla Model S Plaid',
    vehicleIcon: 'zap',
    avatarBg: 'avatar-green',
    experience: '7 years',
    efficiency: 96,
    certs: JSON.stringify([
      { name: 'Tesla Level 3', color: 'badge-cert-green' },
      { name: 'Bosch EV', color: 'badge-cert-blue' },
    ]),
    notes: 'High-voltage safety lead and lithium module isolation tester.',
  },
  {
    staffCode: 'TECH-09',
    name: 'Alex Wong',
    email: 'a.wong@apexdrive.io',
    phone: '+1 (555) 567-8901',
    role: 'Diagnostic & Electronics',
    specialization: 'CAN Bus & Telemetry',
    bay: 'Bay 4',
    baySub: '(Scheduled)',
    status: 'Scheduled',
    vehicleText: '2024 Ford Lightning (02:30 PM)',
    vehicleIcon: 'clock',
    avatarBg: 'avatar-blue',
    experience: '8 years',
    efficiency: 95,
    certs: JSON.stringify([
      { name: 'ASE Electrical', color: 'badge-cert-blue' },
      { name: 'Autel Pro', color: 'badge-cert-blue' },
    ]),
    notes: 'Complex electronic fault extraction and sensor network calibration.',
  },
  {
    staffCode: 'TECH-11',
    name: 'Elena Rostova',
    email: 'e.rostova@apexdrive.io',
    phone: '+1 (555) 678-9012',
    role: 'Chassis & Suspension Tech',
    specialization: 'Laser Geometry & Camber',
    bay: 'Bay 2',
    baySub: '(Alignment Lift)',
    status: 'In-Bay',
    vehicleText: '2020 Audi RS6 Avant',
    vehicleIcon: 'car',
    avatarBg: 'avatar-slate',
    experience: '10 years',
    efficiency: 99,
    certs: JSON.stringify([
      { name: 'Hunter L1', color: 'badge-cert-blue' },
      { name: 'Öhlins Tech', color: 'badge-cert-blue' },
    ]),
    notes: 'Laser camber alignment, corner weight distribution, and race chassis setup.',
  },
  {
    staffCode: 'TECH-14',
    name: 'Liam Chen',
    email: 'l.chen@apexdrive.io',
    phone: '+1 (555) 789-0123',
    role: 'General Maintenance Tech',
    specialization: 'Intake & Fluids Service',
    bay: 'Bay 7',
    baySub: '(Intake Prep)',
    status: 'Available',
    vehicleText: 'Available for Dispatch',
    vehicleIcon: 'check',
    avatarBg: 'avatar-slate',
    experience: '4 years',
    efficiency: 94,
    certs: JSON.stringify([
      { name: 'ASE Suspension', color: 'badge-cert-blue' },
      { name: 'DOT Certified', color: 'badge-cert-blue' },
    ]),
    notes: 'Rapid oil exchange, filter renewal, and multi-point safety intake.',
  },
  {
    staffCode: 'TECH-02',
    name: 'Jordan Belfort',
    email: 'j.belfort@apexdrive.io',
    phone: '+1 (555) 890-1234',
    role: 'Powertrain Specialist',
    specialization: 'Twin-Turbo Induction',
    bay: 'Bay 6',
    baySub: '(Acoustic Cell)',
    status: 'In-Bay',
    vehicleText: '2022 Mercedes-AMG C63',
    vehicleIcon: 'car',
    avatarBg: 'avatar-blue',
    experience: '8 years',
    efficiency: 95,
    certs: JSON.stringify([
      { name: 'AMG Master', color: 'badge-cert-blue' },
      { name: 'ASE A1', color: 'badge-cert-blue' },
    ]),
    notes: 'Bi-turbo boost leak tests, intercooler piping, and dyno pull safety.',
  },
  {
    staffCode: 'TECH-05',
    name: 'Carlos Mendez',
    email: 'c.mendez@apexdrive.io',
    phone: '+1 (555) 901-2345',
    role: 'Brake & Hydraulics Tech',
    specialization: 'Carbon Ceramic Lathe',
    bay: 'Bay 8',
    baySub: '(Rapid QC)',
    status: 'In-Bay',
    vehicleText: '2021 Corvette Z06',
    vehicleIcon: 'car',
    avatarBg: 'avatar-purple',
    experience: '6 years',
    efficiency: 96,
    certs: JSON.stringify([
      { name: 'Brembo Gold', color: 'badge-cert-blue' },
      { name: 'ASE A5', color: 'badge-cert-blue' },
    ]),
    notes: 'Carbon ceramic disc resurfacing and hydraulic high-pressure bleeding.',
  },
  {
    staffCode: 'TECH-08',
    name: 'Hiroshi Tanaka',
    email: 'h.tanaka@apexdrive.io',
    phone: '+1 (555) 012-3456',
    role: 'Tuning & Telemetry Engineer',
    specialization: 'Standalone ECU Maps',
    bay: 'Bay 1',
    baySub: '(Dyno Rack)',
    status: 'In-Bay',
    vehicleText: '2023 Nissan GT-R Nismo',
    vehicleIcon: 'car',
    avatarBg: 'avatar-green',
    experience: '11 years',
    efficiency: 98,
    certs: JSON.stringify([
      { name: 'MoTeC Pro', color: 'badge-cert-blue' },
      { name: 'Haltech Gold', color: 'badge-cert-blue' },
    ]),
    notes: 'Standalone motorsport ECU mapping and wideband lambda tuning.',
  },
  {
    staffCode: 'TECH-12',
    name: 'Sophia Martinez',
    email: 's.martinez@apexdrive.io',
    phone: '+1 (555) 123-4567',
    role: 'General Maintenance Tech',
    specialization: 'Synthetic Express',
    bay: 'Bay 7',
    baySub: '(Intake Prep)',
    status: 'Available',
    vehicleText: 'Available for Dispatch',
    vehicleIcon: 'check',
    avatarBg: 'avatar-blue',
    experience: '5 years',
    efficiency: 95,
    certs: JSON.stringify([
      { name: 'ASE G1', color: 'badge-cert-blue' },
      { name: 'Castrol Pro', color: 'badge-cert-blue' },
    ]),
    notes: 'Express lane maintenance and fluid condition audits.',
  },
  {
    staffCode: 'TECH-03',
    name: 'Lucas Vance',
    email: 'l.vance@apexdrive.io',
    phone: '+1 (555) 234-5678',
    role: 'Chassis & Suspension Tech',
    specialization: 'Corner Weighting & Setup',
    bay: 'Bay Standby',
    baySub: '(Shift Rotation)',
    status: 'Off-Duty',
    vehicleText: 'Shift Rotational Standby',
    vehicleIcon: 'clock',
    avatarBg: 'avatar-slate',
    experience: '6 years',
    efficiency: 93,
    certs: JSON.stringify([
      { name: 'Bilstein Tech', color: 'badge-cert-blue' },
      { name: 'ASE A4', color: 'badge-cert-blue' },
    ]),
    notes: 'Suspension coilover valving and bushing replacements.',
  },
  {
    staffCode: 'TECH-06',
    name: 'Daniel Kim',
    email: 'd.kim@apexdrive.io',
    phone: '+1 (555) 345-6780',
    role: 'EV & High-Voltage Tech',
    specialization: 'Glycol Loop Flush',
    bay: 'Training Stall',
    baySub: '(Certification)',
    status: 'Off-Duty',
    vehicleText: 'Training Protocol Session',
    vehicleIcon: 'clock',
    avatarBg: 'avatar-purple',
    experience: '4 years',
    efficiency: 92,
    certs: JSON.stringify([
      { name: 'High Voltage L2', color: 'badge-cert-green' },
      { name: 'ASE A6', color: 'badge-cert-blue' },
    ]),
    notes: 'EV thermal management and inverter cooling circuits.',
  },
  {
    staffCode: 'TECH-10',
    name: 'Rachel Adams',
    email: 'r.adams@apexdrive.io',
    phone: '+1 (555) 456-7891',
    role: 'Powertrain Specialist',
    specialization: 'Transmission Bench Tech',
    bay: 'Off-Duty',
    baySub: '(Shift Standby)',
    status: 'Off-Duty',
    vehicleText: 'Shift Standby - Rest Cycle',
    vehicleIcon: 'clock',
    avatarBg: 'avatar-green',
    experience: '7 years',
    efficiency: 94,
    certs: JSON.stringify([
      { name: 'ZF Certified', color: 'badge-cert-blue' },
      { name: 'ASE A2', color: 'badge-cert-blue' },
    ]),
    notes: 'Automatic transmission valve body refurbishing and solenoid rebuilds.',
  },
  {
    staffCode: 'TECH-13',
    name: 'Matteo Bellini',
    email: 'm.bellini@apexdrive.io',
    phone: '+1 (555) 567-8902',
    role: 'Chassis & Suspension Tech',
    specialization: 'Roll Cage & Subframe',
    bay: 'Off-Site',
    baySub: '(SCCA Inspection)',
    status: 'Off-Duty',
    vehicleText: 'Off-site inspection test',
    vehicleIcon: 'clock',
    avatarBg: 'avatar-slate',
    experience: '9 years',
    efficiency: 96,
    certs: JSON.stringify([
      { name: 'TIG Master', color: 'badge-cert-blue' },
      { name: 'SCCA Tech', color: 'badge-cert-blue' },
    ]),
    notes: 'Chassis reinforcement, custom fabrication, and FIA safety scruitineering.',
  },
];

// Helper to auto-seed staff on startup
const ensureStaffSeeded = async () => {
  try {
    const count = await prisma.staff.count();
    if (count === 0) {
      for (const item of defaultStaffSeed) {
        await prisma.staff.create({
          data: item,
        });
      }
      console.log(`[Staff] Auto-seeded ${defaultStaffSeed.length} workshop mechanics & master technicians.`);
    }
  } catch (err) {
    console.warn('[Staff] Auto-seed skipped:', err.message);
  }
};

// Helper to format staff object
const formatStaff = (s) => {
  let certs = [];
  try {
    certs = s.certs ? JSON.parse(s.certs) : [];
  } catch {
    certs = [];
  }

  // Compute initials
  const nameParts = (s.name || '').trim().split(' ');
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : (s.name || 'TC').slice(0, 2).toUpperCase();

  // Status class helper
  let statusClass = 'status-available-green';
  if (s.status === 'In-Bay') statusClass = 'status-inbay-blue';
  else if (s.status === 'Scheduled') statusClass = 'status-scheduled-green';
  else if (s.status === 'Off-Duty' || s.status === 'On Leave') statusClass = 'status-offduty-gray';

  // Bay dot color helper
  let bayDotColor = 'dot-blue';
  if (s.status === 'Available') bayDotColor = 'dot-green';
  else if (s.status === 'Scheduled') bayDotColor = 'dot-green';
  else if (s.status === 'Off-Duty') bayDotColor = 'dot-dark';

  return {
    id: s.id,
    staffCode: s.staffCode,
    initials,
    avatarBg: s.avatarBg || 'avatar-blue',
    name: s.name,
    email: s.email,
    phone: s.phone || '+1 (555) 019-2834',
    role: s.role,
    specialization: s.specialization,
    bay: s.bay,
    baySub: s.baySub || '(General Lift)',
    bayDotColor,
    status: s.status,
    statusClass,
    vehicleIcon: s.vehicleIcon || 'car',
    vehicleText: s.vehicleText || 'Available for Dispatch',
    vehicleColor: s.status === 'Available' ? 'text-green' : 'text-dark',
    certs,
    experience: s.experience || '5+ years',
    efficiency: s.efficiency || 95,
    notes: s.notes || '',
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
};

/**
 * @desc    List all workshop staff & technicians (with search, role, bay, and status filters)
 * @route   GET /api/admin/staff
 * @access  Private (Admin)
 */
const getStaffList = async (req, res) => {
  try {
    await ensureStaffSeeded();

    const { search, role, bay, status, page = 1, limit = 50 } = req.query;

    const where = {};

    // Filter by status
    if (status && status !== 'All') {
      where.status = status;
    }

    // Filter by role
    if (role && role !== 'All') {
      where.role = {
        contains: role.trim(),
      };
    }

    // Filter by bay
    if (bay && bay !== 'All') {
      where.bay = {
        contains: bay.trim(),
      };
    }

    // Search query
    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { staffCode: { contains: q } },
        { specialization: { contains: q } },
        { vehicleText: { contains: q } },
        { role: { contains: q } },
      ];
    }

    const total = await prisma.staff.count({ where });

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const staff = await prisma.staff.findMany({
      where,
      orderBy: { staffCode: 'asc' },
      skip,
      take: limitNum,
    });

    res.status(200).json({
      success: true,
      total,
      count: staff.length,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      staff: staff.map(formatStaff),
    });
  } catch (error) {
    console.error('[Staff Error] Failed to fetch staff roster:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve workshop staff roster.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single technician profile and service details
 * @route   GET /api/admin/staff/:id
 * @access  Private (Admin)
 */
const getStaffById = async (req, res) => {
  try {
    await ensureStaffSeeded();

    const { id } = req.params;

    const technician = await prisma.staff.findFirst({
      where: {
        OR: [{ id: id }, { staffCode: id }],
      },
    });

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: `Technician with identifier '${id}' was not found in the workshop roster.`,
      });
    }

    // Mock recent service jobs completed by this technician
    const recentJobs = [
      {
        jobId: `JOB-${technician.staffCode}-892`,
        vehicle: technician.vehicleText || '2023 BMW M3 Competition',
        serviceTitle: 'Engine Diagnostics & ECU Tuning',
        date: 'Today, 10:45 AM',
        bay: technician.bay,
        duration: '45 mins',
        status: technician.status === 'In-Bay' ? 'In Progress' : 'Completed',
      },
      {
        jobId: `JOB-${technician.staffCode}-741`,
        vehicle: '2021 Porsche 911 GT3 RS',
        serviceTitle: 'Brake Rotor Resurfacing & Ceramic Pads',
        date: 'Yesterday, 03:15 PM',
        bay: technician.bay,
        duration: '60 mins',
        status: 'Completed',
      },
    ];

    res.status(200).json({
      success: true,
      technician: {
        ...formatStaff(technician),
        recentJobs,
      },
    });
  } catch (error) {
    console.error(`[Staff Error] Failed to get staff member ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve technician details.',
      error: error.message,
    });
  }
};

/**
 * @desc    Add new staff member / certified technician
 * @route   POST /api/admin/staff
 * @access  Private (Admin)
 */
const createStaffMember = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role = 'Lead Master Technician',
      specialization = 'Powertrain & Diagnostics',
      bay = 'Bay 1 (Dyno Rack)',
      baySub,
      status = 'Available',
      vehicleText = 'Available for Dispatch',
      certs,
      experience = '5+ years',
      efficiency = 95,
      avatarBg = 'avatar-blue',
      notes,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Technician name and email address are required fields.',
      });
    }

    // Check email uniqueness
    const existingEmail = await prisma.staff.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: `A staff member with email '${email}' is already registered in the roster.`,
      });
    }

    // Generate next staff code: e.g. TECH-15
    const allStaff = await prisma.staff.findMany({ select: { staffCode: true } });
    let maxNum = 0;
    allStaff.forEach((s) => {
      const match = s.staffCode.match(/TECH-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const nextCode = `TECH-${String(maxNum + 1).padStart(2, '0')}`;

    // Format certs to JSON string
    let certsJson = '[]';
    if (Array.isArray(certs)) {
      certsJson = JSON.stringify(certs);
    } else if (typeof certs === 'string') {
      const parsed = certs
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => ({ name: c, color: 'badge-cert-blue' }));
      certsJson = JSON.stringify(parsed);
    }

    const newStaff = await prisma.staff.create({
      data: {
        staffCode: nextCode,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '+1 (555) 019-2834',
        role,
        specialization,
        bay,
        baySub: baySub || (bay.includes('(') ? `(${bay.split('(')[1]}` : '(General Lift)'),
        status,
        vehicleText,
        vehicleIcon: status === 'Available' ? 'check' : 'car',
        certs: certsJson,
        experience,
        efficiency: parseInt(efficiency, 10) || 95,
        avatarBg,
        notes: notes || '',
      },
    });

    res.status(201).json({
      success: true,
      message: `Master Technician '${newStaff.name}' (${newStaff.staffCode}) successfully onboarded to the workshop.`,
      staff: formatStaff(newStaff),
    });
  } catch (error) {
    console.error('[Staff Error] Failed to create staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create technician record.',
      error: error.message,
    });
  }
};

/**
 * @desc    Update staff details, certifications, and bay assignment
 * @route   PUT /api/admin/staff/:id
 * @access  Private (Admin)
 */
const updateStaffMember = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.staff.findFirst({
      where: {
        OR: [{ id: id }, { staffCode: id }],
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Technician with identifier '${id}' was not found.`,
      });
    }

    const {
      name,
      email,
      phone,
      role,
      specialization,
      bay,
      baySub,
      status,
      vehicleText,
      certs,
      experience,
      efficiency,
      notes,
    } = req.body;

    const data = {};
    if (name) data.name = name.trim();
    if (email) data.email = email.trim().toLowerCase();
    if (phone) data.phone = phone.trim();
    if (role) data.role = role;
    if (specialization) data.specialization = specialization;
    if (bay) data.bay = bay;
    if (baySub) data.baySub = baySub;
    if (status) {
      data.status = status;
      data.vehicleIcon = status === 'Available' ? 'check' : 'car';
    }
    if (vehicleText !== undefined) data.vehicleText = vehicleText;
    if (experience) data.experience = experience;
    if (efficiency !== undefined) data.efficiency = parseInt(efficiency, 10);
    if (notes !== undefined) data.notes = notes;

    if (certs !== undefined) {
      if (Array.isArray(certs)) {
        data.certs = JSON.stringify(certs);
      } else if (typeof certs === 'string') {
        const parsed = certs
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
          .map((c) => ({ name: c, color: 'badge-cert-blue' }));
        data.certs = JSON.stringify(parsed);
      }
    }

    const updated = await prisma.staff.update({
      where: { id: existing.id },
      data,
    });

    res.status(200).json({
      success: true,
      message: `Technician '${updated.name}' profile updated successfully.`,
      staff: formatStaff(updated),
    });
  } catch (error) {
    console.error(`[Staff Error] Failed to update staff member ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update technician record.',
      error: error.message,
    });
  }
};

/**
 * @desc    Update technician availability status (In-Bay, Available, Scheduled, Off-Duty, On Leave)
 * @route   PUT /api/admin/staff/:id/status
 * @access  Private (Admin)
 */
const updateStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, bay, vehicleText } = req.body;

    const validStatuses = ['In-Bay', 'Available', 'Scheduled', 'Off-Duty', 'On Leave'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
      });
    }

    const existing = await prisma.staff.findFirst({
      where: {
        OR: [{ id: id }, { staffCode: id }],
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Technician with identifier '${id}' was not found.`,
      });
    }

    const data = {
      status,
    };

    if (bay) data.bay = bay;
    if (vehicleText !== undefined) {
      data.vehicleText = vehicleText;
    } else if (status === 'Available') {
      data.vehicleText = 'Available for Dispatch';
      data.vehicleIcon = 'check';
    } else if (status === 'Off-Duty') {
      data.vehicleText = 'Shift Rotational Standby';
      data.vehicleIcon = 'clock';
    }

    const updated = await prisma.staff.update({
      where: { id: existing.id },
      data,
    });

    res.status(200).json({
      success: true,
      message: `Technician '${updated.name}' status updated to '${status}'.`,
      staff: formatStaff(updated),
    });
  } catch (error) {
    console.error(`[Staff Error] Failed to update status for staff member ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update technician status.',
      error: error.message,
    });
  }
};

/**
 * @desc    Remove staff member from roster
 * @route   DELETE /api/admin/staff/:id
 * @access  Private (Admin)
 */
const deleteStaffMember = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.staff.findFirst({
      where: {
        OR: [{ id: id }, { staffCode: id }],
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Technician with identifier '${id}' was not found.`,
      });
    }

    await prisma.staff.delete({
      where: { id: existing.id },
    });

    res.status(200).json({
      success: true,
      message: `Technician '${existing.name}' (${existing.staffCode}) has been removed from the workshop roster.`,
    });
  } catch (error) {
    console.error(`[Staff Error] Failed to delete staff member ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete technician record.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get technician metrics (Total Staff, On-Duty, In-Bay, Efficiency, Certs)
 * @route   GET /api/admin/staff/metrics
 * @access  Private (Admin)
 */
const getStaffMetrics = async (req, res) => {
  try {
    await ensureStaffSeeded();

    const allStaff = await prisma.staff.findMany();

    const totalStaff = allStaff.length;
    let onDutyCount = 0;
    let activeInBayCount = 0;
    let availableCount = 0;
    let scheduledCount = 0;
    let offDutyCount = 0;
    let onLeaveCount = 0;
    let totalEfficiency = 0;
    let masterCertsCount = 0;

    const uniqueBaysInUse = new Set();

    allStaff.forEach((s) => {
      // Efficiency sum
      totalEfficiency += s.efficiency || 95;

      // Status breakdown
      if (s.status === 'In-Bay') {
        activeInBayCount += 1;
        onDutyCount += 1;
        if (s.bay && s.bay.toLowerCase().includes('bay')) {
          uniqueBaysInUse.add(s.bay);
        }
      } else if (s.status === 'Available') {
        availableCount += 1;
        onDutyCount += 1;
      } else if (s.status === 'Scheduled') {
        scheduledCount += 1;
        onDutyCount += 1;
      } else if (s.status === 'Off-Duty') {
        offDutyCount += 1;
      } else if (s.status === 'On Leave') {
        onLeaveCount += 1;
      }

      // Certs count
      try {
        const parsedCerts = s.certs ? JSON.parse(s.certs) : [];
        masterCertsCount += parsedCerts.length;
      } catch {
        // ignore
      }
    });

    const averageEfficiency = totalStaff > 0 ? Math.round(totalEfficiency / totalStaff) : 96;

    res.status(200).json({
      success: true,
      metrics: {
        totalStaff,
        onDutyCount,
        activeInBayCount,
        availableCount,
        scheduledCount,
        offDutyCount,
        onLeaveCount,
        efficiencyRate: averageEfficiency,
        masterCertsCount,
        bayCoverageText: `${uniqueBaysInUse.size} of 8 active bays manned`,
        activeBaysCount: uniqueBaysInUse.size,
        statusBreakdown: {
          inBay: activeInBayCount,
          available: availableCount,
          scheduled: scheduledCount,
          offDuty: offDutyCount,
          onLeave: onLeaveCount,
        },
      },
    });
  } catch (error) {
    console.error('[Staff Error] Failed to get staff metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate staff metrics.',
      error: error.message,
    });
  }
};

module.exports = {
  getStaffList,
  getStaffById,
  createStaffMember,
  updateStaffMember,
  updateStaffStatus,
  deleteStaffMember,
  getStaffMetrics,
  ensureStaffSeeded,
};
