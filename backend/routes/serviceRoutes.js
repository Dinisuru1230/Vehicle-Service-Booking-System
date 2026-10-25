const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  getServiceCategories,
} = require('../controllers/serviceController');

/**
 * Public Service Catalog Routes
 * Base URL: /api/services
 */

// GET /api/services/categories - Service categories with counts and icon mappings
router.get('/categories', getServiceCategories);

// GET /api/services - List all active services (with optional category, search, sorting)
router.get('/', getServices);

// GET /api/services/:id - View service details and included checklist items (by ID or serviceCode)
router.get('/:id', getServiceById);

module.exports = router;
