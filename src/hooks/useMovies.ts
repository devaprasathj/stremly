import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchTrending,
  fetchTopRated,
  fetchNewReleases,
  fetchPopularTVShows,
  fetchRecommended,
  fetchMovieDetails,
  fetchMoodRecommendations,
  setCurrentMovie,
} from '../store/slices/movieSlice';

export const useMovies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    trending, topRated, newReleases, popularTVShows,
    recommended, continueWatching, featured, currentMovie, loading, error,
  } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    if (trending.length === 0) {
      dispatch(fetchTrending());
      dispatch(fetchTopRated());
      dispatch(fetchNewReleases());
      dispatch(fetchPopularTVShows());
    }
  }, [dispatch]);

  return {
    trending, topRated, newReleases, popularTVShows,
    recommended, continueWatching, featured, currentMovie, loading, error,
    fetchRecommended: (userId: string) => dispatch(fetchRecommended(userId)),
    fetchMovieDetails: (movieId: string) => dispatch(fetchMovieDetails(movieId)),
    fetchMoodRecommendations: (mood: string) => dispatch(fetchMoodRecommendations(mood)),
    setCurrentMovie: (movie: any) => dispatch(setCurrentMovie(movie)),
  };
};
