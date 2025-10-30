import React from 'react';
import { downloadFile } from '../services/api';

const ResultDisplay = ({ result, onReset }) => {
  const handleDownload = () => {
    const downloadUrl = downloadFile(result.output_file_id);
    window.location.href = downloadUrl;
  };

  return (
    <div className="result-container">
      <div className="result-success">
        <div className="success-icon">✓</div>
        <h2>Processing Complete!</h2>
        <p>Your enhanced presentation is ready for download.</p>
      </div>

      {result.info && (
        <div className="result-info">
          <h3>Presentation Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Slides Processed:</span>
              <span className="info-value">{result.info.slide_count || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value success">Enhanced</span>
            </div>
          </div>
        </div>
      )}

      <div className="result-actions">
        <button className="button button-primary" onClick={handleDownload}>
          Download Enhanced Presentation
        </button>
        <button className="button button-secondary" onClick={onReset}>
          Process Another File
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
