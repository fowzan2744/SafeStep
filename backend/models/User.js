const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isActive: { type: Boolean, default: true },
  deactivatedAt: Date,
  deactivatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  deactivationReason: String
});

module.exports = mongoose.model('User', UserSchema);
