const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    size: {
        type: String,
        default: 'M'
    },
    color: {
        type: String,
        default: 'Black'
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Cart', cartSchema);
