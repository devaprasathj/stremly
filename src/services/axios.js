import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdbAxios = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
});

tmdbAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[TMDB] API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default tmdbAxios;
