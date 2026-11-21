import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAdmin } from '../context/AdminContext';

export default function FilterSheetScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const { newsFilter, setNewsFilter, userFilter, setUserFilter } = useAdmin();

  const newsStatuses = ['Усі', 'Опубліковано', 'Чернетка', 'На перевірці'];
  const userStatuses = ['Усі', 'Активний', 'Заблокований'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === 'users' ? 'Фільтр користувачів за статусом' : 'Фільтр новин за статусом'}
      </Text>

      <View style={styles.chips}>
        {(type === 'users' ? userStatuses : newsStatuses).map((st) => {
          const active = type === 'users' ? userFilter.status === st : newsFilter.status === st;
          return (
            <TouchableOpacity
              key={st}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => {
                if (type === 'users') setUserFilter({ status: st });
                else setNewsFilter((prev) => ({ ...prev, status: st }));
              }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{st}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.applyBtn} onPress={() => router.back()}>
        <Text style={styles.applyText}>Застосувати та закрити</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  title: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10,
    backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB',
  },
  chipActive: { backgroundColor: '#1E4B94', borderColor: '#1E4B94' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  chipTextActive: { color: '#FFFFFF' },
  applyBtn: { backgroundColor: '#1E4B94', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  applyText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});