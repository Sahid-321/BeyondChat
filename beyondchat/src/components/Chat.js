import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Checkbox,
  FormControlLabel,
  Chip,
  Avatar,
  CircularProgress,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Description as PdfIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { chatAPI, pdfAPI } from '../utils/api';

const Chat = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const messagesEndRef = React.useRef(null);
  
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [selectedPDFs, setSelectedPDFs] = useState(location.state?.selectedPDF ? [location.state.selectedPDF] : []);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  // Auto-create chat when PDFs are selected
  useEffect(() => {
    if (selectedPDFs.length > 0 && !currentChat) {
      createNewChatAuto();
    }
  }, [selectedPDFs]);

  const createNewChatAuto = async () => {
    try {
      const title = selectedPDFs.length > 0 
        ? `Chat about ${selectedPDFs[0].originalName}` 
        : 'New Chat';
      
      const response = await chatAPI.createChat(
        'anonymous', 
        title, 
        selectedPDFs.map(pdf => pdf._id)
      );
      
      setCurrentChat(response.chat);
      await loadChats();
    } catch (error) {
      console.error('Error creating auto chat:', error);
    }
  };

  useEffect(() => {
    loadPDFs();
    loadChats();
  }, []);

  const loadPDFs = async () => {
    try {
      const response = await pdfAPI.getAllPDFs();
      setPdfs(response);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    }
  };

  const loadChats = async () => {
    try {
      const response = await chatAPI.getUserChats();
      setChats(response);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const title = selectedPDFs.length > 0 
        ? `Chat about ${selectedPDFs[0].originalName}` 
        : 'New Chat';
      
      const response = await chatAPI.createChat(
        'anonymous', 
        title, 
        selectedPDFs.map(pdf => pdf._id)
      );
      
      setCurrentChat(response.chat);
      await loadChats();
      setSidebarOpen(false);
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Failed to create chat');
    }
  };

  const selectChat = async (chatId) => {
    try {
      const response = await chatAPI.getChat(chatId);
      setCurrentChat(response);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Error loading chat:', error);
      alert('Failed to load chat');
    }
  };

  const sendMessage = async () => {
    if (!currentChat || !message.trim()) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setLoading(true);
    try {
      const response = await chatAPI.sendMessage(currentChat._id, message);
      
      // Ensure response has timestamp
      const botResponse = {
        ...response.response,
        timestamp: response.response.timestamp || new Date().toISOString()
      };
      
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage, botResponse]
      }));
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sidebarContent = (
    <Box sx={{ 
      width: { xs: 280, sm: 300 }, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Sidebar Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={createNewChat}
          sx={{ mb: 2 }}
        >
          New Chat
        </Button>
        
        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              💬 Chat
            </Typography>
            <IconButton onClick={() => setSidebarOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* PDF Selection */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
          <PdfIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Select PDFs for Context
        </Typography>
        
        <Box sx={{ maxHeight: { xs: 120, sm: 150 }, overflowY: 'auto' }}>
          {pdfs.map((pdf) => (
            <FormControlLabel
              key={pdf._id}
              control={
                <Checkbox
                  checked={selectedPDFs.some(p => p._id === pdf._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPDFs(prev => [...prev, pdf]);
                    } else {
                      setSelectedPDFs(prev => prev.filter(p => p._id !== pdf._id));
                    }
                  }}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  {pdf.originalName}
                </Typography>
              }
              sx={{ 
                width: '100%',
                m: 0,
                mb: 0.5,
                '& .MuiFormControlLabel-label': {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Chat List */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
            <ChatIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Recent Chats
          </Typography>
          
          <List dense>
            {chats.map((chat) => (
              <ListItemButton
                key={chat._id}
                onClick={() => selectChat(chat._id)}
                selected={currentChat?._id === chat._id}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    }
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {chat.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {(() => {
                        try {
                          if (!chat.lastUpdated) return 'Recently';
                          const date = new Date(chat.lastUpdated);
                          return isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString();
                        } catch (error) {
                          return 'Recently';
                        }
                      })()}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden' // Prevent body scroll
    }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="static" elevation={0} sx={{ flexShrink: 0 }}>
          <Toolbar variant="dense">
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1, fontSize: '1.1rem' }}>
              💬 AI Chat
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Paper 
            elevation={1} 
            sx={{ 
              width: 300, 
              borderRadius: 0,
              borderRight: '1px solid',
              borderColor: 'divider'
            }}
          >
            {sidebarContent}
          </Paper>
        )}

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: { xs: 280, sm: 300 },
            },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Main Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Messages Area */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2,
            minHeight: 0,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '4px',
            },
          }}>
            {!currentChat ? (
              <Box sx={{ 
                textAlign: 'center', 
                mt: { xs: 4, md: 8 },
                px: 2
              }}>
                <Avatar
                  sx={{
                    width: { xs: 64, md: 80 },
                    height: { xs: 64, md: 80 },
                    bgcolor: 'primary.main',
                    mx: 'auto',
                    mb: 3,
                    fontSize: '2rem'
                  }}
                >
                  <BotIcon fontSize="large" />
                </Avatar>
                
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                  Welcome to AI Chat!
                </Typography>
                
                <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                  Create a new chat to start asking questions about your study materials.
                </Typography>
                
                <Paper elevation={2} sx={{ p: 3, maxWidth: 400, mx: 'auto', mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    💡 <Box component="span" sx={{ fontWeight: 600, ml: 1 }}>Tip:</Box>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select PDFs from the sidebar to provide context for your questions
                  </Typography>
                </Paper>
                
                <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
                  <Typography variant="body2">
                    ⚠️ <strong>Notice:</strong> Using OpenRouter for free AI features. 
                    The app will provide relevant content from your study materials.
                  </Typography>
                </Alert>
              </Box>
            ) : (
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                {currentChat?.messages?.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: '85%',
                        bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                        color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                      }}
                    >
                      {msg.role !== 'user' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <BotIcon sx={{ mr: 1, fontSize: '1rem' }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            AI Assistant
                          </Typography>
                        </Box>
                      )}
                      
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </Typography>

                      {/* Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                            📚 Sources:
                          </Typography>
                          {msg.citations.map((citation, citIndex) => (
                            <Paper
                              key={citIndex}
                              variant="outlined"
                              sx={{ p: 1, mb: 1, bgcolor: 'action.hover' }}
                            >
                              <Typography variant="caption">
                                Page {citation.pageNumber}: "{citation.snippet}"
                              </Typography>
                            </Paper>
                          ))}
                        </Box>
                      )}
                      
                      <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                        {(() => {
                          try {
                            if (!msg.timestamp) return new Date().toLocaleTimeString();
                            const date = new Date(msg.timestamp);
                            return isNaN(date.getTime()) ? new Date().toLocaleTimeString() : date.toLocaleTimeString();
                          } catch (error) {
                            return new Date().toLocaleTimeString();
                          }
                        })()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}

                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2" color="text.secondary">
                          AI is thinking...
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                )}
                
                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </Box>
            )}
          </Box>

          {/* Input Area - Fixed at bottom */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 1.5, sm: 2 }, 
              borderRadius: 0,
              borderTop: '1px solid',
              borderColor: 'divider',
              position: 'sticky',
              bottom: 0,
              zIndex: 1000,
              bgcolor: 'background.paper',
              flexShrink: 0 // Prevent shrinking
            }}
          >
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentChat ? "Ask a question about your materials..." : "Select a PDF to start chatting"}
                  disabled={!currentChat || loading}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                
                <Button
                  variant="contained"
                  onClick={sendMessage}
                  disabled={!currentChat || !message.trim() || loading}
                  sx={{ 
                    minWidth: { xs: 80, sm: 100 }, 
                    height: { xs: 36, sm: 40 },
                    borderRadius: 2
                  }}
                  startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
                >
                  {isMobile ? '' : 'Send'}
                </Button>
              </Box>
              
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  mt: 1, 
                  display: 'block', 
                  textAlign: 'center',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                Press Enter to send, Shift+Enter for new line
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
