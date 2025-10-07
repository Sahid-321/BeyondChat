const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const seedNCERTPDFs = require('./seedData');
require('dotenv').config();

const app = express();

// MongoDB connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beyondchat', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    cachedDb = connection;
    console.log('Connected to MongoDB');
    
    // Seed NCERT PDFs only once
    if (!global.seeded) {
      seedNCERTPDFs();
      global.seeded = true;
    }
    
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Middleware
app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist (for local development)
const fs = require('fs');
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/pdfs', require('./routes/pdfRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));

// Health check routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'BeyondChat API is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api', (req, res) => {
    res.json({ 
        message: 'BeyondChat API is running on Vercel!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: error.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        path: req.path,
        timestamp: new Date().toISOString()
    });
});

// Export for Vercel serverless
module.exports = async (req, res) => {
    try {
        // Connect to database on each request (serverless)
        await connectToDatabase();
        
        // Handle the request with Express app
        return app(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({ 
            error: 'Database connection failed',
            message: error.message 
        });
    }
};

// For local development only
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    
    connectToDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }).catch(error => {
        console.error('Failed to start server:', error);
    });
}
