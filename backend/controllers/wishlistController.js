const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

exports.getWishlist = async (req, res) => {
    try {
        const wishlistEntries = await Wishlist.find({ userId: req.user._id }).populate('product');
        
        const ids = wishlistEntries.map(item => item.productId);
        const productsList = wishlistEntries.map(item => item.product);

        res.json({
            success: true,
            wishlist: ids,
            products: productsList
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await Product.findOne({ id: Number(productId) });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const exists = await Wishlist.findOne({
            userId: req.user._id,
            productId: product.id
        });

        if (exists) {
            return res.status(400).json({ success: false, message: 'Product already in wishlist' });
        }

        await Wishlist.create({
            userId: req.user._id,
            productId: product.id,
            product: product._id
        });

        res.json({ success: true, message: 'Added to wishlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const productId = Number(req.params.productId);

        const result = await Wishlist.findOneAndDelete({
            userId: req.user._id,
            productId: productId
        });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Item not found in wishlist' });
        }

        res.json({ success: true, message: 'Removed from wishlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
