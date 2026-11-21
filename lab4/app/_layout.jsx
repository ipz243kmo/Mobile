import React from 'react';
import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameProvider } from '../context/GameContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GameProvider>
          <Tabs
            screenOptions={{
              headerStyle: { backgroundColor: '#1E4B94' },
              headerTintColor: '#FFFFFF',
              tabBarActiveTintColor: '#1E4B94',
              tabBarInactiveTintColor: '#6B7280',
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: 'Clicker • Жести',
                tabBarLabel: 'Клікер',
                tabBarIcon: ({ color, size }) => <Ionicons name="hand-left-outline" size={size} color={color} />,
              }}
            />
            <Tabs.Screen
              name="tasks"
              options={{
                title: 'Завдання (8)',
                tabBarLabel: 'Завдання',
                tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} />,
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: 'Налаштування',
                tabBarLabel: 'Налаштування',
                tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
              }}
            />
          </Tabs>
        </GameProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}