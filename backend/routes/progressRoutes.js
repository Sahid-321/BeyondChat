const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Get user progress
router.get('/user', progressController.getUserProgress);

module.exports = router;
