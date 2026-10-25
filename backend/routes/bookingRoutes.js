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
const { protect } = require('../middleware/authMiddleware');

/**
 * Customer Bookings & Appointments Routes
 * Base URL: /api/bookings
 * Requires authentication (Bearer JWT token)
 */
router.use(protect);

// POST /api/bookings - Book appointment (select vehicle, service items, preferred date, time slot, notes)
router.post('/', createBooking);

// GET /api/bookings/my - Customer's booking history (filter by Active, Upcoming, Completed)
router.get('/my', getMyBookings);

// GET /api/bookings/:id/invoice - Generate invoice summary with parts, labor, taxes, and customer discounts
router.get('/:id/invoice', getBookingInvoice);

// GET /api/bookings/:id - Booking details and telemetry progress
router.get('/:id', getBookingById);

// PUT /api/bookings/:id/cancel - Cancel an upcoming booking
router.put('/:id/cancel', cancelBooking);

// PUT /api/bookings/:id/reschedule - Choose a new date/time slot
router.put('/:id/reschedule', rescheduleBooking);

module.exports = router;
