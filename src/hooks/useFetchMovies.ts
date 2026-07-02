import { useState, useEffect } from 'react';
import requests from '../services/requests';
import type { Movie } from '../types';

const fetchers = {
  trending: () => requests.fetchTrending(),
  topRated: () => requests.fetchTopRated(),
  popular: () => requests.fetchPopular(),
  action: () => requests.fetchActionMovies(),
  sciFi: () => requests.fetchSciFiMovies(),
};

type RowKey = keyof typeof fetchers;

interface UseFetchMoviesResult {
  data: Record<string, Movie[]>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  refetchRow: (key: RowKey) => void;
}

export function useFetchMovies(rows: RowKey[]): UseFetchMoviesResult {
  const [data, setData] = useState<Record<string, Movie[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const fetchRow = async (key: RowKey) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: null }));
    try {
      const result = await fetchers[key]();
      setData((prev) => ({ ...prev, [key]: result }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [key]: err instanceof Error ? err.message : 'Failed to fetch',
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    rows.forEach((key) => fetchRow(key));
  }, []);

  const refetchRow = (key: RowKey) => fetchRow(key);

  return { data, loading, errors, refetchRow };
}
