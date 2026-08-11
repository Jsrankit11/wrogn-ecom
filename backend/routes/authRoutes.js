// ==============================================================================
// 🔑 AUTHENTICATION ROUTES (/api/auth)
// ==============================================================================
const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

// 📝 Registration route (Naya account banane ke liye)
router.post('/register', register);

// 🔐 Login route (Email/Username + Password se login)
router.post('/login', login);

// 🚪 Logout route
router.post('/logout', logout);

// 📩 Forgot password route (Reset token generate karne ke liye)
router.post('/forgot-password', forgotPassword);

// 🔄 Reset password route (Naya password set karne ke liye)
router.post('/reset-password', resetPassword);

module.exports = router;
