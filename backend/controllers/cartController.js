const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.user._id }).populate('product');
        
        
        const formattedCart = cartItems.map(item => ({
            product: {
                id: item.productId,
                title: item.product.title,
                price: item.product.price,
                oldPrice: item.product.oldPrice,
                image: item.product.image,
                category: item.product.category,
                color: item.product.color
            },
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price
        }));

        res.json({ success: true, cart: formattedCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, size, color } = req.body;

        const product = await Product.findOne({ id: Number(productId) });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let cartItem = await Cart.findOne({
            userId: req.user._id,
            productId: Number(productId),
            size: size || 'M',
            color: color || product.color
        });

        if (cartItem) {
            cartItem.quantity += Number(quantity || 1);
            await cartItem.save();
        } else {
            cartItem = await Cart.create({
                userId: req.user._id,
                productId: product.id,
                product: product._id,
                quantity: Number(quantity || 1),
                size: size || 'M',
                color: color || product.color,
                price: product.price
            });
        }

        res.json({ success: true, message: 'Added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { quantity, size, color } = req.body;
        const productId = Number(req.params.productId);

        const cartItem = await Cart.findOne({
            userId: req.user._id,
            productId: productId
        });

        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        if (quantity !== undefined) cartItem.quantity = Number(quantity);
        if (size !== undefined) cartItem.size = size;
        if (color !== undefined) cartItem.color = color;

        await cartItem.save();
        res.json({ success: true, message: 'Cart updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        const { size } = req.query; // optional size filter

        let filterObj = {
            userId: req.user._id,
            productId: productId
        };
        if (size) {
            filterObj.size = size;
        }

        const result = await Cart.deleteMany(filterObj);

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        res.json({ success: true, message: 'Removed from cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.syncCart = async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Items array required' });
        }

        for (const item of items) {
            const product = await Product.findOne({ id: Number(item.product.id) });
            if (product) {
                let cartItem = await Cart.findOne({
                    userId: req.user._id,
                    productId: product.id,
                    size: item.size || 'M',
                    color: item.color || product.color
                });

                if (cartItem) {
                    cartItem.quantity = Math.max(cartItem.quantity, Number(item.quantity));
                    await cartItem.save();
                } else {
                    await Cart.create({
                        userId: req.user._id,
                        productId: product.id,
                        product: product._id,
                        quantity: Number(item.quantity || 1),
                        size: item.size || 'M',
                        color: item.color || product.color,
                        price: product.price
                    });
                }
            }
        }

        res.json({ success: true, message: 'Cart synced successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Items array required' });
        }

        await Cart.deleteMany({ userId: req.user._id });

        for (const item of items) {
            const product = await Product.findOne({ id: Number(item.productId) });
            if (product) {
                await Cart.create({
                    userId: req.user._id,
                    productId: product.id,
                    product: product._id,
                    quantity: Number(item.quantity || 1),
                    size: item.size || 'M',
                    color: item.color || product.color || 'Black',
                    price: product.price
                });
            }
        }

        res.json({ success: true, message: 'Cart updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

