import React from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, Alert, Linking } from 'react-native';
import { useContacts } from '../hooks/useContacts';
import ContactItem from '../components/ContactItem';

export default function ContactsScreen() {
  const {
    filtered,
    loadMore,
    permissionStatus,
    searchQuery,
    setSearchQuery,
  } = useContacts();

  // Handle permanent denial of permission
  if (permissionStatus.status !== 'granted' && permissionStatus.canAskAgain === false) {
    Alert.alert(
      'Permissão necessária',
      'A permissão de acesso aos contatos foi negada permanentemente. Abra as Configurações do seu dispositivo → Aplicativos → [Seu App] → Permissões e habilite “Contatos” para continuar.',
      [
        {
          text: 'Abrir Configurações',
          onPress: () => Linking.openSettings(),
        },
      ]
    );
    return null;
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar contato..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image?.uri ? (
              <Image source={{ uri: item.image.uri }} style={styles.avatar} />
            ) : (
              <View style={styles.placeholder} />
            )}
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={20}
        windowSize={10}
        maxToRenderPerBatch={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  search: { marginBottom: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  placeholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc', marginRight: 12 },
  name: { fontSize: 16 },
});
