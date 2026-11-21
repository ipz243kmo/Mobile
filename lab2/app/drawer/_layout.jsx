import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

function CustomDrawerContent(props) {
  const { userEmail, logout } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
      <View style={styles.drawerHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#1E4B94" />
        </View>
        <Text style={styles.userName}>Куліш Марія Олександрівна</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>

      <View style={styles.menuItems}>
        <DrawerItemList {...props} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={22} color="#DC2626" />
        <Text style={styles.logoutText}>Вийти</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: '#1E4B94' },
          headerTintColor: '#FFFFFF',
          drawerActiveTintColor: '#1E4B94',
          drawerInactiveTintColor: '#374151',
        }}
      >
        <Drawer.Screen
          name="(news)"
          options={{
            drawerLabel: 'Стрічка новин',
            title: 'Новини університету',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="faq"
          options={{
            drawerLabel: 'Довідковий центр (FAQ)',
            title: 'Довідковий центр',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="help-circle-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerScroll: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#1E4B94',
    padding: 20,
    marginTop: -4,
    marginBottom: 10,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    color: '#DBEAFE',
    fontSize: 12,
    marginTop: 2,
  },
  menuItems: {
    flex: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 10,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});