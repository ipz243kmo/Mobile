import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NEWS_DATA = [
  {
    id: '1',
    title: 'Житомирська політехніка – учасник міжнародного проєкту Pilot Program for En...',
    date: '17 вересня 2026 р.',
    description: 'Житомирська політехніка долучається до міжнародного освітнього проєкту Pilot Program for Enhancing Cybersecurity Skills Gaps in Ukraine, який є складовою системного стратегічного у...',
    image: 'https://picsum.photos/seed/cyber/600/320',
  },
  {
    id: '2',
    title: 'Запрошуємо до участі у VII Всеукраїнській науково-практичній конференції «Правова...',
    date: '22 жовтня 2026 р., 10:00',
    description: 'Кафедра права запрошує науковців, викладачів, аспірантів та студентів взяти участь у VII Всеукраїнській науково-практичній конференції.',
    image: 'https://picsum.photos/seed/lawconf/600/320',
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = NEWS_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Пошук..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredNews}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardDesc} numberOfLines={3}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: 14, paddingTop: 12 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 10, borderWidth: 1, borderColor: '#D1D5DB',
    paddingHorizontal: 12, height: 44, marginBottom: 14,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 14, overflow: 'hidden', elevation: 2 },
  cardImage: { width: '100%', height: 170, backgroundColor: '#E5E7EB' },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardDate: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#374151', lineHeight: 18 },
});