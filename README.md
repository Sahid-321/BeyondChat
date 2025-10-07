# 🎓 BeyondChat - AI-Powered Educational Platform

<div align="center">

![BeyondChat Banner](https://img.shields.io/badge/BeyondChat-AI%20Educational%20Platform-blue?style=for-the-badge&logo=graduation-cap)

**An intelligent learning companion that transforms PDF study materials into interactive educational experiences**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb)](https://mongodb.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-v5-0081CB?style=flat&logo=mui)](https://mui.com/)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📚 **Smart PDF Management** | Upload, view, and manage study materials with intelligent processing |
| 🤖 **AI Chat Assistant** | Ask questions about your PDFs and get contextual answers with citations |
| 📝 **Quiz Generator** | Create MCQs, SAQs, and LAQs automatically from your content |
| 📊 **Progress Tracking** | Monitor learning analytics and performance metrics |
| 🎥 **Video Recommendations** | Get AI-curated educational videos based on your content |

---

## 🛠 Tech Stack

### Frontend
```
React 18 + Material-UI v5 + React Router
```

### Backend
```
Node.js + Express.js + MongoDB + Mongoose
```

### AI Integration
```
OpenRouter API (Multi-LLM Support)
```

---

## 📁 Project Structure

```
beyondchat_assignment/
├── 📂 beyondchat/                    # 🎨 React Frontend
│   ├── 📂 public/                    # Static assets
│   ├── 📂 src/
│   │   ├── 📂 components/            # React components
│   │   │   ├── 🏠 Dashboard.js       # Main dashboard
│   │   │   ├── 💬 Chat.js            # AI chat interface
│   │   │   ├── 📝 QuizGenerator.js   # Quiz creation
│   │   │   ├── 📊 Progress.js        # Analytics dashboard
│   │   │   ├── 🎥 VideoRecommender.js # Video suggestions
│   │   │   └── 🧭 Navbar.js          # Navigation
│   │   ├── 📂 utils/
│   │   │   └── 🔗 api.js             # API utilities
│   │   ├── 📄 App.js                 # Main app component
│   │   └── 📄 index.js               # Entry point
│   ├── 📄 package.json               # Dependencies
│   ├── 🔐 .env                       # Environment variables
│   ├── 🔐 .env.production            # Production env
│   └── ⚙️ vercel.json               # Vercel config
│
├── 📂 backend/                       # 🚀 Node.js Backend
│   ├── 📂 controllers/               # Business logic
│   │   ├── 📚 pdfController.js       # PDF operations
│   │   ├── 📝 quizController.js      # Quiz management
│   │   ├── 💬 chatController.js      # Chat & RAG
│   │   └── 📊 progressController.js  # Analytics
│   ├── 📂 models/                    # Database schemas
│   │   ├── 📄 PDF.js                 # PDF document model
│   │   ├── 📝 Quiz.js                # Quiz model
│   │   └── 💬 Chat.js                # Chat model
│   ├── 📂 routes/                    # API endpoints
│   │   ├── 🛣️ pdfRoutes.js          # PDF CRUD routes
│   │   ├── 🛣️ quizRoutes.js         # Quiz routes
│   │   ├── 🛣️ chatRoutes.js         # Chat routes
│   │   ├── 🛣️ videoRoutes.js        # Video routes
│   │   └── 🛣️ progressRoutes.js     # Progress routes
│   ├── 📂 uploads/                   # File storage
│   ├── 📄 index.js                   # Server entry point
│   ├── 📄 package.json               # Dependencies
│   ├── 🔐 .env                       # Environment variables
│   └── ⚙️ vercel.json               # Vercel config
│
└── 📖 README.md                      # Project documentation
```

---

## 🚀 Local Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or cloud) - [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)

### 📥 Step 1: Clone Repository

```bash
git clone https://github.com/Sahid-321/BeyondChat.git
cd beyondchat_assignment
```

### 🔧 Step 2: Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb+srv://sahid:Hd5TKV4MzCy90RKm@ecommerce.qxk5j1r.mongodb.net/beyondchat?retryWrites=true&w=majority

# AI Configuration
OPENROUTER_API_KEY=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

# Environment
NODE_ENV=development
```

#### Start Backend Server
```bash
npm start
```

✅ **Backend will be running at:** `http://localhost:5000`

---

### 🎨 Step 3: Frontend Setup

#### Navigate to Frontend Directory
```bash
cd beyondchat
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration

Create a `.env` file in the `beyondchat/` directory:

```env
# API Configuration for Development
REACT_APP_API_URL=http://localhost:5000
```

Create a `.env.production` file for production deployment:

```env
# API Configuration for Production
REACT_APP_API_URL=https://beyondchat-1.onrender.com
```

#### Start Frontend Server
```bash
npm start
```

✅ **Frontend will be running at:** `http://localhost:3000`

---

## 🌐 Environment Variables Guide

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/beyondchat` |
| `OPENROUTER_API_KEY` | AI API key for chat and quiz features | `sk-or-v1-...` |
| `NODE_ENV` | Environment mode | `development` / `production` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000` |

---

## 📱 How to Use the Application

### 🏠 **Getting Started**
1. Open your browser and navigate to `http://localhost:3000`
2. You'll see the main dashboard with feature cards

### 📚 **PDF Management**
1. Click **"Upload PDF"** tab to add study materials
2. Use **"Manage PDFs"** to view, download, or delete files
3. Select PDFs from the **dropdown** for AI features

### 💬 **AI Chat Assistant**
1. Click **"Start Chat"** from the dashboard
2. Ask questions about your study materials
3. Get contextual answers with page citations

### 📝 **Quiz Generation**
1. Click **"Take Quiz"** to access the generator
2. Choose question types: **MCQ**, **SAQ**, or **LAQ**
3. Set the number of questions (1-10)
4. Get immediate feedback with explanations

### 📊 **Progress Tracking**
1. Click **"View Progress"** to see analytics
2. Monitor quiz attempts, scores, and performance
3. Identify strengths and weaknesses

### 🎥 **Video Recommendations**
1. Click **"Video Recommendations"**
2. Get AI-curated educational videos
3. Videos are scored for relevance

---

## 🚀 Deployment Guide

### Backend Deployment (Vercel)

1. **Deploy Backend to Vercel:**
   ```bash
   cd backend
   vercel --prod
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - `MONGODB_URI`
   - `OPENROUTER_API_KEY`
   - `PORT=5000`

### Frontend Deployment (Vercel)

1. **Deploy Frontend to Vercel:**
   ```bash
   cd beyondchat
   vercel --prod
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - `REACT_APP_API_URL=https://your-backend-url.vercel.app`

---

## 🎯 Key Features Deep Dive

### 🤖 AI-Powered Features
- **RAG Implementation** - Retrieval Augmented Generation for accurate answers
- **Smart Content Analysis** - AI extracts key concepts from PDFs
- **Dynamic Question Generation** - Unique quizzes from your content
- **Contextual Citations** - Every answer includes page references

### 🎨 Modern UI/UX
- **Material-UI Design System** - Consistent, professional interface
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Golden Ratio Design** - Mathematically precise layouts
- **Smooth Animations** - Enhanced user interactions

### 🔧 Technical Excellence
- **RESTful API Architecture** - Clean, scalable backend design
- **MongoDB Integration** - Efficient data storage and retrieval
- **Error Handling** - Comprehensive error management
- **Security Best Practices** - CORS, input validation, and more

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

If you encounter any issues or have questions:

- 📧 **Email:** support@beyondchat.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/Sahid-321/BeyondChat/issues)
- 📖 **Documentation:** Check this README

---

<div align="center">

**Built with ❤️ using AI-assisted development**

![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat&logo=react)
![Powered by AI](https://img.shields.io/badge/Powered%20by-AI-FF6B6B?style=flat&logo=openai)

**⭐ Star this repository if you found it helpful!**

</div>
