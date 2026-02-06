const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true,
        unique: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.length >= 4 && v.length <= 5;
            },
            message: 'Options array must contain 4 to 5 items.'
        },
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
