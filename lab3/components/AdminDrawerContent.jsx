import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../context/AdminContext';

export default function AdminDrawerContent(props) {
  const { adminUser, logout } = useAdmin();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {}
      <View style={styles.profileBlock}>
        <View style={styles.avatar}>
          <Ionicons name="shield-checkmark" size={32} color="#1E4B94" />
        </View>
        <Text style={styles.name}>{adminUser.name}</Text>
        <Text style={styles.email}>{adminUser.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Адміністратор порталу</Text>
        </View>
      </View>

      {}
      <View style={styles.menuList}>
        <DrawerItemList {...props} />
      </View>

      {}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={22} color="#DC2626" />
        <Text style={styles.logoutText}>Вийти</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileBlock: {
    backgroundColor: '#1E4B94',
    padding: 20,
    paddingTop: 28,
    marginBottom: 8,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  email: { color: '#DBEAFE', fontSize: 12, marginTop: 2 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  menuList: { flex: 1 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 10,
  },
  logoutText: { color: '#DC2626', fontSize: 16, fontWeight: '700' },
});