import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export const ITEM_HEIGHT = 136;

function NewsCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item.id)} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.thumbnail} />
      <View style={styles.content}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(NewsCard);

const styles = StyleSheet.create({
  card: {
    height: 124,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
  },
  thumbnail: {
    width: 115,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E4B94',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 19,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
});