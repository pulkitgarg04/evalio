const mongoose = require('mongoose');

const testAnswerSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestSession',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    selectedOption: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

testAnswerSchema.index({
    session: 1,
    question: 1
}, {
    unique: true
});

const TestAnswer = mongoose.model('TestAnswer', testAnswerSchema);

module.exports = TestAnswer;
