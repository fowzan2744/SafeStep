const mongoose = require('mongoose');

const EmergencyAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'false_alarm'],
    default: 'active'
  },
  contactsNotified: [{
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmergencyContact'
    },
    name: String,
    email: String,
    notifiedAt: {
      type: Date,
      default: Date.now
    },
    notificationStatus: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    }
  }],
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for quick queries
EmergencyAlertSchema.index({ userId: 1, createdAt: -1 });
EmergencyAlertSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('EmergencyAlert', EmergencyAlertSchema); 