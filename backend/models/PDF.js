const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    chunks: [{
        text: String,
        pageNumber: Number,
        chunkIndex: Number
    }],
    isNCERT: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('PDF', pdfSchema);
