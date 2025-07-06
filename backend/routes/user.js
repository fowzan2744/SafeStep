const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getDashboardStats
} = require('../controllers/userController');

// All routes require authentication
router.use(auth);

// GET /api/user/dashboard-stats - Get dashboard statistics
router.get('/dashboard-stats', getDashboardStats);

module.exports = router; 