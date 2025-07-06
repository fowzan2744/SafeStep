const EmergencyContact = require('../models/EmergencyContact');

// Get all emergency contacts for a user
exports.getContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ 
      userId: req.user.id, 
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
};

// Add a new emergency contact
exports.addContact = async (req, res) => {
  try {
    const { name, email, phone, relationship } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if contact already exists for this user
    const existingContact = await EmergencyContact.findOne({
      userId: req.user.id,
      email: email.toLowerCase()
    });

    if (existingContact) {
      return res.status(400).json({ message: 'Contact with this email already exists' });
    }

    const contact = new EmergencyContact({
      userId: req.user.id,
      name,
      email: email.toLowerCase(),
      phone,
      relationship: relationship || 'Emergency Contact'
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Contact with this email already exists' });
    }
    res.status(500).json({ message: 'Error adding contact', error: error.message });
  }
};

// Update an emergency contact
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, relationship } = req.body;

    const contact = await EmergencyContact.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check if email is being changed and if it conflicts with another contact
    if (email && email !== contact.email) {
      const existingContact = await EmergencyContact.findOne({
        userId: req.user.id,
        email: email.toLowerCase(),
        _id: { $ne: id }
      });

      if (existingContact) {
        return res.status(400).json({ message: 'Contact with this email already exists' });
      }
    }

    contact.name = name || contact.name;
    contact.email = email ? email.toLowerCase() : contact.email;
    contact.phone = phone !== undefined ? phone : contact.phone;
    contact.relationship = relationship || contact.relationship;

    await contact.save();
    res.json(contact);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Contact with this email already exists' });
    }
    res.status(500).json({ message: 'Error updating contact', error: error.message });
  }
};

// Delete an emergency contact (soft delete)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await EmergencyContact.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    contact.isActive = false;
    await contact.save();

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
};

// Get a specific contact
exports.getContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await EmergencyContact.findOne({
      _id: id,
      userId: req.user.id,
      isActive: true
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error: error.message });
  }
}; 