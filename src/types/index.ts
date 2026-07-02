export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  videoUrl: string;
  duration: string;
  year: number;
  rating: number;
  genres: string[];
  language: string;
  maturityRating: string;
  cast: string[];
  director: string;
  isTrending: boolean;
  isTopRated: boolean;
  isNewRelease: boolean;
  category: 'movie' | 'tvshow';
  seasons?: Season[];
}

export interface Season {
  id: string;
  number: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  number: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  watchlist: string[];
  favorites: string[];
  watchHistory: WatchHistoryEntry[];
  preferences: UserPreferences;
  createdAt: Date;
  lastLogin: Date;
}

export interface WatchHistoryEntry {
  movieId: string;
  progress: number;
  timestamp: Date;
  completed: boolean;
}

export interface UserPreferences {
  favoriteGenres: string[];
  preferredLanguage: string;
  autoplay: boolean;
  subtitles: boolean;
  subtitleLanguage: string;
  playbackSpeed: number;
  videoQuality: 'auto' | 'low' | 'medium' | 'high' | 'ultra';
}

export interface SearchFilters {
  query: string;
  genre: string;
  language: string;
  rating: number;
  year: number;
  category: 'all' | 'movie' | 'tvshow';
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  movieSuggestions?: Movie[];
}

export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalTVShows: number;
  totalViews: number;
  activeUsers: number;
  revenue: number;
  monthlyGrowth: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
}

export interface WatchParty {
  id: string;
  movieId: string;
  hostId: string;
  participants: string[];
  startTime: Date;
  status: 'waiting' | 'playing' | 'ended';
}
