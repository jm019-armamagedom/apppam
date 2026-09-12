import React from 'react';
import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useQueries } from '@tanstack/react-query';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useMovieStore } from '../store/useMovieStore';
import { MovieDetail } from '../api/useMovieDetail';

const fetchMovie = async (id: string): Promise<MovieDetail> => {
  const res = await fetch(`/api/tmdb/movie/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch movie ${id}`);
  return res.json();
};

export const WatchlistScreen = () => {
  const navigation = useNavigation<any>();
  const watchlist = useMovieStore((s) => s.watchlist);
  const removeFromWatchlist = useMovieStore((s) => s.removeFromWatchlist);

  const ids = Array.from(watchlist);
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['movie', id],
      queryFn: () => fetchMovie(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const movies = queries
    .map((q, i) => (q.data ? { ...q.data, _id: ids[i] } : null))
    .filter((m): m is MovieDetail & { _id: string } => m !== null);

  const isLoading = queries.some((q) => q.isLoading) && movies.length === 0;

  if (watchlist.size === 0) {
    return (
      <View style={styles.center}>
        <Text variant="titleMedium" style={styles.emptyTitle}>
          Your watchlist is empty
        </Text>
        <Text style={styles.muted}>
          Add movies from the search or detail screens to keep track of what to watch next.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: MovieDetail & { _id: string } }) => (
    <Animated.View entering={FadeIn}>
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { movieId: item._id })}
      >
        <View style={styles.row}>
          <Card.Cover
            source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
            style={styles.poster}
          />
          <View style={styles.body}>
            <Card.Title title={item.title} titleNumberOfLines={2} />
            {!!item.release_date && (
              <Text style={styles.date}>{item.release_date}</Text>
            )}
          </View>
          <IconButton
            icon="heart"
            color="red"
            onPress={() => removeFromWatchlist(item._id)}
          />
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 8 },
  card: { marginVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  poster: { width: 80, height: 120, margin: 8 },
  body: { flex: 1 },
  date: { marginLeft: 16, color: '#666' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { marginBottom: 8 },
  muted: { color: '#666', textAlign: 'center' },
});