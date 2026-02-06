const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['pdf', 'video', 'link'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
