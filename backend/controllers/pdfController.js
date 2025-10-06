const PDF = require('../models/PDF');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const pdfController = {
    // Upload PDF
    uploadPDF: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const dataBuffer = fs.readFileSync(req.file.path);
            const pdfData = await pdfParse(dataBuffer);

            // Basic chunking by pages (simplified)
            const chunks = [];
            const pages = pdfData.text.split('\f'); // Form feed character typically separates pages
            
            pages.forEach((pageText, index) => {
                if (pageText.trim()) {
                    chunks.push({
                        text: pageText.trim(),
                        pageNumber: index + 1,
                        chunkIndex: index
                    });
                }
            });

            const pdf = new PDF({
                filename: req.file.filename,
                originalName: req.file.originalname,
                filepath: req.file.path,
                content: pdfData.text,
                chunks: chunks
            });

            await pdf.save();

            res.json({
                message: 'PDF uploaded successfully',
                pdf: {
                    id: pdf._id,
                    originalName: pdf.originalName,
                    uploadDate: pdf.uploadDate,
                    pageCount: chunks.length
                }
            });
        } catch (error) {
            console.error('Error uploading PDF:', error);
            res.status(500).json({ error: 'Failed to upload PDF' });
        }
    },

    // Get all PDFs
    getAllPDFs: async (req, res) => {
        try {
            const pdfs = await PDF.find({}, 'originalName uploadDate _id isNCERT').sort({ uploadDate: -1 });
            res.json(pdfs);
        } catch (error) {
            console.error('Error fetching PDFs:', error);
            res.status(500).json({ error: 'Failed to fetch PDFs' });
        }
    },

    // Get PDF content
    getPDFContent: async (req, res) => {
        try {
            const pdf = await PDF.findById(req.params.id);
            if (!pdf) {
                return res.status(404).json({ error: 'PDF not found' });
            }

            res.json({
                id: pdf._id,
                originalName: pdf.originalName,
                content: pdf.content,
                chunks: pdf.chunks,
                uploadDate: pdf.uploadDate
            });
        } catch (error) {
            console.error('Error fetching PDF content:', error);
            res.status(500).json({ error: 'Failed to fetch PDF content' });
        }
    },

    // Get PDF file
    getPDFFile: async (req, res) => {
        try {
            const pdf = await PDF.findById(req.params.id);
            if (!pdf) {
                return res.status(404).json({ error: 'PDF not found' });
            }

            const filePath = path.resolve(pdf.filepath);
            if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="${pdf.originalName}"`);
                fs.createReadStream(filePath).pipe(res);
            } else {
                res.status(404).json({ error: 'PDF file not found on disk' });
            }
        } catch (error) {
            console.error('Error serving PDF file:', error);
            res.status(500).json({ error: 'Failed to serve PDF file' });
        }
    },

    upload: upload.single('pdf')
};

module.exports = pdfController;
