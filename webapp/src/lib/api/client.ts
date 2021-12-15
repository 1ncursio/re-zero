import axios from 'axios';

const client = axios.create({
  withCredentials: true,
});

client.defaults.baseURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.example.com';

export default client;
