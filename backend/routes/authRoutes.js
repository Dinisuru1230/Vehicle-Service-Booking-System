const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  seedDefaultAccounts,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/seed', seedDefaultAccounts);

// Protected routes (Requires Bearer JWT token)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
