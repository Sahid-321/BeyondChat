const { Quiz, QuizAttempt } = require('../models/Quiz');
const PDF = require('../models/PDF');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || 'dummy-key',
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'BeyondChat Study Assistant'
    }
});

const quizController = {
    // Generate quiz from PDF
    generateQuiz: async (req, res) => {
        console.log('Quiz generation request received:', req.body);
        try {
            const { pdfId, type, questionCount = 5 } = req.body;
            console.log('Processing quiz for PDF:', pdfId, 'Type:', type);

            const pdf = await PDF.findById(pdfId);
            if (!pdf) {
                return res.status(404).json({ error: 'PDF not found' });
            }

            // Check if OpenRouter API key is available
            if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
                // Return sample quiz when API key is not available
                const sampleQuiz = new Quiz({
                    pdfId: pdfId,
                    type: type,
                    questions: [
                        {
                            question: "What is the main topic discussed in this material?",
                            type: type,
                            options: type === 'MCQ' ? ["Physics concepts", "Mathematical formulas", "Scientific methods", "All of the above"] : undefined,
                            correctAnswer: type === 'MCQ' ? "All of the above" : "The material discusses fundamental physics concepts, mathematical formulas, and scientific methods.",
                            explanation: "This is a sample question. Please add your OpenRouter API key to enable AI-generated questions.",
                            pageReference: 1
                        },
                        {
                            question: "Which of the following is a fundamental unit in physics?",
                            type: type,
                            options: type === 'MCQ' ? ["Meter", "Kilometer", "Centimeter", "Millimeter"] : undefined,
                            correctAnswer: type === 'MCQ' ? "Meter" : "Meter is the fundamental unit of length in the SI system.",
                            explanation: "The meter is the base unit of length in the International System of Units (SI).",
                            pageReference: 2
                        }
                    ]
                });

                await sampleQuiz.save();

                return res.json({
                    message: 'Sample quiz generated (OpenRouter API key required for AI-generated content)',
                    quiz: sampleQuiz
                });
            }

            // Use first few chunks for quiz generation to avoid token limits
            const contentForQuiz = pdf.chunks.slice(0, 5).map(chunk => chunk.text).join('\n\n');

            const prompt = `Based on the following educational content, generate ${questionCount} ${type} questions:

Content:
${contentForQuiz}

Requirements:
- For MCQ: Provide 4 options (A, B, C, D) with one correct answer
- For SAQ: Short answer questions requiring 2-3 sentences
- For LAQ: Long answer questions requiring detailed explanations
- Include explanations for each answer
- Reference page numbers when possible

Format the response as JSON with this structure:
{
  "questions": [
    {
      "question": "Question text",
      "type": "${type}",
      "options": ["Option A", "Option B", "Option C", "Option D"], // Only for MCQ
      "correctAnswer": "Correct answer text",
      "explanation": "Detailed explanation",
      "pageReference": 1
    }
  ]
}`;

            try {
                const completion = await openai.chat.completions.create({
                    model: "openai/gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                    max_tokens: 2000
                });

                let quizData;
                try {
                    quizData = JSON.parse(completion.choices[0].message.content);
                } catch (parseError) {
                    // Fallback: create a simple quiz if JSON parsing fails
                    quizData = {
                        questions: [{
                            question: "What is the main topic discussed in this content?",
                            type: type,
                            options: type === 'MCQ' ? ["Topic A", "Topic B", "Topic C", "Topic D"] : undefined,
                            correctAnswer: "Please refer to the content",
                            explanation: "This question tests understanding of the main concepts.",
                            pageReference: 1
                        }]
                    };
                }

                const quiz = new Quiz({
                    pdfId: pdfId,
                    type: type,
                    questions: quizData.questions
                });

                await quiz.save();

                res.json({
                    message: 'Quiz generated successfully',
                    quiz: quiz
                });

            } catch (aiError) {
                console.error('OpenRouter API Error:', aiError);
                
                // Handle quota exceeded error specifically
                if (aiError.status === 429 && aiError.code === 'insufficient_quota') {
                    // Generate content-based questions from PDF chunks
                    const sampleQuestions = [];
                    const chunks = pdf.chunks.slice(0, questionCount);
                    
                    chunks.forEach((chunk, index) => {
                        const question = {
                            question: `Based on page ${chunk.pageNumber}, what is discussed in the following content: "${chunk.text.substring(0, 100)}..."?`,
                            type: type,
                            options: type === 'MCQ' ? [
                                "Fundamental concepts",
                                "Mathematical formulas", 
                                "Practical applications",
                                "All of the above"
                            ] : undefined,
                            correctAnswer: type === 'MCQ' ? "All of the above" : "Please refer to the specific content on this page for detailed information.",
                            explanation: `This question is based on content from page ${chunk.pageNumber}. Review the material carefully to understand the concepts.`,
                            pageReference: chunk.pageNumber
                        };
                        sampleQuestions.push(question);
                    });

                    const fallbackQuiz = new Quiz({
                        pdfId: pdfId,
                        type: type,
                        questions: sampleQuestions.length > 0 ? sampleQuestions : [
                            {
                                question: "What is the main subject of this educational material?",
                                type: type,
                                options: type === 'MCQ' ? ["Science", "Mathematics", "Literature", "General Knowledge"] : undefined,
                                correctAnswer: type === 'MCQ' ? "Science" : "Please review the content to identify the main subject.",
                                explanation: "This is a content-based question. AI quota exceeded - questions generated from PDF content.",
                                pageReference: 1
                            }
                        ]
                    });

                    await fallbackQuiz.save();

                    return res.json({
                        message: 'Quiz generated from PDF content (OpenRouter quota exceeded)',
                        quiz: fallbackQuiz,
                        note: 'AI-powered question generation is temporarily unavailable due to quota limits. Questions are based on your PDF content.'
                    });
                }
                
                // For other errors, throw to be caught by outer catch block
                throw aiError;
            }

        } catch (error) {
            console.error('Error generating quiz:', error);
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
            
            // If it's an OpenRouter error, provide a helpful message
            if (error.message && error.message.includes('API key')) {
                return res.status(400).json({ 
                    error: 'OpenRouter API key is required for AI-generated quizzes. Please check your configuration.' 
                });
            }
            
            res.status(500).json({ error: 'Failed to generate quiz' });
        }
    },

    // Get quiz by ID
    getQuiz: async (req, res) => {
        try {
            const quiz = await Quiz.findById(req.params.id).populate('pdfId', 'originalName');
            if (!quiz) {
                return res.status(404).json({ error: 'Quiz not found' });
            }

            res.json(quiz);
        } catch (error) {
            console.error('Error fetching quiz:', error);
            res.status(500).json({ error: 'Failed to fetch quiz' });
        }
    },

    // Submit quiz attempt
    submitQuiz: async (req, res) => {
        try {
            const { quizId, answers, userId = 'anonymous' } = req.body;

            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return res.status(404).json({ error: 'Quiz not found' });
            }

            let score = 0;
            const gradedAnswers = answers.map((answer, index) => {
                const question = quiz.questions[index];
                const isCorrect = question.correctAnswer.toLowerCase().trim() === answer.toLowerCase().trim();
                if (isCorrect) score++;

                return {
                    questionIndex: index,
                    answer: answer,
                    isCorrect: isCorrect
                };
            });

            const attempt = new QuizAttempt({
                quizId: quizId,
                userId: userId,
                answers: gradedAnswers,
                score: score,
                totalQuestions: quiz.questions.length
            });

            await attempt.save();

            res.json({
                message: 'Quiz submitted successfully',
                attempt: attempt,
                percentage: Math.round((score / quiz.questions.length) * 100)
            });

        } catch (error) {
            console.error('Error submitting quiz:', error);
            res.status(500).json({ error: 'Failed to submit quiz' });
        }
    },

    // Get quiz attempts for progress tracking
    getQuizAttempts: async (req, res) => {
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

            res.json(attempts);
        } catch (error) {
            console.error('Error fetching quiz attempts:', error);
            res.status(500).json({ error: 'Failed to fetch quiz attempts' });
        }
    }
};

module.exports = quizController;
