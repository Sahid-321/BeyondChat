const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: String,
    title: String,
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant']
        },
        content: String,
        citations: [{
            pageNumber: Number,
            snippet: String,
            pdfId: mongoose.Schema.Types.ObjectId
        }],
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    pdfContext: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDF'
    }],
    createdDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chat', chatSchema);
