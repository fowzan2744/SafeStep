const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.user.id }
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      updates.email = email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

// Get user dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const EmergencyContact = require('../models/EmergencyContact');
    const EmergencyAlert = require('../models/EmergencyAlert');

    const [contactCount, alertCount, activeAlertCount] = await Promise.all([
      EmergencyContact.countDocuments({ userId: req.user.id, isActive: true }),
      EmergencyAlert.countDocuments({ userId: req.user.id }),
      EmergencyAlert.countDocuments({ userId: req.user.id, status: 'active' })
    ]);

    res.json({
      contacts: contactCount,
      totalAlerts: alertCount,
      activeAlerts: activeAlertCount,
      lastLogin: req.user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
}; 