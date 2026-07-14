const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getAnalytics = async (req, res) => {
    try {
        const nonCancelledOrders = await Order.find({ deliveryStatus: { $ne: 'Cancelled' } });
        const totalSales = nonCancelledOrders.reduce((sum, order) => sum + order.amount, 0);

        const totalOrders = await Order.countDocuments({});

        const totalProducts = await Product.countDocuments({});

        // Calculate sales share by product category
        const categoryShare = {};
        for (const order of nonCancelledOrders) {
            for (const item of order.items) {
                const cat = item.category || 'Other';
                categoryShare[cat] = (categoryShare[cat] || 0) + (item.price * item.quantity);
            }
        }

        const categoryShareList = Object.keys(categoryShare).map(key => ({
            category: key,
            sales: categoryShare[key]
        }));

        res.json({
            success: true,
            analytics: {
                totalSales,
                totalOrders,
                totalProducts,
                categoryShare: categoryShareList
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdDate: -1 });
        res.json({ success: true, count: users.length, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent admin self-deletion
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Admin cannot delete their own account' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
