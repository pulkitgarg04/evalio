const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    duration: {
        type: Number,
        default: 30
    },
    questions: [{
        type: String
    }]
}, {
    timestamps: true
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
