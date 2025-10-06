import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { chatAPI, pdfAPI } from '../utils/api';

const Chat = () => {
  const location = useLocation();
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

    setLoading(true);
    try {
      const response = await chatAPI.sendMessage(currentChat._id, message);
      
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, 
          { role: 'user', content: message },
          response.response
        ]
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

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Sidebar - Mobile & Desktop */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-80 lg:w-80 xl:w-96 glass border-r border-white/20 flex flex-col transition-transform duration-300 ease-in-out h-full lg:h-auto`}>
        {/* Sidebar Header */}
        <div className="p-3 sm:p-4 border-b border-white/20 flex justify-between items-center lg:block">
          <h2 className="text-lg font-semibold text-white lg:hidden">💬 Chat</h2>
          <button
            onClick={createNewChat}
            className="btn-touch btn-primary w-full flex items-center justify-center text-sm lg:text-base"
          >
            <span className="mr-2">➕</span>
            New Chat
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* PDF Selection */}
        <div className="p-3 sm:p-4 border-b border-white/20">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center">
            📚 Select PDFs for Context
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
            {pdfs.map((pdf) => (
              <label key={pdf._id} className="flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPDFs.some(p => p._id === pdf._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPDFs(prev => [...prev, pdf]);
                    } else {
                      setSelectedPDFs(prev => prev.filter(p => p._id !== pdf._id));
                    }
                  }}
                  className="mr-3 w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 min-w-[16px] min-h-[16px]"
                />
                <span className="text-xs sm:text-sm text-white truncate">
                  {pdf.originalName}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-3 sm:p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center">
              💭 Recent Chats
            </h3>
            <div className="space-y-2">
              {chats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => {
                    selectChat(chat._id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-200 ${
                    currentChat?._id === chat._id 
                      ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-white/30 shadow-lg' 
                      : 'hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="font-medium text-white truncate">
                    {chat.title}
                  </div>
                  <div className="text-purple-200 text-xs mt-1">
                    {new Date(chat.lastUpdated).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Mobile Header */}
        <div className="lg:hidden glass border-b border-white/20 p-3 sm:p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 hover:bg-white/10 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Chats
          </button>
          <h1 className="text-lg font-semibold text-white">💬 AI Chat</h1>
          <div className="w-9"></div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 custom-scrollbar">
          {!currentChat && (
            <div className="text-center text-white mt-10 lg:mt-20">
              <div className="text-4xl lg:text-6xl mb-4">🤖</div>
              <div className="text-lg lg:text-xl mb-2 font-semibold">Welcome to AI Chat!</div>
              <p className="text-purple-200 text-sm lg:text-base">
                Create a new chat to start asking questions about your study materials.
              </p>
              <div className="mt-6 glass rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm text-purple-100 mb-3">
                  💡 <strong>Tip:</strong> Select PDFs from the sidebar to provide context for your questions
                </p>
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-100">
                    ⚠️ <strong>Notice:</strong> Using OpenRouter for free AI features. The app will provide relevant content from your study materials.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentChat?.messages?.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] lg:max-w-2xl px-3 sm:px-4 py-3 rounded-2xl shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'glass text-white border border-white/20'
                }`}
              >
                {msg.role !== 'user' && (
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium">🤖 AI Assistant</span>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap text-sm lg:text-base">{msg.content}</div>
                
                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="text-xs text-purple-200 mb-2 flex items-center">
                      📚 Sources:
                    </div>
                    {msg.citations.map((citation, citIndex) => (
                      <div key={citIndex} className="text-xs text-purple-100 mb-1 bg-white/10 rounded-lg p-2">
                        Page {citation.pageNumber}: "{citation.snippet}"
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs opacity-70 mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl px-4 py-3 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="loading-spinner"></div>
                  <span className="text-purple-200 text-sm lg:text-base">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="glass border-t border-white/20 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentChat ? "Ask a question about your materials..." : "Create a new chat first"}
              disabled={!currentChat || loading}
              className="input-touch flex-1 resize-none min-h-[50px] text-sm lg:text-base"
              rows="2"
            />
            <button
              onClick={sendMessage}
              disabled={!currentChat || !message.trim() || loading}
              className={`btn-touch px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center min-w-[100px] sm:min-w-[120px] ${
                !currentChat || !message.trim() || loading
                  ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <span className="mr-2">📤</span>
                  Send
                </>
              )}
            </button>
          </div>
          
          <div className="text-xs text-purple-300 mt-3 text-center">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
