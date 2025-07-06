const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getContacts,
  addContact,
  deleteContact
} = require('../controllers/emergencyContactController');

// All routes require authentication
router.use(auth);

// GET /api/emergency-contacts - Get all contacts for the user
router.get('/', getContacts);

// POST /api/emergency-contacts - Add a new contact
router.post('/', addContact);

// DELETE /api/emergency-contacts/:id - Delete a contact
router.delete('/:id', deleteContact);

module.exports = router; 