const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },
    expectedOutput: {
        type: String,
        required: true
    },
    isHidden: {
        type: Boolean,
        default: true
    }
});

const CodingQuestionSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },

    description: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    testCases: {
        type: [TestCaseSchema],
        validate: {
            validator: function (testcases) {
                return testcases.length > 0;
            },
            message: 'At least one test case is required'
        },
        required: true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        immutable : true,
    },
    createdBy: {
        type: String,
        required: true
    }
});

const CodingQuestion = mongoose.model('CodingQuestion',CodingQuestionSchema);
module.exports = CodingQuestion;