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
// const TAB_BAR_HEIGHT = Math.max(65, windowHeight * 0.09); // Diese Konstante ist redundant, da sie unten neu definiert wird

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  // Responsive Header Höhe (mit Korrektur)
  // Auf 70px + insets.top gesetzt, um mehr Platz für die Schrift zu geben.
  const HEADER_HEIGHT = Math.max(70 + insets.top, 60);

  // Responsive TabBar Höhe (Beibehalten der Korrektur von vorhin)
  const TAB_BAR_HEIGHT = Math.max(48, windowHeight * 0.050);

  const baseMargin = 8; // Basiswert in Pixel
  // Der responsive Margin wird jetzt positiv genutzt, um die Schrift nach unten zu bewegen
  const responsiveMarginTop = Math.max(insets.top * 0.9, baseMargin);

  const largeHeaderTitleStyle = {
    fontSize: Math.min(windowWidth * 0.08, 34),
    fontWeight: 'bold' as 'bold',
  };

  // Ein kleiner positiver Margin, um die Schrift/das Bild im Header leicht nach unten zu bewegen.
  // Hier 5px als Beispiel. Du kannst diesen Wert anpassen (z.B. 10), falls nötig.
  const HEADER_TITLE_MARGIN_TOP = 5;

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
                height: 56, 
                resizeMode: 'contain', 
                // KORRIGIERT: Positiver Wert, um Bild nach unten zu verschieben
                marginTop: HEADER_TITLE_MARGIN_TOP
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
          title: 'Kalendar',
          headerTitle: () => (
            <Text
              style={{
                fontSize: Math.min(windowWidth * 0.08, 34),
                fontWeight: 'bold',
                // KORRIGIERT: Positiver Wert, um Schrift nach unten zu verschieben
                marginTop: HEADER_TITLE_MARGIN_TOP,
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
                // KORRIGIERT: Positiver Wert, um Schrift nach unten zu verschieben
                marginTop: HEADER_TITLE_MARGIN_TOP,
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
                // KORRIGIERT: Positiver Wert, um Schrift nach unten zu verschieben
                marginTop: HEADER_TITLE_MARGIN_TOP,
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
                // KORRIGIERT: Positiver Wert, um Schrift nach unten zu verschieben
                marginTop: HEADER_TITLE_MARGIN_TOP,
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