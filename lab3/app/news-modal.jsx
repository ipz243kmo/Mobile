import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAdmin } from '../context/AdminContext';

const STATUS_OPTIONS = ['Опубліковано', 'Чернетка', 'На перевірці'];

export default function NewsModalScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { news, createNews, updateNews } = useAdmin();

  const existing = id ? news.find((n) => n.id === String(id)) : null;

  const [title, setTitle] = useState(existing?.title || '');
  const [category, setCategory] = useState(existing?.category || 'Освіта та наука');
  const [status, setStatus] = useState(existing?.status || 'Опубліковано');
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl || 'https://picsum.photos/seed/newspost/600/320');
  const [content, setContent] = useState(existing?.content || '');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Помилка', 'Введіть заголовок та текст новини');
      return;
    }
    const payload = { title, category, status, imageUrl, content };
    if (existing) {
      updateNews(existing.id, payload);
    } else {
      createNews(payload);
    }
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.form}>
      <Text style={styles.label}>Заголовок новини *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Введіть заголовок..." />

      <Text style={styles.label}>Категорія</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />

      <Text style={styles.label}>Статус публікації</Text>
      <View style={styles.statusRow}>
        {STATUS_OPTIONS.map((st) => (
          <TouchableOpacity
            key={st}
            style={[styles.statusChip, status === st && styles.statusChipActive]}
            onPress={() => setStatus(st)}
          >
            <Text style={[styles.statusChipText, status === st && styles.statusChipTextActive]}>
              {st}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Посилання на зображення (URL)</Text>
      <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} autoCapitalize="none" />

      <Text style={styles.label}>Текст новини *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={5}
        placeholder="Повний текст публікації..."
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>{existing ? 'Зберегти зміни' : 'Опублікувати новину'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  form: { padding: 16, paddingBottom: 30 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 14,
  },
  textArea: { height: 110, textAlignVertical: 'top' },
  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  statusChip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
    backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB',
  },
  statusChipActive: { backgroundColor: '#1E4B94', borderColor: '#1E4B94' },
  statusChipText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  statusChipTextActive: { color: '#FFFFFF' },
  saveBtn: { backgroundColor: '#1E4B94', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});