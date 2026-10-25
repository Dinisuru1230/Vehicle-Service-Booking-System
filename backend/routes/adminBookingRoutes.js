const express = require('express');
const router = express.Router();
const {
  getAdminBookings,
  getBookingMetrics,
  createAdminBooking,
  updateBookingStatus,
  assignTechnicianAndBay,
  getBookingById,
} = require('../controllers/bookingController');
const { optionalProtect } = require('../middleware/authMiddleware');

/**
 * Admin Workshop Bookings Management Routes
 * Base URL: /api/admin/bookings
 */
router.use(optionalProtect);

// GET /api/admin/bookings/metrics - Total bookings count, revenue, in-bay count, pending review count
router.get('/metrics', getBookingMetrics);

// GET /api/admin/bookings - All workshop bookings with status filter, date range, and search
router.get('/', getAdminBookings);

// GET /api/admin/bookings/:id - Single booking details by admin
router.get('/:id', getBookingById);

// POST /api/admin/bookings - Manual phone/walk-in intake
router.post('/', createAdminBooking);

// PUT /api/admin/bookings/:id/status - Update status (e.g. approve booking, start work, complete job)
router.put('/:id/status', updateBookingStatus);

// PUT /api/admin/bookings/:id/assign - Assign technician and service bay
router.put('/:id/assign', assignTechnicianAndBay);

module.exports = router;
