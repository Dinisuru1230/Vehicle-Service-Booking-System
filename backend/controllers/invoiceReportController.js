const prisma = require('../config/prisma');

/**
 * @desc    Generate invoice summary for a booking (Parts, Labor, Taxes, Discounts)
 * @route   GET /api/bookings/:id/invoice
 * @access  Private (Customer & Admin)
 */
const getBookingInvoice = async (req, res) => {
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
        user: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking #${cleanId} not found.`,
      });
    }

    // Check permissions
    if (req.user && req.user.role !== 'admin' && booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this invoice.',
      });
    }

    const total = booking.totalCost || 149.0;
    const labor = Math.round(total * 0.65 * 100) / 100;
    const parts = Math.round(total * 0.35 * 100) / 100;
    const environmentalFee = 14.50;

    // User tier discount calculation
    let discountPercent = 0;
    const userTier = booking.user?.tier || 'Standard';
    if (userTier === 'VIP Platinum') discountPercent = 10;
    else if (userTier === 'Gold Member') discountPercent = 5;

    const discountAmount = Math.round((total * (discountPercent / 100)) * 100) / 100;
    const taxableSubtotal = total - discountAmount + environmentalFee;
    const taxRate = 0.085; // 8.5% California standard sales/service tax
    const taxAmount = Math.round(taxableSubtotal * taxRate * 100) / 100;
    const grandTotal = Math.round((taxableSubtotal + taxAmount) * 100) / 100;

    const invoiceNumber = `INV-${booking.bookingRef.replace(/^#APX-/, '')}`;
    const invoiceDate = booking.createdAt
      ? new Date(booking.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })
      : 'Oct 24, 2025';

    const isPaid = booking.status === 'Completed' || booking.status === 'In-Bay';

    const invoice = {
      invoiceNumber,
      bookingRef: booking.bookingRef,
      bookingId: booking.id,
      invoiceDate,
      dueDate: invoiceDate,
      paymentStatus: isPaid ? 'Paid' : 'Pending Payment',
      paymentMethod: 'Corporate Card (Visa •••• 4242)',
      hub: booking.hub || 'Apex Central Hub',
      customer: {
        id: booking.user?.id,
        name: booking.customerName || booking.user?.name || 'Alexander Wright',
        email: booking.user?.email || 'customer@example.com',
        phone: booking.customerPhone || booking.user?.phone || '+1 (555) 234-5678',
        tier: userTier,
        discountApplied: `${discountPercent}% (${userTier} Member Privilege)`,
      },
      vehicle: {
        vehicleName: booking.vehicleText || (booking.vehicle ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}` : '2023 BMW M3 Competition'),
        plate: booking.plate || booking.vehicle?.plate || 'CA 8XYZ901',
        vin: booking.vehicle?.vin || 'WBA33AY08PFS18920',
        mileage: booking.vehicle?.mileage || '14,200 mi',
      },
      serviceDetails: {
        packageTitle: booking.serviceTitle,
        scope: booking.serviceDetail || 'Precision High-Performance Service Protocol',
        technician: booking.technician || 'Dave Miller (ASE Master)',
        bay: booking.bay || 'Bay 3 (Lift Heavy)',
      },
      itemizedBreakdown: [
        {
          code: 'LABOR-01',
          description: `Certified Master Technician Labor (${booking.serviceTitle})`,
          hours: '1.5 hrs',
          rate: `LKR ${labor.toFixed(2)}`,
          amount: labor,
        },
        {
          code: 'PARTS-OEM',
          description: 'Factory OEM Replacement Components & Premium Synthetic Fluids',
          quantity: 1,
          rate: `LKR ${parts.toFixed(2)}`,
          amount: parts,
        },
        {
          code: 'ENV-RECYCLE',
          description: 'Hazardous Fluid Disposal & Environmental Recycling Fee',
          quantity: 1,
          rate: `LKR ${environmentalFee.toFixed(2)}`,
          amount: environmentalFee,
        },
      ],
      financials: {
        subtotal: total,
        discount: discountAmount,
        discountLabel: `${discountPercent}% (${userTier})`,
        environmentalFee,
        taxableAmount: taxableSubtotal,
        taxRate: '8.5%',
        taxAmount,
        grandTotal,
        amountPaid: isPaid ? grandTotal : 0.0,
        balanceDue: isPaid ? 0.0 : grandTotal,
      },
      terms: 'Payment is due within 14 days of issue. 12-month / 12,000-mile comprehensive warranty on all parts and labor.',
    };

    res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error(`[getBookingInvoice Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Export booking and revenue reports to CSV format
 * @route   GET /api/admin/reports/bookings/export
 * @access  Private (Admin Only)
 */
const exportBookingsReport = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        vehicle: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Generate CSV Header
    const headers = [
      'Booking Ref',
      'Customer Name',
      'Email',
      'Phone',
      'Vehicle',
      'License Plate',
      'Service Package',
      'Scheduled Date',
      'Scheduled Time',
      'Workshop Bay',
      'Technician',
      'Total Cost (USD)',
      'Status',
      'Created Date',
    ];

    // Build CSV Rows with escaping
    const rows = bookings.map((b) => {
      const customer = b.customerName || b.user?.name || '';
      const email = b.user?.email || '';
      const phone = b.customerPhone || b.user?.phone || '';
      const vehicle = b.vehicleText || (b.vehicle ? `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}` : '');
      const plate = b.plate || b.vehicle?.plate || '';
      const service = b.serviceTitle || '';
      const cost = Number(b.totalCost || 0).toFixed(2);
      const created = b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '';

      return [
        `"${b.bookingRef || ''}"`,
        `"${customer.replace(/"/g, '""')}"`,
        `"${email.replace(/"/g, '""')}"`,
        `"${phone.replace(/"/g, '""')}"`,
        `"${vehicle.replace(/"/g, '""')}"`,
        `"${plate.replace(/"/g, '""')}"`,
        `"${service.replace(/"/g, '""')}"`,
        `"${b.scheduledDate || ''}"`,
        `"${b.scheduledTime || ''}"`,
        `"${(b.bay || '').replace(/"/g, '""')}"`,
        `"${(b.technician || '').replace(/"/g, '""')}"`,
        cost,
        `"${b.status || ''}"`,
        `"${created}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="apexdrive-bookings-report.csv"'
    );
    res.status(200).send(csvContent);
  } catch (error) {
    console.error(`[exportBookingsReport Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBookingInvoice,
  exportBookingsReport,
};
