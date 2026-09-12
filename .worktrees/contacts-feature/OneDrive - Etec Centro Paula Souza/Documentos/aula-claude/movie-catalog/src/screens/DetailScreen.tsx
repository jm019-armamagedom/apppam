import React from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, IconButton, Text, Button, Divider } from 'react-native-paper';
import { useMovieDetail } from '../api/useMovieDetail';
import { useRoute } from '@react-navigation/native';
import { useMovieStore } from '../store/useMovieStore';
import Animated, { SlideInRight } from 'react-native-reanimated';
import * as Linking from 'expo-linking';

const US_REGION = 'US';

export const DetailScreen = () => {
  const route = useRoute<any>();
  const { movieId } = route.params as { movieId: string };
  const { data, isLoading } = useMovieDetail(movieId);
  const { watchlist, addToWatchlist, removeFromWatchlist, ratings, rateMovie } = useMovieStore();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const movie = data?.movie;
  if (!movie) {
    return (
      <View style={styles.center}>
        <Text>Movie not found.</Text>
      </View>
    );
  }

  const isInWatchlist = watchlist.has(movieId);
  const userRating = ratings[movieId] ?? 0;

  const toggleWatchlist = () => {
    if (isInWatchlist) removeFromWatchlist(movieId);
    else addToWatchlist(movieId);
  };

  const setRating = (value: number) => rateMovie(movieId, value);

  const openProvider = () => {
    const us = data?.providers?.results?.[US_REGION];
    if (us?.link) Linking.openURL(us.link);
  };

  const providers = data?.providers?.results?.[US_REGION]?.flatrate ?? [];

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={SlideInRight}>
        <Card>
          <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} />
          <Card.Title title={movie.title} subtitle={movie.release_date ?? ''} />
          <Card.Content>
            {!!movie.overview && <Text style={styles.overview}>{movie.overview}</Text>}
            <View style={styles.ratingRow}>
              <IconButton
                icon={isInWatchlist ? 'heart' : 'heart-outline'}
                color={isInWatchlist ? 'red' : undefined}
                size={28}
                onPress={toggleWatchlist}
              />
              <Button
                mode={userRating > 0 ? 'contained' : 'outlined'}
                icon="thumb-up"
                onPress={() => setRating(1)}
                style={styles.ratingBtn}
              >
                Like
              </Button>
              <Button
                mode={userRating < 0 ? 'contained' : 'outlined'}
                icon="thumb-down"
                onPress={() => setRating(-1)}
                style={styles.ratingBtn}
              >
                Dislike
              </Button>
            </View>
            <Divider style={styles.divider} />
            <Text variant="titleMedium">Available on</Text>
            {providers.length > 0 ? (
              providers.map((p) => (
                <Text key={p.provider_name} style={styles.provider}>
                  • {p.provider_name}
                </Text>
              ))
            ) : (
              <Text style={styles.muted}>No streaming info for your region.</Text>
            )}
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={openProvider}>
              Watch on Provider
            </Button>
          </Card.Actions>
        </Card>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  overview: { marginVertical: 8, lineHeight: 20 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' },
  ratingBtn: { marginHorizontal: 4 },
  divider: { marginVertical: 12 },
  provider: { marginLeft: 4, marginVertical: 2 },
  muted: { color: '#888', fontStyle: 'italic' },
});