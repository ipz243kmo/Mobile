import React from 'react';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../context/AdminContext';
import AdminDrawerContent from '../../components/AdminDrawerContent';

export default function AdminDrawerLayout() {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <AdminDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: '#1E4B94' },
          headerTintColor: '#FFFFFF',
          drawerActiveTintColor: '#1E4B94',
          drawerInactiveTintColor: '#374151',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Дашборд аналітики',
            drawerLabel: 'Дашборд',
            drawerIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="news"
          options={{
            title: 'Управління новинами',
            drawerLabel: 'Новини',
            drawerIcon: ({ color, size }) => <Ionicons name="newspaper-outline" size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="users"
          options={{
            title: 'Користувачі порталу',
            drawerLabel: 'Користувачі',
            drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="logs"
          options={{
            title: 'Системні логи',
            drawerLabel: 'Системні логи',
            drawerIcon: ({ color, size }) => <Ionicons name="terminal-outline" size={size} color={color} />,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}