import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from './components/AppHeader';
import HomeScreen from './components/HomeScreen';
import GalleryScreen from './components/GalleryScreen';
import ProfileScreen from './components/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: () => <AppHeader />,
          tabBarActiveTintColor: '#1E4B94',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            if (route.name === 'Головна') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Галерея') iconName = focused ? 'images' : 'images-outline';
            else if (route.name === 'Профіль') iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Головна" component={HomeScreen} />
        <Tab.Screen name="Галерея" component={GalleryScreen} />
        <Tab.Screen name="Профіль" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}