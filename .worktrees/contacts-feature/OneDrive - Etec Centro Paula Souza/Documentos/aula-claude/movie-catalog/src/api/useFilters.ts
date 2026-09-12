import { useQuery } from '@tanstack/react-query';

interface Genre {
  id: number;
  name: string;
}
interface GenresResponse {
  genres: Genre[];
}
interface Provider {
  provider_id: number;
  provider_name: string;
}
interface ProvidersResponse {
  results: Provider[];
}

const fetchGenres = async (): Promise<GenresResponse> => {
  const res = await fetch('/api/tmdb/genre/movie/list');
  if (!res.ok) throw new Error('Failed to fetch genres');
  return res.json();
};

const fetchProviders = async (): Promise<ProvidersResponse> => {
  const res = await fetch('/api/tmdb/watch/providers/movie/list');
  if (!res.ok) throw new Error('Failed to fetch providers');
  return res.json();
};

export const useGenres = () =>
  useQuery<GenresResponse>({ queryKey: ['genres'], queryFn: fetchGenres });

export const useProviders = () =>
  useQuery<ProvidersResponse>({ queryKey: ['providers'], queryFn: fetchProviders });