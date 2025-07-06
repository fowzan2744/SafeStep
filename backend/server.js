const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const emergencyContactRoutes = require('./routes/emergencyContacts');
const emergencyAlertRoutes = require('./routes/emergencyAlerts');
const userRoutes = require('./routes/user');
const emergencyServiceRoutes = require('./routes/emergencyServices');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(express.json());
app.use(cors());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes);
app.use('/api/emergency-alerts', emergencyAlertRoutes);
app.use('/api/user', userRoutes);
app.use('/api/emergency-services', emergencyServiceRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server running on 5000")))
  .catch(err => console.log(err));
