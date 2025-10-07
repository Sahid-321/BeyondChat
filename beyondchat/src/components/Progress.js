import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  Paper,
  LinearProgress,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp as ProgressIcon,
  Quiz as QuizIcon,
  Star as StarIcon,
  FitnessCenter as StrengthIcon,
  School as WeaknessIcon,
  CheckCircle as CorrectIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  LightbulbOutlined as TipIcon,
  TrendingUp as ImprovementIcon,
  GpsFixed as TargetIcon,
} from '@mui/icons-material';

const Progress = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/progress/user?userId=anonymous`);
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setError('Failed to load progress data');
    }
  };

  const fetchRecentAttempts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/quiz/attempts/user?userId=anonymous`);
      setRecentAttempts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recent attempts:', error);
      setError('Failed to load recent attempts');
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ textAlign: 'center', p: 4 }}>
          <ErrorIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6">{error}</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center' }}>
        <ProgressIcon sx={{ mr: 2, fontSize: 'inherit' }} />
        Learning Progress
      </Typography>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <QuizIcon sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {progressData?.totalAttempts || 0}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Total Quiz Attempts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <StarIcon sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {progressData?.averageScore || 0}%
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Average Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <StrengthIcon sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {progressData?.strengths?.length || 0}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Strong Topics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Strengths and Weaknesses */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Strengths */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'success.main', display: 'flex', alignItems: 'center', mb: 3 }}>
                <StrengthIcon sx={{ mr: 1 }} />
                Your Strengths
              </Typography>
              
              {progressData?.strengths?.length > 0 ? (
                <Box sx={{ space: 2 }}>
                  {progressData.strengths.map((strength, index) => (
                    <Paper 
                      key={index} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        bgcolor: 'success.light',
                        '& .MuiPaper-root': {
                          bgcolor: 'background.paper'
                        }
                      }}
                    >
                      <Typography variant="body1" sx={{ flex: 1 }}>
                        {strength.topic}
                      </Typography>
                      <Chip 
                        label={`${strength.percentage}%`} 
                        color="success" 
                        variant="outlined"
                        size="small"
                      />
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <StarIcon sx={{ fontSize: 64, color: 'success.light', mb: 2 }} />
                  <Typography color="text.secondary">
                    Take more quizzes to identify your strengths!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Weaknesses */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'error.main', display: 'flex', alignItems: 'center', mb: 3 }}>
                <WeaknessIcon sx={{ mr: 1 }} />
                Areas to Improve
              </Typography>
              
              {progressData?.weaknesses?.length > 0 ? (
                <Box sx={{ space: 2 }}>
                  {progressData.weaknesses.map((weakness, index) => (
                    <Paper 
                      key={index} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        bgcolor: 'error.light',
                        '& .MuiPaper-root': {
                          bgcolor: 'background.paper'
                        }
                      }}
                    >
                      <Typography variant="body1" sx={{ flex: 1 }}>
                        {weakness.topic}
                      </Typography>
                      <Chip 
                        label={`${weakness.percentage}%`} 
                        color="error" 
                        variant="outlined"
                        size="small"
                      />
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CorrectIcon sx={{ fontSize: 64, color: 'success.light', mb: 2 }} />
                  <Typography color="text.secondary">
                    Great job! No weak areas identified yet.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Quiz Attempts */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
            <QuizIcon sx={{ mr: 1 }} />
            Recent Quiz Attempts
          </Typography>
          
          {recentAttempts?.length > 0 ? (
            <>
              {/* Mobile View */}
              {isMobile ? (
                <Box>
                  {recentAttempts.slice(0, 10).map((attempt, index) => {
                    const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                    
                    return (
                      <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ flex: 1, mr: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              {attempt.quizId?.pdfId?.originalName || 'Unknown'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <Chip 
                                label={attempt.quizId?.type || 'Quiz'} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(attempt.attemptDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                              {attempt.score}/{attempt.totalQuestions}
                            </Typography>
                            <Chip 
                              label={`${percentage}%`} 
                              color={getScoreColor(percentage)}
                              size="small"
                            />
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              ) : (
                /* Desktop Table View */
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Material</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Percentage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentAttempts.slice(0, 10).map((attempt, index) => {
                        const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                        
                        return (
                          <TableRow key={index} hover>
                            <TableCell>
                              {new Date(attempt.attemptDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell sx={{ maxWidth: 200 }}>
                              <Typography noWrap>
                                {attempt.quizId?.pdfId?.originalName || 'Unknown'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={attempt.quizId?.type || 'Quiz'} 
                                color="primary" 
                                variant="outlined"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {attempt.score}/{attempt.totalQuestions}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={`${percentage}%`} 
                                color={getScoreColor(percentage)}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <QuizIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No quiz attempts yet
              </Typography>
              <Button 
                variant="contained" 
                href="/quiz" 
                startIcon={<QuizIcon />}
                sx={{ mt: 2 }}
              >
                Take Your First Quiz
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Learning Tips */}
      <Alert severity="info" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <TipIcon sx={{ mr: 1 }} />
          Learning Tips
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <ImprovementIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
              To Improve Performance:
            </Typography>
            <List dense>
              {[
                'Review explanations for incorrect answers',
                'Focus on topics with lower scores',
                'Use the chat feature to ask specific questions',
                'Take quizzes regularly for better retention'
              ].map((tip, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <Box component="span" sx={{ color: 'info.main', fontSize: '0.8rem' }}>•</Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={tip} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <TargetIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
              Study Strategies:
            </Typography>
            <List dense>
              {[
                'Break down complex topics into smaller parts',
                'Practice different question types (MCQ, SAQ, LAQ)',
                'Create a consistent study schedule',
                'Review material before attempting quizzes'
              ].map((tip, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <Box component="span" sx={{ color: 'info.main', fontSize: '0.8rem' }}>•</Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={tip} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Alert>
    </Container>
  );
};

export default Progress;
