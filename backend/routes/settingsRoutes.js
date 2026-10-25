const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  resetSettings,
} = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * Workshop Settings & Operating Rules Routes
 * Base URL: /api/admin/settings
 * All endpoints require Bearer JWT token AND admin role
 */
router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/settings – Workshop info, operating hours, active capacity, policies
router.get('/', getSettings);

// PUT /api/admin/settings – Update business hours, active intake capacity, advance booking window
router.put('/', updateSettings);

// POST /api/admin/settings/reset – Reset to default workshop parameters
router.post('/reset', resetSettings);

module.exports = router;
