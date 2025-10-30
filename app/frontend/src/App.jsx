import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ProgressBar from './components/ProgressBar';
import ResultDisplay from './components/ResultDisplay';
import { uploadFile, processPresentation } from './services/api';
import './App.css';

const App = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setCurrentStep('uploading');
    setStatus('Uploading file...');
    setError(null);

    try {
      const data = await uploadFile(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setUploadedFileData(data);
      setCurrentStep('processing');
      await handleProcess(data.file_id, data.info);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      setCurrentStep('upload');
    }
  };

  const handleProcess = async (fileId, info) => {
    setStatus('Processing presentation...');
    setProcessingProgress(0);

    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const processResult = await processPresentation(fileId);
      clearInterval(progressInterval);
      setProcessingProgress(100);

      setTimeout(() => {
        setResult({ ...processResult, info });
        setCurrentStep('complete');
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.response?.data?.error || 'Processing failed. Please try again.');
      setCurrentStep('upload');
    }
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setSelectedFile(null);
    setUploadProgress(0);
    setProcessingProgress(0);
    setUploadedFileData(null);
    setResult(null);
    setError(null);
    setStatus('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 PowerPoint Processor</h1>
        <p className="app-subtitle">
          Transform your presentations with automated branding and formatting
        </p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button className="error-close" onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div className="content-container">
          {currentStep === 'upload' && (
            <div className="upload-section">
              <FileUpload
                onUploadSuccess={handleFileSelect}
                onUploadError={setError}
              />
              {selectedFile && (
                <div className="action-buttons">
                  <button
                    className="button button-primary button-large"
                    onClick={handleUpload}
                  >
                    Process Presentation
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'uploading' && (
            <ProgressBar
              progress={uploadProgress}
              status="Uploading File"
              message="Please wait while your file is being uploaded..."
            />
          )}

          {currentStep === 'processing' && (
            <ProgressBar
              progress={processingProgress}
              status="Processing Presentation"
              message="Applying branding, formatting, and enhancements..."
            />
          )}

          {currentStep === 'complete' && result && (
            <ResultDisplay result={result} onReset={handleReset} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="features">
          <div className="feature-item">
            <span className="feature-icon">🎨</span>
            <span>Consistent Branding</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📝</span>
            <span>Smart Formatting</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span>Fast Processing</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
