const { QuizAttempt } = require('../models/Quiz');

const progressController = {
    // Get user progress
    getUserProgress: async (req, res) => {
        try {
            const { userId = 'anonymous' } = req.query;

            const attempts = await QuizAttempt.find({ userId })
                .populate({
                    path: 'quizId',
                    populate: {
                        path: 'pdfId',
                        select: 'originalName'
                    }
                })
                .sort({ attemptDate: -1 });

            // Calculate statistics
            const totalAttempts = attempts.length;
            const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
            const totalQuestions = attempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
            const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

            // Group by PDF for strengths/weaknesses
            const pdfStats = {};
            attempts.forEach(attempt => {
                if (attempt.quizId && attempt.quizId.pdfId) {
                    const pdfName = attempt.quizId.pdfId.originalName;
                    if (!pdfStats[pdfName]) {
                        pdfStats[pdfName] = {
                            attempts: 0,
                            totalScore: 0,
                            totalQuestions: 0
                        };
                    }
                    pdfStats[pdfName].attempts++;
                    pdfStats[pdfName].totalScore += attempt.score;
                    pdfStats[pdfName].totalQuestions += attempt.totalQuestions;
                }
            });

            const strengths = [];
            const weaknesses = [];

            Object.entries(pdfStats).forEach(([pdfName, stats]) => {
                const percentage = (stats.totalScore / stats.totalQuestions) * 100;
                if (percentage >= 70) {
                    strengths.push({ topic: pdfName, percentage: Math.round(percentage) });
                } else if (percentage < 50) {
                    weaknesses.push({ topic: pdfName, percentage: Math.round(percentage) });
                }
            });

            res.json({
                totalAttempts,
                averageScore: Math.round(averageScore),
                recentAttempts: attempts.slice(0, 5),
                strengths,
                weaknesses,
                pdfStats
            });

        } catch (error) {
            console.error('Error fetching progress:', error);
            res.status(500).json({ error: 'Failed to fetch progress' });
        }
    }
};

module.exports = progressController;
