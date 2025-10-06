import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  Description as PdfIcon,
  Article as PageIcon,
} from '@mui/icons-material';
import { pdfAPI } from '../utils/api';

const PDFViewer = () => {
  const { id } = useParams();
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPDFData();
  }, [id]);

  const loadPDFData = async () => {
    try {
      const response = await pdfAPI.getPDFContent(id);
      setPdfData(response);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setError('Failed to load PDF');
    } finally {
      setLoading(false);
    }
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
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PdfIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                {pdfData?.originalName}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Uploaded on {new Date(pdfData?.uploadDate).toLocaleDateString()}
            </Typography>
          </Box>

          <Grid container sx={{ minHeight: 600 }}>
            {/* PDF Viewer */}
            <Grid item xs={12} lg={8}>
              <Box sx={{ p: 3 }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    mb: 3
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    PDF Viewer
                  </Typography>
                  <Paper 
                    elevation={1}
                    sx={{ 
                      height: 500,
                      overflow: 'hidden',
                      borderRadius: 2
                    }}
                  >
                    <Box
                      component="iframe"
                      src={pdfAPI.getPDFFile(id)}
                      sx={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      title="PDF Viewer"
                    />
                  </Paper>
                </Paper>
              </Box>
            </Grid>

            {/* Content Navigation */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ 
                p: 3, 
                borderLeft: { lg: '1px solid' },
                borderTop: { xs: '1px solid', lg: 'none' },
                borderColor: 'divider',
                height: '100%'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Content Navigation
                </Typography>
                
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  <List dense>
                    {pdfData?.chunks?.map((chunk, index) => (
                      <ListItem 
                        key={index}
                        sx={{ 
                          mb: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: 'action.hover',
                            cursor: 'pointer'
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PageIcon sx={{ mr: 1, fontSize: '1rem', color: 'primary.main' }} />
                              <Chip 
                                label={`Page ${chunk.pageNumber}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {chunk.text.substring(0, 150)}...
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider />

          {/* Text Content */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Text Content
            </Typography>
            <Paper 
              elevation={1}
              sx={{ 
                p: 3, 
                bgcolor: 'grey.50',
                maxHeight: 300,
                overflowY: 'auto',
                borderRadius: 2
              }}
            >
              <Typography 
                component="pre"
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  color: 'text.secondary',
                  lineHeight: 1.6
                }}
              >
                {pdfData?.content}
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PDFViewer;
