const mongoose = require('mongoose');

const emergencyServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['police', 'fire', 'hospital', 'ambulance', 'poison_control', 'domestic_violence', 'suicide_prevention']
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  operatingHours: {
    type: String,
    default: '24/7'
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create a geospatial index for location-based queries
emergencyServiceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyService', emergencyServiceSchema); 