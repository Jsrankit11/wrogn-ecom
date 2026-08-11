// ==============================================================================
// 🛒 CART ROUTES (/api/cart)
// ==============================================================================
const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    syncCart,
    updateCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// Cart ke saare operations ke liye authentication required hai
router.use(protect);

// 🛍️ Cart fetch karna, ➕ Item add karna, 🔄 Bulk update karna
router.route('/')
    .get(getCart)
    .post(addToCart)
    .put(updateCart);

// 🔄 Guest user ki local cart ko server cart se sync karna
router.post('/sync', syncCart);

// ✏️ Single item update karna ya 🗑️ Remove karna
router.route('/:productId')
    .put(updateCartItem)
    .delete(removeFromCart);

module.exports = router;
