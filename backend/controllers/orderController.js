// ==============================================================================
// 📦 ORDER CONTROLLER - Order Placement, History & Status Management
// ==============================================================================
// Is controller mein customer dwara order place karna, stock check karna,
// coupons apply karna, order cancel karna aur Admin dwara order status badalna shamil hai.
// ==============================================================================

const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Cancellation = require('../models/Cancellation');

// ------------------------------------------------------------------------------
// 1. 📋 GET USER ORDERS (GET /api/orders)
// ------------------------------------------------------------------------------
exports.getMyOrders = async (req, res) => {
    try {
        // Logged-in user ke saare orders date ke hisaab se latest first fetch karte hain
        const orders = await Order.find({ userId: req.user._id }).sort({ orderDate: -1 });
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        console.error('Fetch my orders error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 2. 🛒 PLACE ORDER (POST /api/orders)
// ------------------------------------------------------------------------------
exports.placeOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, couponCode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Order ke liye kam se kam 1 item hona zaroori hai' });
        }

        let orderItems = [];
        let subtotal = 0;
        let totalQuantity = 0;

        // Har ek item ka real price aur stock check karte hain
        for (const item of items) {
            const product = await Product.findOne({ id: Number(item.productId) });

            if (!product) {
                return res.status(404).json({ success: false, message: `Product ID ${item.productId} nahi mila` });
            }

            // Stock check karte hain
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Product: "${product.title}" ka stock kam hai. Keval ${product.stock} available hain`
                });
            }

            // Inventory stock kam karte hain
            product.stock -= Number(item.quantity);
            await product.save();

            const itemPrice = product.price;
            subtotal += itemPrice * Number(item.quantity);
            totalQuantity += Number(item.quantity);

            orderItems.push({
                productId: product.id,
                title: product.title,
                quantity: Number(item.quantity),
                price: itemPrice,
                size: item.size || 'M',
                color: item.color || product.color,
                image: product.image
            });
        }

        // ₹3000 se zyada ke order par Free Shipping, warna ₹150 flat delivery fee
        const shipping = subtotal > 3000 ? 0 : 150;

        // Coupon code verification
        let discount = 0;
        if (couponCode && ['REBEL15', 'WROGN15', 'CLUB40'].includes(couponCode.toUpperCase())) {
            const pct = couponCode.toUpperCase() === 'CLUB40' ? 0.40 : 0.15;
            discount = Math.round(subtotal * pct);
        }

        const finalAmount = Math.max(0, subtotal - discount + shipping);

        // Unique Order ID generate karte hain (e.g. WR-839210)
        const orderId = `WR-${Date.now().toString().slice(-6)}`;

        const order = await Order.create({
            orderId,
            userId: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
            amount: finalAmount,
            deliveryStatus: 'Processing'
        });

        // Order hone ke baad user ki cart empty kar dete hain
        await Cart.deleteMany({ userId: req.user._id });

        res.status(201).json({
            success: true,
            message: 'Order successfully place ho gaya!',
            order
        });
    } catch (error) {
        console.error('Place order error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 3. 🚫 CANCEL ORDER (POST /api/orders/:id/cancel)
// ------------------------------------------------------------------------------
exports.cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findOne({ orderId: req.params.id, userId: req.user._id });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Yeh order nahi mila' });
        }

        if (order.deliveryStatus === 'Cancelled') {
            return res.status(400).json({ success: false, message: 'Yeh order pehle se hi cancelled hai' });
        }

        if (order.deliveryStatus === 'Delivered') {
            return res.status(400).json({ success: false, message: 'Delivered order ko cancel nahi kiya ja sakta. Return request karein' });
        }

        // Cancel status update karte hain
        order.deliveryStatus = 'Cancelled';
        await order.save();

        // Product stock wapas refund (restore) karte hain
        for (const item of order.items) {
            const product = await Product.findOne({ id: item.productId });
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        // Cancellation record save karte hain
        await Cancellation.create({
            orderId: order.orderId,
            userId: req.user._id,
            reason: reason || 'Customer requested cancellation'
        });

        res.json({ success: true, message: 'Order successfully cancel ho gaya' });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 4. 👑 GET ALL ORDERS (GET /api/orders/all - Admin Only)
// ------------------------------------------------------------------------------
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ orderDate: -1 });
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        console.error('Admin fetch orders error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 5. 👑 UPDATE ORDER STATUS (PUT /api/orders/:id/status - Admin Only)
// ------------------------------------------------------------------------------
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const order = await Order.findOne({ orderId: req.params.id });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order nahi mila' });
        }

        order.deliveryStatus = status;
        await order.save();

        res.json({ success: true, message: `Order status update karke '${status}' kar diya gaya`, order });
    } catch (error) {
        console.error('Admin update order status error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
