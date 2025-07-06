const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin signup OTP routes (no auth required)
router.post('/send-otp', adminController.sendAdminOtp);
router.post('/verify-otp', adminController.verifyAdminOtp);

// Admin login (no auth required)
router.post('/login', adminController.adminLogin);

// All other routes require admin authentication
router.use(adminController.adminAuth);

// Dashboard statistics
router.get('/stats', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/status', adminController.updateUserStatus);

// Alert management
router.get('/alerts', adminController.getAllAlerts);
router.patch('/alerts/:alertId/status', adminController.updateAlertStatus);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// System health
router.get('/system/health', adminController.getSystemHealth);

// Data export
router.get('/export', adminController.exportData);

module.exports = router; 