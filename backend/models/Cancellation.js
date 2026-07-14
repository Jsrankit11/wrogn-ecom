const mongoose = require('mongoose');

const cancellationSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: [true, 'Cancellation reason is required'],
        trim: true
    },
    cancelDate: {
        type: Date,
        default: Date.now
    },
    refundStatus: {
        type: String,
        enum: ['Pending', 'Processed', 'N/A'],
        default: 'Pending'
    }
});

module.exports = mongoose.model('Cancellation', cancellationSchema);
