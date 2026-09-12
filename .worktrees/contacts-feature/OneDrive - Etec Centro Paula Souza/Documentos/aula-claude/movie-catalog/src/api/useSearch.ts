import { useInfiniteQuery } from '@tanstack/react-query';

export interface SearchResult {
  page: number;
  results: Array<{
    id: number;
    title: string;
    poster_path: string | null;
    overview?: string;
    release_date?: string;
  }>;
  total_pages: number;
  total_results: number;
}

interface UseSearchArgs {
  query: string;
  with_genres?: string;
  with_watch_providers?: string;
}

const buildPath = (args: UseSearchArgs) => {
  if (args.query && !args.with_genres && !args.with_watch_providers) {
    // Free‑text search
    return { resource: 'search/movie', extra: `&query=${encodeURIComponent(args.query)}` };
  }
  // Discover by filters
  const filterParams: string[] = [];
  if (args.with_genres) filterParams.push(`with_genres=${args.with_genres}`);
  if (args.with_watch_providers) filterParams.push(`with_watch_providers=${args.with_watch_providers}`);
  if (args.query) filterParams.push(`query=${encodeURIComponent(args.query)}`);
  return { resource: 'discover/movie', extra: `&${filterParams.join('&')}` };
};

const fetchPage = async (
  args: UseSearchArgs,
  pageParam: number
): Promise<SearchResult> => {
  const { resource, extra } = buildPath(args);
  const res = await fetch(`/api/tmdb/${resource}?page=${pageParam}${extra}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
};

export const useSearch = (params: string) => {
  // Parse the URLSearchParams string back into an object
  const url = new URLSearchParams(params);
  const args: UseSearchArgs = {
    query: url.get('query') || '',
    with_genres: url.get('with_genres') || undefined,
    with_watch_providers: url.get('with_watch_providers') || undefined,
  };

  return useInfiniteQuery<SearchResult, Error>({
    queryKey: ['search', args],
    queryFn: ({ pageParam = 1 }) => fetchPage(args, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
};

/** Flatten the infinite query pages into a single results array */
export const flattenResults = (data: { pages?: SearchResult[] } | undefined) =>
  data?.pages.flatMap((p) => p.results) ?? [];