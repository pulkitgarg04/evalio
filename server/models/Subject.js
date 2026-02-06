const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4],
        default: 1
    },
    questionCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
