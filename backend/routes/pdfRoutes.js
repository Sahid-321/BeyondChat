const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

// Upload PDF
router.post('/upload', pdfController.upload, pdfController.uploadPDF);

// Get all PDFs
router.get('/', pdfController.getAllPDFs);

// Get PDF content
router.get('/:id/content', pdfController.getPDFContent);

// Get PDF file
router.get('/:id/file', pdfController.getPDFFile);

module.exports = router;
