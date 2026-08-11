// ==============================================================================
// 🛍️ PRODUCT ROUTES (/api/products)
// ==============================================================================
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// 🔍 Saare products fetch karna (Public) ya ➕ Naya product create karna (Admin Only)
router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.single('image'), createProduct);

// 📦 Single product dekhna (Public), ✏️ Update karna (Admin), 🗑️ Delete karna (Admin)
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.single('image'), updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
