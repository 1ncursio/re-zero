import axios from 'axios';

const client = axios.create({
  withCredentials: true,
});

client.defaults.baseURL =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_BACKEND_URL
    : process.env.NEXT_PUBLIC_PROD_BACKEND_URL;

export default client;
