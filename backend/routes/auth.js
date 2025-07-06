const express = require('express');
const { register, sendSignupOtp, verifyOtp, login, sendResetPasswordOtp, verifyResetPasswordOtp, resetPassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/send-otp', sendSignupOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/send-reset-password-otp', sendResetPasswordOtp);
router.post('/verify-reset-password-otp', verifyResetPasswordOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
