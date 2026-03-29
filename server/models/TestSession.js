const mongoose = require('mongoose');

const testSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['IN_PROGRESS', 'SUBMITTED', 'EXPIRED'],
        default: 'IN_PROGRESS',
        required: true
    },
    submittedAt: {
        type: Date
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    },
    score: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    correctAnswers: {
        type: Number,
        default: 0
    },
    incorrectAnswers: {
        type: Number,
        default: 0
    },
    unanswered: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const TestSession = mongoose.model('TestSession', testSessionSchema);

module.exports = TestSession;
