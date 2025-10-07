import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgressData();
    fetchRecentAttempts();
  }, []);

  const fetchProgressData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/progress`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setError('Failed to load progress data');
    }
  };

  const fetchRecentAttempts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/quiz/attempts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRecentAttempts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recent attempts:', error);
      setError('Failed to load recent attempts');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8">
        <div className="text-4xl mb-4">⚠️</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto responsive-container space-y-4 sm:space-y-6">
      <div className="glass rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6 flex items-center">
          <span className="mr-2 lg:mr-3">📊</span>
          Learning Progress
        </h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="stat-card bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30 p-4 lg:p-6">
            <div className="text-3xl lg:text-4xl font-bold text-blue-300 mb-2">
              {progressData?.totalAttempts || 0}
            </div>
            <div className="text-blue-100 flex items-center text-sm lg:text-base">
              <span className="mr-2">🎯</span>
              Total Quiz Attempts
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30 p-4 lg:p-6">
            <div className="text-3xl lg:text-4xl font-bold text-green-300 mb-2">
              {progressData?.averageScore || 0}%
            </div>
            <div className="text-green-100 flex items-center text-sm lg:text-base">
              <span className="mr-2">⭐</span>
              Average Score
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30 p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
            <div className="text-3xl lg:text-4xl font-bold text-purple-300 mb-2">
              {progressData?.strengths?.length || 0}
            </div>
            <div className="text-purple-100 flex items-center text-sm lg:text-base">
              <span className="mr-2">💪</span>
              Strong Topics
            </div>
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Strengths */}
          <div className="glass rounded-xl p-4 sm:p-6 border border-green-400/30">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-green-300 mb-4 flex items-center">
              <span className="mr-2">💪</span>
              Your Strengths
            </h2>
            {progressData?.strengths?.length > 0 ? (
              <div className="space-y-3">
                {progressData.strengths.map((strength, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-400/20">
                    <span className="text-white text-sm lg:text-base flex-1">
                      {strength.topic}
                    </span>
                    <span className="bg-green-500/30 text-green-200 px-3 py-1 rounded-full text-xs lg:text-sm font-medium border border-green-400/30 self-start sm:self-auto">
                      {strength.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-3xl lg:text-4xl mb-2">🌟</div>
                <p className="text-green-200 text-sm lg:text-base">Take more quizzes to identify your strengths!</p>
              </div>
            )}
          </div>

          {/* Weaknesses */}
          <div className="glass rounded-xl p-4 sm:p-6 border border-red-400/30">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-red-300 mb-4 flex items-center">
              <span className="mr-2">📚</span>
              Areas to Improve
            </h2>
            {progressData?.weaknesses?.length > 0 ? (
              <div className="space-y-3">
                {progressData.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-400/20">
                    <span className="text-white text-sm lg:text-base flex-1">
                      {weakness.topic}
                    </span>
                    <span className="bg-red-500/30 text-red-200 px-3 py-1 rounded-full text-xs lg:text-sm font-medium border border-red-400/30 self-start sm:self-auto">
                      {weakness.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-3xl lg:text-4xl mb-2">🎉</div>
                <p className="text-red-200 text-sm lg:text-base">Great job! No weak areas identified yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="glass rounded-xl p-4 sm:p-6 border border-white/20">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">📝</span>
            Recent Quiz Attempts
          </h2>
          
          {recentAttempts?.length > 0 ? (
            <div className="space-y-4 lg:space-y-0">
              {/* Mobile: Card Layout */}
              <div className="lg:hidden space-y-3">
                {recentAttempts.slice(0, 10).map((attempt, index) => {
                  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                  
                  return (
                    <div key={index} className="glass rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 mr-3">
                          <h3 className="font-medium text-white text-sm mb-1 line-clamp-2">
                            {attempt.quizId?.pdfId?.originalName || 'Unknown'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full text-xs border border-blue-400/30">
                              {attempt.quizId?.type || 'Quiz'}
                            </span>
                            <span className="text-xs text-gray-300">
                              {new Date(attempt.attemptDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-white font-medium text-sm mb-1">
                            {attempt.score}/{attempt.totalQuestions}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            percentage >= 80 
                              ? 'bg-green-500/30 text-green-200 border-green-400/30' :
                            percentage >= 60 
                              ? 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30' :
                              'bg-red-500/30 text-red-200 border-red-400/30'
                          }`}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop: Table Layout */}
              <div className="hidden lg:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Material</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Score</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttempts.slice(0, 10).map((attempt, index) => {
                      const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                      
                      return (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 text-white">
                            {new Date(attempt.attemptDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 truncate max-w-xs text-purple-100">
                            {attempt.quizId?.pdfId?.originalName || 'Unknown'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full text-xs border border-blue-400/30">
                              {attempt.quizId?.type || 'Quiz'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white font-medium">
                            {attempt.score}/{attempt.totalQuestions}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              percentage >= 80 
                                ? 'bg-green-500/30 text-green-200 border-green-400/30' :
                              percentage >= 60 
                                ? 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30' :
                                'bg-red-500/30 text-red-200 border-red-400/30'
                            }`}>
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 lg:py-12">
              <div className="text-4xl lg:text-6xl mb-4">📝</div>
              <div className="text-purple-200 mb-4 text-base lg:text-lg">No quiz attempts yet</div>
              <a
                href="/quiz"
                className="btn-primary inline-flex items-center text-sm lg:text-base"
              >
                <span className="mr-2">🚀</span>
                Take Your First Quiz
              </a>
            </div>
          )}
        </div>

        {/* Learning Tips */}
        <div className="glass rounded-xl p-4 sm:p-6 lg:p-8 border border-yellow-400/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-yellow-300 mb-4 lg:mb-6 flex items-center">
            <span className="mr-2">💡</span>
            Learning Tips
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 text-sm lg:text-base">
            <div className="space-y-3 lg:space-y-4">
              <h3 className="font-medium text-yellow-200 mb-3 flex items-center">
                <span className="mr-2">📈</span>
                To Improve Performance:
              </h3>
              <div className="space-y-2 lg:space-y-3">
                {[
                  'Review explanations for incorrect answers',
                  'Focus on topics with lower scores',
                  'Use the chat feature to ask specific questions',
                  'Take quizzes regularly for better retention'
                ].map((tip, index) => (
                  <div key={index} className="flex items-start text-yellow-100">
                    <span className="text-yellow-300 mr-2 mt-1 text-sm lg:text-base">•</span>
                    <span className="text-sm lg:text-base">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 lg:space-y-4">
              <h3 className="font-medium text-yellow-200 mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Study Strategies:
              </h3>
              <div className="space-y-2 lg:space-y-3">
                {[
                  'Break down complex topics into smaller parts',
                  'Practice different question types (MCQ, SAQ, LAQ)',
                  'Create a consistent study schedule',
                  'Review material before attempting quizzes'
                ].map((tip, index) => (
                  <div key={index} className="flex items-start text-yellow-100">
                    <span className="text-yellow-300 mr-2 mt-1 text-sm lg:text-base">•</span>
                    <span className="text-sm lg:text-base">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
