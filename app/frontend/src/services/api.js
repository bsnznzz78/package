import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    }
  });

  return response.data;
};

export const processPresentation = async (fileId, brandingConfig = null) => {
  const response = await api.post('/process', {
    file_id: fileId,
    branding_config: brandingConfig
  });
  return response.data;
};

export const extractData = async (fileId) => {
  const response = await api.post('/extract', {
    file_id: fileId
  });
  return response.data;
};

export const downloadFile = (fileId) => {
  return `${API_BASE_URL}/download/${fileId}`;
};

export const listFiles = async () => {
  const response = await api.get('/files');
  return response.data;
};

export const cleanupFiles = async () => {
  const response = await api.post('/cleanup');
  return response.data;
};

export default api;
