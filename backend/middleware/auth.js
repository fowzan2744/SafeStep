const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'Account deactivated. Please contact support for assistance.',
        deactivatedAt: user.deactivatedAt,
        deactivationReason: user.deactivationReason
      });
    }

    req.user = { 
      id: decoded.id, 
      email: user.email, 
      name: user.name,
      isActive: user.isActive 
    };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = auth; 