const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
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
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        selectedOption: Number,
        isCorrect: Boolean
    }],
    timeTaken: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);

module.exports = TestAttempt;
