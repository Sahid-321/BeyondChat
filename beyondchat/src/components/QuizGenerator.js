import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  CircularProgress,
  Chip,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Quiz as QuizIcon,
  Description as PdfIcon,
  Numbers as NumbersIcon,
  AutoAwesome as GenerateIcon,
  Send as SubmitIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
} from '@mui/icons-material';
import { pdfAPI, quizAPI } from '../utils/api';

const QuizGenerator = () => {
  const location = useLocation();
  const { pdfIds, sourceType } = location.state || {};
  
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center' }}>
            <QuizIcon sx={{ mr: 2, fontSize: 'inherit' }} />
            Quiz Generator
          </Typography>

          {!quiz && !result && (
            <Box sx={{ space: 4 }}>
              {/* PDF Selection */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PdfIcon sx={{ mr: 1, fontSize: '1rem' }} />
                    Select PDF Source
                  </Box>
                </InputLabel>
                <Select
                  value={selectedPDF?._id || ''}
                  onChange={(e) => {
                    const pdf = pdfs.find(p => p._id === e.target.value);
                    setSelectedPDF(pdf);
                  }}
                  label="Select PDF Source"
                >
                  <MenuItem value="">
                    <em>Select a PDF...</em>
                  </MenuItem>
                  {pdfs.map((pdf) => (
                    <MenuItem key={pdf._id} value={pdf._id}>
                      {pdf.originalName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Quiz Type Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                  🎯 Quiz Type
                </Typography>
                
                <Grid container spacing={2}>
                  {[
                    { type: 'MCQ', label: 'Multiple Choice', emoji: '✅' },
                    { type: 'SAQ', label: 'Short Answer', emoji: '📝' },
                    { type: 'LAQ', label: 'Long Answer', emoji: '📋' }
                  ].map(({ type, label, emoji }) => (
                    <Grid item xs={12} sm={4} key={type}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: quizType === type ? 2 : 1,
                          borderColor: quizType === type ? 'primary.main' : 'divider',
                          bgcolor: quizType === type ? 'primary.light' : 'transparent',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                        onClick={() => setQuizType(type)}
                      >
                        <Typography variant="h3" sx={{ mb: 1 }}>
                          {emoji}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  💡 Choose your preferred question format
                </Typography>
                
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    ⚠️ <strong>Notice:</strong> Using OpenRouter for free AI-powered quiz generation from your PDF content.
                  </Typography>
                </Alert>
              </Box>

              {/* Question Count */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NumbersIcon sx={{ mr: 1, fontSize: '1rem' }} />
                    Number of Questions
                  </Box>
                </InputLabel>
                <Select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  label="Number of Questions"
                >
                  <MenuItem value={3}>3 Questions (Quick)</MenuItem>
                  <MenuItem value={5}>5 Questions (Standard)</MenuItem>
                  <MenuItem value={10}>10 Questions (Comprehensive)</MenuItem>
                  <MenuItem value={15}>15 Questions (Thorough)</MenuItem>
                </Select>
              </FormControl>

              {/* Generate Button */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={generateQuiz}
                disabled={!selectedPDF || generating}
                startIcon={generating ? <CircularProgress size={20} /> : <GenerateIcon />}
                sx={{ py: 2, fontSize: '1.1rem' }}
              >
                {generating ? 'Generating Quiz...' : 'Generate Quiz'}
              </Button>
            </Box>
          )}

          {/* Quiz Display */}
          {quiz && !result && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <QuizIcon sx={{ mr: 1 }} />
                  {quiz.type} Quiz - {quiz.questions.length} Questions
                </Typography>
                <Button
                  variant="outlined"
                  onClick={resetQuiz}
                  startIcon={<HomeIcon />}
                >
                  Back
                </Button>
              </Box>

              <Box sx={{ space: 3 }}>
                {quiz.questions.map((question, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                        <Chip 
                          label={index + 1} 
                          size="small" 
                          color="primary" 
                          sx={{ mr: 2 }} 
                        />
                        {question.question}
                      </Typography>

                      {question.type === 'MCQ' && question.options && (
                        <RadioGroup
                          value={userAnswers[index] || ''}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                        >
                          {question.options.map((option, optionIndex) => (
                            <FormControlLabel
                              key={optionIndex}
                              value={option}
                              control={<Radio />}
                              label={option}
                              sx={{
                                '& .MuiFormControlLabel-root': {
                                  ml: 0
                                }
                              }}
                            />
                          ))}
                        </RadioGroup>
                      )}

                      {(question.type === 'SAQ' || question.type === 'LAQ') && (
                        <TextField
                          multiline
                          rows={question.type === 'LAQ' ? 6 : 3}
                          fullWidth
                          value={userAnswers[index] || ''}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          placeholder="Type your answer here..."
                          variant="outlined"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={submitQuiz}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SubmitIcon />}
                sx={{ py: 2, fontSize: '1.1rem', mt: 3 }}
                color="success"
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            </Box>
          )}

          {/* Results Display */}
          {result && (
            <Box>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  Quiz Results 🎉
                </Typography>
                
                <Card sx={{ maxWidth: 400, mx: 'auto', p: 3, bgcolor: 'primary.light' }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
                    {result.percentage}%
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    {result.attempt.score} out of {result.attempt.totalQuestions} correct
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.percentage >= 80 ? '🌟 Excellent work!' : 
                     result.percentage >= 60 ? '👍 Good job!' : 
                     '📚 Keep studying!'}
                  </Typography>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={result.percentage} 
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                  />
                </Card>
              </Box>

              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                📊 Detailed Results
              </Typography>
              
              {quiz.questions.map((question, index) => {
                const attemptAnswer = result.attempt.answers[index];
                const isCorrect = attemptAnswer?.isCorrect;
                
                return (
                  <Card 
                    key={index} 
                    variant="outlined" 
                    sx={{ 
                      mb: 3,
                      border: 2,
                      borderColor: isCorrect ? 'success.light' : 'error.light',
                      bgcolor: isCorrect ? 'success.light' : 'error.light',
                      '& .MuiCardContent-root': {
                        bgcolor: 'background.paper'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 500, flex: 1 }}>
                          <Chip 
                            label={index + 1} 
                            size="small" 
                            color="primary" 
                            sx={{ mr: 2 }} 
                          />
                          {question.question}
                        </Typography>
                        <Chip
                          icon={isCorrect ? <CorrectIcon /> : <WrongIcon />}
                          label={isCorrect ? 'Correct' : 'Incorrect'}
                          color={isCorrect ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ space: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Your Answer:</strong> {attemptAnswer?.answer || 'No answer provided'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: 'success.main' }}>
                          <strong>Correct Answer:</strong> {question.correctAnswer}
                        </Typography>
                        {question.explanation && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Explanation:</strong> {question.explanation}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}

              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={resetQuiz}
                    startIcon={<RefreshIcon />}
                    sx={{ py: 2 }}
                  >
                    Try Again
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => window.location.reload()}
                    startIcon={<HomeIcon />}
                    sx={{ py: 2 }}
                  >
                    New Quiz
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default QuizGenerator;
