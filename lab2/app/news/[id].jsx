import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_NEWS } from '../../../data/mockData';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const newsItem = ALL_NEWS.find((item) => item.id === String(id));

  if (!newsItem) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Новину з ID {id} не знайдено.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#1E4B94" />
        <Text style={styles.backText}>Назад до списку новин</Text>
      </TouchableOpacity>

      <Image source={{ uri: newsItem.image }} style={styles.image} />

      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{newsItem.category}</Text>
          <Text style={styles.date}>{newsItem.date}</Text>
        </View>

        <Text style={styles.title}>{newsItem.title}</Text>
        <Text style={styles.text}>{newsItem.content}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E4B94',
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#E5E7EB',
  },
  body: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E4B94',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
    lineHeight: 26,
  },
  text: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 23,
  },
});