const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.city = req.body.city || user.city;
            user.state = req.body.state || user.state;
            user.country = req.body.country || user.country;
            user.pincode = req.body.pincode || user.pincode;

            const updatedUser = await user.save();

            res.json({
                success: true,
                user: {
                    _id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    isAdmin: updatedUser.isAdmin,
                    profilePhoto: updatedUser.profilePhoto,
                    address: updatedUser.address,
                    city: updatedUser.city,
                    state: updatedUser.state,
                    country: updatedUser.country,
                    pincode: updatedUser.pincode
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.changeUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ success: true, message: 'Password updated successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Incorrect current password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image file' });
        }

        const user = await User.findById(req.user._id);
        if (user) {
            const photoPath = `/uploads/profiles/${req.file.filename}`;
            user.profilePhoto = photoPath;
            await user.save();

            res.json({
                success: true,
                message: 'Profile photo uploaded successfully',
                profilePhoto: photoPath
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
