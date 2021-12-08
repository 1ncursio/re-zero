import axios from 'axios';

const othelloClient = axios.create({
  withCredentials: true,
});

othelloClient.defaults.baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : 'https://api.example.com';

export default othelloClient;
