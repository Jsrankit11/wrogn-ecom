const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Cancellation = require('../models/Cancellation');

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ orderDate: -1 });
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.placeOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, couponCode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }

        let orderItems = [];
        let subtotal = 0;
        let totalQuantity = 0;

        for (const item of items) {
            const product = await Product.findOne({ id: Number(item.productId) });

            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${item.productId} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for product: ${product.title}. Available: ${product.stock}` });
            }

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

        const shipping = subtotal > 3000 ? 0 : 150;

        let discount = 0;
        if (couponCode && (couponCode.toUpperCase() === 'REBEL15' || couponCode.toUpperCase() === 'WROGN15' || couponCode.toUpperCase() === 'CLUB40')) {
            const pct = couponCode.toUpperCase() === 'CLUB40' ? 0.40 : 0.15;
            discount = Math.round(subtotal * pct);
        }

        const amount = subtotal + shipping - discount;

        const order = await Order.create({
            userId: req.user._id,
            items: orderItems,
            quantity: totalQuantity,
            amount: amount,
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === 'UPI / QR Code' ? 'Paid' : 'Pending',
            shippingAddress: {
                fullName: shippingAddress.fullName,
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state || '',
                country: shippingAddress.country || 'India',
                pincode: shippingAddress.pincode,
                phone: shippingAddress.phone
            }
        });

        await Cart.deleteMany({ userId: req.user._id });

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;
        const orderId = req.params.id;

        const order = await Order.findOne({ orderId: orderId });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Only owner or admin can cancel
        if (order.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
        }

        if (order.deliveryStatus !== 'Processing') {
            return res.status(400).json({ success: false, message: 'Order cannot be cancelled. Already shipped/delivered or cancelled.' });
        }

        for (const item of order.items) {
            await Product.updateOne(
                { id: item.productId },
                { $inc: { stock: item.quantity } }
            );
        }

        order.deliveryStatus = 'Cancelled';
        await order.save();

        await Cancellation.create({
            orderId: order.orderId,
            userId: req.user._id,
            reason: reason || 'Cancelled by customer',
            refundStatus: order.paymentStatus === 'Paid' ? 'Pending' : 'N/A'
        });

        res.json({ success: true, message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'fullName email').sort({ orderDate: -1 });
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { deliveryStatus, paymentStatus } = req.body;
        const order = await Order.findOne({ orderId: req.params.id });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (deliveryStatus) order.deliveryStatus = deliveryStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();
        res.json({ success: true, message: 'Order status updated successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
