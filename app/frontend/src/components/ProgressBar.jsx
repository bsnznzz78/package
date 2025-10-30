import React from 'react';

const ProgressBar = ({ progress, status, message }) => {
  return (
    <div className="progress-container">
      <div className="progress-header">
        <h3>{status || 'Processing...'}</h3>
        {message && <p className="progress-message">{message}</p>}
      </div>
      <div className="progress-bar-wrapper">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          >
            <span className="progress-text">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
