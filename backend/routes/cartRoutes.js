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

router.use(protect); // All cart routes require login

router.route('/')
    .get(getCart)
    .post(addToCart)
    .put(updateCart);

router.post('/sync', syncCart);

router.route('/:productId')
    .put(updateCartItem)
    .delete(removeFromCart);

module.exports = router;
