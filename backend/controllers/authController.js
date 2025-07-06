const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTP = require('../utils/mailer');
const generateOTP = require('../utils/generateOtp');

exports.sendSignupOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already registered' });

  const otp = generateOTP();
  await Otp.deleteMany({ email });

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await Otp.create({ email, otp, expiresAt });

  try {
    await sendOTP(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, name, password, otp } = req.body;

  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    await Otp.deleteMany({ email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ message: 'User registered successfully', token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      user: { name: user.name, email: user.email } 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'Account deactivated. Please contact support for assistance.',
        deactivatedAt: user.deactivatedAt,
        deactivationReason: user.deactivationReason
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Change Password Functions
exports.sendChangePasswordOtp = async (req, res) => {
  const { email } = req.body;
  const userId = req.user.id;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findById(userId);
  if (!user || user.email !== email) {
    return res.status(400).json({ message: 'Invalid email for this user' });
  }

  const otp = generateOTP();
  await Otp.deleteMany({ email });

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await Otp.create({ email, otp, expiresAt });

  try {
    await sendOTP(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyChangePasswordOtp = async (req, res) => {
  const { email, otp } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user || user.email !== email) {
    return res.status(400).json({ message: 'Invalid email for this user' });
  }

  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

  res.json({ message: 'OTP verified successfully' });
};

exports.changePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user || user.email !== email) {
    return res.status(400).json({ message: 'Invalid email for this user' });
  }

  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    await Otp.deleteMany({ email });
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to change password' });
  }
};

// Forgot Password Functions
exports.sendResetPasswordOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'No account found with this email address' });
  }

  const otp = generateOTP();
  await Otp.deleteMany({ email });

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await Otp.create({ email, otp, expiresAt });

  try {
    await sendOTP(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyResetPasswordOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'No account found with this email address' });
  }

  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

  res.json({ message: 'OTP verified successfully' });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'No account found with this email address' });
  }

  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    await Otp.deleteMany({ email });
    
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password' });
  }
};
