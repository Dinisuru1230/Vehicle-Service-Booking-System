const express = require('express');
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  updateUserPreferences,
  getUserDashboard,
  deleteUserAccount,
} = require('../controllers/userController');

const {
  getUserVehicles,
  addVehicle,
  getVehicleById,
  updateVehicle,
  setPrimaryVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');

const { protect } = require('../middleware/authMiddleware');

// All routes require Bearer JWT token authentication
router.use(protect);

// 1. Account Profile Routes
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// 2. Account Security & Password
router.put('/password', changeUserPassword);

// 3. Account Preferences (Notifications & 2FA)
router.put('/preferences', updateUserPreferences);

// 4. Account Dashboard Overview
router.get('/dashboard', getUserDashboard);

// 5. Account Deletion
router.delete('/account', deleteUserAccount);

// 6. User Garage Vehicles
router.route('/vehicles')
  .get(getUserVehicles)
  .post(addVehicle);

router.route('/vehicles/:id')
  .get(getVehicleById)
  .put(updateVehicle)
  .delete(deleteVehicle);

router.put('/vehicles/:id/primary', setPrimaryVehicle);

module.exports = router;
