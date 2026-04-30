import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthProvider } from './AuthContext';

import HomeScreen from './HomeScreen';
import HistoryScreen from './HistoryScreen';
import DetailScreen from './DetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HistoryList"
        component={HistoryScreen}
        options={{ title: 'Riwayat Absensi' }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Detail Informasi' }}
      />
    </Stack.Navigator>
  );
}

export default function MainApp() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#0056A0', headerShown: false }}>
          
          <Tab.Screen
            name="HomeTab"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Beranda',
              tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />
            }}
          />

          <Tab.Screen
            name="HistoryTab"
            component={HistoryStack}
            options={{
              tabBarLabel: 'Riwayat',
              tabBarIcon: ({ color }) => <MaterialIcons name="history" size={24} color={color} />
            }}
          />

        </Tab.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}