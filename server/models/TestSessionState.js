const mongoose = require('mongoose');

const testSessionStateSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestSession',
        required: true,
        unique: true,
        index: true
    },
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
    answers: {
        type: Map,
        of: Number,
        default: {}
    },
    marked: {
        type: [String],
        default: []
    },
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    fullscreenExitedAt: {
        type: Date,
        default: null
    },
    fullscreenDeadlineAt: {
        type: Date,
        default: null
    },
    fullscreenWarnings: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }
}, { timestamps: true });

const TestSessionState = mongoose.model('TestSessionState', testSessionStateSchema);

module.exports = TestSessionState;
