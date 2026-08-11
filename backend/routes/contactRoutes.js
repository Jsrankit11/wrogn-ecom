// ==============================================================================
// ✉️ CONTACT US ROUTES (/api/contact)
// ==============================================================================
const express = require('express');
const router = express.Router();
const {
    submitContactMessage,
    getContactMessages
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

// 📩 Public contact form submit karna (POST)
// 📋 Saare messages dekhna (GET - Sirf Admin ke liye)
router.route('/')
    .post(submitContactMessage)
    .get(protect, admin, getContactMessages);

module.exports = router;
