import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ContactItem({ item }) {
  // distance: number | null (meters) – will be passed from hook
  const getColor = (dist) => {
    if (dist === null) return '#aaa'; // unknown
    if (dist < 10) return '#0f0'; // green
    if (dist <= 30) return '#ff0'; // yellow
    return '#f00'; // red
  };

  return (
    <View style={styles.item}>
      <View style={[styles.indicator, { backgroundColor: getColor(item.distance) }]} />
      {item.image?.uri ? (
        <Image source={{ uri: item.image.uri }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  indicator: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  placeholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc', marginRight: 12 },
  name: { fontSize: 16 },
});
