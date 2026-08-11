// ==============================================================================
// ❤️ WISHLIST ROUTES (/api/wishlist)
// ==============================================================================
const express = require('express');
const router = express.Router();
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

// Wishlist ke liye user ka login hona zaroori hai
router.use(protect);

// ❤️ Wishlist dekhna aur ➕ Item wishlist mein save karna
router.route('/')
    .get(getWishlist)
    .post(addToWishlist);

// 🗑️ Wishlist se item remove karna
router.route('/:productId')
    .delete(removeFromWishlist);

module.exports = router;
