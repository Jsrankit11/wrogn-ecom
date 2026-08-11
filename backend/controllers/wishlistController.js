// ==============================================================================
// ❤️ WISHLIST CONTROLLER - Saved & Favorite Items Management
// ==============================================================================
// Is controller mein user ki wishlist fetch karna, naya item wishlist mein save karna,
// aur remove karna shamil hai.
// ==============================================================================

const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// ------------------------------------------------------------------------------
// 1. ❤️ GET WISHLIST (GET /api/wishlist)
// ------------------------------------------------------------------------------
exports.getWishlist = async (req, res) => {
    try {
        const wishlistEntries = await Wishlist.find({ userId: req.user._id }).populate('product');
        
        const ids = wishlistEntries.map(item => item.productId);
        const productsList = wishlistEntries.map(item => item.product).filter(Boolean);

        res.json({
            success: true,
            wishlist: ids,
            products: productsList
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 2. ➕ ADD TO WISHLIST (POST /api/wishlist)
// ------------------------------------------------------------------------------
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await Product.findOne({ id: Number(productId) });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product nahi mila' });
        }

        // Check karte hain pehle se wishlist mein hai ya nahi
        const exists = await Wishlist.findOne({
            userId: req.user._id,
            productId: product.id
        });

        if (exists) {
            return res.status(400).json({ success: false, message: 'Yeh product pehle se aapki wishlist mein hai' });
        }

        await Wishlist.create({
            userId: req.user._id,
            productId: product.id,
            product: product._id
        });

        res.json({ success: true, message: 'Product wishlist mein add ho gaya' });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 3. 🗑️ REMOVE FROM WISHLIST (DELETE /api/wishlist/:productId)
// ------------------------------------------------------------------------------
exports.removeFromWishlist = async (req, res) => {
    try {
        const productId = Number(req.params.productId);

        const result = await Wishlist.findOneAndDelete({
            userId: req.user._id,
            productId: productId
        });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Item wishlist mein nahi mila' });
        }

        res.json({ success: true, message: 'Product wishlist se remove ho gaya' });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
