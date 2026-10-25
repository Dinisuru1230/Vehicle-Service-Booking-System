const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Helper to generate signed JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET || 'apexdrive_super_secure_jwt_token_secret_key_2026_xyz982',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// @desc    Register a new user account (Prisma)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, fullName, email, password, phone, phoneNumber, city, address, role } = req.body;

    const resolvedName = (name || fullName || '').trim();
    const resolvedPhone = (phone || phoneNumber || '').trim();
    const resolvedEmail = (email || '').trim().toLowerCase();

    // 1. Validation
    if (!resolvedName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name.',
      });
    }

    if (!resolvedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // 2. Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email: resolvedEmail },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.',
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user in Prisma DB
    const assignedRole = role === 'admin' ? 'admin' : 'customer';
    const nameParts = resolvedName.split(' ');
    const firstName = req.body.firstName || nameParts[0] || '';
    const lastName = req.body.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');

    const user = await prisma.user.create({
      data: {
        name: resolvedName,
        firstName,
        lastName,
        email: resolvedEmail,
        password: hashedPassword,
        phone: resolvedPhone,
        city: city || 'San Francisco, CA',
        state: req.body.state || 'CA',
        address: address || '',
        zip: req.body.zip || '',
        role: assignedRole,
        tier: 'Standard',
        status: 'Active',
      },
      include: {
        vehicles: true,
      },
    });

    // 5. Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User account registered successfully.',
      token,
      user: {
        id: user.id,
        _id: user.id, // For backward compatibility
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        address: user.address,
        zip: user.zip,
        role: user.role,
        tier: user.tier,
        status: user.status,
        vehicles: user.vehicles,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & return JWT token (Prisma)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const resolvedEmail = (email || '').trim().toLowerCase();

    // 1. Validate fields
    if (!resolvedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password.',
      });
    }

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: resolvedEmail },
      include: {
        vehicles: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password. Please verify your credentials.',
      });
    }

    // 3. Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password. Please verify your credentials.',
      });
    }

    // 4. Check if account is active
    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact workshop administration.',
      });
    }

    // 5. Update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // 6. Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        address: user.address,
        role: user.role,
        tier: user.tier,
        status: user.status,
        vehicles: user.vehicles,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/profile
// @access  Private (Requires JWT)
const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        vehicles: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    const nameParts = (user.name || '').split(' ');
    const firstName = user.firstName || nameParts[0] || '';
    const lastName = user.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        firstName,
        lastName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state || 'CA',
        address: user.address,
        zip: user.zip || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
        role: user.role,
        tier: user.tier,
        status: user.status,
        twoFactorEnabled: user.twoFactorEnabled,
        smsReminders: user.smsReminders,
        emailStatus: user.emailStatus,
        promotions: user.promotions,
        vehicles: user.vehicles,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current authenticated user profile & credentials
// @route   PUT /api/auth/profile
// @access  Private (Requires JWT)
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    const updateData = {};

    if (req.body.name) updateData.name = req.body.name.trim();
    if (req.body.firstName) updateData.firstName = req.body.firstName.trim();
    if (req.body.lastName) updateData.lastName = req.body.lastName.trim();
    if (req.body.phone) updateData.phone = req.body.phone.trim();
    if (req.body.city) updateData.city = req.body.city.trim();
    if (req.body.state) updateData.state = req.body.state.trim();
    if (req.body.address) updateData.address = req.body.address.trim();
    if (req.body.zip) updateData.zip = req.body.zip.trim();
    if (req.body.bio) updateData.bio = req.body.bio.trim();
    if (req.body.avatar) updateData.avatar = req.body.avatar.trim();

    // Update password if requested
    if (req.body.newPassword) {
      if (req.body.currentPassword) {
        const isCurrentMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isCurrentMatch) {
          return res.status(400).json({
            success: false,
            message: 'Your current master password was incorrect.',
          });
        }
      }

      if (req.body.newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.newPassword, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      include: {
        vehicles: true,
      },
    });

    const token = generateToken(updatedUser);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      token,
      user: {
        id: updatedUser.id,
        _id: updatedUser.id,
        name: updatedUser.name,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        city: updatedUser.city,
        state: updatedUser.state,
        address: updatedUser.address,
        zip: updatedUser.zip,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        role: updatedUser.role,
        tier: updatedUser.tier,
        status: updatedUser.status,
        vehicles: updatedUser.vehicles,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed initial Admin and Customer accounts in Prisma
// @route   POST /api/auth/seed
// @access  Public
const seedDefaultAccounts = async (req, res, next) => {
  try {
    // 1. Super Admin: Marcus Vance
    const adminEmail = 'm.vance@apexdrive.io';
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!admin) {
      const adminPasswordHash = await bcrypt.hash('ApexAdmin2026!', 10);
      admin = await prisma.user.create({
        data: {
          name: 'Marcus Vance',
          email: adminEmail,
          password: adminPasswordHash,
          phone: '+1 (555) 234-8901',
          role: 'admin',
          city: 'San Francisco, CA',
          address: 'Bay Area Precision Hub #742',
          tier: 'VIP Platinum',
          status: 'Active',
        },
      });
      console.log('[Prisma Seed] Super Admin created: m.vance@apexdrive.io / ApexAdmin2026!');
    }

    // 2. Demo Customer: Alexander Wright
    const customerEmail = 'alexander@example.com';
    let customer = await prisma.user.findUnique({
      where: { email: customerEmail },
      include: { vehicles: true },
    });

    if (!customer) {
      const customerPasswordHash = await bcrypt.hash('Customer2026!', 10);
      customer = await prisma.user.create({
        data: {
          name: 'Alexander Wright',
          email: customerEmail,
          password: customerPasswordHash,
          phone: '+1 (555) 234-5678',
          role: 'customer',
          city: 'San Francisco, CA',
          address: '1420 Market St, Suite 400',
          tier: 'VIP Platinum',
          status: 'Active',
          vehicles: {
            create: [
              {
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
            ],
          },
        },
      });
      console.log('[Prisma Seed] Demo Customer created: alexander@example.com / Customer2026!');
    }

    res.status(200).json({
      success: true,
      message: 'Default user accounts seeded in Prisma database successfully.',
      accounts: [
        {
          role: 'admin',
          name: 'Marcus Vance',
          email: adminEmail,
          defaultPassword: 'ApexAdmin2026!',
        },
        {
          role: 'customer',
          name: 'Alexander Wright',
          email: customerEmail,
          defaultPassword: 'Customer2026!',
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  seedDefaultAccounts,
};
