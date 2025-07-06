const mongoose = require('mongoose');

const EmergencyContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  relationship: {
    type: String,
    trim: true,
    default: 'Emergency Contact'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique contacts per user
EmergencyContactSchema.index({ userId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('EmergencyContact', EmergencyContactSchema); 