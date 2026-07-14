const express = require('express');
const router = express.Router();
const {
    getAnalytics,
    getUsers,
    deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);
router.use(admin); // All admin routes require admin privileges

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
