const express = require('express');
const router = express.Router();
const { 
  getNearbyServices
} = require('../controllers/emergencyServiceController');

// Public routes
router.get('/nearby', getNearbyServices);

module.exports = router; 