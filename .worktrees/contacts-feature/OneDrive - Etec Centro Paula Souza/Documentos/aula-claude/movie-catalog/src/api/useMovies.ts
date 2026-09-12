import { useQuery } from '@tanstack/react-query';

interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  overview?: string;
  release_date?: string;
}

interface PopularResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

const fetchPopular = async (): Promise<PopularResponse> => {
  const res = await fetch('/api/tmdb/movie/popular');
  if (!res.ok) throw new Error('Failed to fetch popular movies');
  return res.json();
};

export const usePopular = () =>
  useQuery<PopularResponse>({
    queryKey: ['popular'],
    queryFn: fetchPopular,
  });