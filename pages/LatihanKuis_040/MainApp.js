import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import HomeScreen from './HomeScreen';
import ApartScreen from './ApartScreen';
import HouseScreen from './HouseScreen';
import DetailScreen from './DetailScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation, state }) {
  const currentRoute = state.routeNames[state.index];

  return (
    <DrawerContentScrollView>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>In The House Apps</Text>
      </View>

      <TouchableOpacity
        style={[styles.drawerItem, currentRoute === 'Home' && styles.drawerItemActive]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={[styles.drawerItemText, currentRoute === 'Home' && styles.drawerItemTextActive]}>
          HOME
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.drawerItem, currentRoute === 'Apart' && styles.drawerItemActive]}
        onPress={() => navigation.navigate('Apart')}
      >
        <Text style={[styles.drawerItemText, currentRoute === 'Apart' && styles.drawerItemTextActive]}>
          RENT
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

CustomDrawerContent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  state: PropTypes.shape({
    index: PropTypes.number.isRequired,
    routeNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Apart" component={ApartScreen} />
      <Drawer.Screen name="House" component={HouseScreen} />
    </Drawer.Navigator>
  );
}

export default function MainApp() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="DrawerRoot"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              title: 'In The House Apps',
              headerStyle: { backgroundColor: '#ffffff' },
              headerTintColor: '#000000',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  drawerItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 6,
    marginHorizontal: 8,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#000000',
  },
  drawerItemActive: {
    backgroundColor: '#195d98',
    borderColor: '#195d98',
  },
  drawerItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  drawerItemTextActive: {
    color: '#000000',
  },
});
