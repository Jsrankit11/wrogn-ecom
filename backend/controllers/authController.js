// ==============================================================================
// 🔑 AUTHENTICATION CONTROLLER - User & Admin Auth Logic
// ==============================================================================
// Is controller mein register, login, logout, password reset wagera
// saari security aur session-related functionality hai.
// ==============================================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function: User ID ke sath JWT Token generate karta hai
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretwrognkey123', {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// ------------------------------------------------------------------------------
// 1. 📝 REGISTER NEW USER (POST /api/auth/register)
// ------------------------------------------------------------------------------
exports.register = async (req, res) => {
    try {
        const { fullName, username, email, phone, password } = req.body;

        // Check karte hain ki email pehle se registered toh nahi hai
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Yeh email pehle se registered hai' });
        }

        // Check karte hain ki username pehle se taken toh nahi hai
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ success: false, message: 'Yeh username pehle se kisi aur ka hai' });
        }

        // Naya user document create karte hain MongoDB mein
        const user = await User.create({
            fullName,
            username,
            email,
            phone,
            password
        });

        if (user) {
            // Success response: Token aur sanitized user details return karte hain
            res.status(201).json({
                success: true,
                token: generateToken(user._id),
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    isAdmin: user.isAdmin,
                    profilePhoto: user.profilePhoto,
                    address: user.address,
                    city: user.city,
                    state: user.state,
                    country: user.country,
                    pincode: user.pincode
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'User data sahi nahi hai' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 2. 🔐 LOGIN USER (POST /api/auth/login)
// ------------------------------------------------------------------------------
exports.login = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            return res.status(400).json({ success: false, message: 'Email/Username aur password dono zaroori hain' });
        }

        // User ko email ya fir username dono mein se kisi ek se dhoondhte hain
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });

        // Agar user mil gaya aur hashed password match ho gaya
        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                token: generateToken(user._id),
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    isAdmin: user.isAdmin,
                    profilePhoto: user.profilePhoto,
                    address: user.address,
                    city: user.city,
                    state: user.state,
                    country: user.country,
                    pincode: user.pincode
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Galat credentials. Email/Username ya Password check karein' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 3. 🚪 LOGOUT USER (POST /api/auth/logout)
// ------------------------------------------------------------------------------
exports.logout = async (req, res) => {
    res.json({ success: true, message: 'Aap successfully logout ho chuke hain' });
};

// ------------------------------------------------------------------------------
// 4. 📩 FORGOT PASSWORD (POST /api/auth/forgot-password)
// ------------------------------------------------------------------------------
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Is email address se koi account nahi mila' });
        }

        // Temporary 10-minute reset token generate karte hain
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'supersecretwrognkey123',
            { expiresIn: '10m' }
        );

        res.json({
            success: true,
            message: 'Password reset link bhej diya gaya hai',
            resetToken
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 5. 🔄 RESET PASSWORD (POST /api/auth/reset-password)
// ------------------------------------------------------------------------------
exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Reset token verify karte hain
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'supersecretwrognkey123');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User nahi mila ya token expire ho gaya' });
        }

        // Naya password set karte hain (User model pre-save hook isse bcrypt se hash karega)
        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password successfully update ho gaya hai. Ab aap naye password se login kar sakte hain' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({ success: false, message: 'Password reset link invalid ya expire ho chuka hai' });
    }
};
