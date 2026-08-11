// ==============================================================================
// 👤 USER CONTROLLER - Profile Management & Settings
// ==============================================================================
// Is controller mein user profile view karna, details (address/phone) update karna,
// password change karna aur profile picture upload karna shamil hai.
// ==============================================================================

const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ------------------------------------------------------------------------------
// 1. 👁️ GET USER PROFILE (GET /api/users/profile)
// ------------------------------------------------------------------------------
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'User profile nahi mili' });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 2. ✏️ UPDATE USER PROFILE (PUT /api/users/profile)
// ------------------------------------------------------------------------------
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
                message: 'Profile update ho gayi',
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
            res.status(404).json({ success: false, message: 'User nahi mila' });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 3. 🔒 CHANGE PASSWORD (PUT /api/users/change-password)
// ------------------------------------------------------------------------------
exports.changeUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ success: true, message: 'Aapka password successfully badal diya gaya hai' });
        } else {
            res.status(400).json({ success: false, message: 'Purana password galat hai' });
        }
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 4. 🖼️ UPLOAD PROFILE PHOTO (POST /api/users/upload-photo)
// ------------------------------------------------------------------------------
exports.uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Kripya image file select karein' });
        }

        const user = await User.findById(req.user._id);
        if (user) {
            const photoPath = `/uploads/profiles/${req.file.filename}`;
            user.profilePhoto = photoPath;
            await user.save();

            res.json({
                success: true,
                message: 'Profile photo successfully upload ho gayi',
                profilePhoto: photoPath
            });
        } else {
            res.status(404).json({ success: false, message: 'User nahi mila' });
        }
    } catch (error) {
        console.error('Upload photo error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
