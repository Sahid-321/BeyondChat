import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Quiz as QuizIcon,
  Chat as ChatIcon,
  TrendingUp as ProgressIcon,
  School as SchoolIcon,
  Description as PdfIcon,
  RocketLaunch as RocketIcon,
  VideoLibrary as VideoIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  GetApp as DownloadIcon,
  AllInclusive as AllIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { pdfAPI } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [sourceType, setSourceType] = useState('all'); // 'all' or 'specific'
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState(null);

  useEffect(() => {
    loadPDFs();
    seedNCERTData();
  }, []);

  const seedNCERTData = async () => {
    // Check if we already have seeded data
    try {
      const response = await pdfAPI.getAllPDFs();
      if (response.length === 0) {
        // Seed with NCERT Class XI Physics data
        console.log('Seeding NCERT data...');
        // This would typically be done on the backend
      }
    } catch (error) {
      console.error('Error checking seeded data:', error);
    }
  };

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

  const handleDeletePDF = async () => {
    if (!pdfToDelete) return;
    
    try {
      // Call delete API
      const result = await pdfAPI.deletePDF(pdfToDelete._id);
      console.log('Delete result:', result);
      
      // Reload PDFs list
      await loadPDFs();
      
      // Clear selected PDF if it was the deleted one
      if (selectedPDF && selectedPDF._id === pdfToDelete._id) {
        setSelectedPDF(null);
      }
      
      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setPdfToDelete(null);
      
      // Show success message
      alert(`PDF "${pdfToDelete.originalName}" deleted successfully!`);
    } catch (error) {
      console.error('Error deleting PDF:', error);
      alert(`Failed to delete PDF: ${error.message}`);
    }
  };

  const handleStartQuiz = () => {
    const pdfIds = sourceType === 'all' 
      ? pdfs.map(pdf => pdf._id)
      : selectedPDF ? [selectedPDF._id] : [];
    
    navigate('/quiz', { state: { pdfIds, sourceType } });
  };

  const handleStartChat = () => {
    const selectedPDFs = sourceType === 'all' 
      ? pdfs
      : selectedPDF ? [selectedPDF] : [];
    
    navigate('/chat', { state: { selectedPDFs, sourceType } });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            {/* Source Selector Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          📚 Select Learning Source
        </Typography>
        
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Source Type" />
          <Tab label="Upload PDF" />
          <Tab label="Manage PDFs" />
        </Tabs>

        {/* Tab 0: Source Type Selection */}
        {tabValue === 0 && (
          <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Study Material</InputLabel>
              <Select
                value={sourceType === 'all' ? 'all' : selectedPDF?._id || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'all') {
                    setSourceType('all');
                    setSelectedPDF(null);
                  } else {
                    setSourceType('specific');
                    const pdf = pdfs.find(p => p._id === value);
                    setSelectedPDF(pdf);
                  }
                }}
                label="Select Study Material"
              >
                <MenuItem value="all">
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <AllIcon sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        All Uploaded PDFs
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Use all your uploaded study materials together ({pdfs.length} files)
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                {pdfs.map((pdf) => (
                  <MenuItem key={pdf._id} value={pdf._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <PdfIcon sx={{ mr: 2, color: 'error.main' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {pdf.originalName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(pdf.size)} • {new Date(pdf.uploadDate).toLocaleDateString()}
                          {pdf.isNCERT && ' • NCERT'}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Source Summary */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Selected Source:</strong> {
                  sourceType === 'all' 
                    ? `All PDFs (${pdfs.length} files)`
                    : selectedPDF 
                      ? selectedPDF.originalName
                      : 'No specific PDF selected'
                }
              </Typography>
            </Alert>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<QuizIcon />}
                onClick={handleStartQuiz}
                disabled={!selectedPDF && sourceType !== 'all'}
                size="large"
                sx={{ minWidth: 140 }}
              >
                Start Quiz
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<ChatIcon />}
                onClick={handleStartChat}
                disabled={!selectedPDF && sourceType !== 'all'}
                size="large"
                sx={{ minWidth: 140 }}
              >
                Start Chat
              </Button>

              <Button
                component={Link}
                to="/videos"
                variant="outlined"
                startIcon={<VideoIcon />}
                disabled={!selectedPDF && sourceType !== 'all'}
                size="large"
                sx={{ minWidth: 180 }}
              >
                Video Recommendations
              </Button>
            </Box>
          </Box>
        )}

        {/* Tab 1: Upload PDF */}
        {tabValue === 1 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="pdf-upload"
              disabled={uploading}
            />
            <label htmlFor="pdf-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
                disabled={uploading}
                size="large"
                sx={{ px: 4, py: 2 }}
              >
                {uploading ? 'Uploading...' : 'Upload PDF'}
              </Button>
            </label>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Upload your own NCERT textbooks or study materials
            </Typography>
            
            {uploading && (
              <Box sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
                <LinearProgress />
              </Box>
            )}
          </Box>
        )}

        {/* Tab 2: Manage PDFs */}
        {tabValue === 2 && (
          <Box>
            {pdfs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <PdfIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No PDFs uploaded yet
                </Typography>
                <Typography color="text.secondary">
                  Upload your first PDF to get started
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {pdfs.map((pdf) => (
                  <Grid item xs={12} key={pdf._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <PdfIcon sx={{ mr: 2, color: 'error.main', fontSize: 32 }} />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {pdf.originalName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatFileSize(pdf.size)} • Uploaded {new Date(pdf.uploadDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              component={Link}
                              to={`/pdf/${pdf._id}`}
                              color="primary"
                              title="View PDF"
                            >
                              <ViewIcon />
                            </IconButton>
                            
                            <IconButton
                              href={pdfAPI.getPDFFile(pdf._id)}
                              target="_blank"
                              color="primary"
                              title="Download PDF"
                            >
                              <DownloadIcon />
                            </IconButton>
                            
                            <IconButton
                              onClick={() => {
                                setPdfToDelete(pdf);
                                setDeleteDialogOpen(true);
                              }}
                              color="error"
                              title="Delete PDF"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Paper>

      {/* Features Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ 
          fontWeight: 700, 
          textAlign: 'center', 
          mb: 4,
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ✨ Learning Features
        </Typography>
        
        {/* Small Cards in One Horizontal Row */}
        <Grid container spacing={2} sx={{ 
          justifyContent: 'center',
          maxWidth: 1000,
          mx: 'auto',
          flexDirection: 'row'
        }}>
          <Grid item xs={12} sm={4} md={4}>
            <Card sx={{ 
              height: 240,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                '& .feature-avatar': {
                  transform: 'scale(1.1)',
                  bgcolor: 'primary.main'
                }
              }
            }}>
              <CardContent sx={{ 
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
              }}>
                <Box>
                  <Avatar
                    className="feature-avatar"
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'primary.light',
                      mx: 'auto',
                      mb: 1.5,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <ChatIcon sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: '1rem',
                    mb: 1
                  }}>
                    AI Chat Assistant
                  </Typography>
                  <Typography color="text.secondary" sx={{ 
                    mb: 2,
                    fontSize: '0.8rem',
                    lineHeight: 1.4
                  }}>
                    Ask questions about your study material and get instant responses.
                  </Typography>
                </Box>
                <Button 
                  component={Link} 
                  to="/chat" 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 0.8
                  }}
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Card sx={{ 
              height: 240,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                '& .feature-avatar': {
                  transform: 'scale(1.1)',
                  bgcolor: 'success.main'
                }
              }
            }}>
              <CardContent sx={{ 
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
              }}>
                <Box>
                  <Avatar
                    className="feature-avatar"
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'success.light',
                      mx: 'auto',
                      mb: 1.5,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <QuizIcon sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: '1rem',
                    mb: 1
                  }}>
                    Interactive Quizzes
                  </Typography>
                  <Typography color="text.secondary" sx={{ 
                    mb: 2,
                    fontSize: '0.8rem',
                    lineHeight: 1.4
                  }}>
                    Test your knowledge with AI-generated quizzes.
                  </Typography>
                </Box>
                <Button 
                  component={Link} 
                  to="/quiz" 
                  variant="contained" 
                  color="success"
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 0.8
                  }}
                >
                  Take Quiz
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Card sx={{ 
              height: 240,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                '& .feature-avatar': {
                  transform: 'scale(1.1)',
                  bgcolor: 'warning.main'
                }
              }
            }}>
              <CardContent sx={{ 
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
              }}>
                <Box>
                  <Avatar
                    className="feature-avatar"
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'warning.light',
                      mx: 'auto',
                      mb: 1.5,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <ProgressIcon sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: '1rem',
                    mb: 1
                  }}>
                    Track Progress
                  </Typography>
                  <Typography color="text.secondary" sx={{ 
                    mb: 2,
                    fontSize: '0.8rem',
                    lineHeight: 1.4
                  }}>
                    Monitor your learning journey and progress.
                  </Typography>
                </Box>
                <Button 
                  component={Link} 
                  to="/progress" 
                  variant="contained" 
                  color="warning"
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 0.8
                  }}
                >
                  View Progress
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete PDF</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{pdfToDelete?.originalName}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeletePDF} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
