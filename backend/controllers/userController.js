const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const generateToken = require('../utils/generateToken');

// Helper to format user response
const formatUserResponse = (user) => {
  const nameParts = (user.name || '').trim().split(' ');
  const firstName = user.firstName || nameParts[0] || '';
  const lastName = user.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');

  return {
    id: user.id,
    _id: user.id, // For backward compatibility
    name: user.name,
    firstName,
    lastName,
    email: user.email,
    phone: user.phone || '',
    city: user.city || 'San Francisco, CA',
    state: user.state || 'CA',
    address: user.address || '',
    zip: user.zip || '',
    avatar: user.avatar || '',
    bio: user.bio || '',
    department: user.department || '',
    notes: user.notes || '',
    role: user.role,
    tier: user.tier || 'Standard',
    status: user.status || 'Active',
    twoFactorEnabled: Boolean(user.twoFactorEnabled),
    smsReminders: user.smsReminders !== undefined ? Boolean(user.smsReminders) : true,
    emailStatus: user.emailStatus !== undefined ? Boolean(user.emailStatus) : true,
    promotions: user.promotions !== undefined ? Boolean(user.promotions) : false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: user.lastLogin,
  };
};

// @desc    Get authenticated user full account profile, garage & account stats
// @route   GET /api/user/profile
// @access  Private (JWT protected)
const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        vehicles: {
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'desc' },
          ],
        },
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account profile not found.',
      });
    }

    // Compute stats
    const totalVehicles = user.vehicles.length;
    const totalBookings = await prisma.booking.count({
      where: { userId: user.id },
    });

    const activeBookings = await prisma.booking.count({
      where: {
        userId: user.id,
        status: { in: ['Pending', 'Confirmed', 'In-Bay'] },
      },
    });

    const completedBookings = await prisma.booking.count({
      where: {
        userId: user.id,
        status: 'Completed',
      },
    });

    const aggregateSpend = await prisma.booking.aggregate({
      where: {
        userId: user.id,
        status: 'Completed',
      },
      _sum: {
        totalCost: true,
      },
    });

    const totalSpent = aggregateSpend._sum.totalCost || 0;

    const formattedUser = formatUserResponse(user);

    res.status(200).json({
      success: true,
      user: {
        ...formattedUser,
        stats: {
          totalVehicles,
          totalBookings,
          activeBookings,
          completedBookings,
          totalSpent: parseFloat(totalSpent.toFixed(2)),
        },
        vehicles: user.vehicles,
        recentBookings: user.bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update authenticated user account details
// @route   PUT /api/user/profile
// @access  Private (JWT protected)
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    const {
      name,
      firstName,
      lastName,
      phone,
      phoneNumber,
      city,
      state,
      address,
      zip,
      bio,
      avatar,
    } = req.body;

    const updateData = {};

    let resolvedFirstName = firstName !== undefined ? firstName.trim() : user.firstName;
    let resolvedLastName = lastName !== undefined ? lastName.trim() : user.lastName;

    if (name) {
      updateData.name = name.trim();
      const parts = updateData.name.split(' ');
      if (resolvedFirstName === undefined || resolvedFirstName === null) {
        resolvedFirstName = parts[0] || '';
      }
      if (resolvedLastName === undefined || resolvedLastName === null) {
        resolvedLastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
      }
    } else if (resolvedFirstName || resolvedLastName) {
      updateData.name = `${resolvedFirstName || ''} ${resolvedLastName || ''}`.trim();
    }

    if (resolvedFirstName !== undefined) updateData.firstName = resolvedFirstName;
    if (resolvedLastName !== undefined) updateData.lastName = resolvedLastName;

    const finalPhone = phone !== undefined ? phone : phoneNumber;
    if (finalPhone !== undefined) updateData.phone = finalPhone.trim();
    if (city !== undefined) updateData.city = city.trim();
    if (state !== undefined) updateData.state = state.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (zip !== undefined) updateData.zip = zip.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (avatar !== undefined) updateData.avatar = avatar.trim();

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      include: {
        vehicles: {
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'desc' },
          ],
        },
      },
    });

    const token = generateToken(updatedUser);

    res.status(200).json({
      success: true,
      message: 'Account profile details updated successfully.',
      token,
      user: {
        ...formatUserResponse(updatedUser),
        vehicles: updatedUser.vehicles,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change authenticated user account password
// @route   PUT /api/user/password
// @access  Private (JWT protected)
const changeUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your current password.',
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation password do not match.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'The current password you provided is incorrect.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. Your account is secured.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update authenticated user account preferences (Notifications & 2FA)
// @route   PUT /api/user/preferences
// @access  Private (JWT protected)
const updateUserPreferences = async (req, res, next) => {
  try {
    const { smsReminders, emailStatus, promotions, twoFactorEnabled } = req.body;

    const updateData = {};
    if (smsReminders !== undefined) updateData.smsReminders = Boolean(smsReminders);
    if (emailStatus !== undefined) updateData.emailStatus = Boolean(emailStatus);
    if (promotions !== undefined) updateData.promotions = Boolean(promotions);
    if (twoFactorEnabled !== undefined) updateData.twoFactorEnabled = Boolean(twoFactorEnabled);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Account preferences updated successfully.',
      preferences: {
        smsReminders: updatedUser.smsReminders,
        emailStatus: updatedUser.emailStatus,
        promotions: updatedUser.promotions,
        twoFactorEnabled: updatedUser.twoFactorEnabled,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get User Account Dashboard Overview
// @route   GET /api/user/dashboard
// @access  Private (JWT protected)
const getUserDashboard = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        vehicles: {
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
        },
        bookings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    const upcomingBookings = user.bookings.filter(b => ['Pending', 'Confirmed', 'In-Bay'].includes(b.status));
    const completedBookings = user.bookings.filter(b => b.status === 'Completed');
    const totalSpent = completedBookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);

    const tierPerks = {
      Standard: ['Complimentary 21-point visual inspection', 'Digital service history archive'],
      'Gold Member': ['5% discount on labor & parts', 'Priority hydraulic bay allocation', 'Complimentary loaner vehicle'],
      'VIP Platinum': ['15% discount across all services', 'Designated Master Technician', 'Express trackside concierge & towing', 'Free annual corner balancing'],
      'Corporate Fleet': ['Dedicated fleet account manager', 'Volume pricing tier', '24/7 mobile field repair'],
    };

    res.status(200).json({
      success: true,
      dashboard: {
        user: formatUserResponse(user),
        metrics: {
          garageCount: user.vehicles.length,
          upcomingCount: upcomingBookings.length,
          completedCount: completedBookings.length,
          lifetimeSpend: parseFloat(totalSpent.toFixed(2)),
        },
        tierBenefits: tierPerks[user.tier] || tierPerks['Standard'],
        primaryVehicle: user.vehicles.find(v => v.isPrimary) || user.vehicles[0] || null,
        upcomingBookings: upcomingBookings.slice(0, 3),
        recentActivity: user.bookings.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or deactivate user account
// @route   DELETE /api/user/account
// @access  Private (JWT protected)
const deleteUserAccount = async (req, res, next) => {
  try {
    const { confirmDelete } = req.body;

    if (!confirmDelete) {
      return res.status(400).json({
        success: false,
        message: 'Please confirm account deletion by passing { confirmDelete: true }.',
      });
    }

    // Cascade delete user and associated vehicles / bookings
    await prisma.user.delete({
      where: { id: req.user.id },
    });

    res.status(200).json({
      success: true,
      message: 'User account and associated data have been permanently removed.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  updateUserPreferences,
  getUserDashboard,
  deleteUserAccount,
  formatUserResponse,
};
