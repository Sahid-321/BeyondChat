const API_BASE_URL = 'http://localhost:5000/api';

export const pdfAPI = {
  uploadPDF: async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await fetch(`${API_BASE_URL}/pdfs/upload`, {
      method: 'POST',
      body: formData,
    });
    
    return response.json();
  },

  getAllPDFs: async () => {
    const response = await fetch(`${API_BASE_URL}/pdfs`);
    return response.json();
  },

  getPDFContent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/pdfs/${id}/content`);
    return response.json();
  },

  getPDFFile: (id) => {
    return `${API_BASE_URL}/pdfs/${id}/file`;
  }
};

export const quizAPI = {
  generateQuiz: async (pdfId, type, questionCount = 5) => {
    const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdfId, type, questionCount }),
    });
    
    return response.json();
  },

  getQuiz: async (id) => {
    const response = await fetch(`${API_BASE_URL}/quiz/${id}`);
    return response.json();
  },

  submitQuiz: async (quizId, answers, userId = 'anonymous') => {
    const response = await fetch(`${API_BASE_URL}/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quizId, answers, userId }),
    });
    
    return response.json();
  },

  getQuizAttempts: async (userId = 'anonymous') => {
    const response = await fetch(`${API_BASE_URL}/quiz/attempts/user?userId=${userId}`);
    return response.json();
  }
};

export const chatAPI = {
  createChat: async (userId = 'anonymous', title = 'New Chat', pdfIds = []) => {
    const response = await fetch(`${API_BASE_URL}/chat/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, title, pdfIds }),
    });
    
    return response.json();
  },

  getUserChats: async (userId = 'anonymous') => {
    const response = await fetch(`${API_BASE_URL}/chat/user?userId=${userId}`);
    return response.json();
  },

  getChat: async (id) => {
    const response = await fetch(`${API_BASE_URL}/chat/${id}`);
    return response.json();
  },

  sendMessage: async (chatId, message, userId = 'anonymous') => {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId, message, userId }),
    });
    
    return response.json();
  }
};

export const progressAPI = {
  getUserProgress: async (userId = 'anonymous') => {
    const response = await fetch(`${API_BASE_URL}/progress/user?userId=${userId}`);
    return response.json();
  }
};
