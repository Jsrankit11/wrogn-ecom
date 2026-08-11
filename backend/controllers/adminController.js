// ==============================================================================
// 👑 ADMIN CONTROLLER - Store Analytics & User Management
// ==============================================================================
// Is controller mein Admin dashboard ke sales metrics, order counts,
// category breakdown analytics, aur registered users ki list dekhna/delete karna shamil hai.
// ==============================================================================

const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// ------------------------------------------------------------------------------
// 1. 📊 GET STORE ANALYTICS (GET /api/admin/analytics)
// ------------------------------------------------------------------------------
exports.getAnalytics = async (req, res) => {
    try {
        // Non-cancelled orders ka total revenue calculate karte hain
        const nonCancelledOrders = await Order.find({ deliveryStatus: { $ne: 'Cancelled' } });
        const totalSales = nonCancelledOrders.reduce((sum, order) => sum + order.amount, 0);

        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        // Har category ka sales contribution calculate karte hain
        const categoryShare = {};
        for (const order of nonCancelledOrders) {
            for (const item of order.items) {
                const cat = item.category || 'Apparel';
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
        console.error('Analytics fetch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 2. 👥 GET ALL REGISTERED USERS (GET /api/admin/users)
// ------------------------------------------------------------------------------
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdDate: -1 });
        res.json({ success: true, count: users.length, users });
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 3. ❌ DELETE USER ACCOUNT (DELETE /api/admin/users/:id)
// ------------------------------------------------------------------------------
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User nahi mila' });
        }

        // Admin ko khud ka account delete karne se rokte hain
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Admin apna khud ka account delete nahi kar sakta' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User account delete ho gaya' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
