export const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
  'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
  'Thriller', 'War', 'Western'
] as const;

export const LANGUAGES = [
  'English', 'Hindi', 'Spanish', 'French', 'German',
  'Japanese', 'Korean', 'Chinese', 'Italian', 'Portuguese',
  'Russian', 'Arabic', 'Turkish', 'Tamil', 'Telugu'
] as const;

export const MATURITY_RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'] as const;

export const QUALITY_OPTIONS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Low (480p)', value: 'low' },
  { label: 'Medium (720p)', value: 'medium' },
  { label: 'High (1080p)', value: 'high' },
  { label: 'Ultra (4K)', value: 'ultra' },
] as const;

export const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

export const APP_NAME = 'STREAMLY';

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  backdrop: 'w1280',
  poster: 'w500',
  thumbnail: 'w300',
  profile: 'w185',
} as const;

export const ROWS_CONFIG = {
  trending: { title: 'Trending Now', category: 'movie', filter: 'trending' },
  topRated: { title: 'Top Rated', category: 'movie', filter: 'top_rated' },
  popular: { title: 'Popular', category: 'movie', filter: 'popular' },
  action: { title: 'Action', category: 'movie', filter: 'action' },
  sciFi: { title: 'Sci-Fi', category: 'movie', filter: 'sci_fi' },
  popularTV: { title: 'Popular TV Shows', category: 'tv', filter: 'popular' },
  recommended: { title: 'Recommended For You', category: 'all', filter: 'recommended' },
  continueWatching: { title: 'Continue Watching', category: 'all', filter: 'continue_watching' },
} as const;

export const CATEGORY_COLORS: Record<string, { primary: string; secondary: string; gradient: string; textClass: string }> = {
  'Science Fiction': { primary: '#6366f1', secondary: '#06b6d4', gradient: 'from-indigo-500 via-purple-500 to-cyan-500', textClass: 'text-gradient-sci-fi' },
  'Sci-Fi': { primary: '#6366f1', secondary: '#06b6d4', gradient: 'from-indigo-500 via-purple-500 to-cyan-500', textClass: 'text-gradient-sci-fi' },
  Action: { primary: '#ef4444', secondary: '#f97316', gradient: 'from-red-500 to-orange-500', textClass: 'text-gradient-action' },
  Adventure: { primary: '#14b8a6', secondary: '#10b981', gradient: 'from-teal-500 to-emerald-500', textClass: 'text-teal-400' },
  Romance: { primary: '#ec4899', secondary: '#a855f7', gradient: 'from-pink-500 to-purple-500', textClass: 'text-gradient-romance' },
  Horror: { primary: '#dc2626', secondary: '#450a0a', gradient: 'from-red-700 via-red-900 to-black', textClass: 'text-red-400' },
  Comedy: { primary: '#f59e0b', secondary: '#eab308', gradient: 'from-amber-500 to-yellow-500', textClass: 'text-amber-400' },
  Drama: { primary: '#8b5cf6', secondary: '#6366f1', gradient: 'from-violet-500 to-indigo-500', textClass: 'text-violet-400' },
  Thriller: { primary: '#f97316', secondary: '#ef4444', gradient: 'from-orange-500 to-red-500', textClass: 'text-orange-400' },
  Animation: { primary: '#06b6d4', secondary: '#10b981', gradient: 'from-cyan-500 to-emerald-500', textClass: 'text-cyan-400' },
  Documentary: { primary: '#10b981', secondary: '#14b8a6', gradient: 'from-emerald-500 to-teal-500', textClass: 'text-emerald-400' },
  Fantasy: { primary: '#a855f7', secondary: '#d946ef', gradient: 'from-purple-500 to-fuchsia-500', textClass: 'text-purple-400' },
  default: { primary: '#ff2d55', secondary: '#6366f1', gradient: 'from-streamly-red to-indigo-500', textClass: 'text-gradient-streamly' },
};

export const getCategoryColor = (genres?: string[]) => {
  if (!genres || genres.length === 0) return CATEGORY_COLORS.default;
  for (const genre of genres) {
    if (CATEGORY_COLORS[genre]) return CATEGORY_COLORS[genre];
    const match = Object.keys(CATEGORY_COLORS).find(
      (k) => genre.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(genre.toLowerCase())
    );
    if (match) return CATEGORY_COLORS[match];
  }
  return CATEGORY_COLORS.default;
};

export const COLORS = {
  streamly: {
    red: '#ff2d55',
    dark: '#0a0a0f',
    darker: '#06060b',
    darkblue: '#0a0e1a',
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.12)',
    heavy: 'rgba(255, 255, 255, 0.18)',
  },
} as const;

export const MOOD_OPTIONS = [
  { label: 'Happy', emoji: '😊', description: 'Feel-good movies', category: 'Comedy' },
  { label: 'Sad', emoji: '😢', description: 'Emotional & touching', category: 'Drama' },
  { label: 'Excited', emoji: '🔥', description: 'Action-packed', category: 'Action' },
  { label: 'Relaxed', emoji: '🧘', description: 'Calm & soothing', category: 'Adventure' },
  { label: 'Scared', emoji: '😱', description: 'Horror & thriller', category: 'Horror' },
  { label: 'Romantic', emoji: '💕', description: 'Love stories', category: 'Romance' },
  { label: 'Funny', emoji: '😂', description: 'Comedy & laughter', category: 'Comedy' },
  { label: 'Mysterious', emoji: '🔍', description: 'Suspense & mystery', category: 'Thriller' },
] as const;
