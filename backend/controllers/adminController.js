const Admin = require('../models/Admin');
const User = require('../models/User');
const EmergencyAlert = require('../models/EmergencyAlert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Store OTP temporarily (in production, use Redis or database)
const adminOtpStore = new Map();

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for admin signup
const sendAdminOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP temporarily with admin data
    adminOtpStore.set(otp, {
      name,
      email,
      password,
      createdAt: new Date()
    });
 
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'SafeStep Admin Registration OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">SafeStep Admin Registration</h2>
          <p>A new admin registration request has been made:</p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p><strong>OTP Code:</strong> <span style="font-size: 24px; font-weight: bold; color: #4f46e5;">${otp}</span></p>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request this registration, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'OTP sent to admin email' 
    });

  } catch (error) {
    console.error('Error sending admin OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP and create admin
const verifyAdminOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    // Check if OTP exists and is valid
    const otpData = adminOtpStore.get(otp);
    if (!otpData) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired (10 minutes)
    const now = new Date();
    const otpAge = now - otpData.createdAt;
    if (otpAge > 10 * 60 * 1000) { // 10 minutes
      adminOtpStore.delete(otp);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Verify data matches
    if (otpData.name !== name || otpData.email !== email) {
      return res.status(400).json({ message: 'Invalid registration data' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword
    });

    await admin.save();

    // Remove OTP from store
    adminOtpStore.delete(otp);

    res.json({ 
      success: true, 
      message: 'Admin account created successfully' 
    });

  } catch (error) {
    console.error('Error verifying admin OTP:', error);
    res.status(500).json({ message: 'Failed to create admin account' });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    // Generate admin token
    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
        role: 'admin',
        name: admin.name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    res.json({
      token,
      admin: {
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Admin login failed' });
  }
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Admin token required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ message: 'Invalid admin token' });
  }
};

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAlerts,
      activeAlerts,
      resolvedAlerts
    ] = await Promise.all([
      User.countDocuments(),
      EmergencyAlert.countDocuments(),
      EmergencyAlert.countDocuments({ status: 'active' }),
      EmergencyAlert.countDocuments({ status: 'resolved' })
    ]);

    res.json({
      totalUsers,
      totalAlerts,
      activeAlerts,
      resolvedAlerts
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Failed to get dashboard statistics' });
  }
};

// Get all users with pagination and filtering
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ _id: -1 }) // Sort by _id instead of createdAt
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

// Get all emergency alerts with pagination and filtering
const getAllAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, dateFrom, dateTo } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const alerts = await EmergencyAlert.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EmergencyAlert.countDocuments(query);

    res.json({
      alerts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalAlerts: total,
        hasNext: skip + alerts.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ message: 'Failed to get alerts' });
  }
};

// Update user status (activate/deactivate)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive, reason } = req.body;
    const adminId = req.admin.adminId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user status
    user.isActive = isActive;
    
    if (!isActive) {
      // Deactivating user
      user.deactivatedAt = new Date();
      user.deactivatedBy = adminId;
      user.deactivationReason = reason || 'Deactivated by admin';
    } else {
      // Reactivating user
      user.deactivatedAt = undefined;
      user.deactivatedBy = undefined;
      user.deactivationReason = undefined;
    }

    await user.save();

    res.json({ 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        deactivatedAt: user.deactivatedAt,
        deactivationReason: user.deactivationReason
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
};

// Update alert status
const updateAlertStatus = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, adminNotes } = req.body;
    const adminId = req.admin.adminId;

    const alert = await EmergencyAlert.findByIdAndUpdate(
      alertId,
      {
        status,
        notes: adminNotes ? `${adminNotes} (Admin: ${new Date().toISOString()})` : undefined,
        resolvedAt: status === 'resolved' ? new Date() : undefined,
        resolvedBy: status === 'resolved' ? adminId : undefined
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ 
      message: `Alert marked as ${status} successfully`, 
      alert 
    });
  } catch (error) {
    console.error('Error updating alert status:', error);
    res.status(500).json({ message: 'Failed to update alert status' });
  }
};

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Alert trends by day
    const alertTrends = await EmergencyAlert.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Alert status distribution
    const alertStatusDistribution = await EmergencyAlert.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Alerts by hour of day
    const alertsByHour = await EmergencyAlert.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Alerts by day of week
    const alertsByDayOfWeek = await EmergencyAlert.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Recent activity (last 7 days)
    const recentActivity = await EmergencyAlert.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          alerts: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "resolved"] }, 1, 0]
            }
          },
          active: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Top users by alert count
    const topUsersByAlerts = await EmergencyAlert.aggregate([
      {
        $group: {
          _id: "$userId",
          alertCount: { $sum: 1 }
        }
      },
      {
        $sort: { alertCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          name: "$user.name",
          email: "$user.email",
          alertCount: 1
        }
      }
    ]);

    res.json({
      totalUsers,
      alertTrends,
      alertStatusDistribution,
      alertsByHour,
      alertsByDayOfWeek,
      recentActivity,
      topUsersByAlerts,
      period
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ message: 'Failed to get analytics data' });
  }
};

// Get system health information
const getSystemHealth = async (req, res) => {
  try {
    // Check database connection
    const dbStatus = await User.findOne().select('_id');
    
    // Get basic system metrics
    const metrics = {
      database: dbStatus ? 'connected' : 'disconnected',
      timestamp: new Date(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error getting system health:', error);
    res.status(500).json({ message: 'Failed to get system health' });
  }
};

// Export emergency data
const exportData = async (req, res) => {
  try {
    const { type, format = 'json' } = req.query;

    let data;
    switch (type) {
      case 'users':
        data = await User.find().select('-password');
        break;
      case 'alerts':
        data = await EmergencyAlert.find().populate('userId', 'name email');
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ message: 'Failed to export data' });
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]._doc || data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

module.exports = {
  sendAdminOtp,
  verifyAdminOtp,
  adminLogin,
  adminAuth,
  getDashboardStats,
  getAllUsers,
  getAllAlerts,
  updateUserStatus,
  updateAlertStatus,
  getAnalytics,
  getSystemHealth,
  exportData
}; 