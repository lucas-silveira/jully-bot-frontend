import axios from 'axios';

export const jullyAPI = axios.create({
  baseURL: 'http://localhost:3333',
});
