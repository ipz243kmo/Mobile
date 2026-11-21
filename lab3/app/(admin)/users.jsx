import React, { useCallback } from 'react';
import { View, Text, VirtualizedList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../context/AdminContext';

const USER_ITEM_HEIGHT = 92;

export default function AdminUsersScreen() {
  const { users, userFilter, toggleUserStatus } = useAdmin();
  const router = useRouter();

  const filteredUsers = users.filter(
    (u) => userFilter.status === 'Усі' || u.status === userFilter.status
  );

  const getItem = (data, index) => data[index];
  const getItemCount = (data) => data.length;
  const getItemLayout = (_, index) => ({
    length: USER_ITEM_HEIGHT,
    offset: USER_ITEM_HEIGHT * index,
    index,
  });

  const renderItem = useCallback(
    ({ item }) => {
      const isActive = item.status === 'Активний';
      return (
        <View style={styles.card}>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email} • {item.role}</Text>
            <Text style={[styles.status, { color: isActive ? '#059669' : '#DC2626' }]}>
              Статус: {item.status}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleBtn, { backgroundColor: isActive ? '#FEE2E2' : '#D1FAE5' }]}
            onPress={() => toggleUserStatus(item.id)}
          >
            <Text style={[styles.toggleText, { color: isActive ? '#DC2626' : '#059669' }]}>
              {isActive ? 'Заблокувати' : 'Активувати'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [toggleUserStatus]
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.countText}>Користувачів: {filteredUsers.length}</Text>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => router.push({ pathname: '/filter-sheet', params: { type: 'users' } })}
        >
          <Ionicons name="filter" size={18} color="#1E4B94" />
          <Text style={styles.filterText}>Фільтр ({userFilter.status})</Text>
        </TouchableOpacity>
      </View>

      <VirtualizedList
        data={filteredUsers}
        initialNumToRender={12}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  toolbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  countText: { fontSize: 14, fontWeight: '700', color: '#374151' },
  filterBtn: {
    flexDirection: 'row', backgroundColor: '#EFF6FF', paddingHorizontal: 12,
    paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 6,
  },
  filterText: { color: '#1E4B94', fontWeight: '700', fontSize: 13 },
  list: { padding: 12 },
  card: {
    height: 80, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 10,
    paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2,
  },
  info: { flex: 1, paddingRight: 8 },
  name: { fontSize: 14, fontWeight: '700', color: '#111827' },
  email: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  status: { fontSize: 12, fontWeight: '700', marginTop: 3 },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  toggleText: { fontSize: 12, fontWeight: '700' },
});