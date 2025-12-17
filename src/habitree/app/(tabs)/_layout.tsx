import { Tabs } from 'expo-router';

import React, { useMemo } from 'react';

import { Image, Text, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/presentation/ui/HapticTab';

import { IconSymbol } from '@/presentation/ui/ui/IconSymbol';
import { Colors } from '@/constants/Colors';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createTabsLayoutStyles } from '../../styles/tabs_layout_style';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const tabsLayoutStyles = useMemo(
    () => createTabsLayoutStyles(width, height, { top: insets.top, bottom: insets.bottom }),
    [width, height, insets.top, insets.bottom],
  );

  const renderHeaderTitle = (label: string) => (
    <Text style={tabsLayoutStyles.headerTitleText}>{label}</Text>
  );

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: tabsLayoutStyles.headerStyle,
        tabBarButton: HapticTab,
        headerTitleStyle: tabsLayoutStyles.headerTitleStyle,
        tabBarStyle: tabsLayoutStyles.tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: () => (
            <Image
              source={require('@/assets/images/header.png')}
              style={tabsLayoutStyles.headerLogo}
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
          title: 'Habits',
          headerTitle: () => renderHeaderTitle('Habits'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tree"
        options={{
          title: 'Habitree',
          headerTitle: () => (
            <Image
              source={require('@/assets/images/header.png')}
              style={tabsLayoutStyles.headerLogo}
            />
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tree.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Erfolge',
          headerTitle: () => renderHeaderTitle('Erfolge'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="trophy.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          headerTitle: () => renderHeaderTitle('Profil'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}