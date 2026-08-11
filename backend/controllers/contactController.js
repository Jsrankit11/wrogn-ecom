// ==============================================================================
// ✉️ CONTACT CONTROLLER - Customer Inquiries & Support Messages
// ==============================================================================
// Is controller mein customer dwara bheje gaye "Contact Us" form messages save hote hain,
// aur Admin un sabhi inquiries ko view kar sakta hai.
// ==============================================================================

const Contact = require('../models/Contact');

// ------------------------------------------------------------------------------
// 1. 📩 SUBMIT CONTACT MESSAGE (POST /api/contact)
// ------------------------------------------------------------------------------
exports.submitContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, Email aur Message fields required hain' });
        }

        // Database mein customer inquiry save karte hain
        const newMessage = await Contact.create({
            name,
            email,
            subject: subject || 'General Inquiry',
            message
        });

        res.status(201).json({ success: true, message: 'Aapka message hamari team tak pahunch gaya hai. Dhanyawad!' });
    } catch (error) {
        console.error('Contact message submit error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 2. 📋 GET ALL MESSAGES (GET /api/contact - Admin Only)
// ------------------------------------------------------------------------------
exports.getContactMessages = async (req, res) => {
    try {
        const messages = await Contact.find({}).sort({ date: -1 });
        res.json({ success: true, count: messages.length, messages });
    } catch (error) {
        console.error('Fetch contact messages error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
