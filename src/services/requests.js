import tmdbAxios from './axios';

const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const genreMap = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
 };

function resolveGenres(genreIds) {
  return (genreIds || []).map((id) => genreMap[id] || '').filter(Boolean);
}

function mapMovie(item, category) {
  const isTV = category === 'tvshow' || item.media_type === 'tv';
  const title = isTV ? (item.name || item.title || '') : (item.title || item.name || '');
  return {
    id: String(item.id),
    title,
    description: item.overview || '',
    thumbnailUrl: item.backdrop_path || item.poster_path
      ? `${IMAGE_BASE}/w300${item.backdrop_path || item.poster_path}`
      : '',
    posterUrl: item.poster_path
      ? `${IMAGE_BASE}/w500${item.poster_path}`
      : '',
    backdropUrl: item.backdrop_path
      ? `${IMAGE_BASE}/w1280${item.backdrop_path}`
      : '',
    trailerUrl: '',
    videoUrl: '',
    duration: '',
    year: new Date(item.release_date || item.first_air_date || '').getFullYear() || 0,
    rating: item.vote_average || 0,
    genres: resolveGenres(item.genre_ids),
    language: item.original_language || '',
    maturityRating: '',
    cast: [],
    director: '',
    isTrending: false,
    isTopRated: false,
    isNewRelease: false,
    category: isTV ? 'tvshow' : 'movie',
  };
}

export const requests = {
  fetchTrending: async () => {
    const { data } = await tmdbAxios.get('/trending/movie/week');
    return (data.results || []).map((item) => ({
      ...mapMovie(item, 'movie'),
      isTrending: true,
    }));
  },

  fetchTopRated: async () => {
    const { data } = await tmdbAxios.get('/movie/top_rated');
    return (data.results || []).map((item) => ({
      ...mapMovie(item, 'movie'),
      isTopRated: true,
    }));
  },

  fetchPopular: async () => {
    const { data } = await tmdbAxios.get('/movie/popular');
    return (data.results || []).map((item) => mapMovie(item, 'movie'));
  },

  fetchActionMovies: async () => {
    const { data } = await tmdbAxios.get('/discover/movie', {
      params: { with_genres: 28, sort_by: 'popularity.desc' },
    });
    return (data.results || []).map((item) => mapMovie(item, 'movie'));
  },

  fetchSciFiMovies: async () => {
    const { data } = await tmdbAxios.get('/discover/movie', {
      params: { with_genres: 878, sort_by: 'popularity.desc' },
    });
    return (data.results || []).map((item) => mapMovie(item, 'movie'));
  },

  fetchMovieDetails: async (id) => {
    const type = id.startsWith('tv-') ? 'tv' : 'movie';
    const cleanId = id.replace(/^tv-/, '');
    const { data: details } = await tmdbAxios.get(`/${type}/${cleanId}`);
    const { data: credits } = await tmdbAxios.get(`/${type}/${cleanId}/credits`);
    const { data: videos } = await tmdbAxios.get(`/${type}/${cleanId}/videos`);

    const trailer = (videos.results || []).find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    ) || (videos.results || [])[0];

    const movie = mapMovie(details, type === 'tv' ? 'tvshow' : 'movie');
    const genres = details.genres ? details.genres.map((g) => g.name) : movie.genres;

    return {
      ...movie,
      title: details.title || details.name || movie.title,
      description: details.overview || movie.description,
      duration: details.runtime
        ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
        : '',
      year: new Date(details.release_date || details.first_air_date || '').getFullYear() || movie.year,
      rating: details.vote_average || movie.rating,
      genres,
      language: details.original_language || movie.language,
      maturityRating: details.adult ? 'R' : '',
      posterUrl: details.poster_path ? `${IMAGE_BASE}/w500${details.poster_path}` : movie.posterUrl,
      backdropUrl: details.backdrop_path ? `${IMAGE_BASE}/w1280${details.backdrop_path}` : movie.backdropUrl,
      thumbnailUrl: details.backdrop_path || details.poster_path
        ? `${IMAGE_BASE}/w300${details.backdrop_path || details.poster_path}`
        : movie.thumbnailUrl,
      trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
      cast: (credits.cast || []).slice(0, 10).map((c) => c.name),
      director: (credits.crew || []).find((c) => c.job === 'Director')?.name || '',
    };
  },

  searchMovies: async (query, filters = {}) => {
    const { data } = await tmdbAxios.get('/search/multi', {
      params: { query },
    });
    let results = (data.results || [])
      .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item) => mapMovie(item, item.media_type === 'tv' ? 'tvshow' : 'movie'));

    if (filters.genre) {
      results = results.filter((m) =>
        m.genres.some((g) => g.toLowerCase() === filters.genre.toLowerCase())
      );
    }
    if (filters.language) {
      results = results.filter((m) => m.language.toLowerCase() === filters.language.toLowerCase());
    }
    if (filters.year) {
      results = results.filter((m) => m.year === filters.year);
    }
    if (filters.category && filters.category !== 'all') {
      results = results.filter((m) => m.category === filters.category);
    }
    return results;
  },
};

export default requests;
