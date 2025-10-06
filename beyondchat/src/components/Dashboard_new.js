import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="responsive-container">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-container">
      {/* Hero Section */}
      <div className="text-center py-8 lg:py-12 mb-8">
        <h1 className="text-3xl lg:text-5xl font-bold text-primary mb-4">
          Welcome to BeyondChat
        </h1>
        <p className="text-lg lg:text-xl text-secondary max-w-2xl mx-auto mb-8">
          Your intelligent learning companion for NCERT textbooks. Upload PDFs, chat with AI, and take interactive quizzes to enhance your understanding.
        </p>
        
        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Link to="/quiz" className="btn btn-primary flex-1">
            <span>🚀</span>
            Start Quiz
          </Link>
          <Link to="/chat" className="btn btn-outline flex-1">
            <span>💬</span>
            Ask AI
          </Link>
        </div>
      </div>

      {/* Upload Section */}
      <div className="card p-6 lg:p-8 mb-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h2 className="text-2xl font-semibold text-primary mb-2">Upload Study Material</h2>
          <p className="text-secondary mb-6">
            Upload NCERT PDF textbooks to start your personalized learning journey
          </p>
          
          <div className="max-w-md mx-auto">
            <label className="block">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="pdf-upload"
              />
              <div className={`btn ${uploading ? 'opacity-50 cursor-not-allowed' : 'btn-primary cursor-pointer'} inline-flex items-center gap-2 text-lg px-8 py-4`}>
                {uploading ? (
                  <>
                    <div className="loading-spinner w-5 h-5 border-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    Choose PDF File
                  </>
                )}
              </div>
            </label>
            <p className="text-sm text-secondary mt-3">
              Supports PDF files up to 50MB • NCERT textbooks recommended
            </p>
          </div>
        </div>
      </div>

      {/* PDF Selection Section */}
      {pdfs.length > 0 && (
        <div className="card p-6 lg:p-8 mb-8">
          <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
            <span className="mr-2">📖</span>
            Select Your Study Material
          </h2>
          
          <div className="space-y-3">
            {/* All PDFs Option */}
            <label className="flex items-center p-4 rounded-lg border border-light cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="pdfSource"
                value="all"
                checked={selectedPDF === null}
                onChange={() => handlePDFSelect(null)}
                className="mr-4 w-4 h-4 text-blue-600"
              />
              <div className="flex-1">
                <div className="font-medium text-primary">All Uploaded Materials</div>
                <div className="text-sm text-secondary">Use all uploaded PDFs for comprehensive learning</div>
              </div>
            </label>
            
            {/* Individual PDF Options */}
            {pdfs.map((pdf) => (
              <label key={pdf._id} className="flex items-center p-4 rounded-lg border border-light cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="pdfSource"
                  value={pdf._id}
                  checked={selectedPDF?._id === pdf._id}
                  onChange={() => handlePDFSelect(pdf)}
                  className="mr-4 w-4 h-4 text-blue-600"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-primary truncate pr-2">{pdf.originalName}</div>
                      <div className="text-sm text-secondary">
                        Uploaded on {new Date(pdf.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      {pdf.isNCERT && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          NCERT
                        </span>
                      )}
                      <span className="text-xs text-secondary whitespace-nowrap">
                        {(pdf.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Learning Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">🤖</span>
          </div>
          <h3 className="font-semibold text-primary mb-2">AI Chat Assistant</h3>
          <p className="text-secondary text-sm mb-4">
            Ask questions about your study material and get instant, intelligent responses.
          </p>
          <Link to="/chat" className="btn btn-outline btn-sm">
            Start Chatting
          </Link>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">📝</span>
          </div>
          <h3 className="font-semibold text-primary mb-2">Interactive Quizzes</h3>
          <p className="text-secondary text-sm mb-4">
            Test your knowledge with AI-generated quizzes based on your uploaded content.
          </p>
          <Link to="/quiz" className="btn btn-outline btn-sm">
            Take Quiz
          </Link>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="font-semibold text-primary mb-2">Track Progress</h3>
          <p className="text-secondary text-sm mb-4">
            Monitor your learning progress and identify areas for improvement.
          </p>
          <Link to="/progress" className="btn btn-outline btn-sm">
            View Progress
          </Link>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="card p-6 lg:p-8">
        <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
          <span className="mr-2">🎯</span>
          Getting Started
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-primary mb-1">Upload PDF</h3>
              <p className="text-secondary text-sm">Upload your NCERT textbook or study material in PDF format.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-primary mb-1">Ask Questions</h3>
              <p className="text-secondary text-sm">Use the AI chat to ask questions about your study material.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-primary mb-1">Take Quizzes</h3>
              <p className="text-secondary text-sm">Test your knowledge with AI-generated quizzes and track progress.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
