// ==============================================================================
// 📦 ORDER ROUTES (/api/orders)
// ==============================================================================
const express = require('express');
const router = express.Router();
const {
    getMyOrders,
    placeOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Saari order routes ke liye login zaroori hai
router.use(protect);

// 📋 Logged-in user ke orders dekhna ya 🛒 Naya order place karna
router.route('/')
    .get(getMyOrders)
    .post(placeOrder);

// 🚫 Order cancel request
router.post('/:id/cancel', cancelOrder);

// 👑 ADMIN ROUTES
router.get('/all', admin, getAllOrders);             // Saare customers ke orders dekhna
router.put('/:id/status', admin, updateOrderStatus); // Order delivery status update karna

module.exports = router;
