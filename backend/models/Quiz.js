const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    pdfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDF',
        required: true
    },
    type: {
        type: String,
        enum: ['MCQ', 'SAQ', 'LAQ'],
        required: true
    },
    questions: [{
        question: String,
        type: {
            type: String,
            enum: ['MCQ', 'SAQ', 'LAQ']
        },
        options: [String], // For MCQ
        correctAnswer: String,
        explanation: String,
        pageReference: Number
    }],
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const quizAttemptSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    userId: String, // For now using simple string, can be enhanced with user auth
    answers: [{
        questionIndex: Number,
        answer: String,
        isCorrect: Boolean
    }],
    score: Number,
    totalQuestions: Number,
    attemptDate: {
        type: Date,
        default: Date.now
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);
const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = { Quiz, QuizAttempt };
