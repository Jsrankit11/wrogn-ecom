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

router.use(protect); // All user routes require authentication

router.route('/profile')
    .get(getUserProfile)
    .put(updateUserProfile);

router.put('/change-password', changeUserPassword);
router.post('/upload-photo', upload.single('profilePhoto'), uploadProfilePhoto);

module.exports = router;
