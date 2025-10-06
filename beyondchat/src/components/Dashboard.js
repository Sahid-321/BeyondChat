import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  Paper,
  Avatar,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Quiz as QuizIcon,
  Chat as ChatIcon,
  TrendingUp as ProgressIcon,
  School as SchoolIcon,
  Description as PdfIcon,
  RocketLaunch as RocketIcon,
} from '@mui/icons-material';
import { pdfAPI } from '../utils/api';

const Dashboard = () => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPDFs();
  }, []);

  const loadPDFs = async () => {
    try {
      const response = await pdfAPI.getAllPDFs();
      setPdfs(response);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    setUploading(true);
    try {
      const response = await pdfAPI.uploadPDF(file);
      console.log('Upload response:', response);
      await loadPDFs();
      alert('PDF uploaded successfully!');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handlePDFSelect = (pdf) => {
    setSelectedPDF(pdf);
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: 4,
          p: { xs: 3, md: 6 },
          mb: 4,
          textAlign: 'center'
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            mx: 'auto',
            mb: 3,
            fontSize: '2rem'
          }}
        >
          <SchoolIcon fontSize="large" />
        </Avatar>
        
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, mb: 2 }}>
          Welcome to BeyondChat
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Your intelligent learning companion for NCERT textbooks. Upload PDFs, chat with AI, 
          and take interactive quizzes to enhance your understanding.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            component={Link} 
            to="/quiz" 
            variant="contained" 
            size="large"
            startIcon={<RocketIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            Start Quiz
          </Button>
          <Button 
            component={Link} 
            to="/chat" 
            variant="outlined" 
            size="large"
            startIcon={<ChatIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            Ask AI
          </Button>
        </Box>
      </Paper>

      {/* Upload Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box textAlign="center">
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'primary.light',
                mx: 'auto',
                mb: 2
              }}
            >
              <UploadIcon fontSize="large" />
            </Avatar>
            
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Upload Study Material
            </Typography>
            
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Upload NCERT PDF textbooks to start your personalized learning journey
            </Typography>
            
            <Box sx={{ maxWidth: 400, mx: 'auto' }}>
              <input
                accept=".pdf"
                style={{ display: 'none' }}
                id="pdf-upload"
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label htmlFor="pdf-upload">
                <Button
                  variant="contained"
                  component="span"
                  size="large"
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
                  sx={{ px: 4, py: 2, fontSize: '1.1rem' }}
                >
                  {uploading ? 'Uploading...' : 'Choose PDF File'}
                </Button>
              </label>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Supports PDF files up to 50MB • NCERT textbooks recommended
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* PDF Selection Section */}
      {pdfs.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              <PdfIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Select Your Study Material
            </Typography>
            
            <RadioGroup
              value={selectedPDF?._id || 'all'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'all') {
                  handlePDFSelect(null);
                } else {
                  const pdf = pdfs.find(p => p._id === value);
                  handlePDFSelect(pdf);
                }
              }}
            >
              {/* All PDFs Option */}
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mb: 2,
                  '&:hover': { bgcolor: 'action.hover' },
                  border: selectedPDF === null ? 2 : 1,
                  borderColor: selectedPDF === null ? 'primary.main' : 'divider'
                }}
              >
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        All Uploaded Materials
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Use all uploaded PDFs for comprehensive learning
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%' }}
                />
              </Paper>
              
              {/* Individual PDF Options */}
              {pdfs.map((pdf) => (
                <Paper 
                  key={pdf._id}
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    '&:hover': { bgcolor: 'action.hover' },
                    border: selectedPDF?._id === pdf._id ? 2 : 1,
                    borderColor: selectedPDF?._id === pdf._id ? 'primary.main' : 'divider'
                  }}
                >
                  <FormControlLabel
                    value={pdf._id}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500, noWrap: true }}>
                            {pdf.originalName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Uploaded on {new Date(pdf.uploadDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
                          {pdf.isNCERT && (
                            <Chip 
                              label="NCERT" 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {(pdf.size / 1024 / 1024).toFixed(1)} MB
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Learning Features */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'primary.light',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <ChatIcon />
              </Avatar>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                AI Chat Assistant
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Ask questions about your study material and get instant, intelligent responses.
              </Typography>
              <Button component={Link} to="/chat" variant="outlined" size="small">
                Start Chatting
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'primary.light',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <QuizIcon />
              </Avatar>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Interactive Quizzes
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Test your knowledge with AI-generated quizzes based on your uploaded content.
              </Typography>
              <Button component={Link} to="/quiz" variant="outlined" size="small">
                Take Quiz
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'primary.light',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <ProgressIcon />
              </Avatar>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Track Progress
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Monitor your learning progress and identify areas for improvement.
              </Typography>
              <Button component={Link} to="/progress" variant="outlined" size="small">
                View Progress
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Getting Started Guide */}
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            🎯 Getting Started
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 700
                  }}
                >
                  1
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Upload PDF
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload your NCERT textbook or study material in PDF format.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 700
                  }}
                >
                  2
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Ask Questions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use the AI chat to ask questions about your study material.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 700
                  }}
                >
                  3
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Take Quizzes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Test your knowledge with AI-generated quizzes and track progress.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
