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

router.use(protect); // All order routes require authentication

router.route('/')
    .get(getMyOrders)
    .post(placeOrder);

router.post('/:id/cancel', cancelOrder);

// Admin routes
router.get('/all', admin, getAllOrders);
router.put('/:id/status', admin, updateOrderStatus);

module.exports = router;
