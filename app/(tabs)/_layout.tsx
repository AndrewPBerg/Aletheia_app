import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Import the Aletheia logo
import aletheiaLogo from '../../assets/images/aletheia_logo.png';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profiles"
        options={{
          title: 'Profiles',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="connections"
        options={{
          title: 'Connections',
          tabBarIcon: ({ focused }) => (
            <Image
              source={aletheiaLogo}
              style={[
                styles.tabIcon,
                focused ? styles.focusedIcon : styles.unfocusedIcon
              ]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
  focusedIcon: {
    opacity: 1,
  },
  unfocusedIcon: {
    opacity: 0.5,
  },
});
