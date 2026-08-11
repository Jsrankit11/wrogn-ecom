// ==============================================================================
// 👑 ADMIN ROUTES (/api/admin)
// ==============================================================================
const express = require('express');
const router = express.Router();
const {
    getAnalytics,
    getUsers,
    deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// Sirf logged in Admins ke liye accessible hai
router.use(protect);
router.use(admin);

// 📊 Store sales analytics aur reports
router.get('/analytics', getAnalytics);

// 👥 Saare registered customers ki list dekhna
router.get('/users', getUsers);

// ❌ User account delete karna
router.delete('/users/:id', deleteUser);

module.exports = router;
