// API Configuration for Production and Development
export const API_URL = import.meta.env.PROD 
  ? "https://tech-learn-backend-kabir.onrender.com/api"
  : "http://localhost:5000/api";

// Alternative method if above doesn't work:
// export const API_URL = window.location.hostname === 'tech-learn-frontend-kabir.onrender.com'
//   ? "https://tech-learn-backend-kabir.onrender.com/api"
//   : "http://localhost:5000/api";

console.log('API URL:', API_URL);
console.log('Environment:', import.meta.env.MODE);
