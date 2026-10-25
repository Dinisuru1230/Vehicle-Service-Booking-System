const express = require('express');
const router = express.Router();
const { exportBookingsReport } = require('../controllers/invoiceReportController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * Admin Reports & Analytics Export Routes
 * Base URL: /api/admin/reports
 * Requires admin role authentication
 */
router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/reports/bookings/export - Export workshop booking and revenue reports to CSV
router.get('/bookings/export', exportBookingsReport);

module.exports = router;
