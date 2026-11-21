import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GALLERY_IMAGES = [
  { id: '1', uri: 'https://picsum.photos/seed/ztu1/400/300', title: 'Кібербезпека' },
  { id: '2', uri: 'https://picsum.photos/seed/ztu2/400/300', title: 'Конференція' },
  { id: '3', uri: 'https://picsum.photos/seed/ztu3/400/300', title: 'Зустріч партнерів' },
  { id: '4', uri: 'https://picsum.photos/seed/ztu4/400/300', title: 'Круглий стіл' },
  { id: '5', uri: 'https://picsum.photos/seed/ztu5/400/300', title: 'Викладачі' },
  { id: '6', uri: 'https://picsum.photos/seed/ztu6/400/300', title: 'Студенти ІПЗ' },
];

export default function GalleryScreen() {
  const [isGrid, setIsGrid] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Фотогалерея</Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleBtn, isGrid && styles.activeToggleBtn]}
            onPress={() => setIsGrid(true)}
          >
            <Ionicons name="grid" size={18} color={isGrid ? '#FFFFFF' : '#4B5563'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isGrid && styles.activeToggleBtn]}
            onPress={() => setIsGrid(false)}
          >
            <Ionicons name="list" size={20} color={!isGrid ? '#FFFFFF' : '#4B5563'} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        key={isGrid ? 'GRID' : 'LIST'}
        data={GALLERY_IMAGES}
        numColumns={isGrid ? 2 : 1}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={isGrid ? styles.columnWrapper : undefined}
        renderItem={({ item }) => (
          <View style={isGrid ? styles.gridCard : styles.listCard}>
            <Image source={{ uri: item.uri }} style={isGrid ? styles.gridImage : styles.listImage} />
            {!isGrid && <Text style={styles.listTitle}>{item.title}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: 14, paddingTop: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  heading: { fontSize: 22, fontWeight: '700', color: '#111827' },
  toggleGroup: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 8, padding: 2 },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  activeToggleBtn: { backgroundColor: '#1E4B94' },
  columnWrapper: { justifyContent: 'space-between' },
  gridCard: { width: '48.5%', marginBottom: 12, borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFFFFF', elevation: 2 },
  gridImage: { width: '100%', height: 115 },
  listCard: { width: '100%', marginBottom: 12, borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFFFFF', elevation: 2 },
  listImage: { width: '100%', height: 190 },
  listTitle: { padding: 10, fontSize: 15, fontWeight: '600', color: '#1F2937' },
});