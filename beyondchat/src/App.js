import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PDFViewer from './components/PDFViewer';
import QuizGenerator from './components/QuizGenerator';
import Chat from './components/Chat';
import Progress from './components/Progress';
import VideoRecommender from './components/VideoRecommender';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Navbar />
          <Box component="main" sx={{ pt: 2, pb: 4 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pdf/:id" element={<PDFViewer />} />
              <Route path="/quiz" element={<QuizGenerator />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/videos" element={<VideoRecommender />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
