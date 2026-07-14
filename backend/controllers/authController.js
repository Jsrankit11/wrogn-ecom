const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretwrognkey123', {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

exports.register = async (req, res) => {
    try {
        const { fullName, username, email, phone, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ success: false, message: 'Username is already taken' });
        }

        const user = await User.create({
            fullName,
            username,
            email,
            phone,
            password
        });

        if (user) {
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
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: email }]
        });

        if (user && (await user.matchPassword(password))) {
            user.lastLogin = new Date();
            await user.save();

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
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.logout = (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ success: false, message: 'No user with this email found' });
        }

        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'supersecretwrognkey123',
            { expiresIn: '10m' }
        );

        // Return token in response for local development testing
        res.json({
            success: true,
            message: `Password reset link sent to ${email}`,
            resetToken // Returning it for testing/mocking in frontend
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, password } = req.body;

        if (!resetToken) {
            return res.status(400).json({ success: false, message: 'Reset token is required' });
        }

        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'supersecretwrognkey123');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found or token expired' });
        }

        user.password = password;
        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
};
