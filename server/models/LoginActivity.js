const mongoose = require('mongoose');

const loginActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    emailSnapshot: {
        type: String,
        trim: true,
        default: ''
    },
    nameSnapshot: {
        type: String,
        trim: true,
        default: ''
    },
    loggedInAt: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },
    userAgent: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

const LoginActivity = mongoose.model('LoginActivity', loginActivitySchema);

module.exports = LoginActivity;
