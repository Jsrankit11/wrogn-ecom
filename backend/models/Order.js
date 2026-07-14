const mongoose = require('mongoose');
const Counter = require('./Counter');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: Number,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            size: {
                type: String,
                default: 'M'
            },
            color: {
                type: String,
                default: 'Black'
            },
            image: {
                type: String,
                required: true
            }
        }
    ],
    quantity: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, default: '' },
        country: { type: String, default: 'India' },
        pincode: { type: String, required: true },
        phone: { type: String, required: true }
    },
    deliveryStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

// Auto-increment and format orderId as WRGN-XXXXXX
orderSchema.pre('save', async function () {
    if (this.isNew && !this.orderId) {
        const counter = await Counter.findByIdAndUpdate(
            'orderId',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const paddedSeq = String(counter.seq).padStart(6, '0');
        this.orderId = `WRGN-${paddedSeq}`;
    }
});

module.exports = mongoose.model('Order', orderSchema);
