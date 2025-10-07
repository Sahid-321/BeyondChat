const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const seedNCERTPDFs = require('./seedData');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beyondchat');

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
    // Seed NCERT PDFs on startup
    seedNCERTPDFs();
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/pdfs', require('./routes/pdfRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'BeyondChat API is running!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
