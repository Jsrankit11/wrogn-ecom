const mongoose = require('mongoose');
const Counter = require('./Counter');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true
    },
    brand: {
        type: String,
        default: 'Wrogn'
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    oldPrice: {
        type: Number
    },
    discount: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: [true, 'Main image is required']
    },
    images: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    sizes: {
        type: [String],
        default: ['S', 'M', 'L', 'XL']
    },
    colors: {
        type: [String],
        default: ['Black']
    },
    color: {
        type: String,
        default: 'Black'
    },
    stock: {
        type: Number,
        default: 50
    },
    rating: {
        type: Number,
        default: 4.5
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    badge: {
        type: String,
        default: ''
    },
    tags: {
        type: [String],
        default: []
    }
});

// Auto-increment product numeric ID
productSchema.pre('save', async function () {
    if (this.isNew && !this.id) {
        const counter = await Counter.findByIdAndUpdate(
            'productId',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.id = counter.seq;
    }
});

module.exports = mongoose.model('Product', productSchema);
