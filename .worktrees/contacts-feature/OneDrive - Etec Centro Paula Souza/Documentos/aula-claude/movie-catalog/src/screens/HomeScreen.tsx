import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { usePopular } from '../api/useMovies';
import { useNavigation } from '@react-navigation/native';
import Animated, { withSpring } from 'react-native-reanimated';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { data, isLoading } = usePopular();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <Animated.View entering={withSpring()}>
      <Card
        style={{ margin: 8 }}
        onPress={() => navigation.navigate('Results', { query: item.title })}
      >
        <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} />
        <Card.Title title={item.title} />
      </Card>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, paddingTop: 8 }}>
      <FlatList
        data={data?.results}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<Text style={{ margin: 8, fontSize: 18 }}>Featured</Text>}
      />
    </View>
  );
};