import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { useMovieStore } from '../store/useMovieStore';
import { useMovieDetail } from '../api/useMovieDetail';
import { useNavigation } from '@react-navigation/native';

export const WatchlistScreen = () => {
  const navigation = useNavigation();
  const { watchlist } = useMovieStore();
  const ids = Array.from(watchlist);

  const renderItem = ({ item }) => {
    const { data } = useMovieDetail(item);
    if (!data) return null;
    return (
      <Card style={{ margin: 8 }} onPress={() => navigation.navigate('Detail', { movieId: item })}>
        <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w300${data.poster_path}` }} />
        <Card.Title title={data.title} />
      </Card>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {ids.length === 0 ? (
        <Text style={{ margin: 16 }}>Your watchlist is empty.</Text>
      ) : (
        <FlatList data={ids} renderItem={renderItem} keyExtractor={id => id} />
      )}
    </View>
  );
};
