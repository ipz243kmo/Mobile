import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1E4B94' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Файловий менеджер' }} />
        <Stack.Screen
          name="editor"
          options={{
            presentation: 'modal',
            title: 'Перегляд та редагування файлу',
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            presentation: 'modal',
            title: 'Властивості об’єкта',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}