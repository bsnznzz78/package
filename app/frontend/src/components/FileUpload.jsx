import React, { useState, useRef } from 'react';

const FileUpload = ({ onUploadSuccess, onUploadError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (!file.name.endsWith('.pptx')) {
      if (onUploadError) {
        onUploadError('Please select a .pptx file');
      }
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      if (onUploadError) {
        onUploadError('File size must be less than 50MB');
      }
      return;
    }

    setSelectedFile(file);
    if (onUploadSuccess) {
      onUploadSuccess(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-upload-container">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pptx"
          style={{ display: 'none' }}
        />
        
        {!selectedFile ? (
          <div className="upload-prompt">
            <div className="upload-icon">📄</div>
            <h3>Drop your PowerPoint file here</h3>
            <p>or click to browse</p>
            <span className="upload-hint">.pptx files only (max 50MB)</span>
          </div>
        ) : (
          <div className="file-selected">
            <div className="file-icon">✓</div>
            <div className="file-info">
              <h4>{selectedFile.name}</h4>
              <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button
              className="clear-button"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
