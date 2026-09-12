import React from 'react';
import { FlatList, View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { useSearch, flattenResults, SearchResult } from '../api/useSearch';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 12;

export const ResultsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { query } = route.params;
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } = useSearch(query);
  const results = flattenResults(data);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: SearchResult['results'][number] }) => (
    <Animated.View entering={FadeIn.delay(100)} sharedTransitionTag={`movie-${item.id}`}>
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { movieId: item.id })}
      >
        <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }} />
        <Card.Title title={item.title} titleNumberOfLines={1} />
      </Card>
    </Animated.View>
  );

  return (
    <FlatList
      data={results}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.list}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" />
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 8 },
  card: { margin: 4, width: CARD_WIDTH },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  footer: { height: 80, justifyContent: 'center', alignItems: 'center' },
});