import { useQuery } from '@tanstack/react-query';

export interface MovieDetail {
  id: number;
  title: string;
  poster_path: string | null;
  overview?: string;
  release_date?: string;
  vote_average?: number;
}

export interface WatchProvider {
  link: string;
}

export interface ProvidersResult {
  results?: Record<
    string,
    { link?: string; flatrate?: Array<{ provider_name: string }> }
  >;
}

export interface MovieDetailWithProviders {
  movie: MovieDetail;
  providers: ProvidersResult;
}

const fetchMovieDetail = async (id: string): Promise<MovieDetailWithProviders> => {
  const [movieRes, providersRes] = await Promise.all([
    fetch(`/api/tmdb/movie/${id}`),
    fetch(`/api/tmdb/movie/${id}/watch/providers`),
  ]);
  if (!movieRes.ok) throw new Error('Failed to fetch movie');
  if (!providersRes.ok) throw new Error('Failed to fetch watch providers');
  const [movie, providers] = await Promise.all([movieRes.json(), providersRes.json()]);
  return { movie, providers };
};

export const useMovieDetail = (id: string) =>
  useQuery<MovieDetailWithProviders, Error>({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieDetail(id),
    enabled: !!id,
  });