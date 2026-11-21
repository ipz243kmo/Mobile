import React, { useCallback } from 'react';
import { View, Text, VirtualizedList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../../context/AdminContext';

const ITEM_HEIGHT = 112;

export default function AdminNewsListScreen() {
  const { news, newsFilter } = useAdmin();
  const router = useRouter();

  const filteredNews = news.filter((item) => {
    const matchStatus = newsFilter.status === 'Усі' || item.status === newsFilter.status;
    const matchCat = newsFilter.category === 'Усі' || item.category === newsFilter.category;
    return matchStatus && matchCat;
  });

  const getItem = (data, index) => data[index];
  const getItemCount = (data) => data.length;
  const getItemLayout = (_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const getStatusColor = (status) => {
    if (status === 'Опубліковано') return '#059669';
    if (status === 'На перевірці') return '#D97706';
    return '#6B7280';
  };

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(admin)/news/${item.id}`)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text style={styles.category}>{item.category}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.date}>{item.createdAt}</Text>
        </View>
      </TouchableOpacity>
    ),
    [router]
  );

  return (
    <View style={styles.container}>
      {}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push('/news-modal')}
        >
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Створити новину</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => router.push({ pathname: '/filter-sheet', params: { type: 'news' } })}
        >
          <Ionicons name="filter" size={20} color="#1E4B94" />
          <Text style={styles.filterBtnText}>Фільтр</Text>
        </TouchableOpacity>
      </View>

      <VirtualizedList
        data={filteredNews}
        initialNumToRender={10}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  toolbar: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  createBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1E4B94',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  createBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  filterBtn: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
  },
  filterBtnText: { color: '#1E4B94', fontWeight: '700', fontSize: 14 },
  listContent: { padding: 12 },
  card: {
    height: 100,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
  },
  thumb: { width: 95, height: '100%', backgroundColor: '#E5E7EB' },
  body: { flex: 1, padding: 8, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  category: { fontSize: 11, fontWeight: '700', color: '#1E4B94' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  title: { fontSize: 13, fontWeight: '700', color: '#111827' },
  date: { fontSize: 11, color: '#6B7280' },
});