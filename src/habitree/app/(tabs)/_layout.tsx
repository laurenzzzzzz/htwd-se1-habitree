import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Image } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 44 + insets.top;

  // Define the style for the larger header title
  const largeHeaderTitleStyle = {
    fontSize: 34, // Adjust this value to your desired size (e.g., double the current size)
    fontWeight: 'bold' as 'bold', // Optional: make it bold for visibility
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerTitleAlign: 'center',

        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderBottomColor: Colors[colorScheme ?? 'light'].border,
          height: HEADER_HEIGHT,
          borderBottomWidth: 0,
        },
        
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            bottom: -45,
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),

          headerTitle: () => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: HEADER_HEIGHT - 5,
              }}
            >
              <Image
                source={require('@/assets/images/header.png')}
                style={{
                  width: 160,
                  height: 32,
                  marginTop: -34, // Bild nach oben verschieben
                }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Kalender',
          headerTitleStyle: largeHeaderTitleStyle, // <-- Added style
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tree"
        options={{
          title: 'Baum',
          headerTitleStyle: largeHeaderTitleStyle, // <-- Added style
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="tree.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventar',
          headerTitleStyle: largeHeaderTitleStyle, // <-- Added style
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="archivebox.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          headerTitleStyle: largeHeaderTitleStyle, // <-- Added style
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}