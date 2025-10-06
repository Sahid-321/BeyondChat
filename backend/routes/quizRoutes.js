const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Generate quiz
router.post('/generate', quizController.generateQuiz);

// Get quiz
router.get('/:id', quizController.getQuiz);

// Submit quiz
router.post('/submit', quizController.submitQuiz);

// Get quiz attempts
router.get('/attempts/user', quizController.getQuizAttempts);

module.exports = router;
