// ==============================================================================
// 👤 USER PROFILE ROUTES (/api/users)
// ==============================================================================
const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
    uploadProfilePhoto
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// User profile routes ke liye JWT authentication zaroori hai
router.use(protect);

// 👁️ Profile fetch karna aur ✏️ Personal details update karna
router.route('/profile')
    .get(getUserProfile)
    .put(updateUserProfile);

// 🔒 Password change karna
router.put('/change-password', changeUserPassword);

// 🖼️ Profile photo upload karna
router.post('/upload-photo', upload.single('profilePhoto'), uploadProfilePhoto);

module.exports = router;
