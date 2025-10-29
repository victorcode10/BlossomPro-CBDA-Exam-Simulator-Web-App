const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://cbda-backend.onrender.com/api'  // Your actual backend URL
    : 'http://localhost:5000/api');

export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  changeEmail: `${API_BASE_URL}/auth/change-email`,
  
  // Questions
  uploadQuestions: (testType, testId) => `${API_BASE_URL}/questions/upload/${testType}/${testId}`,
  getQuestions: (testType, testId) => `${API_BASE_URL}/questions/${testType}/${testId}`,
  availableTests: `${API_BASE_URL}/questions/available`,
  
  // Results
  saveResult: `${API_BASE_URL}/results`,
  getUserResults: (userId) => `${API_BASE_URL}/results/user/${userId}`,
  getAllResults: `${API_BASE_URL}/results/admin/all`,
  exportCSV: `${API_BASE_URL}/results/export/csv`,
  deleteResult: (resultId) => `${API_BASE_URL}/results/${resultId}`,
  
  // Admin
  getUsers: `${API_BASE_URL}/admin/users`,
  getStats: `${API_BASE_URL}/admin/stats`,
};

export default API_BASE_URL;