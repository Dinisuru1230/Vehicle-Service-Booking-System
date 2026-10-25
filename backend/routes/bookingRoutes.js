const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  rescheduleBooking,
} = require('../controllers/bookingController');
const { getBookingInvoice } = require('../controllers/invoiceReportController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

/**
 * Customer Bookings & Appointments Routes
 * Base URL: /api/bookings
 */

// POST /api/bookings - Book appointment (guest or authenticated customer)
router.post('/', optionalProtect, createBooking);

// GET /api/bookings/my - Customer's booking history (authenticated or guest lookup)
router.get('/my', optionalProtect, getMyBookings);

// GET /api/bookings/:id/invoice - Generate invoice summary
router.get('/:id/invoice', optionalProtect, getBookingInvoice);

// GET /api/bookings/:id - Booking details and telemetry progress
router.get('/:id', optionalProtect, getBookingById);

// PUT /api/bookings/:id/cancel - Cancel an upcoming booking
router.put('/:id/cancel', optionalProtect, cancelBooking);

// PUT /api/bookings/:id/reschedule - Choose a new date/time slot
router.put('/:id/reschedule', optionalProtect, rescheduleBooking);

module.exports = router;
