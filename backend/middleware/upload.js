// ==============================================================================
// 📁 FILE UPLOAD MIDDLEWARE (Multer)
// ==============================================================================
// Yeh file product images aur user profile photos ko local folder mein
// safely upload aur validate karne ka kaam karti hai.
// ==============================================================================

const multer = require('multer');
const path = require('path');

// Storage configuration - file kahan aur kis naam se save hogi
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest = 'backend/uploads/';
        // Agar profile photo hai toh 'profiles' folder mein, warna 'products' mein
        if (file.fieldname === 'profilePhoto') {
            dest += 'profiles/';
        } else {
            dest += 'products/';
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        // Unique filename banate hain: fieldname-timestamp.extension (e.g. image-1712345678.jpg)
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    }
});

// File filter - check karta hai ki file sirf image format ki ho
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Keval image files (jpeg, jpg, png, webp) allowed hain!'));
    }
};

// Multer instance create kiya (5MB file size limit ke sath)
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Maximum 5MB per file
});

module.exports = upload;
