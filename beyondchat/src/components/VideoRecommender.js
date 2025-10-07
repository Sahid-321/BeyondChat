import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  YouTube as YouTubeIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenIcon,
  AccessTime as TimeIcon,
  Visibility as ViewsIcon,
  ThumbUp as LikeIcon,
  School as EducationIcon,
} from '@mui/icons-material';
import { pdfAPI } from '../utils/api';

const VideoRecommender = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [pdfs, setPdfs] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadPDFs();
  }, []);

  const loadPDFs = async () => {
    try {
      const response = await pdfAPI.getAllPDFs();
      setPdfs(response);
    } catch (error) {
      console.error('Error loading PDFs:', error);
      setError('Failed to load PDFs');
    }
  };

  const generateVideoRecommendations = async () => {
    if (!selectedPDF) {
      setError('Please select a PDF first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/videos/recommendations/${selectedPDF}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get video recommendations');
      }

      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error generating video recommendations:', error);
      setError('Failed to generate video recommendations');
      
      // Fallback to mock data if API fails
      const mockVideos = [
        {
          id: '1',
          title: 'Physics Fundamentals: Motion and Forces',
          channel: 'Khan Academy',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          duration: '15:30',
          views: '2.5M',
          likes: '125K',
          description: 'Understanding the basic concepts of motion, velocity, acceleration and Newton\'s laws of motion.',
          url: 'https://youtube.com/watch?v=example1',
          relevanceScore: 95
        },
        {
          id: '2',
          title: 'Work, Energy and Power - Complete Chapter',
          channel: 'Physics Wallah',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          duration: '45:20',
          views: '1.8M',
          likes: '98K',
          description: 'Comprehensive explanation of work-energy theorem, kinetic and potential energy.',
          url: 'https://youtube.com/watch?v=example2',
          relevanceScore: 92
        },
        {
          id: '3',
          title: 'Gravitation and Orbital Motion',
          channel: 'Unacademy Physics',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          duration: '28:45',
          views: '890K',
          likes: '45K',
          description: 'Newton\'s law of universal gravitation, gravitational field, and satellite motion.',
          url: 'https://youtube.com/watch?v=example3',
          relevanceScore: 88
        }
      ];
      
      setVideos(mockVideos);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setDialogOpen(true);
  };

  const handleWatchVideo = () => {
    if (selectedVideo) {
      window.open(selectedVideo.url, '_blank');
    }
    setDialogOpen(false);
  };

  const getRelevanceColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center' }}>
        <YouTubeIcon sx={{ mr: 2, fontSize: 'inherit', color: '#FF0000' }} />
        Video Recommendations
      </Typography>

      {/* PDF Selection */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <FormControl fullWidth>
              <InputLabel>Select PDF for Video Recommendations</InputLabel>
              <Select
                value={selectedPDF}
                onChange={(e) => setSelectedPDF(e.target.value)}
                label="Select PDF for Video Recommendations"
              >
                {pdfs.map((pdf) => (
                  <MenuItem key={pdf._id} value={pdf._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EducationIcon sx={{ mr: 1 }} />
                      {pdf.originalName}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={generateVideoRecommendations}
              disabled={!selectedPDF || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              sx={{ height: 56 }}
            >
              {loading ? 'Finding Videos...' : 'Get Recommendations'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Video Grid */}
      {videos.length > 0 && (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} lg={4} key={video.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, elevation 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    elevation: 8,
                  }
                }}
                onClick={() => handleVideoClick(video)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height={isMobile ? "160" : "180"}
                    image={video.thumbnail}
                    alt={video.title}
                    sx={{ bgcolor: 'grey.200' }}
                  />
                  
                  {/* Play Button Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: '50%',
                      p: 1,
                    }}
                  >
                    <PlayIcon sx={{ color: 'white', fontSize: 32 }} />
                  </Box>

                  {/* Duration Badge */}
                  <Chip
                    label={video.duration}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                    }}
                  />

                  {/* Relevance Score */}
                  <Chip
                    label={`${video.relevanceScore}% match`}
                    size="small"
                    color={getRelevanceColor(video.relevanceScore)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ 
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {video.title}
                  </Typography>

                  <Typography variant="body2" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                    {video.channel}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {video.description}
                  </Typography>

                  {/* Video Stats */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ViewsIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {video.views}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LikeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {video.likes}
                        </Typography>
                      </Box>
                    </Box>

                    <IconButton size="small" color="primary">
                      <OpenIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* No Videos Message */}
      {!loading && videos.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <YouTubeIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No video recommendations yet
          </Typography>
          <Typography color="text.secondary">
            Select a PDF and click "Get Recommendations" to find relevant educational videos
          </Typography>
        </Box>
      )}

      {/* Video Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedVideo && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h6" component="h2">
                {selectedVideo.title}
              </Typography>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                by {selectedVideo.channel}
              </Typography>
            </DialogTitle>
            
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    borderRadius: 8,
                    backgroundColor: '#f5f5f5'
                  }}
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedVideo.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Duration: {selectedVideo.duration}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ViewsIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Views: {selectedVideo.views}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Chip
                  label={`${selectedVideo.relevanceScore}% relevance match`}
                  color={getRelevanceColor(selectedVideo.relevanceScore)}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`${selectedVideo.likes} likes`}
                  variant="outlined"
                />
              </Box>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={handleWatchVideo}
                startIcon={<YouTubeIcon />}
                sx={{ 
                  bgcolor: '#FF0000',
                  '&:hover': { bgcolor: '#CC0000' }
                }}
              >
                Watch on YouTube
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default VideoRecommender;
