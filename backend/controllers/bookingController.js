const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to extract initials
function getInitials(name) {
  if (!name) return 'CU';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Helper for status CSS class (Admin Table)
function getStatusClass(status) {
  switch (status) {
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
}

// Helper for customer badge class (Customer My Bookings)
function getCustomerBadgeClass(status) {
  switch (status) {
    case 'In-Bay':
      return 'badge-confirmed-blue';
    case 'Confirmed':
      return 'badge-confirmed-green';
    case 'Pending':
      return 'badge-confirmed-amber';
    case 'Completed':
      return 'badge-completed-gray';
    case 'Cancelled':
      return 'badge-cancelled-red';
    default:
      return 'badge-confirmed-blue';
  }
}

// Helper for customer status group
function getCustomerStatusGroup(status) {
  if (status === 'In-Bay') return 'active';
  if (status === 'Pending' || status === 'Confirmed') return 'upcoming';
  if (status === 'Completed') return 'completed';
  if (status === 'Cancelled') return 'cancelled';
  return 'upcoming';
}

// Helper for time icon
function getTimeIcon(status, bay) {
  if (status === 'Completed') return 'check';
  if (status === 'In-Bay') return 'lift';
  if (status === 'Confirmed') return 'calendar';
  return 'clock';
}

// Telemetry Milestone Helper
function buildTelemetry(status, serviceTitle, customTelemetry) {
  if (customTelemetry) {
    if (typeof customTelemetry === 'string') {
      try {
        return JSON.parse(customTelemetry);
      } catch (e) {
        // fallback
      }
    } else if (typeof customTelemetry === 'object') {
      return customTelemetry;
    }
  }

  if (status === 'Cancelled') {
    return {
      step: 0,
      totalSteps: 4,
      stepName: 'Appointment Cancelled',
      estCompletion: 'Cancelled',
      progressPercent: 0,
      milestones: [
        {
          step: 1,
          name: '1. Appointment Intake',
          status: 'cancelled',
          time: 'Booking Cancelled',
        },
      ],
    };
  }

  const isCompleted = status === 'Completed';
  const isInBay = status === 'In-Bay';
  const isConfirmed = status === 'Confirmed';

  return {
    step: isCompleted ? 4 : isInBay ? 3 : isConfirmed ? 2 : 1,
    totalSteps: 4,
    stepName: isCompleted
      ? 'Final Inspection & QC Approved'
      : isInBay
        ? `Step 3 of 4: ${serviceTitle || 'Active Service & Parts Replacement'}`
        : isConfirmed
          ? 'Step 2 of 4: Pre-Service Intake & Bay Reserved'
          : 'Step 1 of 4: Intake Queue & Inspection Scheduled',
    estCompletion: isCompleted ? 'Completed & Signed Off' : 'Today at 4:30 PM',
    progressPercent: isCompleted ? 100 : isInBay ? 75 : isConfirmed ? 40 : 15,
    milestones: [
      {
        step: 1,
        name: '1. Vehicle Checked-in',
        status: isCompleted || isInBay || isConfirmed ? 'completed' : 'active',
        time: isCompleted || isInBay || isConfirmed ? 'Completed (09:45 AM)' : 'Pending Arrival',
      },
      {
        step: 2,
        name: '2. Multi-Point Check',
        status: isCompleted || isInBay ? 'completed' : isConfirmed ? 'active' : 'queued',
        time: isCompleted || isInBay ? 'Completed (10:15 AM)' : isConfirmed ? 'In Progress' : 'Queued next',
      },
      {
        step: 3,
        name: '3. Brake & Mechanical Service',
        status: isCompleted ? 'completed' : isInBay ? 'active' : 'queued',
        time: isCompleted ? 'Completed (02:30 PM)' : isInBay ? 'In Progress (Now)' : 'Queued next',
      },
      {
        step: 4,
        name: '4. Final Road Test & QC',
        status: isCompleted ? 'completed' : 'queued',
        time: isCompleted ? 'Signed off by Master Tech' : 'Queued next',
      },
    ],
  };
}

// Format single booking for client consumption
function formatBooking(b) {
  let parsedServices = [];
  if (b.servicesList) {
    try {
      parsedServices = JSON.parse(b.servicesList);
    } catch (e) {
      parsedServices = [];
    }
  }

  const telemetryObj = buildTelemetry(b.status, b.serviceTitle, b.telemetry);

  // Month and Day extraction
  let month = 'NOV';
  let day = '15';
  if (b.scheduledDate) {
    const dStr = b.scheduledDate.toUpperCase();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    for (const m of months) {
      if (dStr.includes(m)) {
        month = m;
        break;
      }
    }
    const dayMatch = b.scheduledDate.match(/\b([0-2]?[0-9]|3[01])\b/);
    if (dayMatch) {
      day = dayMatch[1].padStart(2, '0');
    }
  }

  const customerName = b.customerName || (b.user ? b.user.name : 'Valued Customer');
  const vehicleText = b.vehicleText || (b.vehicle ? `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}` : 'Performance Vehicle');
  const plate = b.plate || (b.vehicle ? b.vehicle.plate : 'CA 999ZZ');

  const cleanTime = (b.scheduledTime || '10:00 AM').replace(/^Today,\s*/i, '');
  const isDateToday = b.scheduledDate && (
    b.scheduledDate.toLowerCase().includes('today') ||
    b.status === 'In-Bay'
  );
  const displayTime = isDateToday ? `Today, ${cleanTime}` : cleanTime;

  return {
    id: b.bookingRef ? b.bookingRef.replace(/^#/, '') : b.id,
    bookingRef: b.bookingRef || `#${b.id.substring(0, 8)}`,
    uuid: b.id,
    userId: b.userId,
    user: b.user
      ? {
        id: b.user.id,
        name: b.user.name,
        email: b.user.email,
        phone: b.user.phone,
        tier: b.user.tier,
      }
      : null,
    customer: customerName,
    customerName,
    customerPhone: b.customerPhone || b.user?.phone || null,
    initials: getInitials(customerName),
    avatarBg: 'avatar-light-blue',
    vehicleId: b.vehicleId,
    vehicle: vehicleText,
    vehicleText,
    plate,
    serviceTitle: b.serviceTitle,
    title: b.serviceTitle,
    serviceDetail: b.serviceDetail || 'Precision High-Performance Intake Service',
    servicesList: parsedServices,
    time: displayTime,
    scheduledTime: cleanTime,
    scheduledDate: b.scheduledDate,
    month,
    day,
    hub: b.hub || 'Apex Central Hub',
    bay: b.bay || 'Bay Standby',
    technician: b.technician || 'Unassigned',
    techInitials: getInitials(b.technician || 'Unassigned'),
    techBg: b.technician && b.technician.includes('Dave') ? 'tech-dark' : 'tech-blue',
    timeIcon: getTimeIcon(b.status, b.bay),
    status: b.status,
    statusGroup: getCustomerStatusGroup(b.status),
    statusLabel: b.status === 'In-Bay' ? 'In Progress' : b.status,
    statusClass: getStatusClass(b.status),
    statusBadgeClass: getCustomerBadgeClass(b.status),
    totalCost: b.totalCost,
    price: `LKR ${Number(b.totalCost).toFixed(2)}`,
    notes: b.notes,
    cancellationReason: b.cancellationReason,
    telemetry: telemetryObj,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

// -------------------------------------------------------------
// Auto-seeding Initial Workshop Bookings matching mockups
// -------------------------------------------------------------
const ensureBookingsSeeded = async () => {
  try {
    const count = await prisma.booking.count();
    if (count >= 5) {
      return;
    }

    console.log('[Bookings] Checking seed bookings in database...');

    // Find Alexander Wright
    let alex = await prisma.user.findUnique({
      where: { email: 'alexander@example.com' },
      include: { vehicles: true },
    });
    if (!alex) {
      const alexHash = await bcrypt.hash('Customer2026!', 10);
      alex = await prisma.user.create({
        data: {
          name: 'Alexander Wright',
          email: 'alexander@example.com',
          password: alexHash,
          phone: '+1 (555) 234-5678',
          role: 'customer',
          tier: 'VIP Platinum',
          vehicles: {
            create: [
              {
                name: '2023 BMW M3 Competition',
                make: 'BMW',
                model: 'M3 Competition (G80)',
                year: 2023,
                plate: 'CA 8XYZ901',
                mileage: '14,200 mi',
                color: 'Isle of Man Green',
                isPrimary: true,
                inBay: true,
              },
            ],
          },
        },
        include: { vehicles: true },
      });
    }

    // Find Elena Rostova
    let elena = await prisma.user.findUnique({
      where: { email: 'elena.rostova@apexcapital.io' },
      include: { vehicles: true },
    });
    if (!elena) {
      const elenaHash = await bcrypt.hash('Customer2026!', 10);
      elena = await prisma.user.create({
        data: {
          name: 'Elena Rostova',
          email: 'elena.rostova@apexcapital.io',
          password: elenaHash,
          phone: '+1 (555) 891-2345',
          role: 'customer',
          tier: 'VIP Platinum',
          vehicles: {
            create: [
              {
                name: '2021 Porsche 911 GT3 RS',
                make: 'Porsche',
                model: '911 GT3 RS',
                year: 2021,
                plate: 'NV 3TRK77',
                mileage: '6,800 mi',
                color: 'Shark Blue',
                isPrimary: true,
                inBay: true,
              },
            ],
          },
        },
        include: { vehicles: true },
      });
    }

    // Find or create Liam Henderson
    let liam = await prisma.user.findUnique({
      where: { email: 'liam.henderson@example.com' },
      include: { vehicles: true },
    });
    if (!liam) {
      const liamHash = await bcrypt.hash('Customer2026!', 10);
      liam = await prisma.user.create({
        data: {
          name: 'Liam Henderson',
          email: 'liam.henderson@example.com',
          password: liamHash,
          phone: '+1 (555) 912-3456',
          role: 'customer',
          tier: 'Gold Member',
          vehicles: {
            create: [
              {
                name: '2022 Tesla Model S Plaid',
                make: 'Tesla',
                model: 'Model S Plaid',
                year: 2022,
                plate: 'CA 5EV202',
                mileage: '18,500 mi',
                color: 'Midnight Silver Metallic',
                isPrimary: true,
              },
            ],
          },
        },
        include: { vehicles: true },
      });
    }

    // Find or create Sophia Martinez
    let sophia = await prisma.user.findUnique({
      where: { email: 'sophia.martinez@example.com' },
      include: { vehicles: true },
    });
    if (!sophia) {
      const sophiaHash = await bcrypt.hash('Customer2026!', 10);
      sophia = await prisma.user.create({
        data: {
          name: 'Sophia Martinez',
          email: 'sophia.martinez@example.com',
          password: sophiaHash,
          phone: '+1 (555) 456-7890',
          role: 'customer',
          tier: 'VIP Platinum',
          vehicles: {
            create: [
              {
                name: '2020 Audi RS6 Avant',
                make: 'Audi',
                model: 'RS6 Avant',
                year: 2020,
                plate: 'NY RS6-88',
                mileage: '24,600 mi',
                color: 'Nardo Gray',
                isPrimary: true,
              },
            ],
          },
        },
        include: { vehicles: true },
      });
    }

    // Find or create David Chen
    let david = await prisma.user.findUnique({
      where: { email: 'david.chen@example.com' },
      include: { vehicles: true },
    });
    if (!david) {
      const davidHash = await bcrypt.hash('Customer2026!', 10);
      david = await prisma.user.create({
        data: {
          name: 'David Chen',
          email: 'david.chen@example.com',
          password: davidHash,
          phone: '+1 (555) 678-9012',
          role: 'customer',
          tier: 'Standard',
          vehicles: {
            create: [
              {
                name: '2024 Ford F-150 Lightning',
                make: 'Ford',
                model: 'F-150 Lightning Platinum',
                year: 2024,
                plate: 'WA 9LGT44',
                mileage: '5,100 mi',
                color: 'Antimatter Blue',
                isPrimary: true,
              },
            ],
          },
        },
        include: { vehicles: true },
      });
    }

    // Seed list of canonical bookings
    const seedRecords = [
      {
        bookingRef: '#APX-84920',
        userId: alex.id,
        vehicleId: alex.vehicles[0]?.id || null,
        customerName: 'Alexander Wright',
        customerPhone: '+1 (555) 234-5678',
        vehicleText: '2023 BMW M3 Competition',
        plate: 'CA 8XYZ901',
        serviceTitle: 'Brake Renewal & Routine Inspection',
        serviceDetail: 'Tier 1 Service • 4.8L TwinPower Spec & Brembo Renewal',
        servicesList: JSON.stringify([
          { id: 'brake-pads', title: 'Brake Inspection & Pads', price: 149.0, duration: '~60 mins' },
        ]),
        scheduledDate: 'OCT 19, 2025',
        scheduledTime: '10:30 AM',
        hub: 'Apex Central Hub',
        bay: 'Bay 3 (Lift Heavy)',
        technician: 'Dave Miller',
        totalCost: 149.0,
        status: 'In-Bay',
        notes: 'Track brake pads renewal and Castrol SRF fluid replacement.',
      },
      {
        bookingRef: '#APX-85104',
        userId: elena.id,
        vehicleId: elena.vehicles[0]?.id || null,
        customerName: 'Elena Rostova',
        customerPhone: '+1 (555) 891-2345',
        vehicleText: '2021 Porsche 911 GT3 RS',
        plate: 'NV 3TRK77',
        serviceTitle: 'Track Alignment & Corner Balance',
        serviceDetail: 'Laser Chassis Rig • Aero Calibration',
        servicesList: JSON.stringify([
          { id: 'track-align', title: 'Track Alignment & Corner Balance', price: 129.0, duration: '~90 mins' },
        ]),
        scheduledDate: 'NOV 02, 2025',
        scheduledTime: '11:00 AM',
        hub: 'Apex Central Hub',
        bay: 'Bay 1 (Dyno Rack)',
        technician: 'Marcus Vance',
        totalCost: 129.0,
        status: 'Confirmed',
        notes: 'Prepare suspension geometry for Laguna Seca track event.',
      },
      {
        bookingRef: '#APX-85219',
        userId: liam.id,
        vehicleId: liam.vehicles[0]?.id || null,
        customerName: 'Liam Henderson',
        customerPhone: '+1 (555) 912-3456',
        vehicleText: '2022 Tesla Model S Plaid',
        plate: 'CA 5EV202',
        serviceTitle: 'Battery Health & EV Diagnostics',
        serviceDetail: 'Cell Voltage Delta • Thermal Loop Run',
        servicesList: JSON.stringify([
          { id: 'ev-diag', title: 'Battery Health & EV Diagnostics', price: 99.0, duration: '~45 mins' },
        ]),
        scheduledDate: 'NOV 08, 2025',
        scheduledTime: '09:00 AM',
        hub: 'Downtown Flagship',
        bay: 'Bay 5 (EV Station)',
        technician: 'Sam Rivera',
        totalCost: 99.0,
        status: 'Confirmed',
        notes: 'Conduct 400V cell delta sweep and coolant pressure verification.',
      },
      {
        bookingRef: '#APX-79102',
        userId: sophia.id,
        vehicleId: sophia.vehicles[0]?.id || null,
        customerName: 'Sophia Martinez',
        customerPhone: '+1 (555) 456-7890',
        vehicleText: '2020 Audi RS6 Avant',
        plate: 'NY RS6-88',
        serviceTitle: 'Brake System Lathe & Pad Service',
        serviceDetail: 'Carbon Ceramic Inspection • Bleed',
        servicesList: JSON.stringify([
          { id: 'brake-lathe', title: 'Brake System Lathe & Pad Service', price: 249.0, duration: '~75 mins' },
        ]),
        scheduledDate: 'AUG 14, 2025',
        scheduledTime: '08:45 AM',
        hub: 'Apex Central Hub',
        bay: 'Bay 2 (Done • QC Signed)',
        technician: 'Sarah Chen',
        totalCost: 249.0,
        status: 'Completed',
        notes: 'Completed with road test sign-off by Sarah Chen.',
      },
      {
        bookingRef: '#APX-79088',
        userId: david.id,
        vehicleId: david.vehicles[0]?.id || null,
        customerName: 'David Chen',
        customerPhone: '+1 (555) 678-9012',
        vehicleText: '2024 Ford F-150 Lightning',
        plate: 'WA 9LGT44',
        serviceTitle: '40-Point Powertrain Inspection',
        serviceDetail: 'Drivetrain Telemetry • Inverter Log',
        servicesList: JSON.stringify([
          { id: 'powertrain', title: '40-Point Powertrain Inspection', price: 169.0, duration: '~60 mins' },
        ]),
        scheduledDate: 'OCT 24, 2025',
        scheduledTime: '02:00 PM',
        hub: 'Apex Central Hub',
        bay: 'Bay 4 (Scheduled)',
        technician: 'Alex Wong',
        totalCost: 169.0,
        status: 'Pending',
        notes: 'Check inverter telemetry log and dual-motor output balance.',
      },
      {
        bookingRef: '#APX-77401',
        userId: alex.id,
        vehicleId: alex.vehicles[0]?.id || null,
        customerName: 'Alexander Wright',
        customerPhone: '+1 (555) 234-5678',
        vehicleText: '2019 Audi S5 Coupe',
        plate: 'CA 7AUD99',
        serviceTitle: '48V Hybrid Alternator Inspection & Battery Service',
        serviceDetail: 'Alternator Inverter Diagnostic & High-Amp Draw Test',
        servicesList: JSON.stringify([
          { id: 'hybrid-alt', title: '48V Hybrid Alternator Inspection', price: 119.0, duration: '~50 mins' },
        ]),
        scheduledDate: 'JUL 20, 2025',
        scheduledTime: '10:00 AM',
        hub: 'Apex East Annex',
        bay: 'Bay 6',
        technician: 'Sam Rivera',
        totalCost: 119.0,
        status: 'Completed',
        notes: 'Tested 48V mild hybrid starter/generator with factory VAG diagnostic scan.',
      },
    ];

    for (const rec of seedRecords) {
      const existing = await prisma.booking.findUnique({
        where: { bookingRef: rec.bookingRef },
      });
      if (!existing) {
        await prisma.booking.create({ data: rec });
      }
    }

    console.log('[Bookings] Auto-seeded canonical workshop bookings successfully.');
  } catch (error) {
    console.error(`[Bookings Seed Error]: ${error.message}`);
  }
};

// =========================================================================
// CUSTOMER ENDPOINTS (For BookingPage.js & MyBookingsPage.js)
// =========================================================================

/**
 * @desc    Book a new service appointment
 * @route   POST /api/bookings
 * @access  Public (Guest) / Private (Customer & Admin)
 */
const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      vehicleMake,
      vehicle,
      licensePlate,
      plate,
      fullName,
      customerName,
      phoneNumber,
      customerPhone,
      email,
      customerEmail,
      serviceItems,
      selectedServices,
      serviceTitle,
      serviceDetail,
      selectedDay,
      currentMonth,
      currentYear,
      scheduledDate,
      selectedSlot,
      scheduledTime,
      hub,
      notes,
      totalCost,
      totalPrice,
    } = req.body;

    let targetUser = req.user;
    let guestToken = null;

    const resolvedCustomerName = (fullName || customerName || (targetUser ? targetUser.name : 'Valued Customer')).trim();
    const resolvedCustomerPhone = (phoneNumber || customerPhone || (targetUser ? targetUser.phone : null) || '').trim() || null;
    const rawEmail = (email || customerEmail || (targetUser ? targetUser.email : '') || '').trim().toLowerCase();

    // 0. Resolve or create customer account
    if (!targetUser) {
      if (rawEmail) {
        targetUser = await prisma.user.findUnique({
          where: { email: rawEmail },
        });
      }

      if (!targetUser && resolvedCustomerPhone) {
        targetUser = await prisma.user.findFirst({
          where: { phone: resolvedCustomerPhone },
        });
      }

      if (!targetUser) {
        const generatedEmail = rawEmail || `customer_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}@apexdrive.local`;
        const tempPassword = await bcrypt.hash('CustomerPass2026!', 10);
        targetUser = await prisma.user.create({
          data: {
            name: resolvedCustomerName,
            email: generatedEmail,
            phone: resolvedCustomerPhone,
            password: tempPassword,
            role: 'customer',
            tier: 'Standard',
            status: 'Active',
          },
        });
      }

      // Generate session token
      guestToken = jwt.sign(
        { id: targetUser.id, email: targetUser.email, role: targetUser.role },
        process.env.JWT_SECRET || 'apexdrive_super_secure_jwt_token_secret_key_2026_xyz982',
        { expiresIn: '30d' }
      );
    }

    const userId = targetUser.id;

    // 1. Resolve vehicle
    let resolvedVehicleId = vehicleId || null;
    let resolvedVehicleText = (vehicleMake || vehicle || '').trim() || null;
    let resolvedPlate = (licensePlate || plate || '').trim() || null;

    if (resolvedVehicleId) {
      const v = await prisma.vehicle.findUnique({ where: { id: resolvedVehicleId } });
      if (v) {
        resolvedVehicleText = v.name || `${v.year} ${v.make} ${v.model}`;
        resolvedPlate = v.plate;
      }
    } else if (resolvedVehicleText || resolvedPlate) {
      const plateToUse = resolvedPlate || `TX-${Math.floor(100 + Math.random() * 900)}-APX`;
      let existingV = await prisma.vehicle.findFirst({
        where: { userId, plate: plateToUse },
      });

      if (!existingV) {
        const vehicleParts = (resolvedVehicleText || '2023 Performance Vehicle').split(/\s+/);
        const year = parseInt(vehicleParts[0], 10) || new Date().getFullYear();
        const make = vehicleParts[1] || 'Apex';
        const model = vehicleParts.slice(2).join(' ') || 'Standard';

        existingV = await prisma.vehicle.create({
          data: {
            userId,
            name: resolvedVehicleText || `${year} ${make} ${model}`,
            make,
            model,
            year,
            plate: plateToUse,
            isPrimary: true,
          },
        });
      }
      resolvedVehicleId = existingV.id;
      resolvedPlate = existingV.plate;
      resolvedVehicleText = existingV.name || `${existingV.year} ${existingV.make} ${existingV.model}`;
    }

    // 2. Resolve Service Title & Details
    let resolvedTitle = serviceTitle || 'Comprehensive Performance Service';
    let resolvedDetail = serviceDetail || 'ApexDrive Multi-Point Inspection & Fluid Service';
    let resolvedServicesList = [];
    let calculatedCost = parseFloat(totalCost || totalPrice || 0.0);

    const rawServices = serviceItems || selectedServices;
    if (Array.isArray(rawServices) && rawServices.length > 0) {
      if (typeof rawServices[0] === 'string') {
        const found = await prisma.service.findMany({
          where: {
            OR: [
              { serviceCode: { in: rawServices } },
              { id: { in: rawServices } },
            ],
          },
        });
        if (found.length > 0) {
          resolvedTitle = found.map((s) => s.title).join(' & ');
          resolvedDetail = found[0].description || found[0].subtitle || resolvedDetail;
          resolvedServicesList = found.map((s) => ({
            id: s.serviceCode,
            title: s.title,
            price: s.price,
            duration: s.duration,
          }));
          if (calculatedCost <= 0) {
            calculatedCost = found.reduce((acc, s) => acc + s.price, 0);
          }
        }
      } else {
        resolvedServicesList = rawServices;
        if (!serviceTitle && rawServices[0].title) {
          resolvedTitle = rawServices.map((s) => s.title).join(' & ');
        }
      }
    }

    // 3. Resolve Date and Time
    let resolvedDate = scheduledDate;
    if (!resolvedDate) {
      if (selectedDay && currentMonth) {
        resolvedDate = `${currentMonth.substring(0, 3).toUpperCase()} ${String(selectedDay).padStart(2, '0')}, ${currentYear || 2025}`;
      } else {
        const today = new Date();
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        resolvedDate = `${months[today.getMonth()]} ${String(today.getDate()).padStart(2, '0')}, ${today.getFullYear()}`;
      }
    }

    let resolvedTime = scheduledTime || selectedSlot || '10:00 AM';

    // 4. Generate Unique Booking Ref
    let bookingRef;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      attempts++;
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      bookingRef = `#APX-${randomDigits}`;
      const exists = await prisma.booking.findUnique({ where: { bookingRef } });
      if (!exists) {
        isUnique = true;
      }
    }

    // 5. Create Booking
    const newBooking = await prisma.booking.create({
      data: {
        bookingRef,
        userId,
        vehicleId: resolvedVehicleId,
        customerName: resolvedCustomerName,
        customerPhone: resolvedCustomerPhone,
        vehicleText: resolvedVehicleText || 'Standard Performance Vehicle',
        plate: resolvedPlate || 'CA 8XYZ901',
        serviceTitle: resolvedTitle,
        serviceDetail: resolvedDetail,
        servicesList: JSON.stringify(resolvedServicesList),
        scheduledDate: resolvedDate,
        scheduledTime: resolvedTime,
        hub: hub || 'Apex Central Precision Hub',
        bay: 'Bay 3 (Standby Reserved)',
        technician: 'Dave Miller',
        totalCost: calculatedCost || 89.0,
        status: 'Confirmed',
        notes: notes || null,
      },
      include: {
        vehicle: true,
        user: {
          select: { id: true, name: true, email: true, phone: true, tier: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: `Booking ${bookingRef} scheduled successfully!`,
      booking: formatBooking(newBooking),
      token: guestToken,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        role: targetUser.role,
      },
    });
  } catch (error) {
    console.error(`[createBooking Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get customer's booking history
 * @route   GET /api/bookings/my
 * @access  Public / Private (Customer & Admin)
 */
const getMyBookings = async (req, res) => {
  try {
    const { status, hub, search, guestRefs, phone, email } = req.query;

    let whereClause = {};

    if (req.user) {
      const refList = guestRefs
        ? guestRefs
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean)
            .flatMap((r) => [r, r.startsWith('#') ? r.slice(1) : `#${r}`])
        : [];

      whereClause = {
        OR: [
          { userId: req.user.id },
          ...(req.user.email ? [{ user: { email: req.user.email.trim().toLowerCase() } }] : []),
          ...(req.user.phone ? [{ customerPhone: req.user.phone.trim() }] : []),
          ...(refList.length > 0
            ? [
                { bookingRef: { in: refList } },
                { id: { in: refList } },
              ]
            : []),
        ],
      };
    } else if (guestRefs) {
      const refList = guestRefs
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)
        .flatMap((r) => [r, r.startsWith('#') ? r.slice(1) : `#${r}`]);

      whereClause = {
        OR: [
          { bookingRef: { in: refList } },
          { id: { in: refList } },
          ...(email ? [{ user: { email: email.trim().toLowerCase() } }] : []),
          ...(phone ? [{ customerPhone: phone.trim() }] : []),
        ],
      };
    } else if (email || phone) {
      whereClause = {
        OR: [
          ...(email ? [{ user: { email: email.trim().toLowerCase() } }] : []),
          ...(phone ? [{ customerPhone: phone.trim() }] : []),
        ],
      };
    } else {
      whereClause = {};
    }

    let allBookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        vehicle: true,
        user: {
          select: { id: true, name: true, email: true, phone: true, tier: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: req.user ? undefined : 25,
    });

    // If an administrator user visits My Bookings and has no personal customer bookings,
    // display all active workshop bookings so the preview is populated with live telemetry.
    if (req.user?.role === 'admin' && allBookings.length === 0) {
      allBookings = await prisma.booking.findMany({
        include: {
          vehicle: true,
          user: {
            select: { id: true, name: true, email: true, phone: true, tier: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 25,
      });
    }

    const formattedAll = allBookings.map(formatBooking);

    // Compute stats
    const activeCount = formattedAll.filter((b) => b.statusGroup === 'active').length;
    const upcomingCount = formattedAll.filter((b) => b.statusGroup === 'upcoming').length;
    const completedCount = formattedAll.filter((b) => b.statusGroup === 'completed').length;
    const cancelledCount = formattedAll.filter((b) => b.statusGroup === 'cancelled').length;
    const totalCount = formattedAll.length;

    // Filter by tab status
    let filtered = formattedAll;
    if (status) {
      const s = status.toLowerCase();
      if (s === 'active') {
        filtered = filtered.filter((b) => b.statusGroup === 'active');
      } else if (s === 'upcoming') {
        filtered = filtered.filter((b) => b.statusGroup === 'upcoming');
      } else if (s === 'completed') {
        filtered = filtered.filter((b) => b.statusGroup === 'completed');
      } else if (s === 'cancelled') {
        filtered = filtered.filter((b) => b.statusGroup === 'cancelled');
      }
    }

    // Filter by hub
    if (hub && hub !== 'All') {
      filtered = filtered.filter((b) => b.hub === hub);
    }

    // Filter by search
    if (search && search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.serviceTitle.toLowerCase().includes(q) ||
          b.vehicle.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      stats: {
        activeCount,
        upcomingCount,
        completedCount,
        cancelledCount,
        totalCount,
      },
      bookings: filtered,
    });
  } catch (error) {
    console.error(`[getMyBookings Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single booking details and telemetry
 * @route   GET /api/bookings/:id
 * @access  Private
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.replace(/^#/, '');

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { bookingRef: `#${cleanId}` },
          { bookingRef: cleanId },
        ],
      },
      include: {
        vehicle: true,
        user: {
          select: { id: true, name: true, email: true, phone: true, tier: true },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking #${cleanId} not found in database.`,
      });
    }

    // Authorization check
    if (req.user && req.user.role !== 'admin' && booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking.',
      });
    }

    res.status(200).json({
      success: true,
      booking: formatBooking(booking),
    });
  } catch (error) {
    console.error(`[getBookingById Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Cancel an upcoming booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private (Customer & Admin)
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const cleanId = id.replace(/^#/, '');

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { bookingRef: `#${cleanId}` },
          { bookingRef: cleanId },
        ],
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (req.user && req.user.role !== 'admin' && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (booking.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed bookings cannot be cancelled.',
      });
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'Cancelled',
        cancellationReason: reason || 'Customer requested appointment cancellation.',
      },
      include: { vehicle: true, user: true },
    });

    res.status(200).json({
      success: true,
      message: `Booking ${updated.bookingRef} cancelled successfully.`,
      booking: formatBooking(updated),
    });
  } catch (error) {
    console.error(`[cancelBooking Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reschedule a booking to new date & time slot
 * @route   PUT /api/bookings/:id/reschedule
 * @access  Private (Customer & Admin)
 */
const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledDate, scheduledTime, hub, notes } = req.body;
    const cleanId = id.replace(/^#/, '');

    if (!scheduledDate && !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide scheduledDate or scheduledTime to reschedule.',
      });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { bookingRef: `#${cleanId}` },
          { bookingRef: cleanId },
        ],
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (req.user && req.user.role !== 'admin' && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (booking.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed service appointments cannot be rescheduled.',
      });
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        scheduledDate: scheduledDate || booking.scheduledDate,
        scheduledTime: scheduledTime || booking.scheduledTime,
        hub: hub || booking.hub,
        notes: notes !== undefined ? notes : booking.notes,
        status: booking.status === 'Cancelled' ? 'Confirmed' : booking.status,
      },
      include: { vehicle: true, user: true },
    });

    res.status(200).json({
      success: true,
      message: `Booking ${updated.bookingRef} successfully rescheduled to ${updated.scheduledDate} at ${updated.scheduledTime}.`,
      booking: formatBooking(updated),
    });
  } catch (error) {
    console.error(`[rescheduleBooking Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// ADMIN WORKSHOP ENDPOINTS (For AdminBookingsPage.js)
// =========================================================================

/**
 * @desc    Get all workshop bookings with search, status, bay, and category filters
 * @route   GET /api/admin/bookings
 * @access  Private (Admin Only)
 */
const getAdminBookings = async (req, res) => {
  try {
    const { status, bay, category, search, date, page = 1, limit = 50 } = req.query;

    const allBookings = await prisma.booking.findMany({
      include: {
        vehicle: true,
        user: {
          select: { id: true, name: true, email: true, phone: true, tier: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let formatted = allBookings.map(formatBooking);

    // Filter by Status
    if (status && status !== 'All') {
      formatted = formatted.filter(
        (b) => b.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Filter by Bay
    if (bay && bay !== 'All') {
      formatted = formatted.filter((b) => b.bay && b.bay.includes(bay));
    }

    // Filter by Category or Title
    if (category && category !== 'All') {
      formatted = formatted.filter(
        (b) => b.serviceTitle && b.serviceTitle.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by Search Query
    if (search && search.trim()) {
      const q = search.toLowerCase();
      formatted = formatted.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.customer.toLowerCase().includes(q) ||
          b.vehicle.toLowerCase().includes(q) ||
          b.serviceTitle.toLowerCase().includes(q) ||
          b.technician.toLowerCase().includes(q) ||
          b.plate.toLowerCase().includes(q)
      );
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = formatted.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      count: paginated.length,
      total: formatted.length,
      page: pageNum,
      totalPages: Math.ceil(formatted.length / limitNum) || 1,
      bookings: paginated,
    });
  } catch (error) {
    console.error(`[getAdminBookings Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update booking status (Pending, Confirmed, In-Bay, Completed, Cancelled)
 * @route   PUT /api/admin/bookings/:id/status
 * @access  Private (Admin Only)
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const cleanId = id.replace(/^#/, '');

    const validStatuses = ['Pending', 'Confirmed', 'In-Bay', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { bookingRef: `#${cleanId}` },
          { bookingRef: cleanId },
        ],
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Sync vehicle.inBay
    if (booking.vehicleId) {
      await prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: { inBay: status === 'In-Bay' },
      });
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status },
      include: { vehicle: true, user: true },
    });

    res.status(200).json({
      success: true,
      message: `Booking ${updated.bookingRef} status updated to ${status}.`,
      booking: formatBooking(updated),
    });
  } catch (error) {
    console.error(`[updateBookingStatus Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Assign technician and service bay
 * @route   PUT /api/admin/bookings/:id/assign
 * @access  Private (Admin Only)
 */
const assignTechnicianAndBay = async (req, res) => {
  try {
    const { id } = req.params;
    const { technician, bay, technicianId } = req.body;
    const cleanId = id.replace(/^#/, '');

    if (!technician && !bay) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either technician or bay to assign.',
      });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { bookingRef: `#${cleanId}` },
          { bookingRef: cleanId },
        ],
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // If technician name passed, check if matching staff exists
    let resolvedTechId = technicianId || null;
    let resolvedTechName = technician || booking.technician;
    if (technician) {
      const staffMember = await prisma.staff.findFirst({
        where: { name: { contains: technician } },
      });
      if (staffMember) {
        resolvedTechId = staffMember.id;
        resolvedTechName = staffMember.name;
      }
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        technician: resolvedTechName,
        technicianId: resolvedTechId,
        bay: bay || booking.bay,
      },
      include: { vehicle: true, user: true },
    });

    res.status(200).json({
      success: true,
      message: `Technician ${updated.technician} & ${updated.bay} assigned to Booking ${updated.bookingRef}.`,
      booking: formatBooking(updated),
    });
  } catch (error) {
    console.error(`[assignTechnicianAndBay Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Manual walk-in / phone intake booking creation by admin
 * @route   POST /api/admin/bookings
 * @access  Private (Admin Only)
 */
const createAdminBooking = async (req, res) => {
  try {
    const {
      customer,
      customerName,
      phone,
      customerPhone,
      vehicle,
      vehicleText,
      plate,
      serviceTitle,
      serviceDetail,
      time,
      scheduledTime,
      date,
      scheduledDate,
      bay,
      technician,
      totalCost,
      notes,
      status = 'Confirmed',
    } = req.body;

    const resolvedCustomer = customer || customerName || 'Walk-in Customer';
    const resolvedVehicle = vehicle || vehicleText || '2024 Performance Vehicle';
    const resolvedPlate = plate || 'CA 999ZZ';

    // Link to existing customer or current admin user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { name: resolvedCustomer },
          phone ? { phone } : { id: 'none' },
        ],
      },
    });

    if (!user) {
      user = req.user || (await prisma.user.findFirst({ where: { role: 'admin' } })) || (await prisma.user.findFirst());
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Could not associate an account for this booking intake.',
      });
    }

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = `#APX-${randomDigits}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingRef,
        userId: user.id,
        customerName: resolvedCustomer,
        customerPhone: phone || customerPhone || null,
        vehicleText: resolvedVehicle,
        plate: resolvedPlate,
        serviceTitle: serviceTitle || 'Periodic Maintenance & Synthetic Oil',
        serviceDetail: serviceDetail || 'Scheduled Standard Intake Protocol',
        scheduledDate: date || scheduledDate || 'OCT 24, 2025',
        scheduledTime: time || scheduledTime || 'Today, 04:30 PM',
        bay: bay || 'Bay 3 (Lift Heavy)',
        technician: technician || 'Dave Miller',
        totalCost: parseFloat(totalCost || 149.0),
        status: status || 'Confirmed',
        notes: notes || 'Manual administrative intake registration.',
      },
      include: { vehicle: true, user: true },
    });

    res.status(201).json({
      success: true,
      message: `Booking #${newBooking.bookingRef} scheduled successfully!`,
      booking: formatBooking(newBooking),
    });
  } catch (error) {
    console.error(`[createAdminBooking Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get booking metrics for admin dashboard & statistics
 * @route   GET /api/admin/bookings/metrics
 * @access  Private (Admin Only)
 */
const getBookingMetrics = async (req, res) => {
  try {
    const all = await prisma.booking.findMany();

    const totalBookings = all.length;
    const pendingConfirmation = all.filter((b) => b.status === 'Pending').length;
    const todaysInBay = all.filter((b) => b.status === 'In-Bay').length;
    const completedToday = all.filter((b) => b.status === 'Completed').length;
    const confirmedCount = all.filter((b) => b.status === 'Confirmed').length;
    const cancelledCount = all.filter((b) => b.status === 'Cancelled').length;

    const totalRevenue = all.reduce((sum, b) => sum + (b.totalCost || 0), 0);
    const completedRevenue = all
      .filter((b) => b.status === 'Completed')
      .reduce((sum, b) => sum + (b.totalCost || 0), 0);

    const bayUtilization = Math.min(100, Math.round((todaysInBay / 6) * 100));

    res.status(200).json({
      success: true,
      metrics: {
        totalBookings,
        totalBookingsFormatted: totalBookings.toLocaleString(),
        pendingConfirmation,
        todaysInBay,
        completedToday,
        confirmedCount,
        cancelledCount,
        totalRevenue: Math.round(totalRevenue),
        grossInvoiced: `LKR ${Math.round(completedRevenue || totalRevenue).toLocaleString()}`,
        bayUtilizationRate: `${bayUtilization}%`,
        activeBayCount: todaysInBay,
        totalBayCount: 6,
        averageServicePace: '1h 18m',
      },
    });
  } catch (error) {
    console.error(`[getBookingMetrics Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  ensureBookingsSeeded,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  rescheduleBooking,
  getAdminBookings,
  updateBookingStatus,
  assignTechnicianAndBay,
  createAdminBooking,
  getBookingMetrics,
};
