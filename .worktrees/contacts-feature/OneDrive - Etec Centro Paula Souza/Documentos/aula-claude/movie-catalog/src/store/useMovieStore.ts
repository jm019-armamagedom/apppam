import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MovieStore {
  watchlist: Set<string>;
  ratings: Record<string, number>;
  addToWatchlist: (id: string) => void;
  removeFromWatchlist: (id: string) => void;
  rateMovie: (id: string, value: number) => void;
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      watchlist: new Set<string>(),
      ratings: {},
      addToWatchlist: (id) => {
        const newSet = new Set(get().watchlist);
        newSet.add(id);
        set({ watchlist: newSet });
      },
      removeFromWatchlist: (id) => {
        const newSet = new Set(get().watchlist);
        newSet.delete(id);
        set({ watchlist: newSet });
      },
      rateMovie: (id, value) => {
        set({ ratings: { ...get().ratings, [id]: value } });
      },
    }),
    {
      name: 'movie-catalog-store',
      storage: {
        getItem: (name) => {
          const str = typeof window !== 'undefined' ? window.localStorage.getItem(name) : null;
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Rehydrate Set from array
          if (parsed.state?.watchlist) {
            parsed.state.watchlist = new Set(parsed.state.watchlist);
          }
          return parsed;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          // Serialize Set as array
          const serialized = {
            ...value,
            state: {
              ...value.state,
              watchlist: Array.from(value.state.watchlist as Set<string>),
            },
          };
          window.localStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          window.localStorage.removeItem(name);
        },
      },
    }
  )
);