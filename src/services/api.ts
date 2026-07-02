import requests from './requests';
import type { Movie } from '../types';
import * as mockData from '../data/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const HAS_TMDB = Boolean(API_KEY);

const mockFallback = {
  getTrending: async () => {
    const data = await mockData.getTrendingMovies();
    return { data };
  },
  getTopRated: async () => {
    const data = await mockData.getTopRatedMovies();
    return { data };
  },
  getNewReleases: async () => {
    const data = await mockData.getNewReleases();
    return { data };
  },
  getPopularTVShows: async () => {
    const data = await mockData.getPopularTVShows();
    return { data };
  },
  getActionMovies: async () => {
    const data = await mockData.getTrendingMovies();
    return { data };
  },
  getSciFiMovies: async () => {
    const data = await mockData.getTopRatedMovies();
    return { data };
  },
  getMovieDetails: async (id: string) => {
    const data = await mockData.getMovieById(id);
    return { data };
  },
  searchMovies: async (params: any) => {
    const data = await mockData.searchMovies(params.query || '', params);
    return { data };
  },
  getRecommendations: async (userId?: string) => {
    const data = await mockData.getRecommendations(userId);
    return { data };
  },
  getMoodRecommendations: async (mood: string) => {
    const data = await mockData.getMoodRecommendations(mood);
    return { data };
  },
};

export const movieAPI = HAS_TMDB
  ? {
      getTrending: async () => {
        const data = await requests.fetchTrending();
        return { data: data as Movie[] };
      },
      getTopRated: async () => {
        const data = await requests.fetchTopRated();
        return { data: data as Movie[] };
      },
      getNewReleases: async () => {
        const data = await requests.fetchPopular();
        return { data: (data as Movie[]).slice(0, 20) };
      },
      getPopularTVShows: async () => {
        const data = await requests.fetchTrending();
        return { data: (data as Movie[]).slice(0, 20) };
      },
      getActionMovies: async () => {
        const data = await requests.fetchActionMovies();
        return { data: data as Movie[] };
      },
      getSciFiMovies: async () => {
        const data = await requests.fetchSciFiMovies();
        return { data: data as Movie[] };
      },
      getMovieDetails: async (id: string) => {
        try {
          const data = await requests.fetchMovieDetails(id);
          return { data: data as Movie };
        } catch {
          return mockFallback.getMovieDetails(id);
        }
      },
      searchMovies: async (params: any) => {
        try {
          const query = params.query || '';
          const data = await requests.searchMovies(query, params);
          return { data: data as Movie[] };
        } catch {
          return mockFallback.searchMovies(params);
        }
      },
      getRecommendations: async (_userId?: string) => {
        try {
          const data = await requests.fetchTrending();
          return { data: (data as Movie[]).slice(0, 12) };
        } catch {
          return mockFallback.getRecommendations(_userId);
        }
      },
      getMoodRecommendations: async (mood: string) => {
        const moodGenreMap: Record<string, string> = {
          happy: '35', sad: '18', excited: '28', relaxed: '14',
          scared: '27', romantic: '10749', funny: '35', mysterious: '9648',
        };
        const genreId = moodGenreMap[mood.toLowerCase()];
        try {
          const data = genreId
            ? await requests.searchMovies('', { genre: genreId })
            : await requests.fetchPopular();
          return { data: (data as Movie[]).slice(0, 8) };
        } catch {
          return mockFallback.getMoodRecommendations(mood);
        }
      },
    }
  : mockFallback;

export const authAPI = {
  login: async (email: string, password: string) => {
    await delay(300);
    if (email && password) {
      const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
      return { data: { user: { uid: 'mock-user-1', email, displayName: 'Demo User', photoURL: defaultAvatar, phoneNumber: '', emailVerified: true }, token: 'mock-token-123' } };
    }
    throw new Error('Invalid credentials');
  },
  signup: async (data: any) => {
    await delay(300);
    const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
    return { data: { user: { uid: 'mock-user-1', email: data.email, displayName: data.name || 'User', photoURL: defaultAvatar, phoneNumber: '', emailVerified: false }, token: 'mock-token-123' } };
  },
  verifyToken: async () => {
    await delay(200);
    return { data: { valid: true } };
  },
};

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
const mockProfile = {
  uid: 'mock-user-1',
  email: 'user@stremly.ai',
  displayName: 'Demo User',
  photoURL: defaultAvatar,
  phoneNumber: '+1 (555) 123-4567',
  watchlist: [] as string[],
  favorites: [] as string[],
  watchHistory: [] as any[],
  preferences: {
    favoriteGenres: [] as string[],
    preferredLanguage: 'English',
    autoplay: true,
    subtitles: false,
    subtitleLanguage: 'English',
    playbackSpeed: 1,
    videoQuality: 'auto' as const,
  },
  createdAt: new Date('2024-01-01'),
  lastLogin: new Date(),
};

const getProfile = (): any => {
  const stored = localStorage.getItem('userProfile');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch { /* ignore */ }
  }
  return { ...mockProfile, watchlist: [], favorites: [], watchHistory: [] };
};

const saveProfile = (profile: any) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

export const userAPI = {
  getProfile: async (uid: string) => {
    await delay(200);
    return { data: getProfile() };
  },
  updateProfile: async (uid: string, data: any) => {
    await delay(200);
    const profile = getProfile();
    Object.assign(profile, data);
    saveProfile(profile);
    return { data: profile };
  },
  addToWatchlist: async (uid: string, movieId: string) => {
    await delay(200);
    const profile = getProfile();
    if (!profile.watchlist.includes(movieId)) {
      profile.watchlist.push(movieId);
    }
    saveProfile(profile);
    return { data: profile.watchlist };
  },
  removeFromWatchlist: async (uid: string, movieId: string) => {
    await delay(200);
    const profile = getProfile();
    profile.watchlist = profile.watchlist.filter((id: string) => id !== movieId);
    saveProfile(profile);
    return { data: profile.watchlist };
  },
  getWatchHistory: async (uid: string) => {
    await delay(200);
    const profile = getProfile();
    return { data: profile.watchHistory || [] };
  },
  updateWatchProgress: async (uid: string, movieId: string, progress: number) => {
    await delay(200);
    const profile = getProfile();
    const history = profile.watchHistory || [];
    const existing = history.findIndex((h: any) => h.movieId === movieId);
    const entry = { movieId, progress, timestamp: new Date().toISOString(), completed: progress >= 0.95 };
    if (existing >= 0) {
      history[existing] = entry;
    } else {
      history.push(entry);
    }
    profile.watchHistory = history;
    saveProfile(profile);
    return { data: entry };
  },
};

export const adminAPI = {
  getStats: async () => {
    await delay(300);
    const all = await mockData.getAllMovies();
    return {
      data: {
        totalUsers: 12847,
        totalMovies: all.filter((m) => m.category === 'movie').length,
        totalTVShows: all.filter((m) => m.category === 'tvshow').length,
        totalViews: 1200000,
        activeUsers: 3842,
        revenue: 45200,
        monthlyGrowth: 12.5,
      },
    };
  },
  getUsers: async () => {
    await delay(300);
    return { data: Array.from({ length: 20 }, (_, i) => ({ uid: `user-${i + 1}`, email: `user${i + 1}@example.com`, displayName: `User ${i + 1}`, photoURL: defaultAvatar, createdAt: new Date('2024-01-01'), lastLogin: new Date() })) };
  },
  addMovie: async (data: any) => {
    await delay(300);
    return { data: { id: `mock-${Date.now()}`, ...data } };
  },
  updateMovie: async (id: string, data: any) => {
    await delay(300);
    return { data: { id, ...data } };
  },
  deleteMovie: async (id: string) => {
    await delay(300);
    return { data: { success: true } };
  },
};
