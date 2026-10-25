const express = require('express');
const router = express.Router();
const {
  getDashboardMetrics,
  getWorkshopBays,
  getRecentActivity,
} = require('../controllers/adminDashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * Admin Dashboard & Workshop Overview Routes
 * Base URL: /api/admin/dashboard
 * All endpoints require Bearer JWT token AND admin role
 */
router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/dashboard/metrics – Today's Revenue, Active Jobs in Bays, Completed Today, Customer Satisfaction
router.get('/metrics', getDashboardMetrics);

// GET /api/admin/dashboard/bays – Real-time status of workshop bays (Bay 01 to 08: In-Use, Open, vehicle name, assigned technician, progress %)
router.get('/bays', getWorkshopBays);

// GET /api/admin/dashboard/recent-activity – Live audit log of check-ins, status transitions, and completions
router.get('/recent-activity', getRecentActivity);

module.exports = router;
