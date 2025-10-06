import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pdfAPI, quizAPI } from '../utils/api';

const QuizGenerator = () => {
  const location = useLocation();
  const [pdfs, setPdfs] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(location.state?.selectedPDF || null);
  const [quizType, setQuizType] = useState('MCQ');
  const [questionCount, setQuestionCount] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadPDFs();
  }, []);

  const loadPDFs = async () => {
    try {
      const response = await pdfAPI.getAllPDFs();
      setPdfs(response);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    }
  };

  const generateQuiz = async () => {
    if (!selectedPDF) {
      alert('Please select a PDF first');
      return;
    }

    setGenerating(true);
    try {
      const response = await quizAPI.generateQuiz(selectedPDF._id, quizType, questionCount);
      setQuiz(response.quiz);
      setUserAnswers({});
      setResult(null);
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const answers = quiz.questions.map((_, index) => userAnswers[index] || '');
      const response = await quizAPI.submitQuiz(quiz._id, answers);
      setResult(response);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setQuiz(null);
    setUserAnswers({});
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto responsive-container">
      <div className="glass rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6 flex items-center">
          <span className="mr-2 lg:mr-3">📝</span>
          Quiz Generator
        </h1>

        {!quiz && !result && (
          <div className="space-y-4 sm:space-y-6">
            {/* PDF Selection */}
            <div>
              <label className="block text-sm lg:text-base font-medium text-white mb-3 flex items-center">
                <span className="mr-2">📚</span>
                Select PDF Source
              </label>
              <select
                value={selectedPDF?._id || ''}
                onChange={(e) => {
                  const pdf = pdfs.find(p => p._id === e.target.value);
                  setSelectedPDF(pdf);
                }}
                className="select-field w-full text-sm lg:text-base"
              >
                <option value="">Select a PDF...</option>
                {pdfs.map((pdf) => (
                  <option key={pdf._id} value={pdf._id}>
                    {pdf.originalName}
                  </option>
                ))}
              </select>
            </div>

            {/* Quiz Type Selection */}
            <div>
              <label className="block text-sm lg:text-base font-medium text-white mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Quiz Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                {[
                  { type: 'MCQ', label: 'Multiple Choice', emoji: '✅' },
                  { type: 'SAQ', label: 'Short Answer', emoji: '📝' },
                  { type: 'LAQ', label: 'Long Answer', emoji: '📋' }
                ].map(({ type, label, emoji }) => (
                  <label key={type} className="quiz-option">
                    <input
                      type="radio"
                      value={type}
                      checked={quizType === type}
                      onChange={(e) => setQuizType(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`quiz-option-content ${quizType === type ? 'selected' : ''} p-3 lg:p-4`}>
                      <span className="text-2xl lg:text-3xl mb-2">{emoji}</span>
                      <span className="font-medium text-sm lg:text-base">{type}</span>
                      <span className="text-xs lg:text-sm text-purple-200">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-purple-200 mt-3 text-center">
                💡 Choose your preferred question format
              </p>
              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3 mt-4">
                <p className="text-xs text-yellow-100 text-center">
                  ⚠️ <strong>Notice:</strong> Using OpenRouter for free AI-powered quiz generation from your PDF content.
                </p>
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm lg:text-base font-medium text-white mb-3 flex items-center">
                <span className="mr-2">🔢</span>
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="select-field w-full text-sm lg:text-base"
              >
                <option value={3}>3 Questions (Quick)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={10}>10 Questions (Comprehensive)</option>
                <option value={15}>15 Questions (Thorough)</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQuiz}
              disabled={!selectedPDF || generating}
              className={`btn-touch w-full py-4 text-base lg:text-lg font-semibold ${
                !selectedPDF || generating
                  ? 'opacity-50 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {generating ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-3"></div>
                  Generating Quiz...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">✨</span>
                  Generate Quiz
                </div>
              )}
            </button>
          </div>
        )}

        {/* Quiz Display */}
        {quiz && !result && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white flex items-center">
                <span className="mr-2">📝</span>
                {quiz.type} Quiz - {quiz.questions.length} Questions
              </h2>
              <button
                onClick={resetQuiz}
                className="btn-touch btn-secondary flex items-center justify-center sm:justify-start px-4 py-2"
              >
                <span className="mr-2">←</span>
                Back
              </button>
            </div>

            <div className="space-y-4 lg:space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={index} className="glass rounded-xl p-4 sm:p-5 lg:p-6 border border-white/20">
                  <h3 className="font-medium mb-4 text-white text-base lg:text-lg">
                    <span className="text-purple-300 mr-2">{index + 1}.</span>
                    {question.question}
                  </h3>

                  {question.type === 'MCQ' && question.options && (
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/10">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={userAnswers[index] === option}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className="mr-3 w-4 h-4 text-blue-600 bg-white/20 border-white/30 min-w-[16px] min-h-[16px]"
                          />
                          <span className="text-white text-sm lg:text-base">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {(question.type === 'SAQ' || question.type === 'LAQ') && (
                    <textarea
                      value={userAnswers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder="Type your answer here..."
                      className="input-touch w-full resize-none text-sm lg:text-base"
                      rows={question.type === 'LAQ' ? 6 : 3}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={submitQuiz}
              disabled={loading}
              className={`btn-touch w-full py-4 text-base lg:text-lg font-semibold ${
                loading ? 'opacity-50 cursor-not-allowed' : 'btn-success'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-3"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">📤</span>
                  Submit Quiz
                </div>
              )}
            </button>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Quiz Results 🎉
              </h2>
              <div className="glass rounded-xl p-6 lg:p-8 border border-white/20">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {result.percentage}%
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl text-purple-200 mb-2">
                  {result.attempt.score} out of {result.attempt.totalQuestions} correct
                </p>
                <p className="text-sm lg:text-base text-gray-300">
                  {result.percentage >= 80 ? '🌟 Excellent work!' : 
                   result.percentage >= 60 ? '👍 Good job!' : 
                   '📚 Keep studying!'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
                📊 Detailed Results
              </h3>
              {quiz.questions.map((question, index) => {
                const attemptAnswer = result.attempt.answers[index];
                const isCorrect = attemptAnswer?.isCorrect;
                
                return (
                  <div key={index} className={`glass rounded-xl p-4 sm:p-5 lg:p-6 border ${
                    isCorrect ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-white text-sm lg:text-base">
                        <span className="text-purple-300 mr-2">{index + 1}.</span>
                        {question.question}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isCorrect ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                      }`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm lg:text-base">
                      <p className="text-gray-300">
                        <strong>Your Answer:</strong> {attemptAnswer?.answer || 'No answer provided'}
                      </p>
                      <p className="text-green-300">
                        <strong>Correct Answer:</strong> {question.correctAnswer}
                      </p>
                      {question.explanation && (
                        <p className="text-purple-200">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={resetQuiz}
                className="btn-touch btn-primary flex-1 py-3 text-sm lg:text-base"
              >
                <span className="mr-2">🔄</span>
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-touch btn-secondary flex-1 py-3 text-sm lg:text-base"
              >
                <span className="mr-2">🏠</span>
                New Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;
