const EmergencyAlert = require('../models/EmergencyAlert');
const EmergencyContact = require('../models/EmergencyContact');
const sendEmergencyNotification = require('../utils/emergencyMailer');
const sendUserConfirmationEmail = require('../utils/userConfirmationMailer');

// Send emergency alert
exports.sendAlert = async (req, res) => {
  try {
    const { latitude, longitude, address, notes } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location coordinates are required' });
    }

    // Get user's emergency contacts
    const contacts = await EmergencyContact.find({
      userId: req.user.id,
      isActive: true
    });

    if (contacts.length === 0) {
      return res.status(400).json({ message: 'No emergency contacts found. Please add contacts first.' });
    }

    // Create emergency alert
    const alert = new EmergencyAlert({
      userId: req.user.id,
      location: {
        latitude,
        longitude,
        address: address || ''
      },
      notes: notes || '',
      contactsNotified: contacts.map(contact => ({
        contactId: contact._id,
        name: contact.name,
        email: contact.email
      }))
    });

    await alert.save();

    // Send notifications to all contacts
    const notificationPromises = contacts.map(async (contact) => {
      try {
        await sendEmergencyNotification(
          contact.email,
          contact.name,
          req.user.name,
          {
            latitude,
            longitude,
            address: address || 'Location not specified'
          },
          alert._id
        );

        // Update notification status to delivered
        await EmergencyAlert.updateOne(
          { 
            _id: alert._id,
            'contactsNotified.contactId': contact._id 
          },
          { 
            $set: { 
              'contactsNotified.$.notificationStatus': 'delivered' 
            } 
          }
        );
      } catch (error) {
        console.error(`Failed to send notification to ${contact.email}:`, error);
        
        // Update notification status to failed
        await EmergencyAlert.updateOne(
          { 
            _id: alert._id,
            'contactsNotified.contactId': contact._id 
          },
          { 
            $set: { 
              'contactsNotified.$.notificationStatus': 'failed' 
            } 
          }
        );
      }
    });

    // Send confirmation email to the user who triggered the alert
    const sendUserConfirmation = async () => {
      try {
        await sendUserConfirmationEmail(
          req.user.email,
          req.user.name,
          {
            latitude,
            longitude,
            address: address || 'Location not specified'
          },
          alert._id,
          contacts.length
        );
        console.log(`Confirmation email sent to ${req.user.email}`);
      } catch (error) {
        console.error(`Failed to send confirmation email to ${req.user.email}:`, error);
      }
    };

    // Wait for all notifications to be sent (but don't block the response)
    Promise.allSettled([...notificationPromises, sendUserConfirmation()]);

    res.status(201).json({
      message: 'Emergency alert sent successfully',
      alert: {
        id: alert._id,
        status: alert.status,
        location: alert.location,
        contactsNotified: alert.contactsNotified.length,
        createdAt: alert.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending emergency alert', error: error.message });
  }
};

// Get user's emergency alerts
exports.getAlerts = async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    
    const query = { userId: req.user.id };
    if (status) {
      query.status = status;
    }

    const alerts = await EmergencyAlert.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('contactsNotified.contactId', 'name email');

    const total = await EmergencyAlert.countDocuments(query);

    res.json({
      alerts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: parseInt(page) * parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
};

// Get a specific alert
exports.getAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await EmergencyAlert.findOne({
      _id: id,
      userId: req.user.id
    }).populate('contactsNotified.contactId', 'name email');

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alert', error: error.message });
  }
};

// Resolve an emergency alert
exports.resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const alert = await EmergencyAlert.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    if (alert.status !== 'active') {
      return res.status(400).json({ message: 'Alert is already resolved' });
    }

    alert.status = status || 'resolved';
    alert.resolvedAt = new Date();
    alert.resolvedBy = req.user.id;
    if (notes) {
      alert.notes = notes;
    }

    await alert.save();

    res.json({
      message: 'Alert resolved successfully',
      alert
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resolving alert', error: error.message });
  }
};

// Get alert statistics
exports.getAlertStats = async (req, res) => {
  try {
    const stats = await EmergencyAlert.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalAlerts = await EmergencyAlert.countDocuments({ userId: req.user.id });
    const activeAlerts = await EmergencyAlert.countDocuments({ 
      userId: req.user.id, 
      status: 'active' 
    });

    const statsMap = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      total: totalAlerts,
      active: activeAlerts,
      resolved: statsMap.resolved || 0,
      falseAlarm: statsMap.false_alarm || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alert statistics', error: error.message });
  }
}; 