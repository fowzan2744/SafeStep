const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  sendAlert
} = require('../controllers/emergencyAlertController');

// All routes require authentication
router.use(auth);

// POST /api/emergency-alerts - Send emergency alert
router.post('/', sendAlert);

module.exports = router; 