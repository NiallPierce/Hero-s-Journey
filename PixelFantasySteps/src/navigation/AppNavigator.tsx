import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';

// Import screens (we'll create these next)
import { HomeScreen } from '../screens/HomeScreen';
import { CharacterScreen } from '../screens/CharacterScreen';
import { QuestsScreen } from '../screens/QuestsScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { ShopScreen } from '../screens/ShopScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.text.secondary,
          headerStyle: {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          },
          headerTintColor: colors.text.primary,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Character"
          component={CharacterScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="account" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Quests"
          component={QuestsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="sword" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="backpack" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Shop"
          component={ShopScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="store" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}; 