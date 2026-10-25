const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  addCustomerVehicle,
  updateCustomerVehicle,
  deleteCustomerVehicle,
  updateCustomerNotes,
  updateCustomerStatus,
  getCustomerBookings,
  addCustomerBooking,
  getUserMetrics,
} = require('../controllers/adminUserController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require Bearer JWT token AND admin role
router.use(protect);
router.use(authorize('admin'));

// 1. Aggregate customer & workshop metrics
router.get('/metrics', getUserMetrics);

// 2. Customer collection (search, filter, paginate, create)
router.route('/')
  .get(getAllUsers)
  .post(createUserByAdmin);

// 3. Individual customer resource (view, edit, delete)
router.route('/:id')
  .get(getUserById)
  .put(updateUserByAdmin)
  .delete(deleteUserByAdmin);

// 4. Quick updates for notes and status
router.put('/:id/notes', updateCustomerNotes);
router.put('/:id/status', updateCustomerStatus);

// 5. Customer vehicle fleet management by Admin
router.route('/:id/vehicles')
  .post(addCustomerVehicle);

router.route('/:id/vehicles/:vehicleId')
  .put(updateCustomerVehicle)
  .delete(deleteCustomerVehicle);

// 6. Customer service ledger & appointments by Admin
router.route('/:id/bookings')
  .get(getCustomerBookings)
  .post(addCustomerBooking);

module.exports = router;
