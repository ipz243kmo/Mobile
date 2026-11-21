import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../../context/AdminContext';

export default function AdminNewsDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { news, deleteNews } = useAdmin();

  const item = news.find((n) => n.id === String(id));

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Новину не знайдено</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Підтвердження видалення',
      `Ви дійсно бажаєте видалити новину "${item.title}"?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: () => {
            deleteNews(item.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1E4B94" />
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push({ pathname: '/news-modal', params: { id: item.id } })}
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Редагувати</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Видалити</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.meta}>{item.category} • {item.status} • {item.createdAt}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.content}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { color: '#1E4B94', fontWeight: '600', fontSize: 15 },
  actions: { flexDirection: 'row', gap: 8 },
  editBtn: {
    flexDirection: 'row', backgroundColor: '#1E4B94', paddingHorizontal: 10,
    paddingVertical: 7, borderRadius: 6, alignItems: 'center', gap: 4,
  },
  deleteBtn: {
    flexDirection: 'row', backgroundColor: '#DC2626', paddingHorizontal: 10,
    paddingVertical: 7, borderRadius: 6, alignItems: 'center', gap: 4,
  },
  actionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  image: { width: '100%', height: 210, backgroundColor: '#E5E7EB' },
  content: { padding: 16 },
  meta: { fontSize: 12, fontWeight: '700', color: '#1E4B94', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 12 },
  text: { fontSize: 15, color: '#374151', lineHeight: 22 },
});