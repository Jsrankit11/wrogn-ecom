// ==============================================================================
// 🔐 AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// ==============================================================================
// Yeh file verify karti hai ki user logged in hai ya nahi (JWT token check karke),
// aur check karti hai ki user Admin hai ya regular customer.
// ==============================================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect Middleware: Logged-in user authentication check karta hai
const protect = async (req, res, next) => {
    let token;

    // Check karte hain ki header mein 'Authorization: Bearer <token>' aaya hai ya nahi
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // "Bearer " ke baad ka actual token extract karte hain
            token = req.headers.authorization.split(' ')[1];

            // Secret key se token verify aur decode karte hain
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretwrognkey123');

            // Token ke andar maujood user ID se user profile fetch karte hain (password field chhod kar)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User nahi mila, please dobara login karein' });
            }

            // User verified! Agle controller function par forward kar dete hain
            next();
        } catch (error) {
            console.error('Token verification error:', error.message);
            res.status(401).json({ success: false, message: 'Invalid ya expired token, please login karein' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Access denied. Koi authorization token provide nahi kiya gaya' });
    }
};

// 2. Admin Middleware: Check karta hai ki logged-in user admin role rakhta hai ya nahi
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        // User Admin hai, proceed karo
        next();
    } else {
        // Non-admin access attempt
        res.status(403).json({ success: false, message: 'Admin access required. Aapke paas permissions nahi hain' });
    }
};

module.exports = { protect, admin };
