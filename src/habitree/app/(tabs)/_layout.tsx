import { Tabs } from 'expo-router';

import React from 'react';

import { Image, Dimensions, Text } from 'react-native';

import { HapticTab } from '@/presentation/ui/HapticTab';

import { IconSymbol } from '@/presentation/ui/ui/IconSymbol';

import { Colors } from '@/constants/Colors';

import { useColorScheme } from '@/hooks/useColorScheme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  // Responsive Header Höhe 

  const HEADER_HEIGHT = Math.max(70 + insets.top, 60);

  // Responsive TabBar Höhe (Beibehalten der Korrektur von vorhin)
  const TAB_BAR_HEIGHT = Math.max(48, windowHeight * 0.050);

 

  //const responsiveMarginTop = Math.max(insets.top * 0.1, baseMargin);
  const responsiveMarginTop = insets.top * 0.2;

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
        },
        tabBarButton: HapticTab,
        headerTitleStyle: largeHeaderTitleStyle,
        tabBarStyle: {
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
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
              style={{ 
                width: Math.min(windowWidth * 0.35, 140), 
                height: windowHeight * 0.07, 
                resizeMode: 'contain', 
                marginTop: responsiveMarginTop
              }}
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
          title: 'Habit Übersicht',
          headerTitle: () => (
            <Text
              style={{
                fontSize: Math.min(windowWidth * 0.08, 34),
                fontWeight: 'bold',
                marginTop: responsiveMarginTop,
                textAlign: 'center',
              }}
            >
              Habit Übersicht
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
                marginTop: responsiveMarginTop,
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
                marginTop: responsiveMarginTop,
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
                marginTop: responsiveMarginTop,
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