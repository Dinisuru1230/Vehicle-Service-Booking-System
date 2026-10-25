const prisma = require('../config/prisma');

// Helper to format vehicle response
const formatVehicle = (vehicle) => {
  const displayName = vehicle.name || `${vehicle.year} ${vehicle.make} ${vehicle.model}`.trim();

  return {
    id: vehicle.id,
    _id: vehicle.id,
    userId: vehicle.userId,
    name: displayName,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    plate: vehicle.plate,
    license: vehicle.plate, // alias for frontend compatibility
    vin: vehicle.vin || '',
    mileage: vehicle.mileage || '',
    odometer: vehicle.mileage || '', // alias for frontend compatibility
    color: vehicle.color || '',
    isPrimary: Boolean(vehicle.isPrimary),
    inBay: Boolean(vehicle.inBay),
    lastService: vehicle.lastService || '',
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
  };
};

// @desc    Get all vehicles in user garage
// @route   GET /api/user/vehicles
// @access  Private (JWT protected)
const getUserVehicles = async (req, res, next) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { userId: req.user.id },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles: vehicles.map(formatVehicle),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new vehicle to user garage
// @route   POST /api/user/vehicles
// @access  Private (JWT protected)
const addVehicle = async (req, res, next) => {
  try {
    const {
      name,
      make,
      model,
      year,
      plate,
      license,
      vin,
      mileage,
      odometer,
      color,
      isPrimary,
      lastService,
    } = req.body;

    const resolvedPlate = (plate || license || '').trim().toUpperCase();
    const resolvedMileage = (mileage || odometer || '').trim();

    // Check existing count
    const existingCount = await prisma.vehicle.count({
      where: { userId: req.user.id },
    });

    // Determine make and model if user only provided name (e.g. "2023 BMW M3 Competition")
    let finalMake = (make || '').trim();
    let finalModel = (model || '').trim();
    let finalYear = parseInt(year, 10);

    if ((!finalMake || !finalModel) && name) {
      const parts = name.trim().split(' ');
      if (!isNaN(parseInt(parts[0], 10))) {
        finalYear = finalYear || parseInt(parts[0], 10);
        finalMake = finalMake || parts[1] || 'Vehicle';
        finalModel = finalModel || parts.slice(2).join(' ') || 'Standard';
      } else {
        finalMake = finalMake || parts[0] || 'Vehicle';
        finalModel = finalModel || parts.slice(1).join(' ') || 'Standard';
      }
    }

    if (!finalMake) finalMake = 'Unknown Make';
    if (!finalModel) finalModel = 'Unknown Model';
    if (!finalYear || isNaN(finalYear)) finalYear = new Date().getFullYear();

    const formattedName = name
      ? name.trim()
      : `${finalYear} ${finalMake} ${finalModel}`.trim();

    const makePrimary = isPrimary === true || existingCount === 0;

    // If making this primary, remove primary status from existing user vehicles
    if (makePrimary && existingCount > 0) {
      await prisma.vehicle.updateMany({
        where: { userId: req.user.id },
        data: { isPrimary: false },
      });
    }

    const newVehicle = await prisma.vehicle.create({
      data: {
        userId: req.user.id,
        name: formattedName,
        make: finalMake,
        model: finalModel,
        year: finalYear,
        plate: resolvedPlate || 'N/A',
        vin: vin ? vin.trim().toUpperCase() : null,
        mileage: resolvedMileage || '0 mi',
        color: color ? color.trim() : 'Factory Spec',
        isPrimary: makePrimary,
        lastService: lastService ? lastService.trim() : null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added to your garage successfully.',
      vehicle: formatVehicle(newVehicle),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle details
// @route   GET /api/user/vehicles/:id
// @access  Private (JWT protected)
const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found.',
      });
    }

    // Must be vehicle owner or admin
    if (vehicle.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this vehicle.',
      });
    }

    res.status(200).json({
      success: true,
      vehicle: {
        ...formatVehicle(vehicle),
        bookings: vehicle.bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle details
// @route   PUT /api/user/vehicles/:id
// @access  Private (JWT protected)
const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found.',
      });
    }

    if (vehicle.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this vehicle.',
      });
    }

    const {
      name,
      make,
      model,
      year,
      plate,
      license,
      vin,
      mileage,
      odometer,
      color,
      isPrimary,
      lastService,
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (make !== undefined) updateData.make = make.trim();
    if (model !== undefined) updateData.model = model.trim();
    if (year !== undefined) updateData.year = parseInt(year, 10);
    if (plate !== undefined || license !== undefined) {
      updateData.plate = (plate || license).trim().toUpperCase();
    }
    if (vin !== undefined) updateData.vin = vin.trim().toUpperCase();
    if (mileage !== undefined || odometer !== undefined) {
      updateData.mileage = (mileage || odometer).trim();
    }
    if (color !== undefined) updateData.color = color.trim();
    if (lastService !== undefined) updateData.lastService = lastService.trim();

    // Handle primary toggle
    if (isPrimary === true) {
      await prisma.vehicle.updateMany({
        where: { userId: vehicle.userId },
        data: { isPrimary: false },
      });
      updateData.isPrimary = true;
    } else if (isPrimary === false) {
      updateData.isPrimary = false;
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle details updated successfully.',
      vehicle: formatVehicle(updated),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set vehicle as primary in garage
// @route   PUT /api/user/vehicles/:id/primary
// @access  Private (JWT protected)
const setPrimaryVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found.',
      });
    }

    if (vehicle.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this vehicle.',
      });
    }

    // Clear primary on all user vehicles
    await prisma.vehicle.updateMany({
      where: { userId: vehicle.userId },
      data: { isPrimary: false },
    });

    // Set this one as primary
    const updated = await prisma.vehicle.update({
      where: { id },
      data: { isPrimary: true },
    });

    res.status(200).json({
      success: true,
      message: `${updated.name || updated.model} set as your primary garage vehicle.`,
      vehicle: formatVehicle(updated),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle from user garage
// @route   DELETE /api/user/vehicles/:id
// @access  Private (JWT protected)
const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found.',
      });
    }

    if (vehicle.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this vehicle.',
      });
    }

    const wasPrimary = vehicle.isPrimary;
    const userId = vehicle.userId;

    await prisma.vehicle.delete({
      where: { id },
    });

    // If deleted vehicle was primary, promote the most recent remaining vehicle
    if (wasPrimary) {
      const remainingVehicle = await prisma.vehicle.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (remainingVehicle) {
        await prisma.vehicle.update({
          where: { id: remainingVehicle.id },
          data: { isPrimary: true },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle removed from your garage.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserVehicles,
  addVehicle,
  getVehicleById,
  updateVehicle,
  setPrimaryVehicle,
  deleteVehicle,
  formatVehicle,
};
