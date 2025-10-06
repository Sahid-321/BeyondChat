import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { chatAPI, pdfAPI } from '../utils/api';

const Chat = () => {
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [selectedPDFs, setSelectedPDFs] = useState(location.state?.selectedPDF ? [location.state.selectedPDF] : []);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadPDFs();
    loadChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
        ? `Discussion: ${selectedPDFs[0].originalName}` 
        : 'New Learning Session';
      
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
    }
  };

  const selectChat = (chat) => {
    setCurrentChat(chat);
    setSidebarOpen(false);
  };

  const handlePDFSelection = (pdf) => {
    setSelectedPDFs(prev => {
      const isSelected = prev.some(p => p._id === pdf._id);
      if (isSelected) {
        return prev.filter(p => p._id !== pdf._id);
      } else {
        return [...prev, pdf];
      }
    });
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    if (!currentChat) {
      await createNewChat();
    }

    const userMessage = message;
    setMessage('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(
        currentChat?._id || 'new',
        userMessage,
        selectedPDFs.map(pdf => pdf._id)
      );

      if (response.chat) {
        setCurrentChat(response.chat);
      }
    } catch (error) {
      console.error('Error sending message:', error);
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

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-primary mb-4">Learning Sessions</h2>
          <button
            onClick={createNewChat}
            className="btn btn-primary w-full mb-4"
          >
            <span>💬</span>
            New Session
          </button>
        </div>

        {/* Chat History */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-secondary mb-3 uppercase tracking-wide">Recent Sessions</h3>
          <div className="space-y-2">
            {chats.length > 0 ? chats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => selectChat(chat)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentChat?._id === chat._id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="font-medium text-primary text-sm truncate">
                  {chat.title}
                </div>
                <div className="text-xs text-secondary mt-1">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </div>
              </button>
            )) : (
              <div className="text-center py-8 text-secondary">
                <div className="text-2xl mb-2">📚</div>
                <p className="text-sm">No sessions yet. Start a new one!</p>
              </div>
            )}
          </div>
        </div>

        {/* PDF Selection */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <h3 className="text-sm font-medium text-secondary mb-3 uppercase tracking-wide">Study Materials</h3>
          <div className="space-y-2">
            {pdfs.map((pdf) => (
              <label key={pdf._id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPDFs.some(p => p._id === pdf._id)}
                  onChange={() => handlePDFSelection(pdf)}
                  className="mr-3 w-4 h-4 text-blue-600 rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-primary truncate">
                    {pdf.originalName}
                  </div>
                  {pdf.isNCERT && (
                    <span className="text-xs text-blue-600 font-medium">NCERT</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Chat Header */}
        <div className="chat-header">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden btn btn-outline p-2 mr-3"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-primary">
              {currentChat?.title || 'AI Learning Assistant'}
            </h1>
            {selectedPDFs.length > 0 && (
              <p className="text-sm text-secondary">
                Discussing: {selectedPDFs.map(pdf => pdf.originalName).join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {!currentChat || currentChat?.messages?.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Welcome to Your AI Learning Assistant
                </h3>
                <p className="text-secondary mb-6">
                  Ask questions about your study materials, get explanations, or discuss complex topics. I'm here to help you learn better!
                </p>
                <div className="space-y-2 text-sm text-secondary">
                  <p>💡 Try asking: "Explain the concept of..."</p>
                  <p>📚 Or: "What are the key points in chapter..."</p>
                  <p>❓ Or: "Can you help me understand..."</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {currentChat.messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <div className="message-content">
                    {msg.content}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message assistant">
                  <div className="message-content">
                    <div className="flex items-center gap-2">
                      <div className="loading-spinner w-4 h-4 border-2"></div>
                      AI is thinking...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="chat-input-container">
          <div className="chat-input">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your study materials..."
              className="form-control resize-none"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim() || loading}
              className="send-button"
              aria-label="Send message"
            >
              {loading ? (
                <div className="loading-spinner w-4 h-4 border-2"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          
          {selectedPDFs.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedPDFs.map((pdf) => (
                <span key={pdf._id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  📄 {pdf.originalName}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Chat;
