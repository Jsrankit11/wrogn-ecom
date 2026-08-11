// ==============================================================================
// 🛒 CART CONTROLLER - Shopping Cart Operations
// ==============================================================================
// Is controller mein user ki shopping cart ko fetch karna, items add karna,
// quantity update karna, delete karna aur guest localStorage cart ko server se sync karna shamil hai.
// ==============================================================================

const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ------------------------------------------------------------------------------
// 1. 🛍️ GET USER CART (GET /api/cart)
// ------------------------------------------------------------------------------
exports.getCart = async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.user._id }).populate('product');

        // Frontend format ke anusaar format karte hain
        const formattedCart = cartItems.map(item => ({
            product: {
                id: item.productId,
                title: item.product ? item.product.title : 'Product',
                price: item.product ? item.product.price : item.price,
                oldPrice: item.product ? item.product.oldPrice : item.price,
                image: item.product ? item.product.image : '',
                category: item.product ? item.product.category : '',
                color: item.product ? item.product.color : item.color
            },
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price
        }));

        res.json({ success: true, cart: formattedCart });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 2. ➕ ADD ITEM TO CART (POST /api/cart)
// ------------------------------------------------------------------------------
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, size, color } = req.body;

        const product = await Product.findOne({ id: Number(productId) });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product nahi mila' });
        }

        // Check karte hain ki yeh same product (same size & color) cart mein pehle se hai ya nahi
        let cartItem = await Cart.findOne({
            userId: req.user._id,
            productId: Number(productId),
            size: size || 'M',
            color: color || product.color
        });

        if (cartItem) {
            // Agar pehle se hai toh quantity badha dete hain
            cartItem.quantity += Number(quantity || 1);
            await cartItem.save();
        } else {
            // Naya cart item entry create karte hain
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

        res.json({ success: true, message: 'Item cart mein add ho gaya', cartItem });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 3. 🔄 SYNC GUEST CART AFTER LOGIN (POST /api/cart/sync)
// ------------------------------------------------------------------------------
exports.syncCart = async (req, res) => {
    try {
        const { localCart } = req.body;

        if (localCart && Array.isArray(localCart)) {
            for (const item of localCart) {
                const pId = item.product ? item.product.id : item.productId;
                const product = await Product.findOne({ id: Number(pId) });

                if (product) {
                    let cartItem = await Cart.findOne({
                        userId: req.user._id,
                        productId: product.id,
                        size: item.size || 'M',
                        color: item.color || product.color
                    });

                    if (cartItem) {
                        cartItem.quantity += Number(item.quantity || 1);
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
        }

        const updatedCart = await Cart.find({ userId: req.user._id }).populate('product');
        res.json({ success: true, message: 'Cart synchronized successfully', cart: updatedCart });
    } catch (error) {
        console.error('Sync cart error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 4. ✏️ UPDATE SINGLE ITEM QUANTITY (PUT /api/cart/:productId)
// ------------------------------------------------------------------------------
exports.updateCartItem = async (req, res) => {
    try {
        const { quantity, size, color } = req.body;
        const productId = Number(req.params.productId);

        let cartItem = await Cart.findOne({
            userId: req.user._id,
            productId: productId
        });

        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Item cart mein nahi mila' });
        }

        if (quantity !== undefined) cartItem.quantity = Number(quantity);
        if (size) cartItem.size = size;
        if (color) cartItem.color = color;

        await cartItem.save();
        res.json({ success: true, message: 'Cart item update ho gaya', cartItem });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 5. 🗑️ REMOVE ITEM FROM CART (DELETE /api/cart/:productId)
// ------------------------------------------------------------------------------
exports.removeFromCart = async (req, res) => {
    try {
        const productId = Number(req.params.productId);

        const result = await Cart.findOneAndDelete({
            userId: req.user._id,
            productId: productId
        });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Item cart mein nahi mila' });
        }

        res.json({ success: true, message: 'Item cart se remove kar diya gaya' });
    } catch (error) {
        console.error('Remove cart error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 6. 🔄 BULK UPDATE CART (PUT /api/cart)
// ------------------------------------------------------------------------------
exports.updateCart = async (req, res) => {
    try {
        const { cart } = req.body;

        // User ke purane cart records clear karke naye records create karte hain
        await Cart.deleteMany({ userId: req.user._id });

        if (cart && Array.isArray(cart)) {
            for (const item of cart) {
                const pId = item.product ? item.product.id : item.productId;
                const product = await Product.findOne({ id: Number(pId) });

                if (product) {
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

        res.json({ success: true, message: 'Cart successfully updated' });
    } catch (error) {
        console.error('Bulk update cart error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
