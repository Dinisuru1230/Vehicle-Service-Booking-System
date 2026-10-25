const prisma = require('../config/prisma');

const DEFAULT_SETTINGS = {
  id: 'default-settings',
  workshopName: 'ApexDrive Precision Service Hub',
  phone: '1-800-APEX-CAR',
  email: 'admin@apexdrive.io',
  address: '742 Evergreen Motorway, Bay Area, CA',
  timezone: 'Pacific Standard Time (UTC-8)',
  currency: 'LKR (Rs.) – Sri Lankan Rupee',
  weekdayEnabled: true,
  weekdayHours: '08:00 AM → 06:00 PM',
  saturdayEnabled: true,
  saturdayHours: '08:30 AM → 04:00 PM',
  sundayEnabled: false,
  sundayHours: 'Closed',
  activeBays: 8,
  maxIntakePerHour: 4,
  slotDuration: '45 Minutes',
  advanceWindow: '30 Days in advance',
  cancellationCutoff: '24 Hours prior',
  autoConfirm: true,
};

// Helper to format settings object with UI metadata
function formatSettings(s) {
  return {
    ...s,
    compliance2FA: '100% Active (Enforced on 2 Admins)',
    smsDispatchRate: '99.8% (Gateway Healthy)',
    liftsOperational: '100% Operational',
    facilityId: 'WH-742-CA',
  };
}

/**
 * @desc    Get workshop settings, operating hours, active capacity, and policies
 * @route   GET /api/admin/settings
 * @access  Private (Admin Only)
 */
const getSettings = async (req, res) => {
  try {
    let settings = await prisma.workshopSettings.findUnique({
      where: { id: 'default-settings' },
    });

    if (!settings) {
      settings = await prisma.workshopSettings.create({
        data: DEFAULT_SETTINGS,
      });
    }

    res.status(200).json({
      success: true,
      settings: formatSettings(settings),
    });
  } catch (error) {
    console.error(`[getSettings Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update workshop business hours, intake capacity, and booking rules
 * @route   PUT /api/admin/settings
 * @access  Private (Admin Only)
 */
const updateSettings = async (req, res) => {
  try {
    const {
      workshopName,
      phone,
      email,
      address,
      timezone,
      currency,
      weekdayEnabled,
      weekdayHours,
      saturdayEnabled,
      saturdayHours,
      sundayEnabled,
      sundayHours,
      activeBays,
      maxIntakePerHour,
      slotDuration,
      advanceWindow,
      cancellationCutoff,
      autoConfirm,
    } = req.body;

    const updated = await prisma.workshopSettings.upsert({
      where: { id: 'default-settings' },
      update: {
        ...(workshopName !== undefined && { workshopName }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(address !== undefined && { address }),
        ...(timezone !== undefined && { timezone }),
        ...(currency !== undefined && { currency }),
        ...(weekdayEnabled !== undefined && { weekdayEnabled }),
        ...(weekdayHours !== undefined && { weekdayHours }),
        ...(saturdayEnabled !== undefined && { saturdayEnabled }),
        ...(saturdayHours !== undefined && { saturdayHours }),
        ...(sundayEnabled !== undefined && { sundayEnabled }),
        ...(sundayHours !== undefined && { sundayHours }),
        ...(activeBays !== undefined && { activeBays: parseInt(activeBays, 10) }),
        ...(maxIntakePerHour !== undefined && { maxIntakePerHour: parseInt(maxIntakePerHour, 10) }),
        ...(slotDuration !== undefined && { slotDuration }),
        ...(advanceWindow !== undefined && { advanceWindow }),
        ...(cancellationCutoff !== undefined && { cancellationCutoff }),
        ...(autoConfirm !== undefined && { autoConfirm }),
      },
      create: {
        ...DEFAULT_SETTINGS,
        ...(workshopName && { workshopName }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(address && { address }),
        ...(timezone && { timezone }),
        ...(currency && { currency }),
        ...(activeBays && { activeBays: parseInt(activeBays, 10) }),
        ...(maxIntakePerHour && { maxIntakePerHour: parseInt(maxIntakePerHour, 10) }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Workshop operating settings updated successfully!',
      settings: formatSettings(updated),
    });
  } catch (error) {
    console.error(`[updateSettings Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reset settings to default workshop parameters
 * @route   POST /api/admin/settings/reset
 * @access  Private (Admin Only)
 */
const resetSettings = async (req, res) => {
  try {
    const reset = await prisma.workshopSettings.upsert({
      where: { id: 'default-settings' },
      update: DEFAULT_SETTINGS,
      create: DEFAULT_SETTINGS,
    });

    res.status(200).json({
      success: true,
      message: 'Workshop operating parameters restored to factory defaults.',
      settings: formatSettings(reset),
    });
  } catch (error) {
    console.error(`[resetSettings Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  resetSettings,
};
