const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { formatUserResponse } = require('./userController');

// Specialized helper to format rich customer response for admin dashboard
const formatCustomerDetailed = (user) => {
  const nameParts = (user.name || '').trim().split(' ');
  const firstName = user.firstName || nameParts[0] || 'Customer';
  const lastName = user.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
  const initials = ((firstName[0] || '') + (lastName[0] || firstName[1] || '')).toUpperCase() || 'CU';

  // Deterministic avatar background
  const avatarColors = [
    'avatar-blue',
    'avatar-purple',
    'avatar-emerald',
    'avatar-amber',
    'avatar-pink',
    'avatar-indigo',
    'avatar-slate',
  ];
  const charCodeSum = (user.id || initials).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const avatarBg = user.avatar || avatarColors[charCodeSum % avatarColors.length];

  // Badges
  const tier = user.tier || 'Standard';
  const tierBadgeClass =
    tier === 'VIP Platinum'
      ? 'badge-tier-vip'
      : tier === 'Corporate Fleet'
      ? 'badge-tier-fleet'
      : tier === 'Gold Member'
      ? 'badge-tier-gold'
      : 'badge-tier-standard';

  // Check if any vehicle is in bay, or if user status is In-Bay
  const hasVehicleInBay = user.vehicles && user.vehicles.some((v) => v.inBay);
  const status = hasVehicleInBay ? 'In-Bay' : (user.status || 'Active');
  const statusBadgeClass =
    status === 'In-Bay'
      ? 'status-inbay'
      : status === 'Active'
      ? 'status-active'
      : 'status-inactive';

  // Bookings / Service history ledger
  const bookings = user.bookings || [];
  const completedBookings = bookings.filter((b) => b.status === 'Completed');
  const lifetimeSpend = completedBookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);
  const totalVisits = bookings.length;

  // Last visit / last service summary
  let lastVisit = 'New Account • No Services Yet';
  if (bookings.length > 0) {
    const latest = bookings[0]; // ordered by createdAt desc
    lastVisit = `${latest.scheduledDate || 'Recent'} • ${latest.serviceTitle || 'Scheduled Service'}`;
  } else if (user.vehicles && user.vehicles.length > 0 && user.vehicles[0].lastService) {
    lastVisit = user.vehicles[0].lastService;
  }

  // Format memberSince (e.g. "March 2022")
  const createdDate = new Date(user.createdAt);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const memberSince = `${monthNames[createdDate.getMonth()]} ${createdDate.getFullYear()}`;

  // Formatted vehicles list
  const formattedVehicles = (user.vehicles || []).map((v) => ({
    id: v.id,
    _id: v.id,
    make: v.make,
    model: v.model,
    year: v.year,
    name: v.name || `${v.year} ${v.make} ${v.model}`,
    plate: v.plate,
    license: v.plate,
    vin: v.vin || 'VIN-ON-FILE',
    mileage: v.mileage || '0 mi',
    odometer: v.mileage || '0 mi',
    color: v.color || 'Factory Spec',
    inBay: Boolean(v.inBay),
    isPrimary: Boolean(v.isPrimary),
    lastService: v.lastService || 'Scheduled Inspection',
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  }));

  // Formatted service history
  const formattedServiceHistory = bookings.map((b) => ({
    id: b.id,
    ref: b.bookingRef || `#APX-${b.id.slice(0, 5).toUpperCase()}`,
    vehicle: b.vehicle ? `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}` : (b.serviceTitle || 'Customer Vehicle'),
    service: b.serviceTitle,
    date: b.scheduledDate,
    time: b.scheduledTime,
    tech: b.technician || 'Dave Miller',
    bay: b.bay || 'General Service Bay',
    cost: b.totalCost,
    status: b.status,
    notes: b.notes,
    createdAt: b.createdAt,
  }));

  return {
    id: user.id,
    _id: user.id,
    customId: `CUST-${user.id.slice(0, 4).toUpperCase()}`,
    firstName,
    lastName,
    name: user.name || `${firstName} ${lastName}`.trim(),
    initials,
    avatarBg,
    email: user.email,
    phone: user.phone || '+1 (555) 000-0000',
    city: user.city || 'San Francisco, CA',
    state: user.state || 'CA',
    address: user.address || 'Confidential Residence',
    zip: user.zip || '',
    memberSince,
    tier,
    tierBadgeClass,
    status,
    statusBadgeClass,
    lifetimeSpend: parseFloat(lifetimeSpend.toFixed(2)),
    totalVisits,
    lastVisit,
    notes: user.notes || '',
    department: user.department || '',
    role: user.role,
    vehicles: formattedVehicles,
    serviceHistory: formattedServiceHistory,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: user.lastLogin,
  };
};

// @desc    Get all customers with multi-field search, filtering, and sorting (Admin only)
// @route   GET /api/admin/users or GET /api/admin/customers
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const {
      search,
      role = 'customer',
      tier,
      status,
      page = 1,
      limit = 50,
      sortBy = 'recent',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    // Build filter where clause
    const where = {};

    if (role && role !== 'all') {
      where.role = role.toLowerCase();
    }

    if (tier && tier !== 'all' && tier !== 'All') {
      where.tier = tier;
    }

    if (status && status !== 'all' && status !== 'All') {
      if (status === 'In-Bay') {
        where.vehicles = {
          some: { inBay: true },
        };
      } else {
        where.status = status;
      }
    }

    if (search) {
      const s = search.trim();
      where.OR = [
        { name: { contains: s } },
        { firstName: { contains: s } },
        { lastName: { contains: s } },
        { email: { contains: s } },
        { phone: { contains: s } },
        { city: { contains: s } },
        { address: { contains: s } },
        { notes: { contains: s } },
        {
          vehicles: {
            some: {
              OR: [
                { make: { contains: s } },
                { model: { contains: s } },
                { plate: { contains: s } },
                { vin: { contains: s } },
              ],
            },
          },
        },
      ];
    }

    // Determine sort
    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'name') {
      orderBy = { name: sortOrder === 'desc' ? 'desc' : 'asc' };
    } else if (sortBy === 'tier') {
      orderBy = { tier: sortOrder === 'desc' ? 'desc' : 'asc' };
    } else if (sortBy === 'status') {
      orderBy = { status: sortOrder === 'desc' ? 'desc' : 'asc' };
    } else if (sortBy === 'recent') {
      orderBy = { createdAt: 'desc' };
    }

    const [totalUsers, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          vehicles: {
            orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
          },
          bookings: {
            orderBy: { createdAt: 'desc' },
            include: {
              vehicle: true,
            },
          },
        },
      }),
    ]);

    let formattedCustomers = users.map(formatCustomerDetailed);

    // Apply secondary in-memory sort if requested (spend or vehicle count)
    if (sortBy === 'spend') {
      formattedCustomers.sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
    } else if (sortBy === 'vehicles') {
      formattedCustomers.sort((a, b) => b.vehicles.length - a.vehicles.length);
    } else if (sortBy === 'visits') {
      formattedCustomers.sort((a, b) => b.totalVisits - a.totalVisits);
    }

    res.status(200).json({
      success: true,
      pagination: {
        total: totalUsers,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalUsers / limitNum) || 1,
      },
      customers: formattedCustomers,
      users: formattedCustomers, // Backward compatibility
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer by ID with full vehicles and service history (Admin only)
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        vehicles: {
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
        },
        bookings: {
          orderBy: { createdAt: 'desc' },
          include: {
            vehicle: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer account not found.',
      });
    }

    const formattedCustomer = formatCustomerDetailed(user);

    res.status(200).json({
      success: true,
      customer: formattedCustomer,
      user: formattedCustomer, // Backward compatibility
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new customer account by Admin (with optional vehicle intake)
// @route   POST /api/admin/users
// @access  Private (Admin only)
const createUserByAdmin = async (req, res, next) => {
  try {
    const {
      name,
      firstName,
      lastName,
      email,
      password,
      phone,
      city,
      state,
      address,
      zip,
      role = 'customer',
      tier = 'Standard',
      status = 'Active',
      notes,
      department,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehiclePlate,
      vehicleVin,
      vehicleMileage,
      vehicleColor,
    } = req.body;

    const resolvedEmail = (email || '').trim().toLowerCase();
    if (!resolvedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid customer email address.',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: resolvedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A customer account with this email address already exists.',
      });
    }

    const resFirstName = (firstName || '').trim();
    const resLastName = (lastName || '').trim();
    let finalName = (name || '').trim();
    if (!finalName && (resFirstName || resLastName)) {
      finalName = `${resFirstName} ${resLastName}`.trim();
    }
    if (!finalName) finalName = resolvedEmail.split('@')[0];

    const initialPassword = password || 'Customer2026!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(initialPassword, salt);

    // Initial vehicle creation if provided
    const vehicleCreateData = [];
    if (vehicleMake && vehicleMake.trim()) {
      const vMake = vehicleMake.trim();
      const vModel = (vehicleModel || 'Standard').trim();
      const vYear = parseInt(vehicleYear, 10) || new Date().getFullYear();
      const vPlate = (vehiclePlate || 'TEMP-REG').trim().toUpperCase();
      const vVin = (vehicleVin || 'PENDING-VERIFICATION').trim().toUpperCase();

      vehicleCreateData.push({
        name: `${vYear} ${vMake} ${vModel}`,
        make: vMake,
        model: vModel,
        year: vYear,
        plate: vPlate,
        vin: vVin,
        mileage: vehicleMileage ? vehicleMileage.trim() : '0 mi',
        color: vehicleColor ? vehicleColor.trim() : 'Factory Spec',
        isPrimary: true,
        inBay: false,
        lastService: 'Intake Inspection Pending',
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name: finalName,
        firstName: resFirstName || null,
        lastName: resLastName || null,
        email: resolvedEmail,
        password: hashedPassword,
        phone: phone ? phone.trim() : '+1 (555) 000-0000',
        city: city || 'San Francisco, CA',
        state: state || 'CA',
        address: address ? address.trim() : 'Confidential Residence',
        zip: zip ? zip.trim() : null,
        role: ['admin', 'technician', 'customer'].includes(role) ? role : 'customer',
        tier: tier || 'Standard',
        status: status || 'Active',
        notes: notes ? notes.trim() : 'Newly registered customer account.',
        department: department ? department.trim() : null,
        vehicles: {
          create: vehicleCreateData,
        },
      },
      include: {
        vehicles: true,
        bookings: true,
      },
    });

    const formattedCustomer = formatCustomerDetailed(newUser);

    res.status(201).json({
      success: true,
      message: `Customer ${formattedCustomer.name} created successfully.`,
      customer: formattedCustomer,
      user: formattedCustomer,
      defaultPasswordUsed: !password,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer account details, tier, status, notes by Admin
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
const updateUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Customer account not found.',
      });
    }

    const {
      name,
      firstName,
      lastName,
      email,
      phone,
      city,
      state,
      address,
      zip,
      role,
      tier,
      status,
      notes,
      department,
      newPassword,
    } = req.body;

    const updateData = {};

    let resolvedFirst = firstName !== undefined ? firstName.trim() : existingUser.firstName;
    let resolvedLast = lastName !== undefined ? lastName.trim() : existingUser.lastName;

    if (name) {
      updateData.name = name.trim();
    } else if (firstName !== undefined || lastName !== undefined) {
      updateData.name = `${resolvedFirst || ''} ${resolvedLast || ''}`.trim();
    }

    if (firstName !== undefined) updateData.firstName = resolvedFirst;
    if (lastName !== undefined) updateData.lastName = resolvedLast;

    if (email !== undefined) {
      const resolvedEmail = email.trim().toLowerCase();
      if (resolvedEmail !== existingUser.email) {
        const emailTaken = await prisma.user.findUnique({ where: { email: resolvedEmail } });
        if (emailTaken) {
          return res.status(400).json({
            success: false,
            message: 'Email address is already in use by another account.',
          });
        }
        updateData.email = resolvedEmail;
      }
    }

    if (phone !== undefined) updateData.phone = phone.trim();
    if (city !== undefined) updateData.city = city.trim();
    if (state !== undefined) updateData.state = state.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (zip !== undefined) updateData.zip = zip.trim();
    if (role !== undefined) updateData.role = role;
    if (tier !== undefined) updateData.tier = tier;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes.trim();
    if (department !== undefined) updateData.department = department.trim();

    if (newPassword && newPassword.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        vehicles: {
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
        },
        bookings: {
          orderBy: { createdAt: 'desc' },
          include: { vehicle: true },
        },
      },
    });

    const formattedCustomer = formatCustomerDetailed(updatedUser);

    res.status(200).json({
      success: true,
      message: 'Customer details updated successfully.',
      customer: formattedCustomer,
      user: formattedCustomer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer account by Admin
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own administrator account.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer account not found.',
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: `Customer profile for '${user.name}' has been archived and removed.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a vehicle directly to a customer's garage by Admin
// @route   POST /api/admin/users/:id/vehicles
// @access  Private (Admin only)
const addCustomerVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      make,
      model,
      year,
      plate,
      license,
      vin,
      mileage,
      color,
      isPrimary,
      inBay,
      lastService,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { vehicles: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer account not found.',
      });
    }

    const finalMake = (make || 'Vehicle').trim();
    const finalModel = (model || 'Standard').trim();
    const finalYear = parseInt(year, 10) || new Date().getFullYear();
    const finalPlate = (plate || license || 'TEMP-REG').trim().toUpperCase();
    const finalMileage = (mileage || '0 mi').trim();
    const finalVin = (vin || 'VIN-ON-FILE').trim().toUpperCase();

    const makePrimary = isPrimary === true || user.vehicles.length === 0;

    if (makePrimary && user.vehicles.length > 0) {
      await prisma.vehicle.updateMany({
        where: { userId: id },
        data: { isPrimary: false },
      });
    }

    const newVehicle = await prisma.vehicle.create({
      data: {
        userId: id,
        name: `${finalYear} ${finalMake} ${finalModel}`,
        make: finalMake,
        model: finalModel,
        year: finalYear,
        plate: finalPlate,
        vin: finalVin,
        mileage: finalMileage,
        color: color ? color.trim() : 'Factory Spec',
        isPrimary: makePrimary,
        inBay: Boolean(inBay),
        lastService: lastService ? lastService.trim() : 'Recently Added to Garage',
      },
    });

    // Fetch refreshed customer
    const refreshed = await prisma.user.findUnique({
      where: { id },
      include: {
        vehicles: { orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }] },
        bookings: { orderBy: { createdAt: 'desc' }, include: { vehicle: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: `Vehicle ${newVehicle.name} added to customer garage.`,
      vehicle: newVehicle,
      customer: formatCustomerDetailed(refreshed),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a customer's vehicle by Admin
// @route   PUT /api/admin/users/:id/vehicles/:vehicleId
// @access  Private (Admin only)
const updateCustomerVehicle = async (req, res, next) => {
  try {
    const { id, vehicleId } = req.params;
    const {
      make,
      model,
      year,
      plate,
      license,
      vin,
      mileage,
      color,
      isPrimary,
      inBay,
      lastService,
    } = req.body;

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, userId: id },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found for this customer.',
      });
    }

    const updateData = {};
    if (make !== undefined) updateData.make = make.trim();
    if (model !== undefined) updateData.model = model.trim();
    if (year !== undefined) updateData.year = parseInt(year, 10);
    if (plate !== undefined || license !== undefined) {
      updateData.plate = (plate || license).trim().toUpperCase();
    }
    if (vin !== undefined) updateData.vin = vin.trim().toUpperCase();
    if (mileage !== undefined) updateData.mileage = mileage.trim();
    if (color !== undefined) updateData.color = color.trim();
    if (inBay !== undefined) updateData.inBay = Boolean(inBay);
    if (lastService !== undefined) updateData.lastService = lastService.trim();

    if (make || model || year) {
      const vMake = make !== undefined ? make.trim() : vehicle.make;
      const vModel = model !== undefined ? model.trim() : vehicle.model;
      const vYear = year !== undefined ? parseInt(year, 10) : vehicle.year;
      updateData.name = `${vYear} ${vMake} ${vModel}`;
    }

    if (isPrimary === true) {
      await prisma.vehicle.updateMany({
        where: { userId: id },
        data: { isPrimary: false },
      });
      updateData.isPrimary = true;
    }

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle details updated successfully.',
      vehicle: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a customer's vehicle by Admin
// @route   DELETE /api/admin/users/:id/vehicles/:vehicleId
// @access  Private (Admin only)
const deleteCustomerVehicle = async (req, res, next) => {
  try {
    const { id, vehicleId } = req.params;

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, userId: id },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found for this customer.',
      });
    }

    await prisma.vehicle.delete({
      where: { id: vehicleId },
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle removed from customer garage.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer notes by Admin
// @route   PUT /api/admin/users/:id/notes
// @access  Private (Admin only)
const updateCustomerNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { notes: (notes || '').trim() },
    });

    res.status(200).json({
      success: true,
      message: 'Customer notes updated.',
      notes: updated.notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer status by Admin (Active, In-Bay, Inactive)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const updateCustomerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'In-Bay', 'Inactive', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Active, In-Bay, Inactive, or Pending.',
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: `Customer status updated to ${status}.`,
      status: updated.status,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer booking history / service ledger
// @route   GET /api/admin/users/:id/bookings
// @access  Private (Admin only)
const getCustomerBookings = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bookings = await prisma.booking.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: true,
      },
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add booking / service appointment for a customer by Admin
// @route   POST /api/admin/users/:id/bookings
// @access  Private (Admin only)
const addCustomerBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      serviceTitle,
      vehicleId,
      scheduledDate,
      scheduledTime,
      bay,
      technician,
      totalCost,
      status = 'Confirmed',
      notes,
    } = req.body;

    if (!serviceTitle || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide service title, scheduled date, and scheduled time.',
      });
    }

    const bookingRef = `#APX-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingRef,
        userId: id,
        vehicleId: vehicleId || null,
        serviceTitle: serviceTitle.trim(),
        scheduledDate: scheduledDate.trim(),
        scheduledTime: scheduledTime.trim(),
        bay: bay ? bay.trim() : 'Bay 1 (General Service)',
        technician: technician ? technician.trim() : 'Dave Miller',
        totalCost: parseFloat(totalCost) || 150.0,
        status: status || 'Confirmed',
        notes: notes ? notes.trim() : null,
      },
      include: {
        vehicle: true,
      },
    });

    res.status(201).json({
      success: true,
      message: `Service booking ${newBooking.bookingRef} created successfully.`,
      booking: newBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer aggregate metrics (Admin dashboard metrics)
// @route   GET /api/admin/users/metrics or GET /api/admin/customers/metrics
// @access  Private (Admin only)
const getUserMetrics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalAdmins,
      totalTechnicians,
      activeUsers,
      inBayUsers,
      vipCount,
      goldCount,
      standardCount,
      fleetCount,
      totalVehicles,
      inBayVehicles,
      totalBookings,
      aggregateRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({ where: { role: 'technician' } }),
      prisma.user.count({ where: { status: 'Active' } }),
      prisma.user.count({
        where: {
          role: 'customer',
          OR: [
            { status: 'In-Bay' },
            { vehicles: { some: { inBay: true } } },
          ],
        },
      }),
      prisma.user.count({ where: { role: 'customer', tier: 'VIP Platinum' } }),
      prisma.user.count({ where: { role: 'customer', tier: 'Gold Member' } }),
      prisma.user.count({ where: { role: 'customer', tier: 'Standard' } }),
      prisma.user.count({ where: { role: 'customer', tier: 'Corporate Fleet' } }),
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { inBay: true } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        where: { status: 'Completed' },
        _sum: { totalCost: true },
      }),
    ]);

    const totalRevenue = aggregateRevenue._sum.totalCost || 0;

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        totalCustomers,
        totalAdmins,
        totalTechnicians,
        activeUsers,
        inBayUsers,
        inBayVehicles,
        totalVehicles,
        totalBookings,
        lifetimeGrossRevenue: parseFloat(totalRevenue.toFixed(2)),
        tiers: {
          vipPlatinum: vipCount,
          goldMember: goldCount,
          standard: standardCount,
          corporateFleet: fleetCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  addCustomerVehicle,
  updateCustomerVehicle,
  deleteCustomerVehicle,
  updateCustomerNotes,
  updateCustomerStatus,
  getCustomerBookings,
  addCustomerBooking,
  getUserMetrics,
  formatCustomerDetailed,
};
