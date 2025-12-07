const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Sort by creation time descending by default
wishSchema.query.byRecent = function() {
    return this.sort({ createdAt: -1 });
};

module.exports = mongoose.model('Wish', wishSchema);
