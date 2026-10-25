const express = require('express');
const router = express.Router();
const {
  getStaffList,
  getStaffById,
  createStaffMember,
  updateStaffMember,
  updateStaffStatus,
  deleteStaffMember,
  getStaffMetrics,
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * Admin Staff & Technician Management Routes
 * Base URL: /api/admin/staff
 * All endpoints require Bearer JWT token AND admin role
 */
router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/staff/metrics - KPI metrics (Total staff, on-duty, in-bay, efficiency, certs)
router.get('/metrics', getStaffMetrics);

// GET /api/admin/staff - List all staff & technicians with filters (search, role, bay, status)
router.get('/', getStaffList);

// GET /api/admin/staff/:id - View single technician profile & past service history
router.get('/:id', getStaffById);

// POST /api/admin/staff - Add new certified technician / staff member
router.post('/', createStaffMember);

// PUT /api/admin/staff/:id/status - Update technician availability status (In-Bay, Available, etc.)
router.put('/:id/status', updateStaffStatus);

// PUT /api/admin/staff/:id - Update technician details, certifications, and bay
router.put('/:id', updateStaffMember);

// DELETE /api/admin/staff/:id - Remove technician from the roster
router.delete('/:id', deleteStaffMember);

module.exports = router;
