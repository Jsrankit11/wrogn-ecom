const Contact = require('../models/Contact');

exports.submitContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
        }

        const newMessage = await Contact.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getContactMessages = async (req, res) => {
    try {
        const messages = await Contact.find({}).sort({ date: -1 });
        res.json({ success: true, count: messages.length, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
