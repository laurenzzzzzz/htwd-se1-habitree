import { Tabs } from 'expo-router';

import React from 'react';

import { Platform, View, Image, Dimensions, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';

import { IconSymbol } from '@/components/ui/IconSymbol';

import TabBarBackground from '@/components/ui/TabBarBackground';

import { Colors } from '@/constants/Colors';

import { useColorScheme } from '@/hooks/useColorScheme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Math.max(65, windowHeight * 0.09);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  // Responsive Header Höhe
  //const HEADER_HEIGHT = Math.max(44 + insets.top*0.0, windowHeight * 0.13);
  //onst HEADER_HEIGHT = 44 + insets.top * 1.09;
  const HEADER_HEIGHT = Math.max(44 + insets.top * 0.1, 60); // Minimum 60px Reserve


  // Responsive TabBar Höhe
  const TAB_BAR_HEIGHT = Math.max(50, windowHeight * 0.050);

  const baseMargin = 8; // Basiswert in Pixel
  const responsiveMarginTop = Math.max(insets.top * 0.9, baseMargin); 
  //const responsiveMarginTop = Math.min(windowHeight * 0.03, 30); // max 10px, skaliert etwas mit Bildschirmhöhe

  const largeHeaderTitleStyle = {
    fontSize: Math.min(windowWidth * 0.08, 34),
    fontWeight: 'bold' as 'bold',
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
          //paddingTop: insets.top * 0.2,
        },
        tabBarButton: HapticTab,
        headerTitleStyle: largeHeaderTitleStyle,
        tabBarStyle: {
          height: TAB_BAR_HEIGHT + 1,
          //paddingBottom: insets.bottom,
          paddingBottom: Math.max(insets.bottom - 5, 0),

        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: () => (
            <Image
              source={require('@/assets/images/header.png')}
              style={{ width: Math.min(windowWidth * 0.25, 100), height: 40, resizeMode: 'contain', marginTop:-responsiveMarginTop }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Kalendar',
          headerTitle: () => (
            <Text
              style={{
                fontSize: Math.min(windowWidth * 0.08, 34),
                fontWeight: 'bold',
                marginTop: -responsiveMarginTop,
                textAlign: 'center',
              }}
            >
              Kalendar
            </Text>
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tree"
        options={{
          title: 'Baum',
          headerTitle: () => (
            <Text
              style={{
                fontSize: Math.min(windowWidth * 0.08, 34),
                fontWeight: 'bold',
                marginTop: -responsiveMarginTop,
                textAlign: 'center',
              }}
            >
              Baum
            </Text>
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tree.fill" color={color} />,
        }}
      />


      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventar',
          headerTitle: () => (
            <Text
              style={{
                fontSize: Math.min(windowWidth * 0.08, 34),
                fontWeight: 'bold',
                marginTop: -responsiveMarginTop,
                textAlign: 'center',
              }}
            >
              Inventar
            </Text>
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="trophy.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          headerTitle: () => (
            <Text
              style={{
                fontSize: Math.min(windowWidth * 0.08, 34),
                fontWeight: 'bold',
                marginTop: -responsiveMarginTop,
                textAlign: 'center',
              }}
            >
              Profil
            </Text>
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
