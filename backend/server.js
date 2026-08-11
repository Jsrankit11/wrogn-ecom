// ==============================================================================
// 🚀 MAIN SERVER FILE - Wrogn E-Commerce Backend
// ==============================================================================
// Yeh file hamari Express server ko start karti hai, database connect karti hai,
// aur saare API routes aur middleware ko handle karti hai.
// ==============================================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Environment variables load kar rahe hain (.env file se)
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

// Database connection start kar rahe hain
connectDB();

// Express app initialize kiya
const app = express();

// Enable CORS taaki frontend API ko call kar sake
app.use(cors());

// Basic security headers lagane ke liye Helmet
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    })
);

// JSON aur form data parse karne ke liye middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend static files (HTML, CSS, JS, Images) serve karne ke liye
app.use(express.static(path.join(__dirname, '../'), {
    setHeaders: (res, path) => {
        // Cache issue avoid karne ke liye fresh files bhejte hain
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    }
}));

// Uploaded product/profile images serve karne ke liye static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------------------------------------------------------------------
// 📌 API ROUTE IMPORTS
// ------------------------------------------------------------------------------
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ------------------------------------------------------------------------------
// 🔗 MOUNTING API ROUTES
// ------------------------------------------------------------------------------
app.use('/api/auth', authRoutes);         // Login, Register, Password Reset
app.use('/api/users', userRoutes);       // User Profile, Password Update, Photo Upload
app.use('/api/products', productRoutes); // Products CRUD, Filter, Search
app.use('/api/cart', cartRoutes);         // Cart Operations (Add, Update, Remove, Sync)
app.use('/api/wishlist', wishlistRoutes); // Wishlist Add/Remove
app.use('/api/orders', orderRoutes);     // Place Order, Order History, Status
app.use('/api/contact', contactRoutes);   // Contact Us Messages
app.use('/api/admin', adminRoutes);       // Admin Dashboard, Analytics, User Management

// Frontend routing fallback (agar koi direct route open kare toh index.html serve ho)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Global Error Handler - agar koi error aaye toh cleanly JSON response return kare
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Port setting: .env se PORT lega ya fallback 5000 use karega
const PORT = process.env.PORT || 5000;

// Agar production/vercel nahi hai toh local server listen karega
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
    });
}

// Vercel serverless functions ke liye app export kiya
module.exports = app;
