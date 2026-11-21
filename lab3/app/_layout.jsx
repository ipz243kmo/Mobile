import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AdminProvider } from '../context/AdminContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AdminProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen
            name="news-modal"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Редактор новини',
              headerStyle: { backgroundColor: '#1E4B94' },
              headerTintColor: '#FFFFFF',
            }}
          />
          <Stack.Screen
            name="filter-sheet"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.45, 0.8],
              sheetGrabberVisible: true,
              headerShown: true,
              title: 'Фільтрація записів',
            }}
          />
        </Stack>
      </AdminProvider>
    </SafeAreaProvider>
  );
}