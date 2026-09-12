import React, { useState } from 'react';
import { ScrollView, TextInput, View, StyleSheet } from 'react-native';
import { Chip, Button } from 'react-native-paper';
import { useGenres, useProviders } from '../api/useFilters';
import { useNavigation } from '@react-navigation/native';

export const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<Set<number>>(new Set());
  const [selectedProviders, setSelectedProviders] = useState<Set<number>>(new Set());

  const { data: genreData } = useGenres();
  const { data: providerData } = useProviders();

  const toggle = (prev: Set<number>, id: number) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  const apply = () => {
    const params = new URLSearchParams({
      query,
      with_genres: Array.from(selectedGenres).join(','),
      with_watch_providers: Array.from(selectedProviders).join(','),
    }).toString();
    navigation.navigate('Results', { query: params });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <TextInput
        placeholder="Search movies…"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <View style={styles.searchButton}>
        <Button mode="contained" onPress={apply}>
          Search
        </Button>
      </View>

      <Text style={styles.sectionTitle}>Genres</Text>
      <View style={styles.chipRow}>
        {genreData?.genres?.map((g) => (
          <Chip
            key={g.id}
            selected={selectedGenres.has(g.id)}
            onPress={() => setSelectedGenres((prev) => toggle(prev, g.id))}
            style={styles.chip}
          >
            {g.name}
          </Chip>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Providers</Text>
      <View style={styles.chipRow}>
        {providerData?.results?.map((p) => (
          <Chip
            key={p.provider_id}
            selected={selectedProviders.has(p.provider_id)}
            onPress={() => setSelectedProviders((prev) => toggle(prev, p.provider_id))}
            style={styles.chip}
          >
            {p.provider_name}
          </Chip>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  input: { marginBottom: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 },
  searchButton: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 8, marginBottom: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { margin: 4 },
});